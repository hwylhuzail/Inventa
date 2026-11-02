import React, { useState } from 'react';
import { InventaLogo } from '../common/InventaLogo';
import { UserProfile } from '../../types/invention';
import { ShieldCheck, Lock, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: (profile: UserProfile) => void;
  onContinueGuest: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSuccess,
  onContinueGuest
}) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);
  const [activeTab, setActiveTab] = useState<'signin' | 'guest'>('guest');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: UserProfile = {
      id: 'usr-' + Date.now(),
      displayName: displayName.trim() || 'Laboratory Inventor',
      email: email.trim() || 'inventor@inventa.lab',
      bio: 'Independent maker focusing on practical global solutions.',
      tier: 'Free',
      creationsCount: 1,
      activePrototypesCount: 0,
      completedTasksCount: 0,
      cloudAiConsent: consentGiven,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
    onSuccess(profile);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#0B0F19] text-slate-100">
      <div className="flex flex-col items-center text-center pt-2">
        <InventaLogo size="md" className="mb-4" />
        <h2 className="text-xl font-bold text-white tracking-tight">
          Invention Laboratory Access
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Privacy-first architecture. Your invention ideas are stored in your device's private encrypted vault.
        </p>

        {/* Auth mode selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl mt-6 w-full max-w-xs">
          <button
            type="button"
            onClick={() => setActiveTab('guest')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'guest' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Local Guest Vault
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'signin' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Profile
          </button>
        </div>
      </div>

      <div className="max-w-xs w-full mx-auto my-auto">
        {activeTab === 'guest' ? (
          <div className="flex flex-col gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Account Required</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Work completely anonymously. Inventions, custom modifications, prototype checklists, and notes will remain securely stored on your local device.
              </p>
            </div>

            {/* Cloud AI Consent Toggle */}
            <label className="flex items-start gap-2.5 text-left text-xs text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-900/50">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-[11px] text-slate-400 leading-tight">
                I consent to sending problem descriptions to cloud AI (Gemini 3.8 Flash) for synthesis. No personal identity data is attached.
              </span>
            </label>

            <button
              onClick={onContinueGuest}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-violet-950/40 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>Enter as Guest Maker</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Inventor Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Maria Chen, P.E."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="inventor@example.com"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <label className="flex items-start gap-2 text-left text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-[11px] text-slate-400 leading-tight">
                Enable secure AI cloud synthesis for problem briefs.
              </span>
            </label>

            <button
              type="submit"
              className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-violet-950/40 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <span>Save Profile & Start</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      <div className="text-center pt-4 border-t border-slate-800/80">
        <p className="text-[11px] text-slate-400">
          Strict Zero-Sale Policy · 100% User Owned IP
        </p>
      </div>
    </div>
  );
};
