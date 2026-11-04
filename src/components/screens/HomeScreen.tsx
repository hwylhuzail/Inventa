import React, { useState } from 'react';
import { Invention, UserProfile, AppScreen } from '../../types/invention';
import { FEATURED_CHALLENGES, DAILY_INSPIRATIONS } from '../../data/seedInventions';
import {
  Sparkles,
  ArrowRight,
  PlusCircle,
  Lightbulb,
  Search,
  Bookmark,
  CheckCircle2,
  Flame,
  Layers,
  ChevronRight,
  Cpu,
  Compass,
  Hammer,
  Bot
} from 'lucide-react';

interface HomeScreenProps {
  profile: UserProfile;
  inventions: Invention[];
  onNavigate: (screen: AppScreen) => void;
  onSelectInvention: (invention: Invention) => void;
  onStartWithProblem: (problemText: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  inventions,
  onNavigate,
  onSelectInvention,
  onStartWithProblem
}) => {
  const [searchProblem, setSearchProblem] = useState('');
  const savedFavorites = inventions.filter((inv) => inv.isFavorite);
  const recentProjects = inventions.slice(0, 3);
  const totalSteps = inventions.reduce((acc, inv) => acc + (inv.prototypeSteps?.length || 0), 0);
  const completedSteps = inventions.reduce(
    (acc, inv) => acc + (inv.prototypeSteps?.filter((s) => s.completed)?.length || 0),
    0
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchProblem.trim()) {
      onStartWithProblem(searchProblem.trim());
    } else {
      onNavigate('create');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-6 pb-14 text-slate-100">
      {/* Welcome Greeting & System Status */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
            Personal Laboratory Dashboard
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
            {profile.displayName || 'Lead Inventor'}
          </h2>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131B2E] border border-white/[0.08] text-xs font-medium text-slate-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-mono text-[11px]">Groq AI Ready</span>
        </div>
      </div>

      {/* Hero Laboratory Synthesizer Action Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950/70 via-[#0F172A] to-[#0A0E1A] border border-violet-500/30 p-5 sm:p-6 shadow-2xl shadow-violet-950/40">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-cyan-500/15 via-violet-600/10 to-transparent blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>AI Invention Generator</span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
            Transform Any Problem Into 3 Engineered Solutions
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
            Submit observations through text, speech, or photos. INVENTA synthesizes mechanical, sensing, and circular archetypes with verifiable materials and budgets.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('create')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-violet-900/50 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create an Invention</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('discover')}
              className="px-4 py-2.5 rounded-xl bg-[#131B2E] hover:bg-[#1A253E] border border-white/[0.08] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Explore Discovery Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Problem-Solving Quick Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchProblem}
            onChange={(e) => setSearchProblem(e.target.value)}
            placeholder="Describe an observation... e.g. Passive fruit dehydrator for humid climates"
            className="w-full pl-11 pr-24 py-3 bg-[#0F172A] border border-white/[0.08] focus:border-cyan-400 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all active:scale-95 shadow-md"
          >
            Synthesize
          </button>
        </div>
      </form>

      {/* Key Innovation Metrics (Strict Tabular Figures & Unboxed Metadata) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-white/[0.06] flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-400">Total Projects</span>
          <span className="text-2xl font-black font-mono text-white tracking-tight mt-1 tabular-nums">
            {inventions.length}
          </span>
          <span className="text-[10px] text-slate-500 mt-1">Archived in vault</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-white/[0.06] flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-400">Bookmarked</span>
          <span className="text-2xl font-black font-mono text-cyan-400 tracking-tight mt-1 tabular-nums">
            {savedFavorites.length}
          </span>
          <span className="text-[10px] text-slate-500 mt-1">High priority</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-white/[0.06] flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-400">Milestones</span>
          <span className="text-2xl font-black font-mono text-violet-400 tracking-tight mt-1 tabular-nums">
            {completedSteps}/{totalSteps || 12}
          </span>
          <span className="text-[10px] text-slate-500 mt-1">Tasks built</span>
        </div>
      </div>

      {/* Recent Laboratory Projects */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-400" />
            <span>Recent Laboratory Projects</span>
          </h3>
          <button
            onClick={() => onNavigate('my-inventions')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            All Projects ({inventions.length})
          </button>
        </div>

        {recentProjects.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#0F172A]/60 border border-white/[0.06] text-center space-y-2">
            <Lightbulb className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">
              No saved projects yet. Generate your first invention concept!
            </p>
            <button
              onClick={() => onNavigate('create')}
              className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold"
            >
              Start Generating
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentProjects.map((inv) => (
              <div
                key={inv.id}
                onClick={() => onSelectInvention(inv)}
                className="p-4 rounded-2xl bg-[#0F172A] hover:bg-[#131B2E] border border-white/[0.06] hover:border-violet-500/40 transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-semibold text-cyan-400">{inv.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{inv.inventionType}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-300 font-medium tabular-nums">
                      ${inv.costRange?.min}-${inv.costRange?.max} {inv.costRange?.currency || 'USD'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white truncate group-hover:text-violet-300 transition-colors">
                    {inv.name}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {inv.shortDescription}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {inv.progressPercent !== undefined && inv.progressPercent > 0 && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {inv.progressPercent}% built
                    </span>
                  )}
                  <div className="w-7 h-7 rounded-xl bg-white/[0.04] group-hover:bg-violet-600/20 flex items-center justify-center transition-colors">
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Global Invention Challenges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Featured Invention Challenges</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">High Impact</span>
        </div>

        <div className="space-y-3">
          {FEATURED_CHALLENGES.map((ch) => (
            <div
              key={ch.id}
              className="p-4 rounded-2xl bg-[#0F172A] border border-white/[0.06] space-y-2"
            >
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="text-amber-400 font-bold">{ch.category}</span>
                <span className="text-slate-400 font-mono text-[10px]">{ch.rewardTag}</span>
              </div>

              <h4 className="text-sm font-bold text-white">
                {ch.title}
              </h4>

              <p className="text-xs text-slate-400 leading-relaxed">
                {ch.description}
              </p>

              <button
                onClick={() => onStartWithProblem(`${ch.title}: ${ch.description}`)}
                className="mt-1 px-3 py-1.5 rounded-xl bg-[#131B2E] hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Tackle This Challenge</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Creative Inspiration Axiom */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-violet-950/30 via-[#0F172A] to-[#0F172A] border border-violet-800/30 space-y-2">
        <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-bold block">
          Daily Prototyping Axiom
        </span>
        <blockquote className="text-xs italic text-slate-200 leading-relaxed font-serif">
          "{DAILY_INSPIRATIONS[0].quote}"
        </blockquote>
        <div className="text-[11px] text-slate-400 font-medium">
          — {DAILY_INSPIRATIONS[0].author} · {DAILY_INSPIRATIONS[0].tag}
        </div>
      </div>
    </div>
  );
};
