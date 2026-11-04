import { Invention, InventionCategory, InventionType, ComplexityLevel, RefinementResult } from '../types/invention';

function readableApiError(payload: any, fallback: string): string {
  if (!payload?.error) return fallback;
  const raw = typeof payload.error === 'string' ? payload.error : JSON.stringify(payload.error);
  try {
    const parsed = JSON.parse(raw);
    const providerMessage = parsed?.error?.message;
    if (providerMessage) return providerMessage;
  } catch {}
  if (typeof payload.error === 'string' && payload.error.length < 300) return payload.error;
  return fallback;
}

export interface GenerateInventionsParams {
  problem: string;
  category: InventionCategory;
  inventionType: InventionType;
  complexity: ComplexityLevel;
  imageDataUrl?: string;
}

export const InventaApi = {
  async generateInventions(params: GenerateInventionsParams): Promise<{ inventions: Invention[]; isGeneratedByAi: boolean }> {
    const response = await fetch('/api/invent/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(readableApiError(err, `Failed to generate inventions (${response.status})`));
    }

    return response.json();
  },

  async improveInvention(
    invention: Invention,
    refinementGoal: string,
    country?: string
  ): Promise<{ refinement: RefinementResult; isGeneratedByAi: boolean }> {
    const response = await fetch('/api/invent/improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invention, refinementGoal, country })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(readableApiError(err, `Failed to refine invention (${response.status})`));
    }

    return response.json();
  },

  async askAssistant(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    selectedInvention?: Invention | null
  ): Promise<{ reply: string; isGeneratedByAi: boolean }> {
    const response = await fetch('/api/invent/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, selectedInvention })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(readableApiError(err, `Failed to connect with AI assistant (${response.status})`));
    }

    return response.json();
  }
};
