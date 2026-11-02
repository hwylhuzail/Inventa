import React from 'react';

interface InventaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const InventaLogo: React.FC<InventaLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  onClick
}) => {
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    xs: 'text-sm font-bold tracking-tight',
    sm: 'text-base font-bold tracking-tight',
    md: 'text-xl font-extrabold tracking-tight',
    lg: 'text-2xl font-black tracking-tight',
    xl: 'text-3xl font-black tracking-tight'
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Precision Geometric Invention Crystal Node Mark */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        {/* Soft Ambient Radiance */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-violet-600/40 via-indigo-600/30 to-cyan-400/40 blur-md pointer-events-none" />
        
        <svg
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-sm"
        >
          <defs>
            <linearGradient id="invPolyGrad" x1="4" y1="4" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="invCoreGlow" x1="26" y1="10" x2="26" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#C4B5FD" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
            <linearGradient id="invFillGrad" x1="12" y1="8" x2="40" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0F172A" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0B0F19" stopOpacity="0.98" />
            </linearGradient>
          </defs>

          {/* Outer Faceted Geometric Prism */}
          <path
            d="M26 4L44 14.5V37.5L26 48L8 37.5V14.5L26 4Z"
            stroke="url(#invPolyGrad)"
            strokeWidth="2.4"
            strokeLinejoin="round"
            fill="url(#invFillGrad)"
          />

          {/* Internal Geometric Facet Lines */}
          <path
            d="M26 4V26M26 26L44 14.5M26 26L8 14.5M26 26V48M26 26L44 37.5M26 26L8 37.5"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Converging Quantum Filament Vector */}
          <path
            d="M26 13V26M26 26L18 21M26 26L34 21M26 26L19 33M26 26L33 33"
            stroke="url(#invCoreGlow)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Core Energy Emitter Particle */}
          <circle cx="26" cy="26" r="3.5" fill="#22D3EE" />
          <circle cx="26" cy="26" r="1.5" fill="#FFFFFF" />

          {/* Base Lab Plinth Points */}
          <circle cx="21" cy="45" r="1" fill="#8B5CF6" />
          <circle cx="26" cy="46" r="1.2" fill="#22D3EE" />
          <circle cx="31" cy="45" r="1" fill="#8B5CF6" />
        </svg>
      </div>

      {/* Brand Wordmark & Descriptor */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`tracking-tight font-extrabold text-white dark:text-white ${textSizes[size]}`}>
            INVENTA
          </span>
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/30">
            LAB
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-400 font-medium tracking-wide">
            Imagine · Invent · Create
          </span>
        )}
      </div>
    </div>
  );
};
