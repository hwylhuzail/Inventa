import React, { useState, useRef } from 'react';
import {
  InventionCategory,
  InventionType,
  ComplexityLevel
} from '../../types/invention';
import {
  Mic,
  MicOff,
  Camera,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Sprout,
  HeartPulse,
  GraduationCap,
  Truck,
  Leaf,
  HardHat,
  Cpu,
  Zap,
  Home,
  Radio,
  Factory,
  Boxes,
  Layers,
  Wrench,
  Smartphone,
  Briefcase,
  FlaskConical,
  HelpCircle
} from 'lucide-react';

interface CreateInventionScreenProps {
  initialProblem?: string;
  onSubmit: (params: {
    problem: string;
    category: InventionCategory;
    inventionType: InventionType;
    complexity: ComplexityLevel;
    imageDataUrl?: string;
  }) => void;
  onCancel: () => void;
}

const CATEGORY_ITEMS: { name: InventionCategory; icon: any; color: string }[] = [
  { name: 'Agriculture', icon: Sprout, color: 'text-emerald-400' },
  { name: 'Healthcare', icon: HeartPulse, color: 'text-rose-400' },
  { name: 'Education', icon: GraduationCap, color: 'text-indigo-400' },
  { name: 'Transportation', icon: Truck, color: 'text-blue-400' },
  { name: 'Environment', icon: Leaf, color: 'text-teal-400' },
  { name: 'Construction', icon: HardHat, color: 'text-amber-400' },
  { name: 'Technology', icon: Cpu, color: 'text-cyan-400' },
  { name: 'Energy', icon: Zap, color: 'text-yellow-400' },
  { name: 'Household', icon: Home, color: 'text-purple-400' },
  { name: 'Communication', icon: Radio, color: 'text-sky-400' },
  { name: 'Manufacturing', icon: Factory, color: 'text-orange-400' },
  { name: 'Other', icon: Boxes, color: 'text-slate-400' }
];

const INVENTION_TYPE_ITEMS: { type: InventionType; icon: any; summary: string }[] = [
  { type: 'Physical product', icon: Boxes, summary: 'Tangible hardware, consumer product, casing, or tool' },
  { type: 'Machine or device', icon: Wrench, summary: 'Mechanical apparatus with moving parts or motors' },
  { type: 'Software technology', icon: Cpu, summary: 'Algorithm, embedded firmware, web platform, or API' },
  { type: 'Mobile application', icon: Smartphone, summary: 'Mobile touch interface, edge ML, or utility tool' },
  { type: 'Business solution', icon: Briefcase, summary: 'Circular workflow, supply-chain hack, or franchise kit' },
  { type: 'Scientific concept', icon: FlaskConical, summary: 'Thermodynamic cycle, chemical process, or biotechnology' },
  { type: 'Other', icon: HelpCircle, summary: 'Hybrid cross-disciplinary synthesis' }
];

const COMPLEXITIES: { level: ComplexityLevel; label: string; desc: string; budget: string }[] = [
  {
    level: 'Beginner',
    label: 'Beginner / DIY Maker',
    desc: 'Off-the-shelf hardware, simple hand tools, 3D printing, low capital outlay.',
    budget: '< $50 USD'
  },
  {
    level: 'Intermediate',
    label: 'Intermediate / Applied Tech',
    desc: 'Microcontrollers, sensors, custom enclosures, light machining, and standard soldering.',
    budget: '$50 - $250 USD'
  },
  {
    level: 'Advanced',
    label: 'Advanced / Industrial Rigor',
    desc: 'Precision manufacturing, custom multi-layer PCBs, specialized thermodynamics or chemistry.',
    budget: '$250+ USD'
  }
];

const EXAMPLE_PROBLEMS = [
  'Smallholder fruit farmers lose 40% of their harvest to spoilage during humid seasons without electrical grid access.',
  'Municipal clean drinking water lost through underground pipe fractures before detection.',
  'Apartment dwellers cannot compost organic food waste indoors due to odors and fruit flies.',
  'Rural classrooms lack low-cost spectrophotometers to test local water sources for chemical pollutants.'
];

export const CreateInventionScreen: React.FC<CreateInventionScreenProps> = ({
  initialProblem = '',
  onSubmit,
  onCancel
}) => {
  const [step, setStep] = useState<number>(1);
  const [problem, setProblem] = useState<string>(initialProblem);
  const [category, setCategory] = useState<InventionCategory>('Technology');
  const [inventionType, setInventionType] = useState<InventionType>('Physical product');
  const [complexity, setComplexity] = useState<ComplexityLevel>('Intermediate');
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(undefined);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // File input refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Voice input
  const handleToggleVoice = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setVoiceNotice(null);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('Speech recognition not available on this browser. Please type.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setVoiceNotice('Listening to your observation... Speak clearly.');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setProblem((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech error:', e);
        setIsRecording(false);
        setVoiceNotice('Microphone permission required or input timed out.');
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsRecording(false);
      setVoiceNotice('Microphone initialization failed.');
    }
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Please upload an image smaller than 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setImageDataUrl(uploadEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleNextStep = () => {
    if (step === 1 && (!problem || problem.trim().length < 5)) {
      alert('Please describe the problem in at least 5 characters.');
      return;
    }
    if (step < 5) {
      setStep(step + 1);
    } else {
      onSubmit({
        problem: problem.trim(),
        category,
        inventionType,
        complexity,
        imageDataUrl
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-[#0B0F19] text-slate-100">
      {/* Top Stepper Indicator */}
      <div className="space-y-3 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400">
              STAGE 0{step} / 05
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-bold text-white tracking-tight">
              {step === 1 && 'Observe & Describe Problem'}
              {step === 2 && 'Select Domain Category'}
              {step === 3 && 'Invention Form Factor'}
              {step === 4 && 'Prototyping Complexity'}
              {step === 5 && 'Review Synthesis Blueprint'}
            </span>
          </div>

          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Precision Progress Track */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Wizard Form Body */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* STAGE 1: Problem Description */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                What real-world problem are you solving?
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Describe the specific bottleneck, waste, inefficiency, or friction. The more concrete details you provide, the higher the fidelity of the solutions.
              </p>
            </div>

            <div className="space-y-1.5">
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="e.g. Smallholder farmers in off-grid villages lose 40% of their harvested mangoes and tomatoes because high ambient humidity prevents open-air drying, and electricity is unavailable for dehydration..."
                rows={5}
                className="w-full p-4 bg-[#0F172A] border border-white/[0.08] focus:border-cyan-400 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors leading-relaxed"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="font-mono">{problem.length} chars</span>
                {problem.length < 5 ? (
                  <span className="text-amber-400 font-medium">At least 5 characters required</span>
                ) : (
                  <span className="text-emerald-400 font-medium">Valid observation input</span>
                )}
              </div>
            </div>

            {/* Multi-Modal Capture Bar (Voice, Camera, Gallery) */}
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-white/[0.08] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Multi-Modal Problem Input
              </span>

              <div className="flex items-center gap-2">
                {/* Voice Dictation */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isRecording
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-lg'
                      : 'bg-[#131B2E] text-slate-200 hover:text-white border border-white/[0.06] hover:border-violet-500/40'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <div className="flex items-end gap-1 h-4">
                        <span className="w-1 bg-rose-400 rounded-full animate-soundwave-1" />
                        <span className="w-1 bg-rose-400 rounded-full animate-soundwave-2" />
                        <span className="w-1 bg-rose-400 rounded-full animate-soundwave-3" />
                        <span className="w-1 bg-rose-400 rounded-full animate-soundwave-4" />
                        <span className="w-1 bg-rose-400 rounded-full animate-soundwave-5" />
                      </div>
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-cyan-400" />
                      <span>Voice Dictate</span>
                    </>
                  )}
                </button>

                {/* Camera Capture */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#131B2E] text-slate-200 hover:text-white border border-white/[0.06] hover:border-violet-500/40 flex items-center justify-center gap-2 transition-colors"
                >
                  <Camera className="w-4 h-4 text-violet-400" />
                  <span>Take Photo</span>
                </button>

                {/* Gallery Picker */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#131B2E] text-slate-200 hover:text-white border border-white/[0.06] hover:border-violet-500/40 flex items-center justify-center gap-2 transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  <span>Gallery</span>
                </button>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFile}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageFile}
                className="hidden"
              />

              {voiceNotice && (
                <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-300">
                  {voiceNotice}
                </div>
              )}

              {/* Uploaded Image Preview */}
              {imageDataUrl && (
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={imageDataUrl}
                      alt="Uploaded observation"
                      className="w-12 h-12 object-cover rounded-xl border border-white/[0.1]"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Visual Context Attached</span>
                      <span className="text-[11px] text-slate-400">Will be analyzed alongside problem prompt</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setImageDataUrl(undefined)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/[0.04]"
                    title="Remove attachment"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Quick Inspiration Observations */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Or Select an Observation Prompt:
              </span>
              <div className="space-y-1.5">
                {EXAMPLE_PROBLEMS.map((eg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setProblem(eg)}
                    className="w-full text-left p-3 rounded-xl bg-[#0F172A] hover:bg-[#131B2E] border border-white/[0.06] hover:border-violet-500/40 text-xs text-slate-300 hover:text-white transition-all leading-relaxed"
                  >
                    "{eg}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: Category Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Select problem domain
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Classifies physical properties, regulatory standards, and typical supply chains.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {CATEGORY_ITEMS.map((item) => {
                const Icon = item.icon;
                const isSelected = category === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setCategory(item.name)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-violet-950/60 border-violet-500 text-white ring-2 ring-violet-500/40 shadow-lg'
                        : 'bg-[#0F172A] border-white/[0.06] text-slate-300 hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0`}>
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <span className="text-xs font-bold truncate">{item.name}</span>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STAGE 3: Form Factor */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Target invention form factor
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Determines engineering discipline: mechanical, software, embedded sensing, or process.
              </p>
            </div>

            <div className="space-y-2.5">
              {INVENTION_TYPE_ITEMS.map((item) => {
                const Icon = item.icon;
                const isSelected = inventionType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setInventionType(item.type)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-violet-950/60 border-violet-500 text-white ring-2 ring-violet-500/40 shadow-lg'
                        : 'bg-[#0F172A] border-white/[0.06] text-slate-300 hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-cyan-300" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {item.type}
                        </span>
                        <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                          {item.summary}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STAGE 4: Complexity Tier */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Prototyping complexity tier
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Aligns components, tooling assumptions, and budget thresholds.
              </p>
            </div>

            <div className="space-y-3">
              {COMPLEXITIES.map((c) => {
                const isSelected = complexity === c.level;
                return (
                  <button
                    key={c.level}
                    type="button"
                    onClick={() => setComplexity(c.level)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-violet-950/60 border-violet-500 text-white ring-2 ring-violet-500/40 shadow-lg'
                        : 'bg-[#0F172A] border-white/[0.06] text-slate-300 hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-300">
                          {c.label}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 font-semibold">
                          {c.budget}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {c.desc}
                      </p>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STAGE 5: Synthesis Blueprint Review */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Laboratory Synthesis Blueprint
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Confirm problem parameters before executing the Gemini 3.8 Flash synthesis engine.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/[0.08] space-y-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-cyan-400 block mb-1">
                  Observed Problem Brief
                </span>
                <p className="text-xs text-slate-100 font-medium leading-relaxed italic bg-black/30 p-3 rounded-xl border border-white/[0.04]">
                  "{problem}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
                <div>
                  <span className="text-[10px] text-slate-400 block">Domain Category</span>
                  <span className="text-xs font-bold text-white">{category}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Form Factor</span>
                  <span className="text-xs font-bold text-white">{inventionType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Complexity Tier</span>
                  <span className="text-xs font-bold text-violet-300">{complexity}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Visual Context</span>
                  <span className="text-xs font-bold text-slate-300">
                    {imageDataUrl ? '1 Photo Attached' : 'None'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 to-[#0F172A] border border-violet-800/40 text-xs text-slate-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                INVENTA will engineer <strong>three distinct technological archetypes</strong> (mechanical/passive, smart edge sensing, and circular/salvage) with complete bills of materials, safety audits, and prior art vectors.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/[0.08] mt-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/[0.06] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={handleNextStep}
          className="flex-1 max-w-[220px] h-12 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40 hover:brightness-110 active:scale-[0.98] transition-all"
        >
          {step === 5 ? (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Synthesize Solutions</span>
            </>
          ) : (
            <>
              <span>Next Stage</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
