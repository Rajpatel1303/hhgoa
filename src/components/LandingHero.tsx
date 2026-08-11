import React, { useEffect } from 'react';

// Global cache to prevent double-registration in React Strict Mode / hot reload
let theatreInitializing = false;
let theatreProject: any = null;
let theatreSheet: any = null;
let theatreLogoObj: any = null;

interface LandingHeroProps {
  onBoardClick: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onBoardClick }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let unsubscribeTheatre: (() => void) | undefined;
    let isCancelled = false;

    // 1. GSAP: Staggered entry for title characters
    const initGsap = async () => {
      const { default: gsap } = await import('gsap');
      if (isCancelled) return;
      gsap.fromTo(
        '.landing-title-char',
        { opacity: 0, y: 50, scaleY: 1.5 },
        {
          opacity: 1,
          y: 0,
          scaleY: 1,
          duration: 0.8,
          stagger: 0.04,
          ease: 'power3.out',
          delay: 0.2,
        }
      );
    };

    // 2. Anime.js v4: Footer stagger and takeoff icon loop
    const initAnime = async () => {
      const { animate, stagger } = (await import('animejs')) as any;
      if (isCancelled) return;

      // Stagger footer elements and header (must pass DOM elements, not strings in v4)
      const elements = document.querySelectorAll('.landing-footer-item, .landing-header, .landing-subtitle');
      if (elements.length > 0) {
        animate(elements, {
          translateY: [20, 0],
          opacity: [0, 1],
          delay: stagger(150, { start: 800 }),
          ease: 'out',
          duration: 800,
        });
      }

      // Continuous flight takeoff loop
      const takeoffIcon = document.querySelectorAll('.takeoff-icon');
      if (takeoffIcon.length > 0) {
        animate(takeoffIcon, {
          translateY: [0, -6, 0],
          loop: true,
          ease: 'inOut',
          duration: 1200,
        });
      }
    };

    // 3. Theatre.js: Spring Pop-In sequence for Hindi Text (runs on every mount)
    const initTheatre = async () => {
      const { getProject, types } = await import('@theatre/core');
      if (isCancelled) return;

      const prebakedState = {
        sheetsById: {
          Landing: {
            staticValuesByObject: {},
            sequence: {
              sublines: {
                Logo: {
                  type: 'keyframed',
                  value: {
                    scale: {
                      type: 'keyframed',
                      value: [
                        { time: 0, value: 0, ease: [0.175, 0.885, 0.32, 1.275] },
                        { time: 0.8, value: 1.15, ease: [0.25, 0.1, 0.25, 1] },
                        { time: 1.2, value: 1.0 },
                      ],
                    },
                    opacity: {
                      type: 'keyframed',
                      value: [
                        { time: 0, value: 0 },
                        { time: 0.6, value: 1 },
                      ],
                    },
                    rotation: {
                      type: 'keyframed',
                      value: [
                        { time: 0, value: -45, ease: [0.175, 0.885, 0.32, 1.275] },
                        { time: 1.2, value: -12 },
                      ],
                    },
                  },
                },
              },
              length: 1.5,
            },
          },
        },
        definitionVersion: '0.4.0',
      };

      try {
        if (!theatreLogoObj && !theatreInitializing) {
          theatreInitializing = true;
          theatreProject = getProject('HackerHouseGoaAnimation', { state: prebakedState });
          theatreSheet = theatreProject.sheet('Landing');
          theatreLogoObj = theatreSheet.object('Logo', {
            scale: types.number(1, { range: [0, 3] }),
            opacity: types.number(1, { range: [0, 1] }),
            rotation: types.number(-12, { range: [-180, 180] }),
          });
        }

        // We must re-bind the style updates to the newly mounted DOM element on every mount
        const unsubscribe = theatreLogoObj.onValuesChange((values: any) => {
          const element = document.getElementById('hindi-overlay');
          if (element) {
            element.style.transform = `translate(-50%, -50%) scale(${values.scale}) rotate(${values.rotation}deg)`;
            element.style.opacity = `${values.opacity}`;
          }
        });

        if (isCancelled) {
          unsubscribe();
        } else {
          unsubscribeTheatre = unsubscribe;
          // Play sequence on every mount
          setTimeout(() => {
            if (!isCancelled && theatreSheet) {
              theatreSheet.sequence.play({ iterationCount: 1 });
            }
          }, 500);
        }
      } catch (err) {
        console.error('Theatre.js initialization error:', err);
      }
    };

    initGsap();
    initAnime();
    initTheatre();

    return () => {
      isCancelled = true;
      if (unsubscribeTheatre) {
        unsubscribeTheatre();
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative flex flex-col justify-between p-6 sm:p-8 bg-transparent overflow-hidden select-none font-sans">
      
      {/* 1. Header (Navbar row) */}
      <header className="landing-header w-full flex items-center justify-between z-20 opacity-0">
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
          <h1 className="font-landing-heavy text-[#facc15] text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] tracking-tighter leading-none select-none flex flex-wrap justify-center max-w-7xl mx-auto">
            {"HACKER HOUSE".split("").map((char, i) => (
              <span key={i} className="landing-title-char inline-block opacity-0">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>

          {/* Glowing Pink rotated Hindi Overlay */}
          <div 
            id="hindi-overlay"
            className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-[#ff007f] font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl select-none pointer-events-none filter drop-shadow-[0_0_15px_rgba(255,0,127,0.75)] whitespace-nowrap opacity-0"
          >
            गोवा
          </div>
        </div>

        {/* Location & Runway Subtitle */}
        <p className="landing-subtitle mt-8 font-space text-emerald-300/80 text-xs sm:text-sm tracking-[0.25em] uppercase font-bold opacity-0">
          GOA, INDIA · 28 - 31 OCT 2026
        </p>
      </div>

      {/* 3. Bottom Row details */}
      <footer className="w-full flex items-center justify-between border-t border-emerald-800/40 pt-4 z-20 font-mono text-[10px] sm:text-xs text-emerald-400/80">
        <div className="landing-footer-item opacity-0">GOA, INDIA</div>
        
        {/* Scroll board runway prompt */}
        <button
          type="button"
          onClick={onBoardClick}
          className="landing-footer-item flex flex-col items-center gap-1 hover:text-[#facc15] transition-colors cursor-pointer pointer-events-auto opacity-0"
        >
          <span className="takeoff-icon text-sm inline-block">🛫</span>
          <span className="font-space uppercase font-bold tracking-widest text-[9px] sm:text-[10px]">Scroll or click to Board</span>
        </button>

        {/* Spacer to preserve centered layout */}
        <div className="landing-footer-item hidden sm:block opacity-0 select-none">GOA, INDIA</div>
      </footer>

    </div>
  );
};
