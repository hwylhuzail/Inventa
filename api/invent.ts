import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-3.8-flash';

function jsonResponse(res: any, status: number, body: any) {
  res.status(status).json(body);
}

async function generateWithRetry(ai: GoogleGenAI, request: any) {
  let lastError: any;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      return await ai.models.generateContent(request);
    } catch (error: any) {
      lastError = error;
      const text = String(error?.message || error?.toString?.() || '');
      if (!/503|429|UNAVAILABLE|high demand|resource exhausted/i.test(text) || attempt === 3) break;
      await new Promise(resolve => setTimeout(resolve, 600 * (attempt + 1) ** 2));
    }
  }
  throw lastError;
}

function localEngineeringFallback(query: string) {
  const text = query.toLowerCase();
  if (/seal|airtight|leak|boundary/.test(text)) {
    return `For a boundary seal test, use a staged pressure-decay or soap-bubble check rather than relying on visual inspection.\n\n1. Keep pressure and component temperature within the seal material limits.\n2. Close the boundary with equalized fixture clamping; avoid twisting gaskets.\n3. Apply clean water with leak-detection dye or soapy solution to external joints while holding a low test pressure.\n4. For pressure decay, record baseline pressure at 1, 5, 15, and 30 minutes and subtract temperature drift.\n5. Use a pressure gauge with at least 2x the intended range and a guarded relief valve.\n6. Mark individual joints, retighten only by the specified torque sequence, and repeat the complete test.\n7. Never use compressed oxygen or a high-pressure vessel for consumer leakage testing.\n\nIf the seal is for potable water or food use, use compatible NSF/FDA-listed materials and perform post-cleaning inspection.`;
  }
  if (/fastener|machining|low.cost/.test(text)) {
    return `For low-cost assembly, compare these alternatives before accepting custom machining: standard metric bolts with slotted inserts, captured nuts, quarter-turn fasteners, hose clamps, rivnuts, snap fits, or a replaceable printed bracket. Prototype the load path first, then verify creep, vibration loosening, edge pull-out, and thermal expansion. Use flat washers and lock washers or prevailing-torque nuts for vibration, and oversize clearance holes where acrylic or plastic moves with temperature.`;
  }
  if (/patent|prior art|google patent/.test(text)) {
    return `Use a prior-art funnel: start broad with Google Patents and Espacenet, then narrow with CPC/IPC classification, assignee, date range, and inventor terms. Search the mechanism, not only the product name. Create a claim-feature matrix covering your core structure, operating principle, energy source, materials, and sequence. Search 10-20 years when useful, add image-based searches, and document citation URLs and dates. Prior-art research is investigative, not a patentability opinion.`;
  }
  return `To proceed without a live AI connection, define the problem boundary first: target user, expected input, output, operating environment, limits, failure mode, and safety constraints. Build the lowest-cost subassembly, measure one key metric, record uncertainty, and change one variable at a time. Check for pinch points, pressure, sharp edges, heat, electrical isolation, battery hazards, and hazardous substances before testing.`;
}

function extractJson(rawText: string) {
  let cleaned = String(rawText || '').trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const startArray = cleaned.indexOf('[');
  const startObject = cleaned.indexOf('{');
  let start = -1;
  let end = -1;

  if (startArray >= 0 && (startObject < 0 || startArray < startObject)) {
    start = startArray;
    end = cleaned.lastIndexOf(']');
  } else if (startObject >= 0) {
    start = startObject;
    end = cleaned.lastIndexOf('}');
  }

  if (start >= 0 && end > start) cleaned = cleaned.slice(start, end + 1);
  return JSON.parse(cleaned);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    jsonResponse(res, 405, { error: 'Method not allowed' });
    return;
  }

  const endpoint = String(req.query.endpoint || '').replace(/^\/+/, '').split(/[/?]/)[0] || 'generate';
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    jsonResponse(res, 503, {
      error: 'AI service is not configured. Add GEMINI_API_KEY to the Vercel project environment variables and redeploy.'
    });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    if (endpoint === 'generate') {
      const { problem, category, inventionType, complexity, imageDataUrl } = req.body || {};
      if (!problem || String(problem).trim().length < 5) {
        jsonResponse(res, 400, { error: 'Please describe the problem in at least 5 characters.' });
        return;
      }

      const prompt = `You are INVENTA's invention architect. Generate exactly 3 distinct, practical invention concepts for this user problem.

Problem: ${String(problem).trim()}
Category: ${category || 'Technology'}
Invention type: ${inventionType || 'Physical product'}
Complexity: ${complexity || 'Intermediate'}

Return only a valid JSON array. Every invention must include:
- id (use a descriptive concept code)
- name
- shortDescription
- problemSolved
- howItWorks
- whatMakesInteresting
- requiredMaterials (array)
- estimatedDifficulty (${complexity || 'Intermediate'})
- costRange ({min, max, currency, assumptions})
- potentialUsers (array)
- limitations (array)
- safetyConsiderations (array)
- suggestedImprovements (array)
- prototypeSteps (array of {stepNumber, title, description, estimatedHours})
- patentResearchTips
- priorArtKeywords (array)

Make concepts directly specific to the stated problem. Do not return generic templates.`;

      const parts: any[] = [];
      if (typeof imageDataUrl === 'string' && /^data:image\/[^;]+;base64,/i.test(imageDataUrl)) {
        const match = imageDataUrl.match(/^data:(image\/[^;]+);base64,(.+)$/);
        if (match) parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
      }
      parts.push({ text: prompt });

      const response = await generateWithRetry(ai, {
        model: MODEL,
        contents: parts.length > 1 ? { parts } : prompt,
        config: { responseMimeType: 'application/json', temperature: 0.7 }
      });

      const inventions = extractJson(response.text || '');
      if (!Array.isArray(inventions) || inventions.length !== 3) {
        throw new Error('The AI returned an invalid invention list. Please try again.');
      }

      const normalized = inventions.map((invention: any, index: number) => ({
        ...invention,
        id: `inv-${Date.now()}-${index + 1}`,
        category: category || 'Technology',
        inventionType: inventionType || 'Physical product',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      jsonResponse(res, 200, { inventions: normalized, isGeneratedByAi: true });
      return;
    }

    if (endpoint === 'improve') {
      const { invention, refinementGoal, country } = req.body || {};
      if (!invention || !refinementGoal) {
        jsonResponse(res, 400, { error: 'Invention and refinement goal are required.' });
        return;
      }

      const prompt = `Improve this INVENTA invention for the user's goal.
Original invention: ${JSON.stringify(invention)}
Refinement goal: ${refinementGoal}
Target country/region: ${country || 'Worldwide'}
Return only valid JSON with: refinementTitle, summaryOfChanges, revisedMaterials, revisedCostRange, newTradeOffs, updatedPrototypeSteps, regionalAdaptationNotes.`;
      const response = await generateWithRetry(ai, {
        model: MODEL,
        contents: prompt,
        config: { responseMimeType: 'application/json', temperature: 0.5 }
      });
      jsonResponse(res, 200, { refinement: extractJson(response.text || '{}'), isGeneratedByAi: true });
      return;
    }

    if (endpoint === 'assistant') {
      const { messages, selectedInvention } = req.body || {};
      if (!Array.isArray(messages) || messages.length === 0) {
        jsonResponse(res, 400, { error: 'Messages array is required.' });
        return;
      }

      const validContents = messages
        .filter((message: any) => message?.role === 'user' || message?.role === 'assistant')
        .map((message: any) => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(message.content || '') }]
        }));

      if (validContents.length === 0) {
        jsonResponse(res, 400, { error: 'At least one chat message is required.' });
        return;
      }

      const context = selectedInvention
        ? `Selected INVENTA invention: ${JSON.stringify(selectedInvention)}`
        : 'No invention is currently selected.';
      const response = await generateWithRetry(ai, {
        model: MODEL,
        contents: validContents,
        config: {
          temperature: 0.6,
          systemInstruction: `You are INVENTA's engineering assistant. Answer the user's question directly using practical, scientifically grounded invention and prototyping advice. ${context}`
        }
      });

      jsonResponse(res, 200, {
        reply: response.text || 'I am ready to help with your invention workflow.',
        isGeneratedByAi: true
      });
      return;
    }

    jsonResponse(res, 404, { error: 'Unknown INVENTA AI endpoint.' });
  } catch (error: any) {
    console.error('Vercel Gemini error:', error);
    const rawMessage = String(error?.message || error?.toString?.() || '');
    const unavailable = /503|UNAVAILABLE|high demand|temporarily unavailable/i.test(rawMessage);
    if (/Gemini.*assistant|assistant/i.test(endpoint) && unavailable) {
      const lastUserMessage = String(req.body?.messages?.filter((item: any) => item.role === 'user').at(-1)?.content || 'your engineering question');
      jsonResponse(res, 200, {
        reply: localEngineeringFallback(lastUserMessage),
        isGeneratedByAi: false,
        notice: 'Live Gemini capacity was unavailable; INVENTA provided its local engineering guidance fallback.'
      });
      return;
    }
    const status = unavailable ? 503 : 502;
    const message = unavailable
      ? 'Gemini is experiencing high demand right now. Please try again shortly.'
      : rawMessage || 'The Gemini AI service could not complete this request.';
    jsonResponse(res, status, { error: message });
  }
}
