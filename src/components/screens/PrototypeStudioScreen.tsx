import React, { useState } from 'react';
import { Invention, PrototypeStep, MaterialItem } from '../../types/invention';
import {
  Hammer,
  CheckCircle2,
  Circle,
  Download,
  DollarSign,
  ShieldAlert,
  Bot,
  Sparkles,
  ClipboardList,
  Save,
  Plus,
  Trash2,
  AlertTriangle,
  FileCheck,
  Check
} from 'lucide-react';

interface PrototypeStudioScreenProps {
  invention: Invention;
  onUpdateInvention: (updated: Invention) => void;
  onOpenAssistant: (inv: Invention) => void;
  onExportMarkdown: (inv: Invention) => void;
  onBack: () => void;
}

interface TestItem {
  id: string;
  name: string;
  passed: boolean;
}

export const PrototypeStudioScreen: React.FC<PrototypeStudioScreenProps> = ({
  invention,
  onUpdateInvention,
  onOpenAssistant,
  onExportMarkdown,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'bom' | 'testing' | 'notes'>('roadmap');

  // Local state initialized from invention
  const [steps, setSteps] = useState<PrototypeStep[]>(
    invention.prototypeSteps || []
  );
  const [materials, setMaterials] = useState<MaterialItem[]>(
    invention.materialsDetailed ||
      (invention.requiredMaterials || []).map((m, idx) => ({
        name: m,
        estimatedCost: idx === 0 ? 15 : idx === 1 ? 12 : 8,
        acquired: false
      }))
  );
  const [newMaterialName, setNewMaterialName] = useState('');
  const [newMaterialCost, setNewMaterialCost] = useState('');

  // Testing checklist
  const [tests, setTests] = useState<TestItem[]>([
    { id: 't1', name: 'Dimensional tolerances & mechanical clearance check', passed: true },
    { id: 't2', name: 'Electrical boundary grounding & circuit insulation verify', passed: false },
    { id: 't3', name: 'Continuous operational stress benchmark (2 hours)', passed: false },
    { id: 't4', name: 'Environmental seal / moisture ingress inspection', passed: false }
  ]);

  const [labNotes, setLabNotes] = useState(invention.userNotes || '');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Calculations
  const completedStepsCount = steps.filter((s) => s.completed).length;
  const progressPercent = steps.length > 0 ? Math.round((completedStepsCount / steps.length) * 100) : 0;
  const totalBomBudget = materials.reduce((acc, m) => acc + (m.estimatedCost || 0), 0);
  const acquiredBomBudget = materials.filter(m => m.acquired).reduce((acc, m) => acc + (m.estimatedCost || 0), 0);

  const toggleStep = (stepNumber: number) => {
    const updated = steps.map((s) => (s.stepNumber === stepNumber ? { ...s, completed: !s.completed } : s));
    setSteps(updated);
    const newProgress = Math.round((updated.filter((s) => s.completed).length / updated.length) * 100);
    onUpdateInvention({
      ...invention,
      prototypeSteps: updated,
      progressPercent: newProgress
    });
  };

  const toggleMaterial = (index: number) => {
    const updated = [...materials];
    updated[index].acquired = !updated[index].acquired;
    setMaterials(updated);
    onUpdateInvention({
      ...invention,
      materialsDetailed: updated
    });
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialName.trim()) return;
    const cost = parseFloat(newMaterialCost) || 0;
    const updated = [...materials, { name: newMaterialName.trim(), estimatedCost: cost, acquired: false }];
    setMaterials(updated);
    setNewMaterialName('');
    setNewMaterialCost('');
    onUpdateInvention({
      ...invention,
      materialsDetailed: updated,
      requiredMaterials: updated.map((m) => m.name)
    });
  };

  const handleDeleteMaterial = (index: number) => {
    const updated = materials.filter((_, i) => i !== index);
    setMaterials(updated);
    onUpdateInvention({
      ...invention,
      materialsDetailed: updated,
      requiredMaterials: updated.map((m) => m.name)
    });
  };

  const toggleTest = (id: string) => {
    setTests(tests.map((t) => (t.id === id ? { ...t, passed: !t.passed } : t)));
  };

  const saveNotes = () => {
    onUpdateInvention({
      ...invention,
      userNotes: labNotes
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-4 pb-14 text-slate-100">
      {/* Studio Header & Quick Action Ribbon */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Hammer className="w-3.5 h-3.5" />
            <span>Dedicated Prototype Studio</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
            {invention.name}
          </h2>
          <div className="text-[11px] text-slate-400">
            {invention.category} · {invention.inventionType} · {invention.estimatedDifficulty}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onExportMarkdown(invention)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#131B2E] hover:bg-[#1A253E] text-slate-200 border border-white/[0.08] text-xs font-semibold transition-colors shadow-sm"
            title="Download Full Project Report (Markdown)"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Report (.md)</span>
          </button>

          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(invention, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${invention.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_spec.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="p-2 rounded-xl bg-[#131B2E] hover:bg-[#1A253E] text-slate-300 border border-white/[0.08] text-xs font-mono font-bold transition-colors"
            title="Download Machine-Readable JSON Specification"
          >
            {'{ }'}
          </button>

          <button
            onClick={() => onOpenAssistant(invention)}
            className="p-2 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30 transition-colors"
            title="Consult Copilot for Prototyping Advice"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Progress & Live Budget Ribbon */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0F172A] border border-white/[0.08] space-y-3 shadow-lg">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white">Fabrication Milestones</span>
          <span className="font-mono text-cyan-400 font-bold tabular-nums">
            {progressPercent}% Complete ({completedStepsCount}/{steps.length})
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/[0.04]">
          <div
            className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>
            BOM Procured: <strong className="text-white font-mono">${acquiredBomBudget}</strong> / <span className="font-mono">${totalBomBudget} USD</span>
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            Target: ${invention.costRange?.min}-${invention.costRange?.max}
          </span>
        </div>
      </div>

      {/* Workspace Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-[#0F172A] border border-white/[0.08] rounded-2xl">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'roadmap'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Milestones
        </button>
        <button
          onClick={() => setActiveTab('bom')}
          className={`py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'bom'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          BOM List
        </button>
        <button
          onClick={() => setActiveTab('testing')}
          className={`py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'testing'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Testing
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'notes'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Lab Log
        </button>
      </div>

      {/* TAB 1: Milestones Checklist */}
      {activeTab === 'roadmap' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Check off building instructions as you fabricate</span>
            <span className="font-mono text-cyan-400 text-[11px] font-bold">Step-by-Step</span>
          </div>

          <div className="space-y-2.5">
            {steps.map((s) => (
              <div
                key={s.stepNumber}
                onClick={() => toggleStep(s.stepNumber)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 shadow-sm ${
                  s.completed
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300'
                    : 'bg-[#0F172A] border-white/[0.06] hover:border-violet-500/40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {s.completed ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-600 hover:border-violet-400 transition-colors" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-bold ${
                        s.completed ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      Stage 0{s.stepNumber}: {s.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold shrink-0">
                      ~{s.estimatedHours} hrs
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Bill of Materials (BOM) */}
      {activeTab === 'bom' && (
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[11px]">
            <span>Procurement Checklist</span>
            <span>Est. Cost</span>
          </div>

          <div className="space-y-2">
            {materials.map((m, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#0F172A] border border-white/[0.06] flex items-center justify-between gap-3 shadow-sm"
              >
                <div
                  onClick={() => toggleMaterial(idx)}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <div className="shrink-0">
                    {m.acquired ? (
                      <div className="w-4 h-4 rounded-md bg-cyan-500 flex items-center justify-center text-slate-950">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-md border border-slate-600" />
                    )}
                  </div>
                  <span className={`text-xs truncate font-medium ${m.acquired ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                    {m.name}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="font-mono text-cyan-300 font-bold tabular-nums">
                    ${m.estimatedCost || 0}
                  </span>
                  <button
                    onClick={() => handleDeleteMaterial(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add custom component form */}
          <form onSubmit={handleAddMaterial} className="p-3 rounded-2xl bg-black/40 border border-white/[0.08] flex items-center gap-2">
            <input
              type="text"
              value={newMaterialName}
              onChange={(e) => setNewMaterialName(e.target.value)}
              placeholder="Add component / hardware..."
              className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <input
              type="number"
              value={newMaterialCost}
              onChange={(e) => setNewMaterialCost(e.target.value)}
              placeholder="$ cost"
              className="w-18 bg-[#0F172A] px-2.5 py-1.5 rounded-xl text-xs text-white font-mono focus:outline-none border border-white/[0.06]"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Testing Protocol */}
      {activeTab === 'testing' && (
        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              Never present untested prototypes as proven working products. Verify mechanical stresses, thermodynamic limits, and electrical insulation thoroughly.
            </p>
          </div>

          <h4 className="font-bold uppercase tracking-wider text-slate-400 mt-3 mb-1 text-[11px]">
            Verification Protocol Checklist
          </h4>

          <div className="space-y-2">
            {tests.map((test) => (
              <div
                key={test.id}
                onClick={() => toggleTest(test.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm ${
                  test.passed
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                    : 'bg-[#0F172A] border-white/[0.06] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    {test.passed ? (
                      <div className="w-4 h-4 rounded-md bg-emerald-500 flex items-center justify-center text-slate-950">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-md border border-slate-600" />
                    )}
                  </div>
                  <span className="text-xs font-medium">{test.name}</span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                  {test.passed ? 'PASSED' : 'PENDING'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Laboratory Logbook */}
      {activeTab === 'notes' && (
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between text-slate-400 font-bold">
            <span>Inventor Logbook & Physical Observations</span>
            {isSavedNotice && <span className="text-emerald-400 text-xs">✓ Saved to vault</span>}
          </div>

          <textarea
            value={labNotes}
            onChange={(e) => setLabNotes(e.target.value)}
            placeholder="Record prototype test measurements, material batch numbers, dimensional adjustments, or observations..."
            rows={8}
            className="w-full p-4 bg-[#0F172A] border border-white/[0.08] focus:border-cyan-400 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none font-mono leading-relaxed"
          />

          <button
            onClick={saveNotes}
            className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40 transition-all active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>Save Log Entries</span>
          </button>
        </div>
      )}
    </div>
  );
};
