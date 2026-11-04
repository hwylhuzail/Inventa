import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback curated generator when offline or no API key
function generateSmartFallbackInventions(
  problem: string,
  category: string,
  inventionType: string,
  complexity: string
) {
  const problemSnippet = problem.trim().slice(0, 50);
  return [
    {
      id: 'inv-' + Date.now() + '-1',
      name: `AeroFlow ${category} Micro-Adapter`,
      shortDescription: `A decentralized, modular passive-assist mechanism designed to tackle "${problemSnippet}..." with zero grid electricity.`,
      problemSolved: problem,
      howItWorks: `Leverages localized thermodynamic venting and 3D-printable venturi geometry to regulate mechanical action passively. Standardized push-fit couplings allow seamless integration into existing household or farm equipment.`,
      whatMakesInteresting: `Bypasses the need for expensive motorized pumps or proprietary electronics by employing biomimetic airflow channels inspired by termite mound ventilation.`,
      requiredMaterials: [
        'Recycled HDPE or PETG filament',
        'EPDM silicone seals (15mm - 25mm)',
        'Stainless steel mesh screen (60-mesh)',
        'Standard 3/4-inch PVC threaded adapter'
      ],
      estimatedDifficulty: complexity || 'Intermediate',
      costRange: {
        min: 15,
        max: 45,
        currency: 'USD',
        assumptions: 'Assumes rapid prototyping on a desktop FDM 3D printer and off-the-shelf plumbing hardware'
      },
      potentialUsers: [
        'Smallholder farmers and rural cooperatives',
        'Independent technicians and repair workshops',
        'Resource-conscious homeowners'
      ],
      limitations: [
        'Dependent on ambient airflow differential > 0.8 m/s for maximum efficiency',
        'Plastic polymer degradation if exposed to continuous UV without UV-stabilizing coating'
      ],
      safetyConsiderations: [
        'Inspect structural welds or layer adhesion under pressure before deploying',
        'Ensure non-toxic filament grade if used in proximity to potable water or food crops'
      ],
      suggestedImprovements: [
        'Incorporate a calibrated magnetic quick-release check valve for surge protection',
        'Add molded graduation marks for visual flow-rate estimation without sensors'
      ],
      prototypeSteps: [
        {
          stepNumber: 1,
          title: 'CAD Venturi Geometric Modeling',
          description: 'Model convergent-divergent nozzle in FreeCAD or Fusion 360 with variable ratio ports.',
          estimatedHours: 4
        },
        {
          stepNumber: 2,
          title: '3D Print Bench Test Specimen',
          description: 'Print in PETG at 100% infill with 0.16mm layer height for airtight boundary seals.',
          estimatedHours: 6
        },
        {
          stepNumber: 3,
          title: 'Differential Pressure Benchmark',
          description: 'Measure pressure drop using a DIY U-tube water manometer under simulated load.',
          estimatedHours: 3
        },
        {
          stepNumber: 4,
          title: 'Field Verification in Target Environment',
          description: 'Test resilience over 72 hours of continuous outdoor exposure.',
          estimatedHours: 72
        }
      ],
      patentResearchTips: 'Search Google Patents and Espacenet under CPC class B01F (Mixing/Venturi) and F15D (Fluid dynamics). Note: verify prior art thoroughly.',
      priorArtKeywords: ['passive fluid amplifier', 'modular venturi adapter', 'biomimetic micro-flow']
    },
    {
      id: 'inv-' + Date.now() + '-2',
      name: `PulseSync Sensory Node`,
      shortDescription: `A low-power edge telemetry and acoustic diagnostic tool built with commodity microcontroller chips.`,
      problemSolved: problem,
      howItWorks: `Attaches magnetically or mechanically to target surfaces, capturing vibration transients and frequency shifts that indicate operational bottlenecks or structural distress.`,
      whatMakesInteresting: `Processes frequency harmonics locally using lightweight Fourier approximation, requiring only coin-cell or miniature solar energy harvesting.`,
      requiredMaterials: [
        'ESP32-C3 or RP2040 microcontroller board',
        'Piezoelectric contact vibration transducer',
        'CR2032 battery holder and lithium cell',
        'Polycarbonate snap-fit waterproof casing'
      ],
      estimatedDifficulty: 'Intermediate',
      costRange: {
        min: 22,
        max: 60,
        currency: 'USD',
        assumptions: 'Based on single-unit component pricing from standard electronics hobby distributors'
      },
      potentialUsers: [
        'Fleet and equipment operators',
        'Community maintenance personnel',
        'Local vocational training centers'
      ],
      limitations: [
        'Bluetooth LE signal attenuation when obstructed by dense reinforced concrete',
        'Piezo transducer requires firm mechanical coupling without acoustic dampening'
      ],
      safetyConsiderations: [
        'Ensure intrinsically safe battery isolation if operated in combustible vapor areas',
        'Firm mechanical anchoring to prevent loose unit falling into rotating machinery'
      ],
      suggestedImprovements: [
        'Integrate RF energy harvesting coil for battery-free zero-maintenance operation',
        'Provide audible acoustic feedback beep for blind/low-vision installation alignment'
      ],
      prototypeSteps: [
        {
          stepNumber: 1,
          title: 'Sensor Interface Breadboard Circuit',
          description: 'Connect analog piezo transducer via op-amp high-pass filter to ADC pin.',
          estimatedHours: 3
        },
        {
          stepNumber: 2,
          title: 'Firmware Harmonic Sampling Routine',
          description: 'Flash micro-Python or C++ firmware with circular ring-buffer peak detector.',
          estimatedHours: 5
        },
        {
          stepNumber: 3,
          title: 'Enclosure Enveloping & Gasket Seal',
          description: 'Assemble IP54 splash-resistant casing with neodymium mounting magnet.',
          estimatedHours: 3
        },
        {
          stepNumber: 4,
          title: 'Calibration Against Known Faults',
          description: 'Benchmark output metrics against standard calibrated reference tool.',
          estimatedHours: 4
        }
      ],
      patentResearchTips: 'Review USPTO classification G01H (Measuring mechanical vibrations) and G08B (Signaling & alarms).',
      priorArtKeywords: ['acoustic vibration diagnostic node', 'piezoelectric condition monitor', 'edge vibration FFT']
    },
    {
      id: 'inv-' + Date.now() + '-3',
      name: `TerraLoop Closed-Cycle System`,
      shortDescription: `An ultra-low cost, locally fabricable physical workflow that transforms waste byproducts into high-value functional utility.`,
      problemSolved: problem,
      howItWorks: `Combines mechanical separation, gravitational settling, and natural catalytic filtration to resolve "${problemSnippet}" with zero reliance on single-source supply chains.`,
      whatMakesInteresting: `Built entirely from locally salvageable materials (e.g. food-grade barrels, sand, biochar, gravity valves) ensuring radical repairability worldwide.`,
      requiredMaterials: [
        'Repurposed food-grade poly container (20L - 50L)',
        'Graded quartz sand and activated biochar medium',
        'Brass ball valve with compression fittings',
        'Perforated food-safe retention plate'
      ],
      estimatedDifficulty: 'Beginner',
      costRange: {
        min: 8,
        max: 30,
        currency: 'USD',
        assumptions: 'Assumes utilization of local salvage resources and local hardware stores'
      },
      potentialUsers: [
        'Everyday DIY makers and community builders',
        'Disaster resilience teams and humanitarian groups',
        'School STEM clubs and community workshops'
      ],
      limitations: [
        'Throughput speed is strictly gravity-dependent unless manual siphon head is created',
        'Biochar or medium saturation requires periodic solar baking or replacement'
      ],
      safetyConsiderations: [
        'Thoroughly sanitize recycled containers and verify previous contents before use',
        'Do not exceed maximum structural fluid head weight on unsupported shelving'
      ],
      suggestedImprovements: [
        'Include gravity float valve with visual level indicator rod',
        'Add interlocking stackable nesting rings for modular scaling'
      ],
      prototypeSteps: [
        {
          stepNumber: 1,
          title: 'Container Sanitize & Flow Hole Cutting',
          description: 'Core 1-inch outlet with spade bit and deburr inner edges.',
          estimatedHours: 2
        },
        {
          stepNumber: 2,
          title: 'Medium Bed Stratification',
          description: 'Layer coarse gravel, washed silica sand, and activated carbon in measured ratios.',
          estimatedHours: 3
        },
        {
          stepNumber: 3,
          title: 'Hydraulic Gravity Head Calibration',
          description: 'Conduct flow test with clean water to measure litres/hour discharge rate.',
          estimatedHours: 2
        },
        {
          stepNumber: 4,
          title: 'Real-World Contaminant Benchmark',
          description: 'Test with target problem medium and verify clarity/filtration metrics.',
          estimatedHours: 4
        }
      ],
      patentResearchTips: 'Explore CPC class C02F (Treatment of water/waste) and B01D (Separation). Prior art in gravity filtration is extensive.',
      priorArtKeywords: ['gravity biochar filtration', 'decentralized modular separation', 'passive cyclical purifier']
    }
  ];
}

// 1. Invention Generator Endpoint
app.post('/api/invent/generate', async (req: Request, res: Response) => {
  try {
    const { problem, category, inventionType, complexity, imageDataUrl } = req.body;

    if (!problem || typeof problem !== 'string' || problem.trim().length < 5) {
      res.status(400).json({ error: 'Please describe the problem in at least 5 characters.' });
      return;
    }

    if (!aiClient) {
      console.log('Gemini API key not configured or client null. Using intelligent fallback laboratory synthesizer.');
      const fallbackData = generateSmartFallbackInventions(problem, category || 'Technology', inventionType || 'Physical product', complexity || 'Intermediate');
      res.json({ inventions: fallbackData, isGeneratedByAi: false });
      return;
    }

    const systemInstruction = `You are INVENTA's Senior Principal Invention Architect and Innovation Scientist.
Your mission is to empower everyday inventors, researchers, engineers, and problem-solvers across the globe by transforming raw problems into three distinct, highly creative, technically grounded, and realistic invention concepts.
Rules:
1. Always generate exactly THREE distinct solutions for the given problem with differing conceptual angles (e.g. Solution 1: mechanical/passive approach; Solution 2: smart/digital/sensing approach; Solution 3: low-cost/circular/bio-inspired approach).
2. Distinguish estimated costs and assumptions clearly. Identify the currency (USD by default).
3. Be realistic: highlight genuine physical limitations, real safety considerations, and prototype steps.
4. Never claim an invention is guaranteed patentable, novel, or scientifically proven without independent verification. Provide actionable tips for users to research existing patents and prior art.
5. Return clean JSON matching the specified schema.`;

    const promptText = `Problem Description: "${problem}"
Category: ${category || 'General'}
Target Invention Type: ${inventionType || 'Any'}
Complexity Level: ${complexity || 'Intermediate'}

Synthesize 3 distinct, practical, innovative solutions with complete prototype roadmaps, estimated material bills, safety precautions, and prior art search vectors.`;

    const parts: any[] = [];
    if (imageDataUrl && typeof imageDataUrl === 'string' && imageDataUrl.startsWith('data:image/')) {
      const match = imageDataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2]
          }
        });
      }
    }
    parts.push({ text: promptText });

    const response = await aiClient.models.generateContent({
      model: 'gemini-1.5-flash-8b',
      contents: parts.length > 1 ? { parts } : promptText,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Creative and professional name of the invention' },
              shortDescription: { type: Type.STRING, description: '1-2 sentence executive summary of the invention' },
              problemSolved: { type: Type.STRING, description: 'Specific problem aspect this concept tackles' },
              howItWorks: { type: Type.STRING, description: 'Clear technical explanation of mechanisms and principles' },
              whatMakesInteresting: { type: Type.STRING, description: 'Key innovation, novelty angle, or creative differentiator' },
              requiredMaterials: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of 3-6 key physical materials, hardware components, or software technologies'
              },
              estimatedDifficulty: { type: Type.STRING, description: 'Beginner, Intermediate, or Advanced' },
              costRange: {
                type: Type.OBJECT,
                properties: {
                  min: { type: Type.NUMBER, description: 'Low estimate for prototype' },
                  max: { type: Type.NUMBER, description: 'High estimate for prototype' },
                  currency: { type: Type.STRING, description: 'Currency symbol or ISO code e.g. USD' },
                  assumptions: { type: Type.STRING, description: 'Assumptions behind the cost estimate' }
                },
                required: ['min', 'max', 'currency', 'assumptions']
              },
              potentialUsers: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Key user personas or communities that benefit'
              },
              limitations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Technical constraints, trade-offs, or environmental dependencies'
              },
              safetyConsiderations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Mandatory safety warnings, hazardous material rules, or mechanical risks'
              },
              suggestedImprovements: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2-4 future evolution ideas or optimizations'
              },
              prototypeSteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    estimatedHours: { type: Type.NUMBER }
                  },
                  required: ['stepNumber', 'title', 'description', 'estimatedHours']
                },
                description: 'Step-by-step physical or software prototyping roadmap'
              },
              patentResearchTips: { type: Type.STRING, description: 'Actionable guidance on how to search prior art and classifications' },
              priorArtKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Keywords to enter into USPTO, Google Patents, or Espacenet'
              }
            },
            required: [
              'name',
              'shortDescription',
              'problemSolved',
              'howItWorks',
              'whatMakesInteresting',
              'requiredMaterials',
              'estimatedDifficulty',
              'costRange',
              'potentialUsers',
              'limitations',
              'safetyConsiderations',
              'suggestedImprovements',
              'prototypeSteps',
              'patentResearchTips',
              'priorArtKeywords'
            ]
          }
        }
      }
    });

    // Robust JSON parser helper that strips markdown code fences and finds valid json
    function extractJson(rawText: string) {
      let cleaned = rawText.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      return JSON.parse(cleaned);
    }

    const text = response.text;
    if (!text) {
      throw new Error('Empty response received from Gemini');
    }

    const rawInventions = extractJson(text);
    const inventions = (Array.isArray(rawInventions) ? rawInventions : [rawInventions]).map((inv: any, idx: number) => ({
      ...inv,
      id: 'inv-' + Date.now() + '-' + (idx + 1)
    }));

    res.json({ inventions, isGeneratedByAi: true });
  } catch (error: any) {
    console.error('Error generating inventions:', error);
    // Provide smart fallback on error so user experience is smooth
    const { problem, category, inventionType, complexity } = req.body || {};
    const fallbackData = generateSmartFallbackInventions(
      problem || 'Universal Problem',
      category || 'Technology',
      inventionType || 'Physical product',
      complexity || 'Intermediate'
    );
    res.json({
      inventions: fallbackData,
      isGeneratedByAi: false,
      notice: 'Synthesized using INVENTA Lab offline engine due to network/API limit.'
    });
  }
});

// 2. Improve / Refine Invention Endpoint
app.post('/api/invent/improve', async (req: Request, res: Response) => {
  try {
    const { invention, refinementGoal, country } = req.body;
    if (!invention || !refinementGoal) {
      res.status(400).json({ error: 'Invention and refinement goal are required.' });
      return;
    }

    const fallbackRefinement = {
      refinementTitle: `${invention.name} (${refinementGoal})`,
      summaryOfChanges: `Applied architectural heuristic for ${refinementGoal}. Adjusted material tolerances, simplified couplings, and localized component sourcing for ${country || 'global efficiency'}.`,
      revisedMaterials: [
        ...(invention.requiredMaterials?.slice(0, 2) || []),
        'Local salvage fasteners & structural brackets',
        'Standard food-grade EPDM gasket seals'
      ],
      revisedCostRange: {
        min: Math.max(5, Math.round((invention.costRange?.min || 30) * 0.7)),
        max: Math.round((invention.costRange?.max || 60) * 0.8),
        currency: invention.costRange?.currency || 'USD',
        assumptions: `Optimized under ${refinementGoal} parameters for ${country || 'local deployment'}.`
      },
      newTradeOffs: [
        'Slightly increased manual assembly time in exchange for lower hardware acquisition costs.',
        'Requires periodic inspection of localized seal interfaces.'
      ],
      updatedPrototypeSteps: [
        {
          stepNumber: 1,
          title: `Procure Localized Components for ${refinementGoal}`,
          description: `Acquire alternative materials and verify standard dimensional tolerances.`,
          estimatedHours: 3
        },
        {
          stepNumber: 2,
          title: 'Sub-Assembly Rapid Bench Fitment',
          description: 'Dry-fit alternative fasteners and test structural rigidity before final bonding.',
          estimatedHours: 4
        },
        {
          stepNumber: 3,
          title: 'Benchmarking Refined Performance',
          description: `Validate output metrics against original baseline targets under simulated load.`,
          estimatedHours: 5
        }
      ],
      regionalAdaptationNotes: `Optimized for ${country || 'worldwide'} distribution with standard metric hardware.`
    };

    if (!aiClient) {
      res.json({
        refinement: fallbackRefinement,
        isGeneratedByAi: false
      });
      return;
    }

    const prompt = `You are INVENTA's Invention Refinement Engine.
Original Invention:
Name: ${invention.name}
Description: ${invention.shortDescription}
How It Works: ${invention.howItWorks}
Materials: ${JSON.stringify(invention.requiredMaterials)}
Current Cost Range: $${invention.costRange?.min} - $${invention.costRange?.max} ${invention.costRange?.currency}

Refinement Objective: "${refinementGoal}"
Target Region / Country: ${country || 'Worldwide'}

Provide:
1. Specific design changes and material substitutions to achieve this goal.
2. Updated bill of materials.
3. Updated cost impact (lower/higher).
4. New trade-offs or limitations introduced.
5. Revised prototype action steps.

Return clean JSON with:
{
  "refinementTitle": string,
  "summaryOfChanges": string,
  "revisedMaterials": string[],
  "revisedCostRange": { "min": number, "max": number, "currency": "USD", "assumptions": string },
  "newTradeOffs": string[],
  "updatedPrototypeSteps": [{ "stepNumber": number, "title": string, "description": string, "estimatedHours": number }],
  "regionalAdaptationNotes": string
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-1.5-flash-8b',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json'
      }
    });

    let raw = (response.text || '{}').trim();
    if (raw.startsWith('```json')) {
      raw = raw.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (raw.startsWith('```')) {
      raw = raw.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(raw);
    res.json({ refinement: parsed, isGeneratedByAi: true });
  } catch (error: any) {
    console.error('Error improving invention:', error);
    // Return resilient fallback refinement on error
    const { invention, refinementGoal, country } = req.body || {};
    res.json({
      refinement: {
        refinementTitle: `${invention?.name || 'Invention'} (${refinementGoal || 'Optimized'})`,
        summaryOfChanges: `Applied design optimization for ${refinementGoal || 'improved efficiency'}. Adjusted component tolerances and localized bill of materials.`,
        revisedMaterials: invention?.requiredMaterials || ['Locally available fasteners', 'Recycled polymer casing'],
        revisedCostRange: invention?.costRange || { min: 20, max: 50, currency: 'USD', assumptions: 'Standard local components' },
        newTradeOffs: ['Requires initial calibration with local supplies.'],
        updatedPrototypeSteps: invention?.prototypeSteps || [],
        regionalAdaptationNotes: `Adapted for ${country || 'general use'}.`
      },
      isGeneratedByAi: false
    });
  }
});

// 3. AI Invention Assistant Endpoint
app.post('/api/invent/assistant', async (req: Request, res: Response) => {
  try {
    const { messages, selectedInvention } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    if (!aiClient) {
      const lastUserMsg = messages[messages.length - 1]?.content || 'Hello';
      res.json({
        reply: `[INVENTA Laboratory Assistant]\nRegarding "${selectedInvention?.name || 'your invention'}":\n\nTo address "${lastUserMsg}", consider inspecting the critical mechanical junction or bill of materials first. Check whether off-the-shelf fasteners can replace custom machined parts to minimize prototyping lead times.\n\nKey recommendation: Prototype the sub-assembly with lowest tolerance requirements first before building the full enclosure.`,
        isGeneratedByAi: false
      });
      return;
    }

    let contextSnippet = 'No specific invention currently selected.';
    if (selectedInvention) {
      contextSnippet = `Currently Active Invention Workspace:
Name: ${selectedInvention.name}
Description: ${selectedInvention.shortDescription}
How It Works: ${selectedInvention.howItWorks}
Materials: ${JSON.stringify(selectedInvention.requiredMaterials)}
Cost Range: $${selectedInvention.costRange?.min} - $${selectedInvention.costRange?.max}
Limitations: ${JSON.stringify(selectedInvention.limitations)}
Safety Considerations: ${JSON.stringify(selectedInvention.safetyConsiderations)}`;
    }

    const systemInstruction = `You are INVENTA's Dedicated AI Invention Assistant and Engineering Mentor.
You assist makers, engineers, researchers, and everyday problem-solvers in designing, testing, patent-checking, and prototyping inventions.
Context:
${contextSnippet}

Guiding Principles:
1. Grounded advice: Provide practical physics, electronics, materials science, manufacturing methods (3D printing, CNC, sheet metal, laser cutting, casting, microcontrollers), and software architecture.
2. Scientific accuracy: Never invent fake scientific facts, non-existent patents, or pretend untested hypothetical contraptions are proven.
3. Safety first: Emphasize electrical safety (high voltage, lithium batteries), chemical safety (fumes, reaction heat), and mechanical safety (pinch points, pressure vessels).
4. Concise and actionable: Format recommendations with clear steps, bullet points, and realistic testing benchmarks.`;

    // Format chat history
    let validContents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(m.content || '') }]
    }));

    // Multi-turn chat must begin with a user turn
    while (validContents.length > 0 && validContents[0].role !== 'user') {
      validContents.shift();
    }
    if (validContents.length === 0) {
      validContents = [{ role: 'user', parts: [{ text: 'Hello, how can you assist my invention prototyping?' }] }];
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-1.5-flash-8b',
      contents: validContents,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction
      }
    });

    res.json({ reply: response.text || 'I am ready to assist your prototyping workflow.', isGeneratedByAi: true });
  } catch (error: any) {
    console.error('Error in assistant chat:', error);
    const lastUserMsg = (req.body?.messages || []).filter((m: any) => m.role === 'user').pop()?.content || 'Invention guidance';
    res.json({
      reply: `[INVENTA Engineering Assistant]\nRegarding your question on "${lastUserMsg}":\n\nFor joining dissimilar materials like acrylic and wood, avoid solvent glues as they craze acrylic and do not bond to cellular wood fibers. Instead, use:\n1. Mechanical fasteners with oversized clearance holes in acrylic to allow thermal expansion.\n2. Neutral-cure silicone or MS polymer adhesive for flexible shock absorption.\n3. Neoprene or EPDM rubber washers between screw heads and acrylic to distribute point stress.`,
      isGeneratedByAi: false,
      debugError: error?.message || String(error)
    });
  }
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', app: 'INVENTA', version: '1.0.0', hasGeminiKey: !!apiKey });
});

// Vite middleware in dev, static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`[INVENTA] Server active at http://localhost:${port}`);
  });
}

startServer();
