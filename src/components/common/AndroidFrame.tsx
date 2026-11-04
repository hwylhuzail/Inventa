import React from 'react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isFramed: boolean;
  onToggleFrame: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenAndroidCode: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#0B0F19] text-slate-100 flex flex-col items-stretch justify-start transition-colors">

      <div
        className="w-full min-h-screen flex flex-col overflow-hidden bg-[#0B0F19]"
      >
        {/* Screen Content Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          {children}
        </div>

      </div>
    </div>
  );
};
