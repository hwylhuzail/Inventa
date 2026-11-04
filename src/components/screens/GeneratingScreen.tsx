import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

interface GeneratingScreenProps {
  problem: string;
}

const PHASES = [
  'Deconstructing mechanical constraints & boundary limits...',
  'Cross-referencing thermodynamic & materials prior art...',
  'Synthesizing 3 distinct technological archetypes...',
  'Auditing bill of materials, safety risks & prototype roadmap...'
];

export const GeneratingScreen: React.FC<GeneratingScreenProps> = ({ problem }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(18);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => {
        const next = prev < PHASES.length - 1 ? prev + 1 : prev;
        setProgressPercent(Math.min(96, Math.round(((next + 1) / PHASES.length) * 100)));
        return next;
      });
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 text-center bg-[#0B0F19] text-slate-100">
      {/* Precision Orbital Synthesizer Reactor Core */}
      <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
        {/* Outer Orbital Rings */}
        <div
          className="absolute inset-0 rounded-full border border-violet-500/30 animate-spin"
          style={{ animationDuration: '8s' }}
        />
        <div
          className="absolute inset-2 rounded-full border border-cyan-400/50 border-dashed animate-spin"
          style={{ animationDuration: '5s', animationDirection: 'reverse' }}
        />
        <div className="absolute inset-0 rounded-full bg-radial from-violet-600/30 via-cyan-500/10 to-transparent blur-xl" />

        {/* Center Geometric Prism Core */}
        <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 shadow-2xl shadow-cyan-500/30 flex items-center justify-center">
          <div className="w-full h-full bg-[#0B0F19] rounded-[22px] flex items-center justify-center">
            <Cpu className="w-8 h-8 text-cyan-300 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-xs mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-[11px] font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>GEMINI 3.8 FLASH SYNTHESIZER</span>
        </div>

        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Synthesizing 3 Concepts
        </h2>

        <p className="text-xs text-slate-400 line-clamp-2 italic px-2 bg-black/30 p-2.5 rounded-xl border border-white/[0.04]">
          "{problem}"
        </p>

        {/* Progress Percent Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Synthesis Progress</span>
            <span className="text-cyan-400 font-bold tabular-nums">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Sequential Telemetry Checklist */}
        <div className="pt-4 space-y-2 text-left">
          {PHASES.map((phase, idx) => {
            const isDone = idx < phaseIndex;
            const isCurrent = idx === phaseIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-xl text-xs transition-all ${
                  isCurrent
                    ? 'bg-[#131B2E] border border-cyan-400/40 text-white shadow-md'
                    : isDone
                    ? 'text-slate-400'
                    : 'text-slate-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span className="text-[11px] font-medium leading-tight">{phase}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
