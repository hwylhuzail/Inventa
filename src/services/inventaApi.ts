import { Invention, InventionCategory, InventionType, ComplexityLevel, RefinementResult } from '../types/invention';

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
      throw new Error(err.error || `Failed to generate inventions (${response.status})`);
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
      throw new Error(err.error || `Failed to refine invention (${response.status})`);
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
      throw new Error(err.error || `Failed to connect with AI assistant (${response.status})`);
    }

    return response.json();
  }
};
