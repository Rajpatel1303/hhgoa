import React from 'react';
import { BuilderDetails, CARD_THEMES } from '../types';
import { Sparkles } from 'lucide-react';

interface CardPreviewProps {
  details: BuilderDetails;
}

const getFilterStyle = (filter: string | undefined): string => {
  if (filter === 'contrast') return 'contrast(130%)';
  if (filter === 'goa-warmth') return 'sepia(30%) contrast(115%)';
  if (filter === 'cyber-cyan') return 'hue-rotate(150deg)';
  if (filter === 'mono') return 'grayscale(100%)';
  return 'none';
};

export const CardPreview: React.FC<CardPreviewProps> = ({ details }) => {
  const theme = CARD_THEMES.find((t) => t.id === details.themeId) || CARD_THEMES[0];

  const nameText = (details.name || 'HARSH RAIKWAR').toUpperCase();
  const roleText = (details.role || 'BUILDER / AI ML').toUpperCase();
  const taglineText = details.builderTitle || '"Neural Network Hacker & Prompt Sorcerer"';
  const cardNumber = details.cardNumber || 'HH26-4E90D7AC';

  // Parse stack chips from details.stack
  const rawStack = details.stack || 'Nextjs, Nodejs, Django, Flask, Gin, Rust, Tensorflow';
  const stackChips = rawStack
    .split(/[,/·•\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 7);

  // If team pass, construct combined names and roles
  const isTeam = details.passType === 'team' && details.teammates && details.teammates.length > 0;
  
  const displayNames = isTeam
    ? [nameText, ...details.teammates!.map((t) => (t.name || 'TEAMMATE').toUpperCase())].join(' & ')
    : nameText;

  const displayRoles = isTeam
    ? Array.from(new Set([roleText, ...details.teammates!.map((t) => (t.role || 'Builder').toUpperCase())])).join(' • ')
    : roleText;

  return (
    <div
      className="@container w-full max-w-[620px] mx-auto aspect-[16/9] text-white p-2.5 @xs:p-4 @sm:p-5 @md:p-6 rounded-[24px] @sm:rounded-[28px] border border-white/15 shadow-2xl relative flex items-center justify-between overflow-hidden font-sans select-none"
      style={{
        backgroundColor: theme.cardBg,
        backgroundImage: `radial-gradient(circle at 80% 20%, rgba(250, 204, 21, 0.08), transparent 40%), linear-gradient(135deg, ${theme.cardBg} 0%, #03180f 100%)`,
      }}
    >
      {/* Background subtle diagonal stripe pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 10px)'
        }}
      />

      {/* Main 2-Column Horizontal Layout */}
      <div className="w-full h-full flex items-center gap-2 @xs:gap-4 @md:gap-6 z-10">
        
        {/* LEFT COLUMN: Circular Seal / Badge Frame */}
        <div className="shrink-0 relative flex flex-col items-center justify-center">
          
          {!isTeam ? (
            /* Single Builder circular Badge Outer Ring */
            <div className="relative w-24 h-24 @xs:w-36 @xs:h-36 @sm:w-44 @sm:h-44 @md:w-48 @md:h-48 rounded-full bg-[#021f14] border-2 @xs:border-4 border-[#075336] shadow-2xl flex items-center justify-center p-1 @xs:p-2">
              
              {/* SVG Arched Curved Text Path */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
                <path
                  id="textPathTop"
                  d="M 30,100 A 70,70 0 1,1 170,100"
                  fill="none"
                />
                <path
                  id="textPathBottom"
                  d="M 170,100 A 70,70 0 0,1 30,100"
                  fill="none"
                />
                <text className="font-mono text-[11px] font-bold fill-[#facc15] tracking-[2px] uppercase">
                  <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
                    HACKER HOUSE
                  </textPath>
                </text>
                <text className="font-mono text-[10px] font-bold fill-[#34d399] tracking-[1.5px] uppercase">
                  <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
                    OCT 28-31 · 2026
                  </textPath>
                </text>
              </svg>

              {/* Inner Photo Circle */}
              <div className="w-16 h-16 @xs:w-24 @xs:h-24 @sm:w-28 @sm:h-28 @md:w-32 @md:h-32 rounded-full overflow-hidden border @xs:border-2 border-[#facc15] shadow-inner bg-gradient-to-br from-yellow-400 via-pink-500 to-emerald-600 relative flex items-center justify-center">
                {details.photoUrl ? (
                  <img
                    src={details.photoUrl}
                    alt={details.name}
                    style={{
                      transform: `scale(${details.photoTransform?.zoom || 1}) translate(${
                        details.photoTransform?.panX || 0
                      }px, ${details.photoTransform?.panY || 0}px) rotate(${
                        details.photoTransform?.rotation || 0
                      }deg)`,
                      filter: getFilterStyle(details.photoTransform?.filter),
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-[7px] @xs:text-[10px] font-mono text-white/80 font-bold text-center px-1 @xs:px-2">
                    [ PHOTO ]
                  </div>
                )}
              </div>

              {/* Pink Devanagari Goa Stamp/Badge at Bottom Center */}
              <div className="absolute -bottom-1.5 @xs:-bottom-2 bg-pink-600 border border-yellow-300 text-yellow-300 font-extrabold text-[8px] @xs:text-[10px] @sm:text-[12px] @md:text-[14px] px-2 @sm:px-3 py-0.5 rounded-full tracking-wider shadow-lg transform -rotate-2">
                गोवा
              </div>
            </div>
          ) : (
            /* Team Pass overlapping photos list */
            <div className="relative flex flex-col items-center justify-center gap-1 @xs:gap-1.5 select-none">
              <div className="flex items-center -space-x-3 @xs:-space-x-5 @sm:-space-x-7 @md:-space-x-8">
                
                {/* Primary Photo */}
                <div className="relative w-12 h-12 @xs:w-20 @xs:h-20 @sm:w-24 @sm:h-24 @md:w-28 @md:h-28 rounded-full bg-[#021f14] border border-[#075336] p-0.5 shadow-xl z-30">
                  <div className="w-full h-full rounded-full overflow-hidden border border-[#facc15] bg-gradient-to-br from-yellow-400 to-emerald-600 relative flex items-center justify-center">
                    {details.photoUrl ? (
                      <img
                        src={details.photoUrl}
                        alt={details.name}
                        style={{
                          transform: `scale(${details.photoTransform?.zoom || 1}) translate(${
                            details.photoTransform?.panX || 0
                          }px, ${details.photoTransform?.panY || 0}px) rotate(${
                            details.photoTransform?.rotation || 0
                          }deg)`,
                          filter: getFilterStyle(details.photoTransform?.filter),
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-[5px] @xs:text-[7px] font-mono text-white/80 font-bold text-center">P1</div>
                    )}
                  </div>
                </div>

                {/* Teammates Photos */}
                {details.teammates!.map((teammate, index) => (
                  <div
                    key={index}
                    className="relative w-12 h-12 @xs:w-20 @xs:h-20 @sm:w-24 @sm:h-24 @md:w-28 @md:h-28 rounded-full bg-[#021f14] border border-[#075336] p-0.5 shadow-xl"
                    style={{ zIndex: 20 - index }}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden border border-[#facc15] bg-gradient-to-br from-yellow-400 to-emerald-600 relative flex items-center justify-center">
                      {teammate.photoUrl ? (
                        <img
                          src={teammate.photoUrl}
                          alt={teammate.name}
                          style={{
                            transform: `scale(${teammate.photoTransform?.zoom || 1}) translate(${
                              teammate.photoTransform?.panX || 0
                            }px, ${teammate.photoTransform?.panY || 0}px) rotate(${
                              teammate.photoTransform?.rotation || 0
                            }deg)`,
                            filter: getFilterStyle(teammate.photoTransform?.filter),
                          }}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-[5px] @xs:text-[7px] font-mono text-white/80 font-bold text-center">P{index + 2}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pink Devanagari Goa Stamp/Badge at Bottom Center */}
              <div className="bg-pink-600 border border-yellow-300 text-yellow-300 font-extrabold text-[6px] @xs:text-[8px] @sm:text-[10px] @md:text-[12px] px-1.5 @sm:px-2 py-0.2 rounded-full tracking-wider shadow-lg transform -rotate-2">
                गोवा
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Typography & Builder Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5 @xs:py-1 @sm:py-2">
          
          {/* Top Header */}
          <div className="space-y-0 @xs:space-y-0.5">
            <h2 className="font-serif font-black text-xs @xs:text-lg @sm:text-2xl @md:text-3xl text-[#facc15] tracking-tight uppercase leading-none drop-shadow-xs whitespace-nowrap">
              HACKER HOUSE
            </h2>
            <div className="font-mono text-[7px] @xs:text-[9px] @sm:text-[10px] @md:text-xs text-emerald-300/90 font-bold tracking-wider flex items-center justify-between">
              <span>GOA · OCT 28-31 2026</span>
              <span className="text-yellow-400 font-mono text-[7px] @xs:text-[9px] @sm:text-[10px] hidden @xs:inline">{cardNumber}</span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-emerald-700/60 my-0.5 @xs:my-1 @sm:my-1.5" />

          {/* User Name & Role */}
          <div className="space-y-0 @xs:space-y-0.5 min-w-0">
            <div className="font-space font-extrabold text-[10px] @xs:text-sm @sm:text-lg @md:text-2xl text-white truncate tracking-tight uppercase">
              {displayNames}
            </div>

            <div className="font-mono font-bold text-[8px] @xs:text-xs @sm:text-sm text-pink-400 flex items-center gap-0.5 @xs:gap-1 truncate">
              <span className="text-emerald-400">»</span>
              <span>{displayRoles}</span>
            </div>

            <p className="font-sans italic text-[7px] @xs:text-[9px] @sm:text-xs text-amber-200/90 line-clamp-1">
              {taglineText}
            </p>
          </div>

          {/* Tech Stack Chips */}
          <div className="flex flex-wrap items-center gap-0.5 @xs:gap-1 my-0.5 @xs:my-1">
            {stackChips.map((chip, idx) => (
              <span
                key={idx}
                className="font-mono text-[6px] @xs:text-[8px] @sm:text-[9px] @md:text-[10px] font-semibold text-white/90 bg-black/40 border border-emerald-800/80 px-1 @xs:px-2 py-0.5 rounded-xs @xs:rounded-md backdrop-blur-xs"
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Footer Info */}
          <div className="flex items-center pt-0.5 @xs:pt-1 border-t border-emerald-900/60 font-mono text-[7px] @xs:text-[8px] @sm:text-[9px] @md:text-[10px] text-emerald-400/80">
            <div className="space-y-0 min-w-0">
              <div className="font-bold text-white flex items-center gap-0.5 @xs:gap-1">
                <Sparkles className="w-2 h-2 @xs:w-3 h-3 text-[#facc15]" />
                <span className="truncate">CODE ON THE COAST • SHIP TO THE WORLD</span>
              </div>
              <div className="text-emerald-300/80 font-semibold leading-none">hhgoa.com</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
