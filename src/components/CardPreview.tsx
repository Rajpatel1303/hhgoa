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

  if (theme.id === 'goa-boarding-pass' || theme.id === 'vintage-goa') {
    const isDark = theme.id === 'vintage-goa';
    const textColor = isDark ? 'text-white' : 'text-stone-900';
    const labelColor = isDark ? 'text-emerald-300/80' : 'text-stone-400';
    const valueColor = isDark ? 'text-white' : 'text-stone-700';
    const borderColor = isDark ? 'border-emerald-800/40' : 'border-stone-200';
    const dividingLineColor = isDark ? 'border-emerald-800/30' : 'border-stone-300';
    const headerColor = isDark ? 'text-[#facc15]' : 'text-[#047857]';
    const headerBorder = isDark ? 'border-emerald-800/40' : 'border-stone-200';
    const rolePillClass = isDark
      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-850/60'
      : 'bg-[#047857]/10 text-[#047857] border border-[#047857]/20';
    const stubBg = isDark ? 'bg-[#02160e]' : 'bg-[#F5F5F4]';
    const stubBorder = isDark ? 'border-emerald-800/50' : 'border-stone-200';

    const photoTransformStyles = (transformData: any) => ({
      transform: `scale(${transformData?.zoom || 1}) translate(${
        transformData?.panX || 0
      }px, ${transformData?.panY || 0}px) rotate(${
        transformData?.rotation || 0
      }deg)`,
      filter: getFilterStyle(transformData?.filter),
    });

    const renderStampPhoto = (url: string, transformData: any, placeholder: string, sizeClass: string, rotationClass: string = 'rotate-[2deg]') => (
      <div className={`relative ${sizeClass} p-0.5 @xs:p-1 bg-white border @xs:border-2 border-dashed border-stone-300 shadow-md ${rotationClass} flex items-center justify-center overflow-hidden shrink-0`}>
        <div className="w-full h-full bg-stone-100 flex items-center justify-center relative overflow-hidden">
          {url ? (
            <img
              src={url}
              alt="passenger"
              style={photoTransformStyles(transformData)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-[8px] @xs:text-[10px] font-mono text-stone-400 font-bold">{placeholder}</div>
          )}
        </div>
      </div>
    );

    return (
      <div 
        className={`@container w-full max-w-[620px] mx-auto aspect-[16/9] border shadow-2xl rounded-2xl relative overflow-hidden flex items-stretch font-sans select-none ${textColor} ${borderColor}`}
        style={{ backgroundColor: theme.cardBg }}
      >
        
        {/* Ticket Notch Cutouts (Mock cutout using background matches page color) */}
        <div className="absolute top-0 left-[72%] w-6 h-3 bg-[#070d0a] border-b border-l border-r border-stone-200 rounded-b-full transform -translate-x-1/2 z-20" style={{ borderColor: isDark ? 'rgba(52, 211, 153, 0.2)' : '#e5e7eb' }} />
        <div className="absolute bottom-0 left-[72%] w-6 h-3 bg-[#070d0a] border-t border-l border-r border-stone-200 rounded-t-full transform -translate-x-1/2 z-20" style={{ borderColor: isDark ? 'rgba(52, 211, 153, 0.2)' : '#e5e7eb' }} />
        
        {/* Perforated dashed dividing line */}
        <div className={`absolute top-3 bottom-3 left-[72%] border-l border-dashed transform -translate-x-1/2 z-10 ${dividingLineColor}`} />

        {/* LEFT COLUMN: Main Pass (72% width) */}
        <div className="w-[72%] flex flex-col justify-between p-3 @xs:p-4 pr-6">
          
          {/* Header Row */}
          <div className={`flex items-center justify-between border-b pb-1.5 ${headerBorder}`}>
            <div className={`flex items-center gap-1.5 ${headerColor}`}>
              <span className="text-xs @xs:text-sm">✈️</span>
              <span className="font-space font-black text-[9px] @xs:text-xs tracking-wider uppercase">
                Hacker House Airlines
              </span>
            </div>
            <span className={`font-mono text-[8px] @xs:text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-emerald-400/80' : 'text-stone-400'}`}>
              Boarding Pass
            </span>
          </div>

          {/* Core Ticket details: Flight Origin / Dest & Photo Stamp */}
          <div className="flex-1 flex items-center justify-between my-2 gap-2 min-w-0">
            {/* Left part: Airport codes & Flight Info */}
            <div className="flex-1 space-y-1 @xs:space-y-2 min-w-0 pr-2">
              <div className="flex items-center gap-2 @xs:gap-3 leading-none">
                <span className={`font-space font-black text-2xl @xs:text-4xl ${isDark ? 'text-white' : 'text-[#047857]'}`}>HCK</span>
                <span className="text-[#F97316] font-bold text-xs @xs:text-sm">→</span>
                <span className={`font-space font-black text-2xl @xs:text-4xl ${isDark ? 'text-white' : 'text-[#047857]'}`}>GOA</span>
              </div>
              
              <div className="space-y-0.5 min-w-0">
                <div className={`text-[6px] @xs:text-[8px] font-mono uppercase ${labelColor}`}>Passenger</div>
                <div className={`font-space font-black uppercase leading-none break-words line-clamp-2 max-w-[160px] @xs:max-w-[240px] ${
                  displayNames.length > 35
                    ? 'text-[8.5px] @xs:text-[10.5px] @sm:text-[11.5px]'
                    : displayNames.length > 20
                    ? 'text-[9.5px] @xs:text-[12px] @sm:text-[13.5px]'
                    : 'text-[11px] @xs:text-[14px] @sm:text-[16px]'
                }`}>
                  {displayNames}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[6px] @xs:text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase ${rolePillClass}`}>
                  {displayRoles}
                </span>
              </div>
              <p
                style={{ color: isDark ? '#FEF08A' : '#78716C' }}
                className="font-sans italic text-[6px] @xs:text-[8px] @sm:text-[9.5px] mt-1.5 truncate line-clamp-1 max-w-[150px] @xs:max-w-[220px]"
              >
                {taglineText}
              </p>
              <div className="flex flex-wrap items-center gap-1 mt-1.5 max-w-[150px] @xs:max-w-[240px] overflow-hidden">
                {stackChips.map((chip, idx) => (
                  <span
                    key={idx}
                    className={`font-mono text-[4.5px] @xs:text-[6px] @sm:text-[7.5px] font-semibold px-1 py-0.2 rounded border ${
                      isDark
                        ? 'bg-emerald-950/30 text-emerald-300 border-emerald-800/30'
                        : 'bg-stone-100 text-stone-600 border-stone-200'
                    }`}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Right part: Passenger stamps (fixed sizing and overflow bounds) */}
            <div className="shrink-0 flex items-center justify-end max-w-[42%] pl-1">
              {!isTeam ? (
                renderStampPhoto(details.photoUrl, details.photoTransform, '[ PHOTO ]', 'w-18 h-18 @xs:w-24 @xs:h-24 @sm:w-30 @sm:h-30', 'rotate-[2deg]')
              ) : (
                <div className="flex items-center -space-x-1.5 @xs:-space-x-2.5 @sm:-space-x-3.5">
                  {renderStampPhoto(details.photoUrl, details.photoTransform, 'P1', 'w-10 h-10 @xs:w-13 @xs:h-13 @sm:w-17 @sm:h-17', 'rotate-[-6deg] translate-y-0.5 z-10')}
                  {details.teammates!.map((t, idx) => {
                    const rotation = idx === 0 ? 'rotate-[4deg] -translate-y-0.5 z-20' : 'rotate-[-2deg] translate-y-1 z-30';
                    return (
                      <React.Fragment key={idx}>
                        {renderStampPhoto(t.photoUrl, t.photoTransform, `P${idx + 2}`, 'w-10 h-10 @xs:w-13 @xs:h-13 @sm:w-17 @sm:h-17', rotation)}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Details footer row */}
          <div className={`grid grid-cols-4 gap-2 border-t pt-1.5 font-mono text-[6px] @xs:text-[8px] ${labelColor} ${headerBorder}`}>
            <div>
              <div className="uppercase">Flight</div>
              <div className={`font-bold ${valueColor}`}>HH2026</div>
            </div>
            <div>
              <div className="uppercase">Seat</div>
              <div className={`font-bold ${valueColor}`}>24A</div>
            </div>
            <div>
              <div className="uppercase">Gate</div>
              <div className="font-bold text-[#F97316]">08</div>
            </div>
            <div>
              <div className="uppercase">Date</div>
              <div className={`font-bold ${valueColor}`}>28 OCT 2026</div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Ticket Stub (28% width) */}
        <div className={`w-[28%] border-l p-3 @xs:p-4 flex flex-col justify-between pl-6 ${stubBg} ${stubBorder}`}>
          {/* Stub header */}
          <div className={`border-b pb-1.5 text-right ${headerBorder}`}>
            <span className={`font-mono text-[7px] @xs:text-[9px] font-bold uppercase tracking-wider ${labelColor}`}>
              Flight Stub
            </span>
          </div>

          {/* Stub details */}
          <div className="flex-1 flex flex-col justify-center py-2 space-y-1 @xs:space-y-2 min-w-0">
            <div className="space-y-0.5 min-w-0">
              <div className={`text-[5px] @xs:text-[7px] font-mono uppercase ${labelColor}`}>Passenger</div>
              <div className={`font-space font-black uppercase leading-none break-words line-clamp-2 ${
                displayNames.length > 35
                  ? 'text-[6.5px] @xs:text-[8px] @sm:text-[8.5px]'
                  : displayNames.length > 20
                  ? 'text-[7.5px] @xs:text-[9.5px] @sm:text-[10px]'
                  : 'text-[9px] @xs:text-xs'
              }`}>
                {displayNames}
              </div>
            </div>
            
            <div className={`grid grid-cols-2 gap-1 font-mono text-[5px] @xs:text-[7px] ${labelColor}`}>
              <div>
                <div className="uppercase">Seat</div>
                <div className={`font-bold ${valueColor}`}>24A</div>
              </div>
              <div>
                <div className="uppercase">Class</div>
                <div className={`font-bold ${valueColor}`}>VIP</div>
              </div>
            </div>


          </div>

          {/* Stub Footer */}
          <div className={`border-t pt-1.5 text-right ${headerBorder}`}>
            <span className={`font-mono text-[6px] @xs:text-[8px] font-bold ${isDark ? 'text-emerald-400/80' : 'text-stone-500'}`}>
              {cardNumber}
            </span>
          </div>
        </div>

      </div>
    );
  }

  if (theme.layout === 'square') {
    return (
      <div
        className="@container w-full max-w-[560px] mx-auto aspect-square text-white rounded-[24px] @sm:rounded-[28px] border border-white/15 shadow-2xl relative overflow-hidden font-sans select-none"
        style={{
          backgroundImage: `url('/images/card-template-combined.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Central Polaroid Photo Frame */}
        <div
          className="absolute"
          style={{
            top: '25.7%',
            left: '29.8%',
            width: '40.4%',
            height: '39.0%',
            overflow: 'hidden',
          }}
        >
          {!isTeam ? (
            <div className="w-full h-full relative flex items-center justify-center bg-zinc-800">
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
                <div className="text-[10px] @sm:text-xs font-mono text-white/80 font-bold">
                  [ PHOTO ]
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-[#021f14] flex items-center justify-center p-1.5">
              <div className="flex items-center -space-x-3 @xs:-space-x-4 @sm:-space-x-5">
                {/* Primary Photo */}
                <div className="relative w-10 h-10 @xs:w-14 @xs:h-14 rounded-full bg-[#021f14] border border-[#075336] p-0.5 shadow-xl z-30">
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
                    className="relative w-10 h-10 @xs:w-14 @xs:h-14 rounded-full bg-[#021f14] border border-[#075336] p-0.5 shadow-xl"
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
            </div>
          )}
        </div>

        {/* Green Badge User Name Overlay */}
        <div
          className="absolute flex items-center justify-center font-space font-extrabold text-white text-center uppercase tracking-wide"
          style={{
            top: '78.8%',
            left: '22.0%',
            width: '56.0%',
            height: '7.0%',
            fontSize: 'min(3.4cqw, 20px)',
          }}
        >
          ✦ {displayNames} ✦
        </div>

        {/* Yellow Badge Role Overlay */}
        <div
          className="absolute flex items-center justify-center font-space font-extrabold text-center uppercase tracking-wide"
          style={{
            top: '87.4%',
            left: '27.0%',
            width: '46.0%',
            height: '5.2%',
            color: '#7F1D1D', // Deep reddish-brown font matching original
            fontSize: 'min(2.8cqw, 16px)',
          }}
        >
          ⚡ {displayRoles} ⚡
        </div>
      </div>
    );
  }

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
