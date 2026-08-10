import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const name = searchParams.get('name') || 'HARSH RAIKWAR';
    const role = searchParams.get('role') || 'BUILDER / AI ML';
    const title = searchParams.get('title') || '"Neural Network Hacker & Prompt Sorcerer"';
    const stack = searchParams.get('stack') || 'Nextjs, Nodejs, Django, React, AI';
    const photo = searchParams.get('photo');
    const theme = searchParams.get('theme') || 'forest-emerald';
    const passType = searchParams.get('passType') || 'single';
    const teammatesParam = searchParams.get('teammates');
    let teammates: any[] = [];
    if (passType === 'team' && teammatesParam) {
      try {
        teammates = JSON.parse(teammatesParam);
      } catch (err) {
        console.error('Failed to parse teammates query param in OG route:', err);
      }
    }

    if (theme === 'goa-boarding-pass' || theme === 'vintage-goa') {
      const isDark = theme === 'vintage-goa';
      const barcodes = [2, 1, 3, 1, 4, 2, 1, 3, 2, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2];

      const stackChips = stack
        .split(/[,/·•\n]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .slice(0, 5);

      const isTeam = passType === 'team' && teammates.length > 0;
      
      const ogName = isTeam
        ? [name.toUpperCase(), ...teammates.map((t: any) => (t.name || 'TEAMMATE').toUpperCase())].join(' & ')
        : name.toUpperCase();

      const ogRoleText = isTeam
        ? Array.from(new Set([role.toUpperCase(), ...teammates.map((t: any) => (t.role || 'Builder').toUpperCase())])).join(' • ')
        : role.toUpperCase();

      const ogNameFontSize = ogName.length > 35
        ? '12px'
        : ogName.length > 20
        ? '16px'
        : '24px';
      const ogStubNameFontSize = ogName.length > 35
        ? '9px'
        : ogName.length > 20
        ? '12px'
        : '18px';

      const cardBg = isDark ? '#052A1A' : '#FAF8F5';
      const cardBorder = isDark ? '8px solid rgba(52, 211, 153, 0.25)' : '8px solid #E5E7EB';
      const textColor = isDark ? '#FFFFFF' : '#1C1917';
      const labelColor = isDark ? '#A7F3D0' : '#A8A29E';
      const valueColor = isDark ? '#FFFFFF' : '#1C1917';
      const dividerBorder = isDark ? '2px solid rgba(52, 211, 153, 0.2)' : '2px solid #E7E5E4';
      const perforatedBorder = isDark ? '4px dashed rgba(52, 211, 153, 0.25)' : '4px dashed #D6D3D1';
      const headerColor = isDark ? '#FACC15' : '#047857';
      const airportCodeColor = isDark ? '#FFFFFF' : '#047857';
      const arrowColor = isDark ? '#FACC15' : '#F97316';
      const rolePillBg = isDark ? 'rgba(4, 120, 87, 0.2)' : 'rgba(4, 120, 87, 0.1)';
      const rolePillBorder = isDark ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(4, 120, 87, 0.25)';
      const rolePillTextColor = isDark ? '#34D399' : '#047857';
      const stubBg = isDark ? '#02160e' : '#F5F5F4';
      const stubLeftBorder = isDark ? '2px solid rgba(52, 211, 153, 0.25)' : '2px solid #E7E5E4';
      const barcodeColor = isDark ? '#34D399' : '#1C1917';
      const cardNumberColor = isDark ? '#34D399' : '#78716C';

      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: cardBg,
              border: cardBorder,
              padding: '40px 50px',
              boxSizing: 'border-box',
              position: 'relative',
            }}
          >
            {/* Notch Cutout Elements (Mocked with page background color #070d0a) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '72%',
                width: '30px',
                height: '15px',
                backgroundColor: '#070d0a',
                borderBottomLeftRadius: '15px',
                borderBottomRightRadius: '15px',
                transform: 'translateX(-15px)',
                zIndex: 20,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: '72%',
                width: '30px',
                height: '15px',
                backgroundColor: '#070d0a',
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px',
                transform: 'translateX(-15px)',
                zIndex: 20,
              }}
            />

            {/* Perforated divider */}
            <div
              style={{
                position: 'absolute',
                top: '25px',
                bottom: '25px',
                left: '72%',
                width: '0px',
                borderLeft: perforatedBorder,
                transform: 'translateX(-2px)',
                zIndex: 10,
              }}
            />

            {/* MAIN PASS (72%) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '72%',
                height: '100%',
                justifyContent: 'space-between',
                paddingRight: '40px',
                boxSizing: 'border-box',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: dividerBorder,
                  paddingBottom: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', color: headerColor, fontSize: '18px', fontWeight: 900 }}>
                  ✈️ HACKER HOUSE AIRLINES
                </div>
                <div style={{ color: labelColor, fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                  BOARDING PASS
                </div>
              </div>

              {/* Middle Section */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, margin: '15px 0' }}>
                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', color: airportCodeColor, fontSize: '48px', fontWeight: 900 }}>
                    HCK <span style={{ color: arrowColor, fontSize: '28px', margin: '0 15px' }}>➔</span> GOA
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                    <span style={{ fontSize: '10px', color: labelColor, fontFamily: 'monospace', textTransform: 'uppercase' }}>Passenger</span>
                    <span style={{ fontSize: ogNameFontSize, fontWeight: 900, color: textColor, lineHeight: 1.2 }}>{ogName}</span>
                  </div>

                  <div style={{ display: 'flex', marginTop: '8px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: rolePillTextColor,
                        backgroundColor: rolePillBg,
                        border: rolePillBorder,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontFamily: 'monospace',
                      }}
                    >
                      {ogRoleText}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontStyle: 'italic',
                      color: isDark ? '#FEF08A' : '#78716C',
                      marginTop: '8px',
                      display: 'flex',
                    }}
                  >
                    {title}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '8px', maxWidth: '280px' }}>
                    {stackChips.map((chip, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '10px',
                          fontWeight: 'bold',
                          fontFamily: 'monospace',
                          color: isDark ? '#A7F3D0' : '#57534E',
                          backgroundColor: isDark ? 'rgba(4, 120, 87, 0.2)' : '#F5F5F4',
                          border: isDark ? '1px solid rgba(52, 211, 153, 0.25)' : '1px solid #E7E5E4',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          marginRight: '6px',
                          marginBottom: '4px',
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Photo Stamp */}
                {!isTeam ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '180px',
                      height: '180px',
                      backgroundColor: '#FFFFFF',
                      border: '2px dashed #D6D3D1',
                      padding: '6px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                      transform: 'rotate(2deg)',
                    }}
                  >
                    <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#F5F5F4' }}>
                      {photo ? (
                        <img
                          src={photo}
                          alt="avatar"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div style={{ color: '#A8A29E', fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace', margin: 'auto' }}>
                          [ PHOTO ]
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '220px', height: '180px' }}>
                    {/* Photo 1 (left) */}
                    <div
                      style={{
                        display: 'flex',
                        position: 'absolute',
                        left: '0px',
                        top: '25px',
                        width: '100px',
                        height: '100px',
                        backgroundColor: '#FFFFFF',
                        border: '1.5px dashed #D6D3D1',
                        padding: '3px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        transform: 'rotate(-6deg)',
                        zIndex: 10,
                      }}
                    >
                      <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#F5F5F4' }}>
                        {photo ? (
                          <img src={photo} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ color: '#A8A29E', fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace', margin: 'auto' }}>P1</div>
                        )}
                      </div>
                    </div>

                    {/* Photo 2 (middle) */}
                    {teammates.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          position: 'absolute',
                          left: '60px',
                          top: '15px',
                          width: '100px',
                          height: '100px',
                          backgroundColor: '#FFFFFF',
                          border: '1.5px dashed #D6D3D1',
                          padding: '3px',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                          transform: 'rotate(4deg)',
                          zIndex: 20,
                        }}
                      >
                        <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#F5F5F4' }}>
                          {teammates[0].photoUrl ? (
                            <img src={teammates[0].photoUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ color: '#A8A29E', fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace', margin: 'auto' }}>P2</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Photo 3 (right) */}
                    {teammates.length > 1 && (
                      <div
                        style={{
                          display: 'flex',
                          position: 'absolute',
                          left: '120px',
                          top: '30px',
                          width: '100px',
                          height: '100px',
                          backgroundColor: '#FFFFFF',
                          border: '1.5px dashed #D6D3D1',
                          padding: '3px',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                          transform: 'rotate(-2deg)',
                          zIndex: 30,
                        }}
                      >
                        <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#F5F5F4' }}>
                          {teammates[1].photoUrl ? (
                            <img src={teammates[1].photoUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ color: '#A8A29E', fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace', margin: 'auto' }}>P3</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Grid Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: dividerBorder,
                  paddingTop: '10px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: labelColor,
                }}
              >
                <div>FLIGHT: <span style={{ color: valueColor, fontWeight: 'bold' }}>HH2026</span></div>
                <div>SEAT: <span style={{ color: valueColor, fontWeight: 'bold' }}>24A</span></div>
                <div>GATE: <span style={{ color: '#F97316', fontWeight: 'bold' }}>08</span></div>
                <div>DATE: <span style={{ color: valueColor, fontWeight: 'bold' }}>28 OCT 2026</span></div>
              </div>

            </div>

            {/* STUB (28%) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '28%',
                height: '100%',
                justifyContent: 'space-between',
                paddingLeft: '30px',
                boxSizing: 'border-box',
                backgroundColor: stubBg,
                borderLeft: stubLeftBorder,
              }}
            >
              {/* Header */}
              <div style={{ borderBottom: dividerBorder, paddingBottom: '10px', textAlign: 'right' }}>
                <span style={{ color: labelColor, fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                  FLIGHT STUB
                </span>
              </div>

              {/* Stub info */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '9px', color: labelColor, fontFamily: 'monospace' }}>PASSENGER</span>
                  <span style={{ fontSize: ogStubNameFontSize, fontWeight: 900, color: textColor, lineHeight: 1.2 }}>{ogName}</span>
                </div>

                <div style={{ display: 'flex', marginTop: '10px', fontFamily: 'monospace', fontSize: '10px', color: labelColor }}>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                    <span>SEAT</span>
                    <span style={{ color: valueColor, fontWeight: 'bold', fontSize: '14px' }}>24A</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                    <span>CLASS</span>
                    <span style={{ color: valueColor, fontWeight: 'bold', fontSize: '14px' }}>VIP</span>
                  </div>
                </div>

                {/* Barcode lines */}
                <div style={{ display: 'flex', height: '40px', marginTop: '15px', opacity: 0.8 }}>
                  {barcodes.map((w, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: `${w * 1.5}px`,
                        height: '100%',
                        backgroundColor: barcodeColor,
                        marginRight: '2px',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Stub card number footer */}
              <div style={{ borderTop: dividerBorder, paddingTop: '10px', textAlign: 'right' }}>
                <span style={{ color: cardNumberColor, fontSize: '12px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {searchParams.get('cardNo') || 'HH26-BUILDER'}
                </span>
              </div>

            </div>

          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    // Parse stack chips
    const stackChips = stack
      .split(/[,/·•\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, 6);

    // Dynamic Theme selection (mirroring CARD_THEMES)
    let cardBg = '#052A1A';
    let bracketsColor = '#EC4899';
    let headerLogo = '#FACC15';

    if (theme === 'cyber-midnight') {
      cardBg = '#0B132B';
      bracketsColor = '#F43F5E';
      headerLogo = '#38BDF8';
    } else if (theme === 'solar-terracotta') {
      cardBg = '#1C0D07';
      bracketsColor = '#06B6D4';
      headerLogo = '#F97316';
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: cardBg,
            backgroundImage: `radial-gradient(circle at 80% 20%, rgba(250, 204, 21, 0.08), transparent 40%), linear-gradient(135deg, ${cardBg} 0%, #02160e 100%)`,
            border: '8px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0px',
            padding: '40px 50px',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {/* Inner Rounded Border */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '20px',
              border: '2px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              pointerEvents: 'none',
            }}
          />

          {/* LEFT COLUMN: Circular Seal & Profile Photo */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              width: '360px',
              height: '100%',
            }}
          >
            {/* Outer Circular Seal */}
            <div
              style={{
                width: '300px',
                height: '300px',
                borderRadius: '150px',
                backgroundColor: '#021f14',
                border: '10px solid #075336',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              }}
            >
              {/* Inner Circular Photo Container */}
              <div
                style={{
                  width: '220px',
                  height: '220px',
                  borderRadius: '110px',
                  border: '6px solid #FACC15',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'linear-gradient(to bottom right, #FACC15, #EC4899, #059669)',
                }}
              >
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo}
                    alt="avatar"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 'bold' }}>
                    [ PHOTO ]
                  </div>
                )}
              </div>
            </div>

            {/* Goa Stamp Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '80px',
                backgroundColor: '#DB2777',
                border: '3px solid #FDE047',
                borderRadius: '25px',
                padding: '6px 24px',
                transform: 'rotate(-4deg)',
                color: '#FDE047',
                fontSize: '28px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
              }}
            >
              गोवा
            </div>
          </div>

          {/* RIGHT COLUMN: Typography Details */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '690px',
              paddingLeft: '30px',
              boxSizing: 'border-box',
              justifyContent: 'center',
            }}
          >
            {/* Header Title */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontSize: '64px',
                  fontWeight: 900,
                  color: '#FACC15',
                  letterSpacing: '-1px',
                  lineHeight: 1,
                  fontFamily: 'serif',
                }}
              >
                HACKER HOUSE
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#A7F3D0',
                  marginTop: '6px',
                  letterSpacing: '1.5px',
                  fontFamily: 'monospace',
                }}
              >
                <span>GOA · OCT 28-31 2026</span>
              </div>
            </div>

            {/* Horizontal Line separator */}
            <div
              style={{
                height: '2px',
                backgroundColor: 'rgba(52, 211, 153, 0.3)',
                margin: '18px 0',
                width: '100%',
              }}
            />

            {/* Full Name */}
            <div
              style={{
                fontSize: '44px',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.1,
                letterSpacing: '-0.5px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {name.toUpperCase()}
            </div>

            {/* Role title */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '26px',
                fontWeight: 'bold',
                color: '#F472B6',
                marginTop: '6px',
                fontFamily: 'monospace',
              }}
            >
              <span style={{ color: '#34D399', marginRight: '6px' }}>»</span>
              <span>{role.toUpperCase()}</span>
            </div>

            {/* Tagline */}
            <div
              style={{
                fontSize: '22px',
                color: '#FEF08A',
                fontStyle: 'italic',
                marginTop: '10px',
                opacity: 0.95,
              }}
            >
              {title}
            </div>

            {/* Tech Stack Chips */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '8px',
                marginTop: '14px',
              }}
            >
              {stackChips.map((chip, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: 'rgba(255, 255, 255, 0.9)',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(52, 211, 153, 0.4)',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>

            {/* Footer motto */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'rgba(52, 211, 153, 0.8)',
                fontFamily: 'monospace',
              }}
            >
              <div style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#FACC15', marginRight: '6px' }}>✦</span>
                <span>CODE ON THE COAST • SHIP TO THE WORLD</span>
              </div>
              <div style={{ color: '#6EE7B7', marginTop: '2px' }}>hhgoa.com</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('OG generation failed:', e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
