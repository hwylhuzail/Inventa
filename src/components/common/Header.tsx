import React from 'react';
import { ArrowLeft, Bot, Sparkles } from 'lucide-react';
import { AppScreen } from '../../types/invention';
import { InventaLogo } from './InventaLogo';

interface HeaderProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onBack?: () => void;
  title?: string;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onBack,
  title,
  showBack = false
}) => {
  return (
    <header className="shrink-0 h-14 px-4 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between gap-4 z-30 select-none">
      {/* Zone 1: Brand Wordmark or Contextual Back Navigation */}
      <div className="flex items-center gap-2 min-w-0">
        {showBack ? (
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onBack || (() => onNavigate('home'))}
              className="p-2 -ml-1 text-slate-300 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors focus:outline-none"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-sm sm:text-base font-bold text-white truncate tracking-tight">
              {title}
            </h1>
          </div>
        ) : (
          <InventaLogo
            size="sm"
            onClick={() => onNavigate('home')}
          />
        )}
      </div>

      {/* Zone 3: Primary Fast Action (AI Lab Copilot) */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onNavigate('assistant')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
            currentScreen === 'assistant'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-400 shadow-md shadow-violet-900/30'
              : 'bg-[#131B2E] text-violet-200 hover:text-white border-white/[0.08] hover:border-violet-500/40 shadow-sm'
          }`}
          aria-label="Open AI Invention Assistant"
        >
          <Bot className="w-3.5 h-3.5 text-cyan-400" />
          <span className="tracking-tight">AI Copilot</span>
        </button>
      </div>
    </header>
  );
};
