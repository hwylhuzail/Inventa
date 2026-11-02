import React from 'react';
import { UserProfile, AppScreen } from '../../types/invention';
import {
  User,
  ShieldCheck,
  Award,
  Settings,
  Download,
  Code,
  Zap,
  ChevronRight,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface ProfileScreenProps {
  profile: UserProfile;
  inventionsCount: number;
  activeCount: number;
  completedTasksCount: number;
  onNavigate: (screen: AppScreen) => void;
  onOpenAndroidCode: () => void;
}

const BADGES = [
  { id: 'b1', name: 'First Spark', desc: 'Synthesized your first laboratory invention', unlocked: true },
  { id: 'b2', name: 'Prior Art Scout', desc: 'Researched patent classification vectors', unlocked: true },
  { id: 'b3', name: 'Prototype Pioneer', desc: 'Completed milestone build instructions', unlocked: true },
  { id: 'b4', name: 'Safety Certified', desc: 'Audited electrical and mechanical hazards', unlocked: true }
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  inventionsCount,
  activeCount,
  completedTasksCount,
  onNavigate,
  onOpenAndroidCode
}) => {
  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-5 pb-12 bg-[#0B0F19] text-slate-100">
      {/* Profile Header Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-950/60 via-slate-900 to-slate-900 border border-violet-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-violet-900/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
              <User className="w-7 h-7 text-cyan-300" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {profile.displayName || 'Inventor'}
              </h2>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {profile.tier} TIER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xs line-clamp-1">
              {profile.bio || 'Independent hardware maker and inventor.'}
            </p>
            <div className="text-[11px] text-slate-400 mt-1">
              Member since {profile.joinedDate || 'November 2026'}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block">Total Inventions</span>
          <span className="text-lg font-bold font-mono text-white tabular-nums mt-0.5">
            {inventionsCount}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block">Active Builds</span>
          <span className="text-lg font-bold font-mono text-cyan-400 tabular-nums mt-0.5">
            {activeCount}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block">Tasks Verified</span>
          <span className="text-lg font-bold font-mono text-violet-400 tabular-nums mt-0.5">
            {completedTasksCount}
          </span>
        </div>
      </div>

      {/* Freemium Architecture Notice Card */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Freemium Plan Tiering
            </h3>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold">Active: Free Tier</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="font-bold text-white block mb-1">Innovator Free</span>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>• 10 AI syntheses / day</li>
              <li>• Encrypted local vault</li>
              <li>• Standard prototype plans</li>
              <li>• Markdown export</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-violet-500/30">
            <span className="font-bold text-violet-300 block mb-1">Laboratory Pro</span>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>• Unlimited AI syntheses</li>
              <li>• CAD & STEP exports</li>
              <li>• Formal patent draft prep</li>
              <li>• Team collaboration</li>
            </ul>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 italic">
          *Notice: Real payments will be enabled once a compliant billing provider is configured. All features in this version are free for laboratory use.
        </div>
      </div>

      {/* Innovation Badges */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Innovation Milestones</span>
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {BADGES.map((b) => (
            <div
              key={b.id}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-white block leading-tight">
                  {b.name}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                  {b.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Links */}
      <div className="space-y-2 pt-2">
        <button
          onClick={onOpenAndroidCode}
          className="w-full p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-violet-500/40 text-left flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <Code className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-xs font-semibold text-white block">
                Native Android Kotlin Codebase
              </span>
              <span className="text-[11px] text-slate-400">
                Inspect Jetpack Compose, Room DB & Android Studio files
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className="w-full p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-slate-300" />
            <div>
              <span className="text-xs font-semibold text-white block">
                Settings & Privacy
              </span>
              <span className="text-[11px] text-slate-400">
                Permissions, privacy policy, and hardware toggles
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => onNavigate('data-export')}
          className="w-full p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <Download className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-xs font-semibold text-white block">
                Data Export & Account Reset
              </span>
              <span className="text-[11px] text-slate-400">
                Download JSON backup or wipe local records
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
