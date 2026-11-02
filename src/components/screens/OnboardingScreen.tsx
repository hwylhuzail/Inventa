import React, { useState } from 'react';
import { Lightbulb, Cpu, Hammer, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  onSkip
}) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: Lightbulb,
      title: 'Observe & Describe the Problem',
      subtitle: 'Real Inventions Start from Genuine Friction',
      description: 'Capture real-world frustrations, community bottlenecks, or observations using text, microphone voice notes, or camera photos. INVENTA categorizes your challenge across 12 practical domains.',
      accent: 'from-cyan-500 to-blue-600',
      tag: 'Step 01 · Input Modalities'
    },
    {
      icon: Cpu,
      title: 'AI Laboratory Synthesizer',
      subtitle: 'Three Distinct Solution Archetypes',
      description: 'Our grounded AI engine synthesizes three distinct technological concepts for your problem: mechanical/passive, smart edge/sensor, and low-cost/circular designs with realistic cost estimates.',
      accent: 'from-violet-600 to-indigo-600',
      tag: 'Step 02 · Engineering Synthesis'
    },
    {
      icon: Hammer,
      title: 'Prototype & Build Studio',
      subtitle: 'From Idea to Physical Reality',
      description: 'Access a dedicated workspace for each invention with a live bill of materials, safety audits, milestone tracking, prior art patent guides, and downloadable engineering reports.',
      accent: 'from-emerald-500 to-cyan-600',
      tag: 'Step 03 · Prototyping Roadmap'
    }
  ];

  const current = steps[step];
  const Icon = current.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#0B0F19] text-slate-100">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-cyan-400 font-medium">
          {current.tag}
        </span>
        <button
          onClick={onSkip}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          Skip Intro
        </button>
      </div>

      {/* Main Illustration & Copy */}
      <div className="my-auto flex flex-col items-center text-center max-w-sm mx-auto">
        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${current.accent} p-0.5 shadow-xl shadow-violet-950/40 mb-8 flex items-center justify-center`}>
          <div className="w-full h-full bg-slate-950/70 rounded-[22px] flex items-center justify-center">
            <Icon className="w-10 h-10 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
          {current.title}
        </h2>
        <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-4">
          {current.subtitle}
        </p>
        <p className="text-sm text-slate-400 leading-relaxed">
          {current.description}
        </p>

        {/* Step dots */}
        <div className="flex items-center gap-2 mt-8">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
        <button
          onClick={handlePrev}
          disabled={step === 0}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors ${
            step === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleNext}
          className="flex-1 max-w-[180px] h-11 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <span>{step === steps.length - 1 ? 'Get Started' : 'Next'}</span>
          {step === steps.length - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
