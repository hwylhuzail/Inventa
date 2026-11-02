import React, { useState } from 'react';
import { Invention, InventionCategory, ComplexityLevel, RefinementResult } from '../../types/invention';
import { InventaApi } from '../../services/inventaApi';
import {
  Compass,
  Search,
  Sparkles,
  Bookmark,
  Scale,
  Hammer,
  ChevronRight,
  Globe,
  Sliders,
  DollarSign,
  Leaf,
  CheckCircle2,
  RefreshCw,
  X,
  ArrowRight
} from 'lucide-react';

interface DiscoveryLabScreenProps {
  inventions: Invention[];
  onSelectInvention: (inv: Invention) => void;
  onOpenPrototype: (inv: Invention) => void;
  onCompare: (inventions: Invention[]) => void;
  onToggleFavorite: (id: string) => void;
  onUpdateInvention: (inv: Invention) => void;
  initialRefineTarget?: Invention | null;
}

const REFINEMENT_GOALS = [
  { id: 'cheaper', label: 'Make it cheaper', icon: DollarSign, prompt: 'Reduce cost significantly using standard salvage materials' },
  { id: 'simpler', label: 'Make it simpler', icon: Sliders, prompt: 'Eliminate complex moving parts and high-tolerance components' },
  { id: 'efficient', label: 'Make it more efficient', icon: Sparkles, prompt: 'Maximize energy and thermodynamic efficiency' },
  { id: 'eco', label: 'Make eco-friendly', icon: Leaf, prompt: 'Use 100% biodegradable, non-toxic, or recycled elements' },
  { id: 'country', label: 'Adapt to country', icon: Globe, prompt: 'Adapt to local supply chains, climate, and grid constraints' },
  { id: 'materials', label: 'Alternative materials', icon: RefreshCw, prompt: 'Substitutes for scarce or specialized composite materials' }
];

export const DiscoveryLabScreen: React.FC<DiscoveryLabScreenProps> = ({
  inventions,
  onSelectInvention,
  onOpenPrototype,
  onCompare,
  onToggleFavorite,
  onUpdateInvention,
  initialRefineTarget = null
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // AI Refine Modal State
  const [refineTarget, setRefineTarget] = useState<Invention | null>(initialRefineTarget);
  const [selectedGoal, setSelectedGoal] = useState(REFINEMENT_GOALS[0]);
  const [targetCountry, setTargetCountry] = useState('Kenya');
  const [isRefining, setIsRefining] = useState(false);
  const [refinementResult, setRefinementResult] = useState<RefinementResult | null>(null);
  const [refinementError, setRefinementError] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialRefineTarget) {
      setRefineTarget(initialRefineTarget);
      setRefinementResult(null);
    }
  }, [initialRefineTarget]);

  const categories = ['All', 'Agriculture', 'Healthcare', 'Environment', 'Energy', 'Technology', 'Household'];

  const filtered = inventions.filter((inv) => {
    const matchesSearch =
      inv.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      inv.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || inv.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'All' || inv.estimatedDifficulty === selectedDifficulty;
    return matchesSearch && matchesCat && matchesDiff;
  });

  const handleOpenRefineModal = (inv: Invention, e: React.MouseEvent) => {
    e.stopPropagation();
    setRefineTarget(inv);
    setRefinementResult(null);
    setRefinementError(null);
  };

  const handleExecuteRefinement = async () => {
    if (!refineTarget) return;
    setIsRefining(true);
    setRefinementError(null);

    try {
      const goalText =
        selectedGoal.id === 'country'
          ? `Adapt specifically to the infrastructure, climate, and supply chains of ${targetCountry}`
          : selectedGoal.prompt;

      const res = await InventaApi.improveInvention(refineTarget, goalText, targetCountry);
      setRefinementResult(res.refinement);
    } catch (err: any) {
      setRefinementError(err.message || 'Failed to refine invention');
    } finally {
      setIsRefining(false);
    }
  };

  const handleApplyRefinementToInvention = () => {
    if (!refineTarget || !refinementResult) return;
    const updated: Invention = {
      ...refineTarget,
      name: `${refineTarget.name} (${refinementResult.refinementTitle || selectedGoal.label})`,
      shortDescription: refinementResult.summaryOfChanges || refineTarget.shortDescription,
      requiredMaterials: refinementResult.revisedMaterials || refineTarget.requiredMaterials,
      costRange: refinementResult.revisedCostRange || refineTarget.costRange,
      limitations: [...(refineTarget.limitations || []), ...(refinementResult.newTradeOffs || [])],
      prototypeSteps: refinementResult.updatedPrototypeSteps || refineTarget.prototypeSteps,
      customModifications: [...(refineTarget.customModifications || []), selectedGoal.label]
    };
    onUpdateInvention(updated);
    setRefineTarget(null);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-4 pb-14 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Compass className="w-3.5 h-3.5" />
            <span>Open Innovation Repository</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
            Discovery Laboratory
          </h2>
        </div>

        <button
          onClick={() => onCompare(filtered.slice(0, 3))}
          disabled={filtered.length < 2}
          className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
            filtered.length >= 2
              ? 'bg-[#131B2E] hover:bg-[#1A253E] text-slate-200 border-white/[0.08]'
              : 'bg-slate-900/50 border-white/[0.04] text-slate-600 cursor-not-allowed'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-violet-400" />
          <span>Compare (2-3)</span>
        </button>
      </div>

      {/* Search & Difficulty Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search repository by keyword, material..."
            className="w-full pl-10 pr-3 py-2.5 bg-[#0F172A] border border-white/[0.08] focus:border-cyan-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-3 py-2.5 bg-[#0F172A] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none font-medium cursor-pointer"
        >
          <option value="All">All Tiers</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Category Pills Scroller */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-violet-600/30 text-cyan-300 border border-violet-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0F172A]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Inventions Cards Feed */}
      <div className="space-y-3">
        {filtered.map((inv) => (
          <div
            key={inv.id}
            onClick={() => onSelectInvention(inv)}
            className="p-5 rounded-3xl bg-[#0F172A] hover:bg-[#131B2E] border border-white/[0.06] hover:border-violet-500/40 transition-all cursor-pointer group space-y-3.5 shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-cyan-400 font-bold">{inv.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{inv.inventionType}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-slate-300 font-medium tabular-nums">
                    ${inv.costRange?.min}-${inv.costRange?.max} {inv.costRange?.currency || 'USD'}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white group-hover:text-violet-300 transition-colors">
                  {inv.name}
                </h3>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(inv.id);
                }}
                className="p-2 text-slate-400 hover:text-violet-400 rounded-xl hover:bg-white/[0.04] transition-colors"
                title="Toggle Bookmark"
              >
                <Bookmark className={`w-4 h-4 ${inv.isFavorite ? 'fill-violet-400 text-violet-400' : ''}`} />
              </button>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {inv.shortDescription}
            </p>

            {/* Core novelty quote */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.04] text-[11px] text-slate-300 italic leading-relaxed">
              "{inv.whatMakesInteresting}"
            </div>

            {/* Action Bar: Improve This Invention & Open Studio */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
              <button
                onClick={(e) => handleOpenRefineModal(inv, e)}
                className="px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Improve This Invention</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPrototype(inv);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#131B2E] hover:bg-[#1A253E] text-slate-200 border border-white/[0.08] text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Hammer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Studio</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* "Improve This Invention" AI Refinement Modal */}
      {refineTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0F172A] border border-white/[0.1] p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Improve This Invention
                </h3>
              </div>
              <button
                onClick={() => setRefineTarget(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] text-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Target Concept:</span>
              <div className="font-bold text-white">{refineTarget.name}</div>
              <div className="text-slate-400 text-[11px] line-clamp-1">{refineTarget.shortDescription}</div>
            </div>

            {/* Refinement Objective Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Select Refinement Objective:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {REFINEMENT_GOALS.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoal.id === goal.id;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setSelectedGoal(goal)}
                      className={`p-3 rounded-2xl border text-left text-xs transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-violet-950/60 border-violet-500 text-white ring-2 ring-violet-500/40 font-bold shadow-sm'
                          : 'bg-black/30 border-white/[0.06] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span className="truncate">{goal.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Country Input when adapting to country */}
            {selectedGoal.id === 'country' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Country or Region:
                </label>
                <input
                  type="text"
                  value={targetCountry}
                  onChange={(e) => setTargetCountry(e.target.value)}
                  placeholder="e.g. Kenya, India, Peru, Rural Vietnam..."
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/[0.08] focus:border-cyan-400 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
            )}

            {/* Execute Refinement CTA */}
            {!refinementResult && (
              <button
                onClick={handleExecuteRefinement}
                disabled={isRefining}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isRefining ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                    <span>Synthesizing Design Refinements...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Refiner ({selectedGoal.label})</span>
                  </>
                )}
              </button>
            )}

            {refinementError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300">
                {refinementError}
              </div>
            )}

            {/* Refinement Results View */}
            {refinementResult && (
              <div className="space-y-3 pt-2 border-t border-white/[0.08] text-xs">
                <div className="p-4 rounded-2xl bg-black/40 border border-cyan-400/40 space-y-2.5 shadow-md">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>{refinementResult.refinementTitle || 'Architectural Optimization Complete'}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {refinementResult.summaryOfChanges}
                  </p>

                  {refinementResult.revisedCostRange && (
                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Revised Budget:</span>
                      <span className="font-mono text-cyan-300 font-bold">
                        ${refinementResult.revisedCostRange.min} - ${refinementResult.revisedCostRange.max} USD
                      </span>
                    </div>
                  )}

                  {refinementResult.revisedMaterials?.length > 0 && (
                    <div className="pt-2 border-t border-white/[0.06]">
                      <span className="text-slate-400 block mb-1 font-semibold">Substituted Materials:</span>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {refinementResult.revisedMaterials.slice(0, 3).map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setRefinementResult(null)}
                    className="flex-1 py-2.5 rounded-xl bg-[#131B2E] text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    Try Another Goal
                  </button>
                  <button
                    onClick={handleApplyRefinementToInvention}
                    className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
                  >
                    Apply to Project
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
