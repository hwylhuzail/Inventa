import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-2.5-flash';

function jsonResponse(res: any, status: number, body: any) {
  res.status(status).json(body);
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

      const response = await ai.models.generateContent({
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
      const response = await ai.models.generateContent({
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
      const response = await ai.models.generateContent({
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
    jsonResponse(res, 502, {
      error: error?.message || 'The Gemini AI service could not complete this request.'
    });
  }
}
