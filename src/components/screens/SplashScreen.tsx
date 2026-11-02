import React, { useEffect } from 'react';
import { InventaLogo } from '../common/InventaLogo';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface SplashScreenProps {
  onStart: () => void;
  onExploreDirectly: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onStart,
  onExploreDirectly
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between items-center p-6 text-center relative overflow-hidden bg-gradient-to-b from-[#0B0F19] via-[#0F172A] to-[#0B0F19]">
      {/* Background ambient quantum glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-violet-600/15 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />

      {/* Top Tag */}
      <div className="pt-6 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
        <Zap className="w-3.5 h-3.5 text-cyan-400" />
        <span>INVENTA CORE 1.0 · ANDROID RELEASE</span>
      </div>

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center max-w-sm my-auto">
        <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
          <InventaLogo size="xl" />
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight leading-tight mb-2">
          Imagine. Invent. Create.
        </h1>

        <p className="text-sm text-slate-400 font-normal leading-relaxed mb-6">
          The worldwide AI laboratory transforming real-world problems and observations into practical inventions, prototypes, and technologies.
        </p>

        <div className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 mb-2">
          <span>Worldwide Access</span>
          <span aria-hidden="true">·</span>
          <span>Open Prototyping</span>
          <span aria-hidden="true">·</span>
          <span>Responsible AI</span>
        </div>
      </div>

      {/* Action CTA Zone */}
      <div className="w-full max-w-sm pb-6 flex flex-col gap-3 z-10">
        <button
          onClick={onStart}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40 hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <span>Begin Invention Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onExploreDirectly}
          className="w-full h-11 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors"
        >
          Enter Laboratory Directly
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local encrypted vault · Private by default</span>
        </div>
      </div>
    </div>
  );
};
