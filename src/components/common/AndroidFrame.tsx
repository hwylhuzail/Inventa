import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Smartphone, Maximize2, Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isFramed: boolean;
  onToggleFrame: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenAndroidCode: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isFramed,
  onToggleFrame,
  isDark,
  onToggleDark,
  onOpenAndroidCode
}) => {
  const [time, setTime] = useState('09:41');
  const [deviceModel, setDeviceModel] = useState<'pixel' | 'galaxy' | 'compact'>('pixel');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 20000);
    return () => clearInterval(interval);
  }, []);

  const deviceWidths = {
    pixel: 'max-w-[430px]',
    galaxy: 'max-w-[412px]',
    compact: 'max-w-[385px]'
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col items-center justify-start p-0 sm:p-4 md:p-6 transition-colors selection:bg-violet-500/30 selection:text-violet-200 lab-grid-bg">
      {/* Top Professional Tech Studio Ribbon */}
      <header className="w-full max-w-5xl mb-3 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border border-white/[0.08] bg-[#0D1322]/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-xs font-semibold text-slate-200 tracking-tight">
              Android 14 Jetpack Compose
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Target SDK 34 · com.inventa.app
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Model Switcher (Visible when framed) */}
          {isFramed && (
            <div className="hidden md:flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
              <button
                onClick={() => setDeviceModel('pixel')}
                className={`px-2 py-1 rounded-md transition-colors ${
                  deviceModel === 'pixel' ? 'bg-violet-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Pixel 8
              </button>
              <button
                onClick={() => setDeviceModel('galaxy')}
                className={`px-2 py-1 rounded-md transition-colors ${
                  deviceModel === 'galaxy' ? 'bg-violet-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Galaxy S24
              </button>
              <button
                onClick={() => setDeviceModel('compact')}
                className={`px-2 py-1 rounded-md transition-colors ${
                  deviceModel === 'compact' ? 'bg-violet-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Compact
              </button>
            </div>
          )}

          {/* Kotlin Code Studio Button */}
          <button
            onClick={onOpenAndroidCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-200 text-xs font-medium transition-all"
            title="Inspect Android Studio Kotlin Project & Gradle Files"
          >
            <span className="font-mono text-cyan-300 font-bold">{'</>'}</span>
            <span>Kotlin Studio</span>
          </button>

          {/* Toggle Phone Frame vs Full Viewport */}
          <button
            onClick={onToggleFrame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700/60 text-xs font-medium transition-colors"
            title={isFramed ? 'Switch to Full Screen Layout' : 'Switch to Android Phone Frame'}
          >
            {isFramed ? <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> : <Smartphone className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="hidden sm:inline">{isFramed ? 'Full Viewport' : 'Phone Frame'}</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDark}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700/60 text-xs font-medium transition-colors"
            title="Toggle Dark / Light Theme"
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      {/* Frame Container with Simulated Hardware Bezel */}
      <div
        className={`w-full transition-all duration-300 ${
          isFramed
            ? `${deviceWidths[deviceModel]} rounded-[48px] ring-14 ring-slate-950 border-[5px] border-slate-800/90 shadow-[0_25px_60px_-15px_rgba(139,92,246,0.3)] overflow-hidden relative flex flex-col h-[900px] max-h-[92vh]`
            : 'max-w-4xl rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden min-h-[860px] flex flex-col'
        } bg-[#0B0F19] dark:bg-[#0B0F19]`}
      >
        {/* Android Native Status Bar */}
        <div className="shrink-0 h-11 px-7 flex items-center justify-between text-xs font-medium text-slate-300 select-none bg-inherit z-40 border-b border-white/[0.04]">
          {/* Time with standard Android weight */}
          <span className="font-mono text-[13px] font-semibold tracking-tight text-slate-200">
            {time}
          </span>

          {/* High-Fidelity Centered Camera Punch-Hole */}
          {isFramed && (
            <div className="w-4 h-4 rounded-full bg-black border border-slate-800 flex items-center justify-center shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900 ring-1 ring-cyan-500/30" />
            </div>
          )}

          {/* System Status Indicators */}
          <div className="flex items-center gap-2 text-slate-400">
            <Signal className="w-3.5 h-3.5 text-slate-200" />
            <span className="text-[10px] font-bold font-mono text-cyan-400">5G</span>
            <Wifi className="w-3.5 h-3.5 text-slate-200" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono text-slate-300 font-semibold tabular-nums">94%</span>
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Screen Content Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          {children}
        </div>

        {/* Android 14 Gesture Navigation Bar */}
        {isFramed && (
          <div className="shrink-0 h-7 flex items-center justify-center bg-inherit z-40 select-none">
            <div className="w-36 h-1 rounded-full bg-slate-400/30 hover:bg-slate-300/50 transition-colors" />
          </div>
        )}
      </div>
    </div>
  );
};
