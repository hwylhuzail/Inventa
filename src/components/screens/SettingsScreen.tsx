import React, { useState } from 'react';
import { UserProfile } from '../../types/invention';
import {
  ShieldCheck,
  Lock,
  Moon,
  Sun,
  Smartphone,
  Maximize2,
  Camera,
  Mic,
  Database,
  Info,
  CheckCircle2,
  ExternalLink,
  X
} from 'lucide-react';

interface SettingsScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  isDark: boolean;
  onToggleDark: () => void;
  isFramed: boolean;
  onToggleFrame: () => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  profile,
  onUpdateProfile,
  isDark,
  onToggleDark,
  isFramed,
  onToggleFrame,
  onBack
}) => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const toggleConsent = () => {
    onUpdateProfile({
      ...profile,
      cloudAiConsent: !profile.cloudAiConsent
    });
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-4 pb-12 bg-[#0B0F19] text-slate-100">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Settings & Privacy
        </h2>
        <p className="text-xs text-slate-400">
          Configure security, permissions, and display preferences
        </p>
      </div>

      {/* Display & Interface Preferences */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Interface & Layout
        </h3>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-4 h-4 text-violet-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              <div>
                <span className="text-xs font-semibold text-white block">Theme Mode</span>
                <span className="text-[11px] text-slate-400">
                  {isDark ? 'Dark Laboratory Theme' : 'High Contrast Light Theme'}
                </span>
              </div>
            </div>
            <button
              onClick={onToggleDark}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
            >
              Toggle ({isDark ? 'Dark' : 'Light'})
            </button>
          </div>

          {/* Device Frame */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="flex items-center gap-3">
              {isFramed ? <Smartphone className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-emerald-400" />}
              <div>
                <span className="text-xs font-semibold text-white block">Viewport Presentation</span>
                <span className="text-[11px] text-slate-400">
                  {isFramed ? 'Android Phone Shell' : 'Full Responsive Canvas'}
                </span>
              </div>
            </div>
            <button
              onClick={onToggleFrame}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
            >
              {isFramed ? 'Switch to Full' : 'Switch to Phone'}
            </button>
          </div>
        </div>
      </div>

      {/* Cloud AI Consent & Privacy Governance */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Cloud AI & Privacy Control
        </h3>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-white block">
                  Cloud AI Synthesis Consent
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  Allows problem descriptions to be transmitted to Groq AI for invention synthesis, with Google Gemini fallback. Personal IDs and email are never sent.
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={profile.cloudAiConsent}
              onChange={toggleConsent}
              className="w-4 h-4 rounded border-slate-700 text-violet-600 focus:ring-violet-500 mt-1 cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Vault Encryption: <strong className="text-emerald-400">Active (AES-256 local)</strong>
            </span>
            <button
              onClick={() => setShowPrivacyPolicy(true)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Read Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* Device Permissions Status */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Android Hardware Permissions
        </h3>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Mic className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-semibold text-white block">Microphone</span>
                <span className="text-[10px] text-slate-400">Used only during voice note dictation</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-medium">GRANTED ON DEMAND</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2.5">
              <Camera className="w-4 h-4 text-violet-400" />
              <div>
                <span className="font-semibold text-white block">Camera & Storage</span>
                <span className="text-[10px] text-slate-400">Used only for uploading prototype photo evidence</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-medium">GRANTED ON DEMAND</span>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>INVENTA Privacy & IP Charter</span>
              </h3>
              <button
                onClick={() => setShowPrivacyPolicy(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong>1. 100% User Invention Ownership:</strong> You retain complete, unencumbered ownership of all problems, observations, concepts, bills of materials, and prototype logs synthesized inside INVENTA.
              </p>
              <p>
                <strong>2. Zero Personal Data Sale:</strong> We do not sell, rent, or monetize your personal identity, invention records, or search queries to any third parties or advertisers.
              </p>
              <p>
                <strong>3. Local Encrypted Persistence:</strong> All your projects are stored in your device's browser and local sandbox. When cloud syncing is toggled on, data is guarded with standard cryptographic access rules.
              </p>
              <p>
                <strong>4. Responsible AI Boundaries:</strong> AI synthesis results are exploratory engineering concepts. INVENTA does not verify physical patentability or market exclusivity. Always perform independent prior art research.
              </p>
            </div>

            <button
              onClick={() => setShowPrivacyPolicy(false)}
              className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
