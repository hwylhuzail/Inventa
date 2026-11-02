import React, { useState } from 'react';
import { Invention, AppScreen } from '../../types/invention';
import {
  Bookmark,
  Hammer,
  Share2,
  Download,
  ShieldAlert,
  Sparkles,
  Bot,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  FileText
} from 'lucide-react';

interface InventionDetailScreenProps {
  invention: Invention;
  onOpenPrototype: (inv: Invention) => void;
  onOpenAssistant: (inv: Invention) => void;
  onOpenRefine: (inv: Invention) => void;
  onToggleFavorite: (id: string) => void;
  onExportReport: (inv: Invention) => void;
  onBack: () => void;
}

export const InventionDetailScreen: React.FC<InventionDetailScreenProps> = ({
  invention,
  onOpenPrototype,
  onOpenAssistant,
  onOpenRefine,
  onToggleFavorite,
  onExportReport,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'steps' | 'safety' | 'patents'>('overview');

  const totalHours = (invention.prototypeSteps || []).reduce((acc, s) => acc + (s.estimatedHours || 0), 0);

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-4 pb-12 bg-[#0B0F19] text-slate-100">
      {/* Title & Badge Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-cyan-400">{invention.category}</span>
            <span aria-hidden="true">·</span>
            <span>{invention.inventionType}</span>
            <span aria-hidden="true">·</span>
            <span className="text-violet-300 font-medium">{invention.estimatedDifficulty}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleFavorite(invention.id)}
              className={`p-2 rounded-xl border transition-colors ${
                invention.isFavorite
                  ? 'bg-violet-600/30 border-violet-500 text-violet-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Bookmark Invention"
            >
              <Bookmark className={`w-4 h-4 ${invention.isFavorite ? 'fill-violet-400 text-violet-400' : ''}`} />
            </button>
            <button
              onClick={() => onExportReport(invention)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
              title="Download Engineering Report (Markdown)"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
          {invention.name}
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          {invention.shortDescription}
        </p>
      </div>

      {/* Quick Spec Metrics */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
        <div>
          <span className="text-[10px] text-slate-400 block">Est. Budget</span>
          <span className="text-xs font-bold font-mono text-cyan-400 tabular-nums">
            ${invention.costRange?.min}-${invention.costRange?.max}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">Prototyping Time</span>
          <span className="text-xs font-bold font-mono text-violet-400 tabular-nums">
            ~{totalHours} hrs
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">Roadmap Steps</span>
          <span className="text-xs font-bold font-mono text-emerald-400 tabular-nums">
            {invention.prototypeSteps?.length || 0} stages
          </span>
        </div>
      </div>

      {/* Action Shortcut Bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onOpenPrototype(invention)}
          className="flex-1 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <Hammer className="w-4 h-4" />
          <span>Open Prototype Studio</span>
        </button>

        <button
          onClick={() => onOpenAssistant(invention)}
          className="px-3 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-violet-300 border border-violet-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Bot className="w-4 h-4 text-cyan-400" />
          <span>Ask Copilot</span>
        </button>

        <button
          onClick={() => onOpenRefine(invention)}
          className="px-3 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Refine</span>
        </button>
      </div>

      {/* Detail Section Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'materials', label: 'Materials' },
          { id: 'steps', label: 'Roadmap' },
          { id: 'safety', label: 'Safety & Risks' },
          { id: 'patents', label: 'Prior Art' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-1">
                Problem Addressed
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {invention.problemSolved}
              </p>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-cyan-400 mb-1">
                How It Works (Technical Principles)
              </h4>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {invention.howItWorks}
              </p>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-violet-400 mb-1">
                Novelty & Creative Angle
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {invention.whatMakesInteresting}
              </p>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-2">
                Potential Beneficiaries & Users
              </h4>
              <div className="space-y-1">
                {invention.potentialUsers?.map((user, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{user}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-400 font-semibold mb-1">
              <span>Required Components & Hardware</span>
              <span className="font-mono text-cyan-400">${invention.costRange?.min}-${invention.costRange?.max}</span>
            </div>

            <div className="space-y-2">
              {invention.requiredMaterials?.map((mat, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400">0{i + 1}</span>
                    <span className="text-slate-200">{mat}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Hardware Spec</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-300">Budget Assumptions:</strong> {invention.costRange?.assumptions}
            </div>
          </div>
        )}

        {activeTab === 'steps' && (
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-1">
              Prototype Development Stages
            </h4>

            <div className="space-y-2.5">
              {invention.prototypeSteps?.map((step) => (
                <div key={step.stepNumber} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-violet-300">
                      Step {step.stepNumber}: {step.title}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400">
                      ~{step.estimatedHours} hrs
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/40 text-rose-200">
              <div className="flex items-center gap-2 font-semibold text-rose-300 mb-1">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Mandatory Safety Considerations</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-rose-200/90 list-disc list-inside">
                {invention.safetyConsiderations?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-2">
                Physical Limitations & Constraints
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside">
                {invention.limitations?.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'patents' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-cyan-300 mb-1">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Prior Art & Patent Verification Guide</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                {invention.patentResearchTips}
              </p>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1.5">
                  Search Query Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {invention.priorArtKeywords?.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-cyan-300"
                    >
                      "{kw}"
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">Free Patent Databases:</p>
              <p>• Google Patents (patents.google.com)</p>
              <p>• Espacenet Worldwide Patent Search (worldwide.espacenet.com)</p>
              <p>• USPTO Patent Public Search (ppubs.uspto.gov)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
