import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface LandingHeroProps {
  onStart: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStart }) => {
  return (
    <div className="w-full min-h-[calc(100vh-65px)] flex flex-col justify-between py-8 px-4 sm:px-8 max-w-5xl mx-auto">
      {/* Top Tag & Event Meta */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#22252e] pb-4">
        <div className="flex items-center gap-2 font-mono text-xs text-[#ff4500]">
          <span className="w-2 h-2 rounded-full bg-[#ff4500] animate-pulse"></span>
          <span>OFFICIAL SHORTLISTING TASK // HACKER HOUSE GOA</span>
        </div>
        <div className="font-mono text-xs text-neutral-400">
          OCT 2026 • GOA, INDIA
        </div>
      </div>

      {/* Main Editorial Hero Block */}
      <div className="my-auto py-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 max-w-xl">
          {/* Main Huge Typography */}
          <h1 className="font-syne font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-white uppercase mb-6">
            HH GOA <br />
            <span className="text-[#ff4500]">2026</span>
          </h1>

          <div className="font-space font-bold text-2xl sm:text-3xl text-neutral-200 uppercase tracking-tight mb-6">
            BUILD YOUR <br />
            <span className="text-[#ff4500] underline decoration-[#ff4500]/40 underline-offset-8">
              BUILDER PASS
            </span>
          </div>

          <p className="font-sans text-lg text-neutral-300 mb-8 max-w-md leading-relaxed">
            Upload your photo. Tell us what you build. Get your custom #FrameInGoa credential pass in seconds.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
            <button
              onClick={onStart}
              className="group relative inline-flex items-center justify-center gap-3 bg-[#ff4500] hover:bg-[#ff5511] text-black font-syne font-extrabold text-lg sm:text-xl px-8 py-4 uppercase tracking-wider rounded-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-lg shadow-[#ff4500]/20"
            >
              <span>CREATE MY PASS</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Secondary details */}
          <div className="flex items-center gap-6 font-mono text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#ff4500]" />
              <span>100% Free • No Signup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#ff4500]" />
              <span>Instant 4:5 PNG</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#ff4500]" />
              <span>iPhone HEIC Ready</span>
            </div>
          </div>
        </div>

        {/* Right side Pass Preview Visual */}
        <div className="w-full max-w-xs sm:max-w-sm relative">
          {/* Subtle Technical Border Box */}
          <div className="relative border-2 border-[#ff4500] bg-[#121418] p-5 rounded-sm shadow-2xl space-y-4 font-mono text-xs text-neutral-300">
            {/* Top Pass Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="font-syne font-extrabold text-white text-base">HH GOA '26</span>
                <span className="block text-[10px] text-neutral-500">BUILDER CREDENTIAL</span>
              </div>
              <span className="bg-[#ff4500] text-black font-bold px-2 py-0.5 rounded-xs text-[11px]">
                HHG26 / 0184
              </span>
            </div>

            {/* Mock Photo Box */}
            <div className="w-full aspect-[4/3] bg-[#1a1d24] border border-neutral-700 relative flex flex-col items-center justify-center p-4 overflow-hidden rounded-xs">
              <div className="w-16 h-16 rounded-full bg-[#ff4500]/20 border border-[#ff4500] flex items-center justify-center text-[#ff4500] font-syne font-extrabold text-xl mb-2">
                YOU
              </div>
              <span className="text-[11px] text-neutral-400 font-mono text-center">
                [ YOUR PHOTO HERE ]
              </span>
              <div className="absolute top-2 left-2 bg-black/80 text-white text-[9px] px-1.5 py-0.5 border border-[#ff4500]/40">
                GOA '26
              </div>
            </div>

            {/* Mock User Details */}
            <div className="space-y-1.5">
              <div className="font-syne font-extrabold text-xl text-white tracking-tight">
                RAJ PATEL
              </div>
              <div className="text-[11px] text-[#ff4500] font-semibold">
                DEVELOPER • PYTHON / AI / WEB
              </div>
              <div className="inline-block bg-[#ff4500] text-black font-syne font-extrabold px-2.5 py-1 text-xs uppercase rounded-xs">
                THE SHIPPER
              </div>
            </div>

            {/* Footer badge */}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-500">
              <span>LAT 15.4989° N</span>
              <span className="font-bold text-white bg-neutral-800 px-1.5 py-0.5">#FRAMEINGOA</span>
            </div>
          </div>

          {/* Background Technical Stamp */}
          <div className="absolute -bottom-4 -right-4 bg-[#ff4500]/10 border border-[#ff4500]/40 text-[#ff4500] font-mono text-[10px] px-3 py-1 rounded-xs backdrop-blur-xs">
            1600 × 900 HIGH RES PNG
          </div>
        </div>
      </div>

      {/* Footer minimal tag */}
      <div className="pt-6 border-t border-[#22252e] flex flex-wrap items-center justify-between text-xs font-mono text-neutral-500">
        <div>HACKER HOUSE GOA 2026 CREDENTIAL STUDIO</div>
        <div className="text-[#ff4500] font-bold">#FrameInGoa</div>
      </div>
    </div>
  );
};
