import { Invention, UserProfile, ChatMessage } from '../types/invention';
import { SEED_INVENTIONS } from '../data/seedInventions';

const STORAGE_KEY_INVENTIONS = 'inventa_saved_inventions_v1';
const STORAGE_KEY_PROFILE = 'inventa_user_profile_v1';
const STORAGE_KEY_CHAT = 'inventa_assistant_chat_v1';
const STORAGE_KEY_THEME = 'inventa_theme_mode';
const STORAGE_KEY_FRAME = 'inventa_device_frame_mode';

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-inventor-local',
  displayName: 'Lead Maker',
  email: 'inventor@inventa.lab',
  bio: 'Exploring practical hardware, renewable energy, and open-source civic solutions.',
  tier: 'Free',
  creationsCount: 3,
  activePrototypesCount: 2,
  completedTasksCount: 9,
  cloudAiConsent: true,
  joinedDate: 'November 2026'
};

export const StorageService = {
  // Inventions
  getInventions(): Invention[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_INVENTIONS);
      if (!data) {
        // Initialize with seeds
        this.saveInventions(SEED_INVENTIONS);
        return SEED_INVENTIONS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read inventions from localStorage:', e);
      return SEED_INVENTIONS;
    }
  },

  saveInventions(inventions: Invention[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_INVENTIONS, JSON.stringify(inventions));
    } catch (e) {
      console.error('Failed to save inventions to localStorage:', e);
    }
  },

  addInvention(invention: Invention): Invention[] {
    const list = this.getInventions();
    // Prepend new invention
    const updated = [invention, ...list.filter(item => item.id !== invention.id)];
    this.saveInventions(updated);
    this.incrementCreationCount();
    return updated;
  },

  updateInvention(updatedInvention: Invention): Invention[] {
    const list = this.getInventions();
    const updated = list.map(item => (item.id === updatedInvention.id ? { ...updatedInvention, updatedAt: new Date().toISOString() } : item));
    this.saveInventions(updated);
    return updated;
  },

  deleteInvention(id: string): Invention[] {
    const list = this.getInventions();
    const updated = list.filter(item => item.id !== id);
    this.saveInventions(updated);
    return updated;
  },

  toggleFavorite(id: string): Invention[] {
    const list = this.getInventions();
    const updated = list.map(item => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
    this.saveInventions(updated);
    return updated;
  },

  // User Profile
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (!data) {
        this.saveProfile(DEFAULT_PROFILE);
        return DEFAULT_PROFILE;
      }
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  },

  incrementCreationCount(): void {
    const profile = this.getProfile();
    profile.creationsCount += 1;
    this.saveProfile(profile);
  },

  // Chat history
  getChatHistory(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CHAT);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  },

  saveChatHistory(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  },

  // UI preferences
  getThemeMode(): 'dark' | 'light' {
    return (localStorage.getItem(STORAGE_KEY_THEME) as 'dark' | 'light') || 'dark';
  },

  setThemeMode(mode: 'dark' | 'light'): void {
    localStorage.setItem(STORAGE_KEY_THEME, mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  getDeviceFrameMode(): boolean {
    const val = localStorage.getItem(STORAGE_KEY_FRAME);
    return val === null ? false : val === 'true';
  },

  setDeviceFrameMode(enabled: boolean): void {
    localStorage.setItem(STORAGE_KEY_FRAME, String(enabled));
  },

  // Export Data
  exportAllDataAsJson(): string {
    const data = {
      app: 'INVENTA',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      inventions: this.getInventions(),
      chatHistory: this.getChatHistory(),
      integrityHash: 'sha256-verified-local-vault'
    };
    return JSON.stringify(data, null, 2);
  },

  exportInventionAsMarkdown(invention: Invention): string {
    const materialsText = (invention.requiredMaterials || []).map(m => `- ${m}`).join('\n');
    const stepsText = (invention.prototypeSteps || [])
      .map(
        s =>
          `### Step ${s.stepNumber}: ${s.title} (${s.estimatedHours} hrs)\n${s.description}\n- Status: ${s.completed ? '[x] Completed' : '[ ] Pending'}`
      )
      .join('\n\n');
    const safetyText = (invention.safetyConsiderations || []).map(s => `⚠️ **Warning:** ${s}`).join('\n');

    return `# INVENTA — Prototype Engineering Report
**Project Name:** ${invention.name}  
**Category:** ${invention.category} · **Type:** ${invention.inventionType}  
**Complexity:** ${invention.estimatedDifficulty}  
**Indicative Budget:** $${invention.costRange?.min} - $${invention.costRange?.max} ${invention.costRange?.currency || 'USD'}  
**Budget Assumptions:** ${invention.costRange?.assumptions || 'N/A'}  
**Report Generated:** ${new Date().toLocaleDateString()}  

---

## 1. Problem Statement
${invention.problemSolved}

---

## 2. Executive Summary & Proposed Solution
${invention.shortDescription}

### How It Works
${invention.howItWorks}

### Novelty & Core Innovation
${invention.whatMakesInteresting}

---

## 3. Bill of Materials & Components
${materialsText || 'None specified'}

---

## 4. Prototype Development Roadmap
${stepsText || 'No roadmap steps defined'}

---

## 5. Potential Limitations & Boundary Conditions
${(invention.limitations || []).map(l => `- ${l}`).join('\n')}

---

## 6. Safety & Hazardous Considerations
${safetyText}

---

## 7. Prior Art & Patent Research Vectors
${invention.patentResearchTips || 'Conduct comprehensive searches on USPTO, Espacenet, and Google Patents.'}

**Recommended Search Keywords:**
${(invention.priorArtKeywords || []).map(k => `\`${k}\``).join(', ')}

---
*Notice: This document was synthesized using INVENTA AI Invention Laboratory. Untested prototypes should never be presented as proven products. Verify all electrical, mechanical, and chemical claims before fabrication.*
`;
  },

  // Account Wipe / Clear
  wipeAllData(): void {
    localStorage.removeItem(STORAGE_KEY_INVENTIONS);
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    localStorage.removeItem(STORAGE_KEY_CHAT);
    // Re-seed default profile
    this.saveProfile(DEFAULT_PROFILE);
  }
};
