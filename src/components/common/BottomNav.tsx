import React from 'react';
import { Home, Compass, Plus, Bookmark, User } from 'lucide-react';
import { AppScreen } from '../../types/invention';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  savedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  savedCount = 0
}) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, screen: 'home' as AppScreen },
    { id: 'discover', label: 'Discover', icon: Compass, screen: 'discover' as AppScreen },
    { id: 'create', label: 'Create', icon: Plus, screen: 'create' as AppScreen, isFab: true },
    { id: 'my-inventions', label: 'My Inventions', icon: Bookmark, screen: 'my-inventions' as AppScreen, badge: savedCount },
    { id: 'profile', label: 'Profile', icon: User, screen: 'profile' as AppScreen },
  ];

  const getIsActive = (screen: AppScreen) => {
    if (screen === 'home') return currentScreen === 'home';
    if (screen === 'discover') return currentScreen === 'discover';
    if (screen === 'create') return ['create', 'generating', 'results'].includes(currentScreen);
    if (screen === 'my-inventions') return ['my-inventions', 'detail', 'prototype', 'compare'].includes(currentScreen);
    if (screen === 'profile') return ['profile', 'settings', 'data-export'].includes(currentScreen);
    return false;
  };

  return (
    <nav
      aria-label="Android Bottom Navigation Bar"
      className="shrink-0 w-full bg-[#0B0F19]/95 backdrop-blur-xl border-t border-white/[0.08] px-3 py-1.5 flex items-center justify-around z-40 select-none shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.5)]"
    >
      {tabs.map((tab) => {
        const isActive = getIsActive(tab.screen);
        const Icon = tab.icon;

        // Elevated Center Creation FAB
        if (tab.isFab) {
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.screen)}
              className="flex flex-col items-center justify-center -mt-5 min-w-[56px] min-h-[56px] group transition-transform active:scale-95 focus:outline-none"
              aria-label="Create Invention"
            >
              <div
                className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-tr from-cyan-400 via-violet-600 to-indigo-600 shadow-violet-500/40 ring-2 ring-cyan-300 scale-105'
                    : 'bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-violet-900/50 hover:brightness-110'
                }`}
              >
                <Icon className="w-6 h-6 text-white stroke-[2.4]" />
              </div>
              <span className={`text-[10px] font-bold mt-1 tracking-tight transition-colors ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-slate-200'}`}>
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.screen)}
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[50px] py-1 px-2 rounded-2xl transition-all duration-200 relative ${
              isActive ? 'text-violet-300' : 'text-slate-400 hover:text-slate-200'
            }`}
            aria-label={tab.label}
          >
            {/* Material You Pill Highlight behind active icon */}
            <div
              className={`relative px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                isActive
                  ? 'bg-violet-600/25 border border-violet-500/40 text-cyan-300'
                  : 'bg-transparent text-slate-400'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.4] text-cyan-300' : 'stroke-[1.8]'}`} />
              
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1 -right-1 px-1.5 min-w-[16px] h-4 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-[9px] font-mono font-bold text-white flex items-center justify-center shadow-sm">
                  {tab.badge}
                </span>
              ) : null}
            </div>

            <span
              className={`text-[10px] tracking-tight mt-0.5 transition-colors ${
                isActive ? 'text-white font-bold' : 'text-slate-400 font-medium'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
