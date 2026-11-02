import React from 'react';
import { Invention } from '../../types/invention';
import { Scale, CheckCircle2, ArrowRight, Hammer, ChevronLeft } from 'lucide-react';

interface ComparisonScreenProps {
  inventions: Invention[];
  onSelectForPrototype: (inv: Invention) => void;
  onBack: () => void;
}

export const ComparisonScreen: React.FC<ComparisonScreenProps> = ({
  inventions,
  onSelectForPrototype,
  onBack
}) => {
  if (!inventions || inventions.length === 0) {
    return (
      <div className="flex-1 p-8 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
        <Scale className="w-10 h-10 text-slate-600 mx-auto" />
        <h3 className="text-base font-bold text-white">No Concepts for Comparison</h3>
        <p className="text-xs text-slate-400 max-w-xs">
          Select at least two inventions from Discovery Lab or generate a new batch to compare solutions.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-colors"
        >
          Return to Laboratory
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-4 pb-12 bg-[#0B0F19] text-slate-100">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
            <Scale className="w-3.5 h-3.5" />
            <span>Side-by-Side Trade-off Matrix</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Compare Invention Concepts
          </h2>
        </div>
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded"
        >
          Back
        </button>
      </div>

      <p className="text-xs text-slate-400">
        Evaluate the 3 architectural approaches across cost, development velocity, and mechanical complexity.
      </p>

      {/* Comparison Columns / Cards */}
      <div className="space-y-4">
        {inventions.map((inv, idx) => {
          const hours = (inv.prototypeSteps || []).reduce((acc, s) => acc + (s.estimatedHours || 0), 0);

          return (
            <div
              key={inv.id || idx}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">
                    Option 0{idx + 1} · {idx === 0 ? 'Mechanical/Passive' : idx === 1 ? 'Smart/Edge Telemetry' : 'Circular/Salvage'}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                    {inv.name}
                  </h3>
                </div>

                <button
                  onClick={() => onSelectForPrototype(inv)}
                  className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                >
                  <Hammer className="w-3.5 h-3.5" />
                  <span>Build This</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {inv.shortDescription}
              </p>

              {/* Matrix Attributes */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                <div className="p-2 rounded-lg bg-slate-950">
                  <span className="text-[10px] text-slate-400 block">Indicative Cost</span>
                  <span className="text-xs font-bold font-mono text-cyan-300 tabular-nums">
                    ${inv.costRange?.min}-${inv.costRange?.max}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950">
                  <span className="text-[10px] text-slate-400 block">Difficulty</span>
                  <span className="text-xs font-bold text-violet-300">
                    {inv.estimatedDifficulty}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950">
                  <span className="text-[10px] text-slate-400 block">Lead Time</span>
                  <span className="text-xs font-bold font-mono text-emerald-300 tabular-nums">
                    ~{hours} hrs
                  </span>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="text-xs space-y-1.5 pt-1">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-emerald-400">
                    Primary Advantage:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {inv.whatMakesInteresting}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-amber-400">
                    Primary Limitation:
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {inv.limitations?.[0] || 'Requires initial calibration and user testing.'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
