import React from 'react';

interface NavbarProps {
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset }) => {
  return (
    <header className="w-full bg-[#0a0f0d] border-b border-emerald-900/60 sticky top-0 z-50 py-3.5 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-[#facc15] text-black font-mono font-black text-xs px-2.5 py-1 rounded-md tracking-tighter">
            HH'26
          </div>
          <div>
            <div className="font-space font-bold text-sm text-white tracking-tight flex items-center gap-2">
              HACKER HOUSE GOA <span className="text-emerald-400 font-mono text-xs font-normal">2026</span>
            </div>
            <div className="font-mono text-[10px] text-emerald-400/70 tracking-wider">
              BUILDER PASSPORT STUDIO
            </div>
          </div>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="hidden sm:inline-block text-emerald-300/80 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded-full text-[11px]">
            GOA, INDIA · OCT 28–31
          </span>
          <button
            onClick={onReset}
            className="text-emerald-400 hover:text-yellow-300 transition-colors cursor-pointer text-xs font-mono"
          >
            Reset Form
          </button>
        </div>
      </div>
    </header>
  );
};


