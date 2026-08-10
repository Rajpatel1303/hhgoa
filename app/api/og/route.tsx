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
