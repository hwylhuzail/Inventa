import React, { useState } from 'react';
import { Invention } from '../../types/invention';
import {
  Sparkles,
  ArrowRight,
  Bookmark,
  Check,
  Hammer,
  Scale,
  ShieldAlert,
  ChevronRight,
  Boxes,
  Zap,
  Leaf,
  DollarSign
} from 'lucide-react';

interface GeneratedResultsScreenProps {
  inventions: Invention[];
  onSelectInvention: (inv: Invention) => void;
  onOpenPrototype: (inv: Invention) => void;
  onCompare: (inventions: Invention[]) => void;
  onSaveToVault: (inv: Invention) => void;
  savedIds: string[];
}

export const GeneratedResultsScreen: React.FC<GeneratedResultsScreenProps> = ({
  inventions,
  onSelectInvention,
  onOpenPrototype,
  onCompare,
  onSaveToVault,
  savedIds
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const activeInvention = inventions[activeTab] || inventions[0];

  if (!activeInvention) {
    return (
      <div className="flex-1 p-6 text-center text-slate-400">
        No concepts generated.
      </div>
    );
  }

  const isSaved = savedIds.includes(activeInvention.id);

  const archetypeIcons = [Boxes, Zap, Leaf];
  const archetypeLabels = ['Passive / Mechanical', 'Smart / Sensing', 'Circular / Salvage'];

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-4 pb-14 text-slate-100">
      {/* Header & Comparison Action */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3 Solution Archetypes Synthesized</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mt-0.5">
            Select Your Invention Concept
          </h2>
        </div>

        <button
          onClick={() => onCompare(inventions)}
          className="px-3.5 py-2 rounded-xl bg-[#131B2E] hover:bg-[#1A253E] text-slate-200 border border-white/[0.08] hover:border-violet-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
        >
          <Scale className="w-3.5 h-3.5 text-violet-400" />
          <span>Compare 3</span>
        </button>
      </div>

      {/* 3 Solution Selector Tab Strip */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#0F172A] border border-white/[0.08] rounded-2xl">
        {inventions.map((inv, idx) => {
          const Icon = archetypeIcons[idx] || Boxes;
          const isActive = activeTab === idx;

          return (
            <button
              key={inv.id || idx}
              onClick={() => setActiveTab(idx)}
              className={`py-2.5 px-2 rounded-xl text-xs font-medium text-center transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/40 font-bold scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-mono tracking-wider opacity-80">
                <Icon className="w-3 h-3" />
                <span>Concept 0{idx + 1}</span>
              </div>
              <div className="truncate text-xs mt-1">
                {archetypeLabels[idx] || 'Archetype'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Concept Card Details */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0F172A] border border-white/[0.08] space-y-5 shadow-xl">
        {/* Title, Category & Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="font-bold text-cyan-400">{activeInvention.category}</span>
              <span aria-hidden="true">·</span>
              <span>{activeInvention.inventionType}</span>
              <span aria-hidden="true">·</span>
              <span className="text-violet-300 font-semibold">{activeInvention.estimatedDifficulty}</span>
            </div>
            <h3 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug">
              {activeInvention.name}
            </h3>
          </div>

          <button
            onClick={() => onSaveToVault(activeInvention)}
            className={`p-2.5 rounded-2xl border transition-all shrink-0 ${
              isSaved
                ? 'bg-violet-600/30 border-violet-500 text-violet-300 shadow-md'
                : 'bg-[#131B2E] border-white/[0.08] text-slate-400 hover:text-white'
            }`}
            title={isSaved ? 'Saved in My Inventions' : 'Save to My Inventions'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-violet-400 text-violet-400' : ''}`} />
          </button>
        </div>

        {/* Executive summary */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {activeInvention.shortDescription}
        </p>

        {/* Budget assumptions pill */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">
              Indicative Prototyping Budget
            </span>
            <span className="text-lg font-black font-mono text-cyan-300 tabular-nums">
              ${activeInvention.costRange?.min} - ${activeInvention.costRange?.max}{' '}
              <span className="text-xs font-normal text-slate-400">
                {activeInvention.costRange?.currency || 'USD'}
              </span>
            </span>
          </div>
          <span className="text-[11px] text-slate-400 italic max-w-xs leading-relaxed">
            {activeInvention.costRange?.assumptions}
          </span>
        </div>

        {/* How It Works & Core Novelty */}
        <div className="space-y-4 pt-2 border-t border-white/[0.06]">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              How It Operates (Technical Mechanism)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeInvention.howItWorks}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
              Core Innovation Angle & Novelty
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {activeInvention.whatMakesInteresting}
            </p>
          </div>
        </div>

        {/* Key Materials Required */}
        <div className="pt-2 border-t border-white/[0.06]">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Primary Materials & Hardware
          </h4>
          <div className="space-y-1.5">
            {activeInvention.requiredMaterials?.slice(0, 4).map((mat, i) => (
              <div key={i} className="text-xs text-slate-300 flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span>{mat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Safety & Responsible AI Disclaimer Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-amber-200/90 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300 block">
              Safety & Patent Verification Notice:
            </span>
            <p className="text-[11px] text-amber-200/80 leading-relaxed">
              These concepts are AI-generated blueprints. Validate thermodynamic limits, electrical wiring, and independent novelty on Google Patents or USPTO before building.
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onSelectInvention(activeInvention)}
            className="w-full h-12 rounded-xl bg-[#131B2E] hover:bg-[#1A253E] text-slate-200 border border-white/[0.08] hover:border-violet-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>Full Specs</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => onOpenPrototype(activeInvention)}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Hammer className="w-4 h-4" />
            <span>Prototype Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
