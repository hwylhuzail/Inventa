export type InventionCategory =
  | 'Agriculture'
  | 'Healthcare'
  | 'Education'
  | 'Transportation'
  | 'Environment'
  | 'Construction'
  | 'Technology'
  | 'Energy'
  | 'Household'
  | 'Communication'
  | 'Manufacturing'
  | 'Other';

export type InventionType =
  | 'Physical product'
  | 'Mobile application'
  | 'Software technology'
  | 'Machine or device'
  | 'Business solution'
  | 'Scientific concept'
  | 'Other';

export type ComplexityLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CostRange {
  min: number;
  max: number;
  currency: string;
  assumptions: string;
}

export interface PrototypeStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedHours: number;
  completed?: boolean;
}

export interface MaterialItem {
  name: string;
  estimatedCost?: number;
  acquired?: boolean;
  notes?: string;
}

export interface Invention {
  id: string;
  name: string;
  shortDescription: string;
  problemSolved: string;
  category: InventionCategory;
  inventionType: InventionType;
  howItWorks: string;
  whatMakesInteresting: string;
  requiredMaterials: string[];
  materialsDetailed?: MaterialItem[];
  estimatedDifficulty: ComplexityLevel;
  costRange: CostRange;
  potentialUsers: string[];
  limitations: string[];
  safetyConsiderations: string[];
  suggestedImprovements: string[];
  prototypeSteps: PrototypeStep[];
  patentResearchTips: string;
  priorArtKeywords: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  progressPercent?: number;
  userNotes?: string;
  customModifications?: string[];
  isSeed?: boolean;
}

export interface RefinementResult {
  refinementTitle: string;
  summaryOfChanges: string;
  revisedMaterials: string[];
  revisedCostRange: CostRange;
  newTradeOffs: string[];
  updatedPrototypeSteps: PrototypeStep[];
  regionalAdaptationNotes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  bio: string;
  tier: 'Free' | 'Pro';
  creationsCount: number;
  activePrototypesCount: number;
  completedTasksCount: number;
  cloudAiConsent: boolean;
  joinedDate: string;
}

export type AppScreen =
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'home'
  | 'create'
  | 'generating'
  | 'results'
  | 'detail'
  | 'compare'
  | 'prototype'
  | 'my-inventions'
  | 'discover'
  | 'assistant'
  | 'profile'
  | 'settings'
  | 'data-export'
  | 'android-code';
