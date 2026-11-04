import { GoogleGenAI } from '@google/genai';

const GEMINI_MODEL = 'gemini-1.5-flash-8b';
const GROQ_PREFERRED_MODEL = 'llama-3.1-8b-instant';
const GROQ_FALLBACK_MODELS = ['llama-3.3-70b-versatile', 'llama3-70b-8192', 'mixtral-8x7b-32768'];
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const CACHE_TTL_MS = 5 * 60 * 1000;
const responseCache = new Map<string, { value: any; expiresAt: number }>();
let requestQueue = Promise.resolve();
let lastProviderRequestAt = 0;
let discoveredGroqModel: string | null = null;

function jsonResponse(res: any, status: number, body: any) {
  res.status(status).json(body);
}

async function queueProviderRequest<T>(operation: () => Promise<T>): Promise<T> {
  const run = requestQueue.then(async () => {
    const elapsed = Date.now() - lastProviderRequestAt;
    if (elapsed < 2500) await new Promise(resolve => setTimeout(resolve, 2500 - elapsed));
    lastProviderRequestAt = Date.now();
    return operation();
  });
  requestQueue = run.then(() => undefined, () => undefined);
  return run;
}

async function getGroqModel(apiKey: string): Promise<string> {
  if (discoveredGroqModel) return discoveredGroqModel;
  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    if (response.ok) {
      const data = await response.json();
      const ids = Array.isArray(data?.data) ? data.data.map((model: any) => String(model.id)) : [];
      const candidate = [GROQ_PREFERRED_MODEL, ...GROQ_FALLBACK_MODELS].find(id => ids.includes(id));
      if (candidate) {
        discoveredGroqModel = candidate;
        return candidate;
      }
    }
  } catch {}
  return GROQ_PREFERRED_MODEL;
}

async function callGroq(messages: Array<{ role: string; content: string }>, jsonResponse = false) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not configured');
  const model = await getGroqModel(apiKey);

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await queueProviderRequest(async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        let response: Response;
        try {
          response = await fetch(GROQ_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages,
            temperature: 0.7,
            response_format: jsonResponse ? { type: 'json_object' } : undefined
          }),
          signal: controller.signal
        });
        } finally {
          clearTimeout(timeout);
        }
        if (!response.ok) {
          const text = await response.text();
          const error = new Error(text || `Groq request failed (${response.status})`);
          (error as any).status = response.status;
          throw error;
        }
        const data = await response.json();
        return data?.choices?.[0]?.message?.content || '';
      });
    } catch (error: any) {
      if (error?.status !== 429 && !/429|quota|rate/i.test(String(error?.message || ''))) throw error;
      if (attempt === 2) throw error;
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
  throw new Error('Groq is currently rate limited');
}

async function getSupabaseCache(key: string): Promise<any | null> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  try {
    const response = await fetch(`${url}/rest/v1/inventa_ai_cache?cache_key=eq.${encodeURIComponent(key)}&expires_at=gt.${new Date().toISOString()}&select=value&limit=1`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }
    });
    if (!response.ok) return null;
    const rows = await response.json();
    return rows?.[0]?.value ?? null;
  } catch { return null; }
}

async function setSupabaseCache(key: string, value: any): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return;
  try {
    await fetch(`${url}/rest/v1/inventa_ai_cache`, {
      method: 'POST',
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ cache_key: key, value, expires_at: new Date(Date.now() + CACHE_TTL_MS).toISOString() })
    });
  } catch {}
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
      await new Promise(resolve => setTimeout(resolve, 30000));
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
  const endpoint = String(req.query.endpoint || '').replace(/^\/+/, '').split(/[/?]/)[0] || 'generate';
  if (req.method === 'GET' && endpoint === 'status') {
    let groqStatus = 'not-tested';
    let groqError = '';
    if (process.env.GROQ_API_KEY) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        const response = await fetch(GROQ_URL, {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: await getGroqModel(process.env.GROQ_API_KEY), messages: [{ role: 'user', content: 'Reply with OK only.' }], max_tokens: 5 }),
          signal: controller.signal
        }).finally(() => clearTimeout(timeout));
        groqStatus = response.ok ? 'working' : `http-${response.status}`;
        if (!response.ok) groqError = String(await response.text()).slice(0, 300);
      } catch (error: any) {
        groqStatus = 'error';
        groqError = String(error?.message || error?.toString?.() || '').slice(0, 300);
      }
    } else {
      groqStatus = 'missing-key';
    }
    jsonResponse(res, 200, {
      groqConfigured: !!process.env.GROQ_API_KEY,
      groqStatus,
      groqError,
      geminiConfigured: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
      groqModel: discoveredGroqModel || GROQ_PREFERRED_MODEL,
      geminiModel: GEMINI_MODEL
    });
    return;
  }
  if (req.method !== 'POST') {
    jsonResponse(res, 405, { error: 'Method not allowed' });
    return;
  }

  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!groqKey && !geminiKey) {
    jsonResponse(res, 503, {
      error: 'AI service is not configured. Add GROQ_API_KEY or GEMINI_API_KEY to Vercel environment variables and redeploy.'
    });
    return;
  }

  try {
    const ai = geminiKey ? new GoogleGenAI({ apiKey: geminiKey }) : null;

    if (endpoint === 'status') {
      jsonResponse(res, 200, {
        groqConfigured: !!groqKey,
        geminiConfigured: !!geminiKey,
        groqModel: discoveredGroqModel || GROQ_PREFERRED_MODEL,
        geminiModel: GEMINI_MODEL
      });
      return;
    }

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

      let inventions: any[];
      try {
        const groqText = await callGroq([
          { role: 'system', content: 'You are INVENTA invention architect. Return valid JSON with an inventions array. Make every concept specific to the problem.' },
          { role: 'user', content: prompt }
        ], true);
        const parsed = extractJson(groqText);
        inventions = Array.isArray(parsed) ? parsed : parsed.inventions;
      } catch {
        if (!ai) throw new Error('Groq is unavailable and Gemini fallback is not configured.');
        const response = await generateWithRetry(ai, {
          model: GEMINI_MODEL,
          contents: parts.length > 1 ? { parts } : prompt,
          config: { responseMimeType: 'application/json', temperature: 0.7 }
        });
        inventions = extractJson(response.text || '');
      }

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
      let refinement: any;
      try {
        const groqText = await callGroq([
          { role: 'system', content: 'You are INVENTA refinement engine. Return only valid JSON matching the requested refinement schema.' },
          { role: 'user', content: prompt }
        ], true);
        refinement = extractJson(groqText);
      } catch {
        if (!ai) throw new Error('Groq is unavailable and Gemini fallback is not configured.');
        const response = await generateWithRetry(ai, {
          model: GEMINI_MODEL,
          contents: prompt,
          config: { responseMimeType: 'application/json', temperature: 0.5 }
        });
        refinement = extractJson(response.text || '{}');
      }
      jsonResponse(res, 200, { refinement, isGeneratedByAi: true });
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
      const lastUser = validContents.filter((item: any) => item.role === 'user').at(-1)?.parts?.[0]?.text || 'engineering question';
      const cacheKey = `assistant:${selectedInvention?.id || 'general'}:${lastUser.trim().toLowerCase()}`;
      const cached = responseCache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        jsonResponse(res, 200, { ...cached.value, isCached: true });
        return;
      }
      const persistentCached = await getSupabaseCache(cacheKey);
      if (persistentCached) {
        responseCache.set(cacheKey, { value: persistentCached, expiresAt: Date.now() + CACHE_TTL_MS });
        jsonResponse(res, 200, { ...persistentCached, isCached: true });
        return;
      }

      try {
        const groqMessages = [
          { role: 'system', content: `You are INVENTA's engineering assistant. Answer directly with practical, scientifically grounded invention and prototyping advice. Never fabricate verification. ${context}` },
          ...validContents.map((item: any) => ({ role: item.role === 'model' ? 'assistant' : 'user', content: item.parts[0].text }))
        ];
        const reply = await callGroq(groqMessages);
        const result = { reply, isGeneratedByAi: true, provider: 'groq' };
        responseCache.set(cacheKey, { value: result, expiresAt: Date.now() + CACHE_TTL_MS });
        await setSupabaseCache(cacheKey, result);
        jsonResponse(res, 200, result);
      } catch {
        if (ai) {
          try {
            const response = await generateWithRetry(ai, {
              model: GEMINI_MODEL,
              contents: validContents,
              config: { temperature: 0.6, systemInstruction: `You are INVENTA's engineering assistant. Answer directly with practical, scientifically grounded invention advice. ${context}` }
            });
            const result = { reply: response.text || 'I am ready to help.', isGeneratedByAi: true, provider: 'gemini' };
            responseCache.set(cacheKey, { value: result, expiresAt: Date.now() + CACHE_TTL_MS });
            await setSupabaseCache(cacheKey, result);
            jsonResponse(res, 200, result);
          } catch {
            const reply = localEngineeringFallback(lastUser);
            const result = { reply, isGeneratedByAi: false, provider: 'local', notice: 'Live AI capacity is temporarily unavailable. Showing INVENTA engineering guidance.' };
            responseCache.set(cacheKey, { value: result, expiresAt: Date.now() + CACHE_TTL_MS });
            await setSupabaseCache(cacheKey, result);
            jsonResponse(res, 200, result);
          }
        } else {
          const reply = localEngineeringFallback(lastUser);
          jsonResponse(res, 200, { reply, isGeneratedByAi: false, provider: 'local' });
        }
      }
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
