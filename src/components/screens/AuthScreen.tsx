import React, { useState } from 'react';
import { InventaLogo } from '../common/InventaLogo';
import { StorageService } from '../../services/storage';
import { UserProfile } from '../../types/invention';
import { ArrowRight, Lock, ShieldCheck, UserCheck } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: (profile: UserProfile) => void;
  onContinueGuest: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, onContinueGuest }) => {
  const [activeTab, setActiveTab] = useState<'signup' | 'signin' | 'guest'>('signup');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [error, setError] = useState('');

  const acceptAndContinue = (profile?: UserProfile) => {
    if (!consentGiven) {
      setError('Please agree to the Terms of Use and Privacy Policy to continue.');
      return;
    }
    StorageService.acceptTerms();
    if (profile) onSuccess(profile);
    else onContinueGuest();
  };

  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || password.length < 6) {
      setError('Enter an email and a password with at least 6 characters.');
      return;
    }
    const profile: UserProfile = {
      id: 'usr-' + Date.now(),
      displayName: displayName.trim() || 'Laboratory Inventor',
      email: email.trim(),
      bio: 'Independent inventor focused on practical solutions.',
      tier: 'Free',
      creationsCount: 0,
      activePrototypesCount: 0,
      completedTasksCount: 0,
      cloudAiConsent: consentGiven,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
    StorageService.saveAccountSession({ email: email.trim(), displayName: profile.displayName });
    acceptAndContinue(profile);
  };

  const handleSignin = (event: React.FormEvent) => {
    event.preventDefault();
    const session = StorageService.getAccountSession();
    if (!session || session.email.toLowerCase() !== email.trim().toLowerCase()) {
      setError('No local account matches this email. Create a Sign Up profile first.');
      return;
    }
    const profile = StorageService.getProfile();
    acceptAndContinue({ ...profile, displayName: session.displayName, email: session.email });
  };

  const policyLinks = (
    <p className="text-[11px] text-slate-400 leading-relaxed text-center">
      I agree to the{' '}
      <a href="/terms-of-use.html" className="text-cyan-400 underline" target="_blank" rel="noreferrer">Terms of Use</a>
      {' '}and{' '}
      <a href="/privacy-policy.html" className="text-cyan-400 underline" target="_blank" rel="noreferrer">Privacy Policy</a>
      .
    </p>
  );

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 bg-[#0B0F19] text-slate-100 overflow-y-auto">
      <div className="flex flex-col items-center text-center">
        <InventaLogo size="md" className="mb-4" />
        <h1 className="text-2xl font-black text-white">Welcome to INVENTA</h1>
        <p className="text-xs text-slate-400 mt-2 max-w-md">Transform real problems into practical inventions with Gemini engineering intelligence, prototype roadmaps, and a private project vault.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto w-full mt-5">
        {(['signup', 'signin', 'guest'] as const).map((tab) => (
          <button key={tab} type="button" onClick={() => { setActiveTab(tab); setError(''); }} className={`py-2 rounded-lg text-xs font-semibold ${activeTab === tab ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
            {tab === 'signup' ? 'Sign Up' : tab === 'signin' ? 'Sign In' : 'Guest'}
          </button>
        ))}
      </div>

      <div className="max-w-md w-full mx-auto my-auto py-5">
        {activeTab === 'guest' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-2"><UserCheck className="w-4 h-4" />Private guest laboratory</div>
              <p className="text-xs text-slate-400">No account is required. Inventions and Copilot conversations remain stored on this device.</p>
            </div>
          </div>
        )}

        {(activeTab === 'signup' || activeTab === 'signin') && (
          <form onSubmit={activeTab === 'signup' ? handleSignup : handleSignin} className="space-y-3">
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs text-slate-300 mb-1">Display name</label>
                <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="w-full px-3 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white" placeholder="Your name" />
              </div>
            )}
            <div>
              <label className="block text-xs text-slate-300 mb-1">Email</label>
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full px-3 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white" placeholder="inventor@example.com" />
            </div>
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs text-slate-300 mb-1">Password</label>
                <div className="relative"><Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" /><input required type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full pl-9 pr-3 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white" placeholder="At least 6 characters" /></div>
              </div>
            )}
            <button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-bold flex items-center justify-center gap-2">{activeTab === 'signup' ? 'Create Account' : 'Sign In'}<ArrowRight className="w-4 h-4" /></button>
          </form>
        )}

        <label className="flex items-start gap-2.5 mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
          <input type="checkbox" checked={consentGiven} onChange={(event) => { setConsentGiven(event.target.checked); setError(''); }} className="mt-1" />
          {policyLinks}
        </label>
        {error && <p className="text-xs text-rose-400 text-center mt-3">{error}</p>}
        {activeTab === 'guest' && <button onClick={() => acceptAndContinue()} className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-bold">Enter Laboratory</button>}
      </div>

      <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />Your invention data remains under your control.</div>
    </div>
  );
};
