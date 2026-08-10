import React from 'react';

interface LandingHeroProps {
  onBoardClick: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onBoardClick }) => {
  return (
    <div className="w-full h-full relative flex flex-col justify-between p-6 sm:p-8 bg-[#005030] overflow-hidden select-none font-sans">
      
      {/* 1. Header (Navbar row) */}
      <header className="w-full flex items-center justify-between z-20 animate-fade-in-up delay-100">
        <div className="flex items-center gap-3">
          <div className="bg-[#facc15] text-black font-mono font-black text-xs px-2.5 py-1 rounded-md tracking-tighter">
            HH'26
          </div>
          <div>
            <div className="font-space font-bold text-xs sm:text-sm text-white tracking-tight flex items-center gap-2">
              HACKER HOUSE GOA <span className="text-emerald-400 font-mono text-xs font-normal">2026</span>
            </div>
            <div className="font-mono text-[9px] sm:text-[10px] text-emerald-400/70 tracking-wider">
              BUILDER PASSPORT STUDIO
            </div>
          </div>
        </div>

        {/* Actions spacer */}
        <div className="w-10 h-1" />
      </header>

      {/* 2. Main Centered Title Branding */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center py-12 z-20">
        {/* Massive Yellow Brand Text */}
        <div className="relative">
          <h1 className="font-landing-heavy text-[#facc15] text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] tracking-tighter leading-none select-none animate-fade-in-up delay-300">
            HACKER HOUSE
          </h1>

          {/* Glowing Pink rotated Hindi Overlay */}
          <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] text-[#ff007f] font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl select-none pointer-events-none filter drop-shadow-[0_0_15px_rgba(255,0,127,0.75)] whitespace-nowrap animate-pop-in delay-600">
            गोवा
          </div>
        </div>

        {/* Location & Runway Subtitle */}
        <p className="mt-8 font-space text-emerald-300/80 text-xs sm:text-sm tracking-[0.25em] uppercase font-bold animate-fade-in-up delay-900">
          GOA, INDIA · 28 - 31 OCT 2026
        </p>
      </div>

      {/* 3. Bottom Row details */}
      <footer className="w-full flex items-center justify-between border-t border-emerald-800/40 pt-4 z-20 font-mono text-[10px] sm:text-xs text-emerald-400/80 animate-fade-in-up delay-1100">
        <div>GOA, INDIA</div>
        
        {/* Scroll board runway prompt */}
        <button
          type="button"
          onClick={onBoardClick}
          className="flex flex-col items-center gap-1 hover:text-[#facc15] transition-colors cursor-pointer"
        >
          <span className="animate-bounce text-sm">🛫</span>
          <span className="font-space uppercase font-bold tracking-widest text-[9px] sm:text-[10px]">Scroll or click to Board</span>
        </button>

        {/* Spacer to preserve centered layout */}
        <div className="hidden sm:block opacity-0 select-none">GOA, INDIA</div>
      </footer>

    </div>
  );
};
