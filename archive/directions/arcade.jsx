// Arcade / CRT direction — pixel chrome wrapping real covers, scanlines, neon
// Reflowed for 16:9 landscape covers (CRT screens are now landscape).

const arcW = 1280;

const arcStyles = {
  root: {
    width: arcW,
    background: '#0d0d18',
    color: '#e8e8f0',
    fontFamily: '"VT323", ui-monospace, "Courier New", monospace',
    overflow: 'hidden',
    position: 'relative',
  },
};

if (typeof document !== 'undefined' && !document.getElementById('arc-fonts')) {
  const l = document.createElement('link');
  l.id = 'arc-fonts';
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Caveat:wght@600;700&display=swap';
  document.head.appendChild(l);
}

const PIXEL = '"Press Start 2P", ui-monospace, monospace';

// ---- Pixel art primitives ----
function PixelArt({ pixels, palette, scale = 5 }) {
  const w = pixels[0].length, h = pixels.length;
  const shadows = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x === 0 && y === 0) continue; // (0,0) is the base div's own background
      const ch = pixels[y][x];
      if (ch !== '.' && ch !== ' ') {
        shadows.push(`${x * scale}px ${y * scale}px 0 ${palette[ch] || '#fff'}`);
      }
    }
  }
  const firstCh = pixels[0][0];
  const baseBg = (firstCh !== '.' && firstCh !== ' ')
    ? (palette[firstCh] || '#fff')
    : 'transparent';
  return (
    <div style={{ position: 'relative', width: w * scale, height: h * scale }}>
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: scale, height: scale,
        background: baseBg,
        boxShadow: shadows.join(', '),
      }} />
    </div>
  );
}

// Platinum trophy — pixel art, 14×16 grid
//   O = outline, D = deep shadow, M = mid platinum,
//   L = light platinum, H = bright highlight
const TROPHY_PIXELS = [
  '..OOOOOOOOOO..',
  '..OLLLLLLLLO..',
  '..OLHLLLLLLO..',
  '.OOM......MOO.',
  'OOMD......DMOO',
  'OMD........DMO',
  '.OOMD....DMOO.',
  '..OOM....MOO..',
  '..OMM....MMO..',
  '...OMMMMMMO...',
  '....OMMMMO....',
  '.....OMMO.....',
  '.....OMMO.....',
  '..OOMMMMMMOO..',
  '.OMLLLLLLLLMO.',
  '.OOOOOOOOOOOO.',
];
const TROPHY_PALETTE = {
  O: '#0a0a1a',
  D: '#4a6878',
  M: '#8aa8b8',
  L: '#d4e8f0',
  H: '#ffffff',
};
function PlatinumTrophy({ scale = 6 }) {
  return <PixelArt pixels={TROPHY_PIXELS} palette={TROPHY_PALETTE} scale={scale} />;
}

// ---- Platform icons ----
const PC_PIXELS = [
  'OOOOOOOOOOOO',
  'OMMMMMMMMMMO',
  'OMSSSSSSSSMO',
  'OMSCCCCCCSMO',
  'OMSCCCCCCSMO',
  'OMSCCCCCCSMO',
  'OMSSSSSSSSMO',
  'OMMMMMMMMMMO',
  'OOOOOOOOOOOO',
  '....OOOO....',
  '.OOOOOOOOOO.',
];
const PS5_PIXELS = [
  '.OOOOOOOOOO.',
  'OWWWWWWWWWWO',
  'OWWBBBBBBWWO',
  'OWWWWWWWWWWO',
  'OBBBBBBBBBBO',
  'OBBBBBBBBBBO',
  'OWWWWWWWWWWO',
  'OWWBBBBBBWWO',
  'OWWWWWWWWWWO',
  '.OOOOOOOOOO.',
];
const SWITCH_PIXELS = [
  'RROOOOOOOOOOBB',
  'ROSSSSSSSSSSOB',
  'ROSGGGGGGGGSOB',
  'ROSGGGGGGGGSOB',
  'ROSGGGGGGGGSOB',
  'ROSGGGGGGGGSOB',
  'ROSGGGGGGGGSOB',
  'ROSSSSSSSSSSOB',
  'RROOOOOOOOOOBB',
];
const PLATFORM_DEFS = {
  pc:     { pixels: PC_PIXELS,     palette: { O: '#0a0a1a', M: '#5a6878', S: '#1a2030', C: '#3dc8ff' }, label: 'PC' },
  ps5:    { pixels: PS5_PIXELS,    palette: { O: '#0a0a1a', W: '#f0f0f0', B: '#1a1a1a' },                label: 'PS5' },
  switch: { pixels: SWITCH_PIXELS, palette: { O: '#0a0a1a', R: '#e60012', B: '#00aeef', S: '#2a2a2a', G: '#3dc8ff' }, label: 'SWITCH 2' },
};
function PlatformIcon({ platform = 'pc', scale = 2, screenColor }) {
  const def = PLATFORM_DEFS[platform] || PLATFORM_DEFS.pc;
  const palette = screenColor && (platform === 'pc' || platform === 'switch')
    ? { ...def.palette, [platform === 'pc' ? 'C' : 'G']: screenColor }
    : def.palette;
  return <PixelArt pixels={def.pixels} palette={palette} scale={scale} />;
}

function Scanlines({ opacity = 0.18 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
      background: `repeating-linear-gradient(0deg, rgba(0,0,0,${opacity}) 0 1px, transparent 1px 3px)`,
      mixBlendMode: 'multiply',
    }} />
  );
}

function PxButton({ children, primary, accent }) {
  return (
    <button style={{
      background: primary ? accent : '#1a1a2e',
      color: primary ? '#0d0d18' : '#e8e8f0',
      border: `3px solid ${primary ? accent : '#e8e8f0'}`,
      padding: '12px 20px', fontFamily: PIXEL, fontSize: 10,
      letterSpacing: '0.05em', cursor: 'pointer',
      boxShadow: `4px 4px 0 ${primary ? '#5a1a2a' : '#000'}`,
      textTransform: 'uppercase',
    }}>{children}</button>
  );
}

// CRT cover — landscape (16:9) screen inside a pixel chrome bezel
function CRTCover({ g, accent, neon, sticky = '#ffd23e' }) {
  return (
    <div style={{
      background: '#1a1a2e',
      padding: '10px 10px 6px',
      border: `3px solid #2a2a44`,
      boxShadow: `inset 0 0 0 2px #0d0d18, 4px 4px 0 #000`,
      position: 'relative',
    }}>
      {/* top strip — bezel labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontFamily: PIXEL, fontSize: 6, color: neon, letterSpacing: '0.1em' }}>● {g.year}</div>
      </div>

      {/* CRT screen — 16:9 landscape */}
      <div style={{
        background: '#000', position: 'relative', overflow: 'hidden',
        aspectRatio: '16 / 9', width: '100%',
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)',
      }}>
        {g.img ? (
          <img src={g.img} alt={g.title} style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            filter: 'saturate(1.15) contrast(1.05)',
          }} />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: PIXEL, fontSize: 8, color: neon, textAlign: 'center', padding: 10,
            background: '#0a0a1a',
          }}>{g.title.toUpperCase()}</div>
        )}
        {/* CRT effects */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 3px)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)`,
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '60%', height: '40%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        {g.goty && (
          <div style={{
            position: 'absolute', bottom: 8, right: 8,
            background: accent, color: '#0d0d18',
            fontFamily: PIXEL, fontSize: 6, padding: '3px 5px',
            boxShadow: `2px 2px 0 #000`,
          }}>★ GOTY</div>
        )}
        {g.platinum && (
          <div style={{
            position: 'absolute', bottom: 6, left: 6,
            padding: '4px 5px 2px',
            background: '#0a0a1a',
            border: `2px solid ${neon}`,
            boxShadow: `2px 2px 0 #000, 0 0 10px ${neon}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} title="PLATINUM">
            <PlatinumTrophy scale={2} />
          </div>
        )}
      </div>

      {/* personal sticky note overlay */}
      {g.personalNote && (
        <div style={{
          position: 'absolute',
          top: -10, right: -10,
          transform: 'rotate(4deg)',
          background: sticky,
          color: '#1a1a1a',
          padding: '7px 10px',
          maxWidth: 130,
          fontFamily: '"Caveat", "Comic Sans MS", cursive',
          fontSize: 13, lineHeight: 1.25, fontWeight: 700,
          boxShadow: '3px 3px 0 rgba(0,0,0,0.7)',
          whiteSpace: 'pre-line',
          zIndex: 5,
        }}>{g.personalNote}</div>
      )}

      {/* title plate */}
      <div style={{
        marginTop: 8,
        fontFamily: PIXEL, fontSize: 7, lineHeight: 1.5,
        color: '#e8e8f0', letterSpacing: '0.02em',
        minHeight: 22,
      }}>{g.title}</div>

      {/* knobs */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 6, padding: '4px 0 0', borderTop: '2px solid #2a2a44',
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3a3a55', boxShadow: 'inset 1px 1px 0 #0d0d18' }} />
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3a3a55', boxShadow: 'inset 1px 1px 0 #0d0d18' }} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3a3a55', boxShadow: 'inset 1px 1px 0 #0d0d18' }} />
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3a3a55', boxShadow: 'inset 1px 1px 0 #0d0d18' }} />
        </div>
      </div>
    </div>
  );
}

function ArcPlayerProfile({ accent, neon, name = 'JOHNNY', tagline = 'Souls connoisseur · open-world tourist · co-op believer', platinum = 7 }) {
  // Pixel avatar — built from CSS box-shadow grid
  const pixelArt = (
    <div style={{ position: 'relative', width: 88, height: 88, imageRendering: 'pixelated' }}>
      {/* simple character sprite: hood + face */}
      <div style={{
        position: 'absolute', inset: 0,
        // base background of "screen"
        background: '#0a0a1a',
      }} />
      {/* hat/hood */}
      <div style={{ position: 'absolute', top: 8, left: 16, width: 56, height: 16, background: '#5a3a8a' }} />
      <div style={{ position: 'absolute', top: 16, left: 8, width: 72, height: 16, background: '#5a3a8a' }} />
      {/* face */}
      <div style={{ position: 'absolute', top: 28, left: 16, width: 56, height: 32, background: '#f4c290' }} />
      {/* eyes */}
      <div style={{ position: 'absolute', top: 36, left: 28, width: 8, height: 8, background: '#1a1a2e' }} />
      <div style={{ position: 'absolute', top: 36, left: 52, width: 8, height: 8, background: '#1a1a2e' }} />
      {/* mouth */}
      <div style={{ position: 'absolute', top: 50, left: 36, width: 16, height: 4, background: '#1a1a2e' }} />
      {/* shoulders */}
      <div style={{ position: 'absolute', top: 60, left: 8, width: 72, height: 20, background: accent }} />
      <div style={{ position: 'absolute', top: 60, left: 20, width: 48, height: 12, background: '#1a1a2e' }} />
    </div>
  );

  return (
    <div style={{
      position: 'relative',
      padding: '20px 40px',
      background: '#1a1a2e',
      borderBottom: `3px solid ${accent}`,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto auto',
      gap: 28,
      alignItems: 'center',
    }}>
      {/* avatar card */}
      <div style={{
        position: 'relative',
        background: '#000',
        padding: 6,
        border: `2px solid ${neon}`,
        boxShadow: `3px 3px 0 #000, 0 0 12px ${neon}50`,
      }}>
        {pixelArt}
        <div style={{
          position: 'absolute', top: -10, left: -10,
          fontFamily: PIXEL, fontSize: 7, color: '#0d0d18',
          background: neon, padding: '3px 5px', boxShadow: '2px 2px 0 #000',
        }}>P1</div>
      </div>

      {/* name + tagline + stats */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 10 }}>
          <div style={{
            fontFamily: PIXEL, fontSize: 26, color: '#e8e8f0',
            letterSpacing: '0.06em',
            textShadow: `3px 3px 0 ${accent}`,
          }}>{name}</div>
          <div style={{ fontFamily: PIXEL, fontSize: 8, color: neon, letterSpacing: '0.15em' }}>
            LV.{new Date().getFullYear() - 2002}
          </div>
          <div style={{ fontFamily: PIXEL, fontSize: 8, color: 'rgba(232,232,240,0.5)', letterSpacing: '0.15em' }}>
            · GAMING SINCE 2002
          </div>
        </div>
        <div style={{
          fontFamily: 'VT323, monospace', fontSize: 18, color: 'rgba(232,232,240,0.7)',
          letterSpacing: '0.02em', marginBottom: 12,
        }}>{tagline}</div>
        {/* HUD-style stat bar */}
        <div style={{ display: 'flex', gap: 18, fontFamily: PIXEL, fontSize: 8, letterSpacing: '0.1em' }}>
          <span><span style={{ color: 'rgba(232,232,240,0.4)' }}>TITLES</span> <span style={{ color: neon }}>{STATS.total}</span></span>
          <span><span style={{ color: 'rgba(232,232,240,0.4)' }}>GOTYs</span> <span style={{ color: neon }}>{STATS.goty}</span></span>
          <span><span style={{ color: 'rgba(232,232,240,0.4)' }}>SOULS W</span> <span style={{ color: neon }}>{GAMES.filter(g=>g.tag==='soulslike').length}</span></span>
          <span><span style={{ color: 'rgba(232,232,240,0.4)' }}>SPAN</span> <span style={{ color: neon }}>{STATS.latest - STATS.earliest}Y</span></span>
        </div>
        {/* platforms */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, marginTop: 14,
          fontFamily: PIXEL, fontSize: 8, letterSpacing: '0.15em',
        }}>
          <span style={{ color: 'rgba(232,232,240,0.4)' }}>PLATFORMS</span>
          {['pc', 'ps5', 'switch'].map(p => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <PlatformIcon platform={p} scale={2} screenColor={neon} />
              <span style={{ color: 'rgba(232,232,240,0.7)' }}>{PLATFORM_DEFS[p].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* platinum trophy case */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px', background: '#0a0a1a',
        border: `2px solid ${neon}`,
        boxShadow: `3px 3px 0 #000, 0 0 12px ${neon}33`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 30% 50%, ${neon}1f 0%, transparent 70%)`,
        }} />
        <div style={{ position: 'relative' }}>
          <PlatinumTrophy scale={3} />
        </div>
        <div style={{ textAlign: 'right', lineHeight: 1, position: 'relative' }}>
          <div style={{
            fontFamily: PIXEL, fontSize: 22, color: '#e8e8f0',
            letterSpacing: '0.04em',
            textShadow: `2px 2px 0 ${accent}`,
          }}>{platinum}</div>
          <div style={{
            fontFamily: PIXEL, fontSize: 6, color: '#d4e8f0',
            letterSpacing: '0.18em', marginTop: 8,
          }}>PLATINUM</div>
        </div>
      </div>

      {/* save file info */}
      <div style={{
        textAlign: 'right', fontFamily: PIXEL, fontSize: 8,
        color: 'rgba(232,232,240,0.5)', letterSpacing: '0.12em', lineHeight: 2,
      }}>
        <div style={{ color: accent }}>● SAVE LOADED</div>
        <div>JOHNNY.SAV</div>
        <div style={{ color: 'rgba(232,232,240,0.35)' }}>LAST: TODAY</div>
      </div>
    </div>
  );
}

function ArcDiary({ accent, neon, entries }) {
  return (
    <div style={{ padding: '40px 40px 0' }}>
      <div style={{
        background: '#1a1a2e',
        border: `3px solid ${accent}`,
        boxShadow: '6px 6px 0 #000',
        position: 'relative',
      }}>
        {/* header bar */}
        <div style={{
          background: accent, color: '#0d0d18',
          padding: '8px 14px',
          fontFamily: PIXEL, fontSize: 10, letterSpacing: '0.15em',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>► STORY MODE · HOW IT STARTED</span>
          <span style={{ fontSize: 8 }}>CH.01</span>
        </div>

        {/* diary body */}
        <div style={{ padding: '24px 28px' }}>
          {entries.map((e, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '90px 1fr',
              gap: 24, alignItems: 'baseline',
              padding: '14px 0',
              borderBottom: i < entries.length - 1 ? '2px dashed rgba(232,232,240,0.15)' : 'none',
            }}>
              <div style={{
                fontFamily: PIXEL, fontSize: 14, color: neon, letterSpacing: '0.05em',
              }}>{e.year}</div>
              <div>
                <div style={{
                  fontFamily: PIXEL, fontSize: 9, color: accent,
                  letterSpacing: '0.15em', marginBottom: 8, textTransform: 'uppercase',
                }}>{e.title}</div>
                <div style={{
                  fontFamily: 'VT323, monospace', fontSize: 20,
                  lineHeight: 1.45, color: 'rgba(232,232,240,0.9)',
                  maxWidth: 900,
                }}>{e.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArcTopBar({ accent, neon }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '22px 40px', borderBottom: `3px solid ${accent}`,
      background: '#0d0d18',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 14, height: 14, background: accent,
          boxShadow: `0 0 12px ${accent}`,
        }} />
        <span style={{ fontFamily: PIXEL, fontSize: 14, letterSpacing: '0.05em' }}>
          JOHNNY'S<span style={{ color: accent }}>.</span>LIBRARY
        </span>
      </div>
      <div style={{ display: 'flex', gap: 22, fontFamily: PIXEL, fontSize: 9, letterSpacing: '0.1em' }}>
        <span style={{ color: neon }}>► LIBRARY</span>
        <span style={{ color: 'rgba(232,232,240,0.5)' }}>TIMELINE</span>
        <span style={{ color: 'rgba(232,232,240,0.5)' }}>GOTY</span>
        <span style={{ color: 'rgba(232,232,240,0.5)' }}>INFO</span>
      </div>
      <div style={{ fontFamily: PIXEL, fontSize: 8, color: accent, letterSpacing: '0.1em' }}>
        ▼ {STATS.total} TITLES
      </div>
    </div>
  );
}

// ---- Cover screen (shared 16:9 CRT-style screen with cover art) ----
function CoverScreen({ g, neon }) {
  return (
    <div style={{
      background: '#000', aspectRatio: '16 / 9', position: 'relative', overflow: 'hidden',
      boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9)', width: '100%',
    }}>
      {g.img ? (
        <img src={g.img} alt={g.title} style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          filter: 'saturate(1.15) contrast(1.05)',
        }} />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: PIXEL, fontSize: 16, color: neon, textAlign: 'center', padding: 20,
          background: 'radial-gradient(ellipse at center, #2a1a3e 0%, #000 100%)',
        }}>{g.title.toUpperCase()}</div>
      )}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0 1px, transparent 1px 3px)` }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)` }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        boxShadow: `inset 0 0 60px ${neon}40` }} />
    </div>
  );
}

// ---- PC Monitor display ----
function PCMonitor({ g, accent, neon, idx }) {
  return (
    <div style={{ width: 460 }}>
      <div style={{
        background: '#1a1a2e', padding: '10px 14px 6px',
        border: '4px solid #2a2a44',
        boxShadow: `6px 6px 0 #000, inset 0 0 0 2px #0d0d18`,
        position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: PIXEL, fontSize: 7, color: neon }}>● MONITOR</span>
          <span style={{ fontFamily: PIXEL, fontSize: 7, color: accent }}>DISPLAY-{String(idx+1).padStart(2,'0')}</span>
        </div>
        <CoverScreen g={g} neon={neon} />
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3a3a55', boxShadow: 'inset 1px 1px 0 #0d0d18' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: accent, boxShadow: `inset 1px 1px 0 #0d0d18, 0 0 6px ${accent}` }} />
          </div>
          <div style={{ fontFamily: PIXEL, fontSize: 6, color: 'rgba(232,232,240,0.4)' }}>{g.id.toUpperCase().replace(/-/g,'_')}</div>
        </div>
      </div>
      {/* compact stand */}
      <div style={{
        width: 60, height: 12, margin: '0 auto',
        background: '#1a1a2e', border: '4px solid #2a2a44', borderTop: 'none',
      }} />
      <div style={{
        width: 160, height: 8, margin: '0 auto',
        background: '#1a1a2e', border: '4px solid #2a2a44',
        boxShadow: '6px 6px 0 #000',
      }} />
    </div>
  );
}

// ---- PS5 + TV display ----
function PS5TVDisplay({ g, accent, neon, idx }) {
  return (
    <div style={{ width: 460 }}>
      {/* TV */}
      <div style={{
        background: '#1a1a2e', padding: '10px 14px 6px',
        border: '4px solid #2a2a44',
        boxShadow: `6px 6px 0 #000, inset 0 0 0 2px #0d0d18`,
        position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: PIXEL, fontSize: 7, color: neon }}>● TV</span>
          <span style={{ fontFamily: PIXEL, fontSize: 7, color: accent }}>HDMI-{String(idx+1).padStart(2,'0')}</span>
        </div>
        <CoverScreen g={g} neon={neon} />
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: PIXEL, fontSize: 6, color: 'rgba(232,232,240,0.4)' }}>4K-OLED</div>
          <div style={{ display: 'flex', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3a3a55', boxShadow: 'inset 1px 1px 0 #0d0d18' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: accent, boxShadow: `inset 1px 1px 0 #0d0d18, 0 0 6px ${accent}` }} />
          </div>
        </div>
      </div>
      {/* TV stand */}
      <div style={{
        width: 140, height: 8, margin: '0 auto',
        background: '#1a1a2e', border: '4px solid #2a2a44', borderTop: 'none',
      }} />

      {/* HDMI cable */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 60 }}>
        <div style={{ width: 4, height: 12, background: '#2a2a44' }} />
      </div>

      {/* PS5 console (compact horizontal slab) */}
      <div style={{
        width: 220, marginLeft: 'auto', marginRight: 30,
        background: '#0d0d18',
        border: '3px solid #2a2a44',
        boxShadow: '5px 5px 0 #000',
        padding: 3,
        position: 'relative',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 50px 1fr',
          height: 24, alignItems: 'stretch',
        }}>
          <div style={{ background: '#f0f0f0' }} />
          <div style={{ background: '#1a1a1a', position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: PIXEL, fontSize: 6, color: neon, letterSpacing: '0.15em',
            }}>PS5</div>
          </div>
          <div style={{ background: '#f0f0f0' }} />
        </div>
        {/* power LED */}
        <div style={{
          position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
          width: 3, height: 3, background: accent, boxShadow: `0 0 5px ${accent}`,
        }} />
      </div>
    </div>
  );
}

// ---- Switch 2 handheld display ----
function SwitchHandheld({ g, accent, neon, idx }) {
  const dot = { width: 10, height: 10, borderRadius: '50%', background: '#0a0a1a', boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.15)' };
  return (
    <div style={{ width: 540, position: 'relative' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '70px 1fr 70px',
        boxShadow: '6px 6px 0 #000',
        borderRadius: 22,
      }}>
        {/* left joycon (red) */}
        <div style={{
          background: '#e60012',
          border: '4px solid #0a0a1a',
          borderRight: 'none',
          borderTopLeftRadius: 22, borderBottomLeftRadius: 22,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 0',
          position: 'relative',
        }}>
          {/* analog stick */}
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: '#1a1a1a', border: '2px solid #0a0a1a',
            boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.1)',
          }} />
          {/* dpad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 10px)', gap: 2 }}>
            <div /><div style={dot} /><div />
            <div style={dot} /><div /><div style={dot} />
            <div /><div style={dot} /><div />
          </div>
          {/* minus button */}
          <div style={{
            width: 14, height: 3, background: '#0a0a1a',
            position: 'absolute', top: 8, right: 10,
          }} />
        </div>

        {/* screen middle */}
        <div style={{
          background: '#1a1a2e',
          borderTop: '4px solid #0a0a1a',
          borderBottom: '4px solid #0a0a1a',
          padding: '14px 10px 8px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: PIXEL, fontSize: 8, color: neon }}>● HANDHELD</span>
            <span style={{ fontFamily: PIXEL, fontSize: 8, color: accent }}>SLOT-{String(idx+1).padStart(2,'0')}</span>
          </div>
          <CoverScreen g={g} neon={neon} />
          <div style={{
            marginTop: 8, fontFamily: PIXEL, fontSize: 6, color: 'rgba(232,232,240,0.4)',
            textAlign: 'center', letterSpacing: '0.2em',
          }}>NINTENDO SWITCH 2</div>
        </div>

        {/* right joycon (blue) */}
        <div style={{
          background: '#00aeef',
          border: '4px solid #0a0a1a',
          borderLeft: 'none',
          borderTopRightRadius: 22, borderBottomRightRadius: 22,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 0',
          position: 'relative',
        }}>
          {/* A B X Y buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 10px)', gap: 2 }}>
            <div /><div style={dot} /><div />
            <div style={dot} /><div /><div style={dot} />
            <div /><div style={dot} /><div />
          </div>
          {/* analog stick */}
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: '#1a1a1a', border: '2px solid #0a0a1a',
            boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.1)',
          }} />
          {/* plus button */}
          <div style={{
            position: 'absolute', top: 8, left: 10,
            width: 14, height: 3, background: '#0a0a1a',
          }} />
          <div style={{
            position: 'absolute', top: 3, left: 15,
            width: 3, height: 13, background: '#0a0a1a',
          }} />
        </div>
      </div>
    </div>
  );
}

// ---- Platform dispatcher ----
function PlatformDisplay({ platform, g, accent, neon, idx }) {
  const chrome =
    platform === 'ps5'    ? <PS5TVDisplay   g={g} accent={accent} neon={neon} idx={idx} /> :
    platform === 'switch' ? <SwitchHandheld g={g} accent={accent} neon={neon} idx={idx} /> :
                            <PCMonitor     g={g} accent={accent} neon={neon} idx={idx} />;
  // Fixed-height frame so the layout stays stable across chromes
  return (
    <div style={{
      width: 540, height: 340,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {chrome}
    </div>
  );
}

function ArcHero({ accent, neon, tagColor, tagBg, tagFont }) {
  const NOW_PLAYING = [
    { id: 'brotato',  platform: 'pc',     blurb: 'A sentient potato fights waves of aliens. 20-minute runs, absurd builds, the most addictive loop I’ve found this year.' },
    { id: 'nfs-heat', platform: 'ps5',    blurb: 'Night street races, daytime cop pursuits. Pure arcade speed.' },
    { id: 'diablo-4', platform: 'switch', blurb: 'Back in Sanctuary for the seasonal grind. Demons, loot, repeat.' },
  ];
  const [idx, setIdx] = React.useState(0);
  const entry = NOW_PLAYING[idx];
  const g = GAMES_BY_ID[entry.id] || { title: entry.id.toUpperCase(), year: '----', tag: '' };
  const next = () => setIdx((i) => (i + 1) % NOW_PLAYING.length);
  const prev = () => setIdx((i) => (i - 1 + NOW_PLAYING.length) % NOW_PLAYING.length);

  // Arrow button — pixel chrome
  const Arrow = ({ dir, onClick }) => (
    <button onClick={onClick} aria-label={dir === 'prev' ? 'Previous' : 'Next'} style={{
      background: '#1a1a2e', color: '#e8e8f0',
      border: `3px solid ${accent}`,
      padding: '12px 14px', fontFamily: PIXEL, fontSize: 14,
      cursor: 'pointer', boxShadow: `4px 4px 0 #000`,
      lineHeight: 1,
    }}>{dir === 'prev' ? '◀' : '▶'}</button>
  );

  return (
    <div style={{
      position: 'relative',
      padding: '50px 40px',
      background: 'linear-gradient(180deg, #1a0a2e 0%, #0d0d18 100%)',
      borderBottom: '3px solid #2a2a44',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.15,
        backgroundImage: `linear-gradient(${neon}40 1px, transparent 1px), linear-gradient(90deg, ${neon}40 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'linear-gradient(180deg, transparent 0%, black 30%, black 60%, transparent 100%)',
      }} />

      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 540px', gap: 50, alignItems: 'center' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22,
          }}>
            <div style={{
              fontFamily: PIXEL, fontSize: 9,
              color: neon, padding: '8px 14px', border: `2px solid ${neon}`,
              background: `${neon}11`, letterSpacing: '0.15em',
            }}>► NOW PLAYING</div>
            <div style={{
              fontFamily: PIXEL, fontSize: 8, color: 'rgba(232,232,240,0.5)',
              letterSpacing: '0.15em',
            }}>{String(idx + 1).padStart(2,'0')} / {String(NOW_PLAYING.length).padStart(2,'0')}</div>
          </div>
          <h1 style={{
            fontFamily: PIXEL, fontSize: 40, lineHeight: 1.15, margin: '0 0 24px 0',
            letterSpacing: '0.02em',
            textShadow: `4px 4px 0 ${accent}, 8px 8px 0 #000`,
          }}>{g.title.toUpperCase()}</h1>
          <div style={{ fontSize: 22, lineHeight: 1.4, color: 'rgba(232,232,240,0.85)', maxWidth: 540, marginBottom: 32 }}>
            {entry.blurb}
          </div>

          {/* badges — ghost / dashed style, equal width */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {(() => {
              const border = tagColor || accent;
              const fg = tagFont || border;
              const bg = tagBg || `${border}22`;
              const chip = {
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '0 12px',
                height: 30, minWidth: 160,
                background: bg, color: fg,
                border: `2px dashed ${border}`,
                fontFamily: PIXEL, fontSize: 9, letterSpacing: '0.15em',
                boxSizing: 'border-box',
              };
              return (
                <React.Fragment>
                  <div style={chip}>
                    <PlatformIcon platform={entry.platform} scale={2} />
                    <span>{PLATFORM_DEFS[entry.platform].label}</span>
                  </div>
                  <div style={chip}>
                    <span>◆</span>
                    <span>{(g.tag || '').toUpperCase()}</span>
                  </div>
                  <div style={chip}>
                    <span>{g.year}</span>
                  </div>
                </React.Fragment>
              );
            })()}
          </div>
        </div>

        {/* Platform-specific display chrome */}
        <PlatformDisplay platform={entry.platform} g={g} accent={accent} neon={neon} idx={idx} />
      </div>

      {/* carousel nav — bottom center */}
      <div style={{
        position: 'relative', marginTop: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <Arrow dir="prev" onClick={prev} />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {NOW_PLAYING.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Go to ${i+1}`} style={{
              width: 12, height: 12, padding: 0, cursor: 'pointer',
              background: i === idx ? accent : '#3a3a55',
              border: `2px solid ${i === idx ? accent : '#3a3a55'}`,
              boxShadow: i === idx ? `0 0 8px ${accent}` : 'inset 2px 2px 0 #0d0d18',
            }} />
          ))}
        </div>
        <Arrow dir="next" onClick={next} />
      </div>
    </div>
  );
}

function ArcSectionHead({ kicker, title, accent }) {
  return (
    <div style={{ padding: '50px 40px 24px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14,
      }}>
        <div style={{ width: 12, height: 12, background: accent }} />
        <div style={{ fontFamily: PIXEL, fontSize: 8, color: accent, letterSpacing: '0.2em' }}>{kicker}</div>
        <div style={{ flex: 1, height: 2, background: `repeating-linear-gradient(90deg, ${accent} 0 8px, transparent 8px 14px)` }} />
      </div>
      <h2 style={{ fontFamily: PIXEL, fontSize: 22, margin: 0, letterSpacing: '0.04em' }}>{title}</h2>
    </div>
  );
}

function ArcGOTY({ accent, neon, sticky }) {
  const featured = [
    { year: 'ALL-TIME', game: GAMES_BY_ID['gta-5'] },
    { year: '2022',     game: GAMES_BY_ID['elden-ring'] },
    { year: '2024',     game: GAMES_BY_ID['wukong'] },
  ];
  return (
    <div>
      <ArcSectionHead kicker="HIGH SCORES" title="GAMES OF THE YEAR" accent={accent} />

      {/* 3 large featured CRT cards */}
      <div style={{ padding: '0 40px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 36 }}>
        {featured.map(f => (
          <div key={f.year} style={{ position: 'relative', paddingTop: 14 }}>
            <div style={{
              position: 'absolute', top: 0, left: 14, zIndex: 5,
              fontFamily: PIXEL, fontSize: 9, color: '#0d0d18',
              background: accent, padding: '4px 8px',
              boxShadow: '3px 3px 0 #000',
            }}>★ {f.year}</div>
            <CRTCover g={f.game} accent={accent} neon={neon} sticky={sticky} />
          </div>
        ))}
      </div>

      {/* Full roll — 4 across landscape */}
      <div style={{ padding: '0 40px' }}>
        <div style={{ fontFamily: PIXEL, fontSize: 8, color: 'rgba(232,232,240,0.5)', letterSpacing: '0.15em', marginBottom: 14 }}>
          ► FULL ROLL · {GOTYS.reduce((a,y)=>a+y.games.length,0)} ENTRIES
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {GOTYS.flatMap(y => y.games.map(id => ({ year: y.year, g: GAMES_BY_ID[id] }))).slice(0, 12).map((row, i) => (
            <CRTCover key={i} g={row.g} accent={accent} neon={neon} sticky={sticky} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ArcTimeline({ accent, neon, sticky }) {
  const sorted = GAMES.slice().sort((a,b)=>a.year-b.year);
  return (
    <div>
      <ArcSectionHead kicker="CHRONOLOGY" title="TIMELINE" accent={accent} />
      <div style={{ padding: '0 40px' }}>
        <div style={{ position: 'relative', height: 32, marginBottom: 20 }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 14,
            height: 4, background: `repeating-linear-gradient(90deg, ${accent} 0 6px, transparent 6px 12px)`,
          }} />
          {[1987, 1995, 2005, 2015, 2025].map((y, i) => (
            <div key={y} style={{
              position: 'absolute', left: `${(i / 4) * 100}%`, transform: 'translateX(-50%)',
              top: 0, fontFamily: PIXEL, fontSize: 9, color: neon,
            }}>
              ◆<div style={{ marginTop: 4, fontSize: 8 }}>{y}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {sorted.slice(0, 8).map(g => (
            <CRTCover key={g.id} g={g} accent={accent} neon={neon} sticky={sticky} />
          ))}
        </div>
        <div style={{ fontFamily: PIXEL, fontSize: 8, color: 'rgba(232,232,240,0.4)', marginTop: 20, letterSpacing: '0.15em', textAlign: 'center' }}>
          ↓ {STATS.earliest} ──── {STATS.latest} · {STATS.total} TITLES TOTAL ↓
        </div>
      </div>
    </div>
  );
}

function ArcLibrary({ era, kicker, title, accent, neon, sticky }) {
  const games = GAMES.filter(g => g.era === era).slice(0, 12);
  return (
    <div>
      <ArcSectionHead kicker={kicker} title={title} accent={accent} />
      <div style={{ padding: '0 40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {games.map(g => <CRTCover key={g.id} g={g} accent={accent} neon={neon} sticky={sticky} />)}
      </div>
    </div>
  );
}

function ArcFooter({ accent, neon }) {
  return (
    <div style={{
      marginTop: 60, padding: '50px 40px',
      borderTop: `3px solid ${accent}`,
      background: '#1a1a2e',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: PIXEL, fontSize: 36, color: neon, letterSpacing: '0.04em', marginBottom: 8 }}>
            ★ {STATS.total} ★
          </div>
          <div style={{ fontFamily: PIXEL, fontSize: 9, color: 'rgba(232,232,240,0.6)', letterSpacing: '0.15em' }}>
            TITLES UNLOCKED · {STATS.earliest}—{STATS.latest}
          </div>
        </div>
        <div style={{ fontFamily: PIXEL, fontSize: 8, color: 'rgba(232,232,240,0.5)', textAlign: 'right', letterSpacing: '0.1em', lineHeight: 1.8 }}>
          ✉ JOHNNYMU0809@GMAIL.COM<br/>
          ▣ LINKEDIN.COM/IN/ZICHENG-MU
        </div>
      </div>
      <div style={{
        marginTop: 40, fontFamily: PIXEL, fontSize: 8,
        color: 'rgba(232,232,240,0.3)', textAlign: 'center', letterSpacing: '0.2em',
      }}>
        — INSERT COIN TO CONTINUE —
      </div>
    </div>
  );
}

function Arcade({ accent = '#ff3e6c', neon = '#7ee787', playerName = 'JOHNNY', tagline = 'Souls connoisseur · open-world tourist · co-op believer', platinum = 7, sticky = '#ffd23e', tagColor, tagBg, tagFont, diaryEntries }) {
  const defaultDiary = [
    { year: 2002, title: 'The First Hit', body: 'A second-hand PC. A bootleg disc of Vice City. I was supposed to do homework. Instead I drove around Ocean Drive with the radio on, and I never really came back.' },
    { year: 2011, title: 'The Dark Souls Year', body: 'Heard people complaining about a game that was too hard. Bought it out of spite. Spent six months getting humbled. Came out the other side a different player.' },
    { year: 2022, title: 'The Open World', body: 'Elden Ring landed in March and ate that year. 200+ hours, three characters, every boss. Still my GOAT.' },
    { year: 2026, title: 'Right Now', body: 'Brotato on the commute. 20-minute runs. A sentient potato. Somehow this is the best loop I\'ve found in years.' },
  ];
  return (
    <div style={arcStyles.root}>
      <ArcTopBar accent={accent} neon={neon} />
      <ArcPlayerProfile accent={accent} neon={neon} name={playerName} tagline={tagline} platinum={platinum} />
      <ArcHero accent={accent} neon={neon} tagColor={tagColor} tagBg={tagBg} tagFont={tagFont} />
      <ArcGOTY accent={accent} neon={neon} sticky={sticky} />
      <ArcTimeline accent={accent} neon={neon} sticky={sticky} />
      <ArcLibrary era="childhood" kicker="ERA 01" title="CHILDHOOD & TEENAGE" accent={accent} neon={neon} sticky={sticky} />
      <ArcLibrary era="uni" kicker="ERA 02" title="UNIVERSITY → NOW" accent={accent} neon={neon} sticky={sticky} />
      <ArcFooter accent={accent} neon={neon} />
      <Scanlines opacity={0.12} />
    </div>
  );
}

window.Arcade = Arcade;
