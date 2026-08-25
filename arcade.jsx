// arcade.jsx — Arcade / CRT direction
// Pixel chrome wrapping real covers, scanlines, neon.
// All special characters use clean Unicode (no mojibake).

const PALETTES = [
  { label: "PINK", colors: ["#ff2e88", "#00e5ff", "#fff066"] },
  { label: "ORANGE", colors: ["#ff7e3e", "#3dc8ff", "#ffd23e"] },
  { label: "LIME", colors: ["#a3e635", "#ff6ec7", "#fef08a"] },
  { label: "AMBER", colors: ["#f7b801", "#ee4266", "#06a77d"] },
];

const arcStyles = {
  root: {
    width: "100%",
    minHeight: "100vh",
    boxSizing: "border-box",
    background: "#0d0d18",
    color: "#e8e8f0",
    fontFamily: '"VT323", ui-monospace, "Courier New", monospace',
    overflow: "hidden",
    position: "relative",
  },
};

if (typeof document !== "undefined" && !document.getElementById("arc-fonts")) {
  const l = document.createElement("link");
  l.id = "arc-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Caveat:wght@600;700&display=swap";
  document.head.appendChild(l);
}

const PIXEL = '"Press Start 2P", ui-monospace, monospace';

// ---- Pixel art primitives ----
function PixelArt({ pixels, palette, scale = 5 }) {
  const w = pixels[0].length,
    h = pixels.length;
  const shadows = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x === 0 && y === 0) continue;
      const ch = pixels[y][x];
      if (ch !== "." && ch !== " ") {
        shadows.push(`${x * scale}px ${y * scale}px 0 ${palette[ch] || "#fff"}`);
      }
    }
  }
  const firstCh = pixels[0][0];
  const baseBg =
    firstCh !== "." && firstCh !== " " ? palette[firstCh] || "#fff" : "transparent";
  return (
    <div style={{ position: "relative", width: w * scale, height: h * scale }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: scale,
          height: scale,
          background: baseBg,
          boxShadow: shadows.join(", "),
        }}
      />
    </div>
  );
}

const TROPHY_PIXELS = [
  "..OOOOOOOOOO..",
  "..OLLLLLLLLO..",
  "..OLHLLLLLLO..",
  ".OOM......MOO.",
  "OOMD......DMOO",
  "OMD........DMO",
  ".OOMD....DMOO.",
  "..OOM....MOO..",
  "..OMM....MMO..",
  "...OMMMMMMO...",
  "....OMMMMO....",
  ".....OMMO.....",
  ".....OMMO.....",
  "..OOMMMMMMOO..",
  ".OMLLLLLLLLMO.",
  ".OOOOOOOOOOOO.",
];
const TROPHY_PALETTE = {
  O: "#0a0a1a",
  D: "#4a6878",
  M: "#8aa8b8",
  L: "#d4e8f0",
  H: "#ffffff",
};

function PlatinumTrophy({ scale = 6 }) {
  return <PixelArt pixels={TROPHY_PIXELS} palette={TROPHY_PALETTE} scale={scale} />;
}

// ---- Platform icons ----
const PC_PIXELS = [
  "OOOOOOOOOOOO",
  "OMMMMMMMMMMO",
  "OMSSSSSSSSMO",
  "OMSCCCCCCSMO",
  "OMSCCCCCCSMO",
  "OMSCCCCCCSMO",
  "OMSSSSSSSSMO",
  "OMMMMMMMMMMO",
  "OOOOOOOOOOOO",
  "....OOOO....",
  ".OOOOOOOOOO.",
];
const PS5_PIXELS = [
  ".OOOOOOOOOO.",
  "OWWWWWWWWWWO",
  "OWWBBBBBBWWO",
  "OWWWWWWWWWWO",
  "OBBBBBBBBBBO",
  "OBBBBBBBBBBO",
  "OWWWWWWWWWWO",
  "OWWBBBBBBWWO",
  "OWWWWWWWWWWO",
  ".OOOOOOOOOO.",
];
const SWITCH_PIXELS = [
  "RROOOOOOOOOOBB",
  "ROSSSSSSSSSSOB",
  "ROSGGGGGGGGSOB",
  "ROSGGGGGGGGSOB",
  "ROSGGGGGGGGSOB",
  "ROSGGGGGGGGSOB",
  "ROSGGGGGGGGSOB",
  "ROSSSSSSSSSSOB",
  "RROOOOOOOOOOBB",
];
const PLATFORM_DEFS = {
  pc: {
    pixels: PC_PIXELS,
    palette: { O: "#0a0a1a", M: "#5a6878", S: "#1a2030", C: "#3dc8ff" },
    label: "PC",
  },
  ps5: {
    pixels: PS5_PIXELS,
    palette: { O: "#0a0a1a", W: "#f0f0f0", B: "#1a1a1a" },
    label: "PS5",
  },
  switch: {
    pixels: SWITCH_PIXELS,
    palette: { O: "#0a0a1a", R: "#e60012", B: "#00aeef", S: "#2a2a2a", G: "#3dc8ff" },
    label: "SWITCH 2",
  },
};

function PlatformIcon({ platform = "pc", scale = 2, screenColor }) {
  const def = PLATFORM_DEFS[platform] || PLATFORM_DEFS.pc;
  const palette =
    screenColor && (platform === "pc" || platform === "switch")
      ? { ...def.palette, [platform === "pc" ? "C" : "G"]: screenColor }
      : def.palette;
  return <PixelArt pixels={def.pixels} palette={palette} scale={scale} />;
}

function Scanlines({ opacity = 0.18 }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
        background: `repeating-linear-gradient(0deg, rgba(0,0,0,${opacity}) 0 1px, transparent 1px 3px)`,
        mixBlendMode: "multiply",
      }}
    />
  );
}

// ---- CRT cover card (16:9 landscape) ----
function CRTCover({ g, accent, neon, sticky = "#ffd23e", hideNote = false }) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [g.img]);
  return (
    <div
      style={{
        background: "#1a1a2e",
        padding: "10px 10px 6px",
        border: "3px solid #2a2a44",
        boxShadow: "inset 0 0 0 2px #0d0d18, 4px 4px 0 #000",
        position: "relative",
      }}
    >
      <div
        style={{
          background: "#000",
          position: "relative",
          overflow: "hidden",
          aspectRatio: "16 / 9",
          width: "100%",
          boxShadow: "inset 0 0 30px rgba(0,0,0,0.8)",
        }}
      >
        {g.img && !failed ? (
          <img
            src={g.img}
            alt={g.title}
            onError={() => setFailed(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              filter: "saturate(1.15) contrast(1.05)",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: PIXEL,
              fontSize: 8,
              color: neon,
              textAlign: "center",
              padding: 10,
              background: "#0a0a1a",
            }}
          >
            {g.title.toUpperCase()}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 3px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "60%",
            height: "40%",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        {g.goty && (
          <div
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              background: accent,
              color: "#0d0d18",
              fontFamily: PIXEL,
              fontSize: 6,
              padding: "3px 5px",
              boxShadow: "2px 2px 0 #000",
            }}
          >
            ★ GOTY
          </div>
        )}
        {g.platinum && (
          <div
            style={{
              position: "absolute",
              bottom: 6,
              left: 6,
              padding: "4px 5px 2px",
              background: "#0a0a1a",
              border: `2px solid ${neon}`,
              boxShadow: `2px 2px 0 #000, 0 0 10px ${neon}55`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="PLATINUM"
          >
            <PlatinumTrophy scale={2} />
          </div>
        )}
      </div>

      {g.personalNote && !hideNote && (
        <div
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            transform: "rotate(4deg)",
            background: sticky,
            color: "#1a1a1a",
            padding: "7px 10px",
            maxWidth: 130,
            fontFamily: '"Caveat", "Comic Sans MS", cursive',
            fontSize: 13,
            lineHeight: 1.25,
            fontWeight: 700,
            boxShadow: "3px 3px 0 rgba(0,0,0,0.7)",
            whiteSpace: "pre-line",
            zIndex: 5,
          }}
        >
          {g.personalNote}
        </div>
      )}

      <div
        style={{
          marginTop: 8,
          fontFamily: PIXEL,
          fontSize: 7,
          lineHeight: 1.5,
          color: "#e8e8f0",
          letterSpacing: "0.02em",
          minHeight: 22,
        }}
      >
        {g.title}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 6,
          padding: "4px 0 0",
          borderTop: "2px solid #2a2a44",
        }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#3a3a55",
              boxShadow: "inset 1px 1px 0 #0d0d18",
            }}
          />
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#3a3a55",
              boxShadow: "inset 1px 1px 0 #0d0d18",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#3a3a55",
              boxShadow: "inset 1px 1px 0 #0d0d18",
            }}
          />
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#3a3a55",
              boxShadow: "inset 1px 1px 0 #0d0d18",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ---- Player profile (header) ----
function ArcPlayerProfile({
  accent,
  neon,
  name = "JOHNNY",
  tagline = "Souls connoisseur · open-world tourist · co-op believer",
  platinum = 8,
}) {
  // Which preset palette is active (matched by accent colour) → drives the
  // player tag (P1–P4) and the avatar's hair colour so they track the theme.
  const paletteIndex = Math.max(
    0,
    PALETTES.findIndex(
      (p) => p.colors[0].toLowerCase() === String(accent).toLowerCase(),
    ),
  );
  const playerTag = `P${paletteIndex + 1}`;
  const hairColors = ["#5a3a8a", "#2a5aa0", "#2f7a4a", "#9a5a2a"];
  const hair = hairColors[paletteIndex];

  const pixelAvatar = (
    <div style={{ position: "relative", width: 88, height: 88 }}>
      <div style={{ position: "absolute", inset: 0, background: "#0a0a1a" }} />
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 16,
          width: 56,
          height: 16,
          background: hair,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 8,
          width: 72,
          height: 16,
          background: hair,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 16,
          width: 56,
          height: 32,
          background: "#f4c290",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 28,
          width: 8,
          height: 8,
          background: "#1a1a2e",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 52,
          width: 8,
          height: 8,
          background: "#1a1a2e",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 36,
          width: 16,
          height: 4,
          background: "#1a1a2e",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 8,
          width: 72,
          height: 20,
          background: accent,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 20,
          width: 48,
          height: 12,
          background: "#1a1a2e",
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        padding: "20px 40px",
        background: "#1a1a2e",
        borderBottom: `3px solid ${accent}`,
        display: "grid",
        gridTemplateColumns: "auto 1fr auto auto",
        gap: 28,
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          background: "#000",
          padding: 6,
          border: `2px solid ${neon}`,
          boxShadow: `3px 3px 0 #000, 0 0 12px ${neon}50`,
        }}
      >
        {pixelAvatar}
        <div
          style={{
            position: "absolute",
            top: -10,
            left: -10,
            fontFamily: PIXEL,
            fontSize: 7,
            color: "#0d0d18",
            background: neon,
            padding: "3px 5px",
            boxShadow: "2px 2px 0 #000",
          }}
        >
          {playerTag}
        </div>
      </div>

      <div>
        <div
          style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 28 }}
        >
          <div
            style={{
              fontFamily: PIXEL,
              fontSize: 26,
              color: "#e8e8f0",
              letterSpacing: "0.06em",
              textShadow: `3px 3px 0 ${accent}`,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: PIXEL,
              fontSize: 11,
              color: neon,
              letterSpacing: "0.15em",
            }}
          >
            LV.26
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 14,
            fontFamily: PIXEL,
            fontSize: 8,
            letterSpacing: "0.15em",
          }}
        >
          <span style={{ color: "rgba(232,232,240,0.4)" }}>PLATFORMS</span>
          {["pc", "ps5", "switch"].map((p) => (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <PlatformIcon platform={p} scale={2} screenColor={neon} />
              <span style={{ color: "rgba(232,232,240,0.7)" }}>
                {PLATFORM_DEFS[p].label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          background: "#0a0a1a",
          border: `2px solid ${neon}`,
          boxShadow: `3px 3px 0 #000, 0 0 12px ${neon}33`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `radial-gradient(ellipse at 30% 50%, ${neon}1f 0%, transparent 70%)`,
          }}
        />
        <div style={{ position: "relative" }}>
          <PlatinumTrophy scale={3} />
        </div>
        <div style={{ textAlign: "right", lineHeight: 1, position: "relative" }}>
          <div
            style={{
              fontFamily: PIXEL,
              fontSize: 22,
              color: "#e8e8f0",
              letterSpacing: "0.04em",
              textShadow: `2px 2px 0 ${accent}`,
            }}
          >
            {platinum}
          </div>
          <div
            style={{
              fontFamily: PIXEL,
              fontSize: 6,
              color: "#d4e8f0",
              letterSpacing: "0.18em",
              marginTop: 8,
            }}
          >
            PLATINUM
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: "right",
          fontFamily: PIXEL,
          fontSize: 8,
          color: "rgba(232,232,240,0.5)",
          letterSpacing: "0.12em",
          lineHeight: 2,
        }}
      >
        <div style={{ color: accent }}>► SAVE LOADED</div>
        <div>JOHNNY.SAV</div>
        <div style={{ color: "rgba(232,232,240,0.35)" }}>LAST: TODAY</div>
      </div>
    </div>
  );
}

// ---- Story diary ----
// ---- Top navigation bar ----
const NAV_LINKS = [
  { label: "NOW PLAYING", id: "arc-now-playing" },
  { label: "CHAMPIONS", id: "arc-goty" },
  { label: "LIBRARY", id: "arc-library" },
];

function ArcTopBar({ accent, neon }) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState("arc-now-playing");

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  }

  function applyPalette(p) {
    if (!window.__setTweak) return;
    window.__setTweak({
      arcAccent: p.colors[0],
      arcNeon: p.colors[1],
      arcSticky: p.colors[2],
    });
    setOpen(false);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 40px",
        borderBottom: `3px solid ${accent}`,
        background: "#0d0d18",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 14,
            height: 14,
            background: accent,
            boxShadow: `0 0 12px ${accent}`,
          }}
        />
        <span style={{ fontFamily: PIXEL, fontSize: 14, letterSpacing: "0.05em" }}>
          JOHNNY'S GAME LIBRARY<span style={{ color: accent }}>.</span>
        </span>
      </div>
      <div
        style={{
          display: "flex",
          gap: 22,
          fontFamily: PIXEL,
          fontSize: 9,
          letterSpacing: "0.1em",
        }}
      >
        {NAV_LINKS.map(({ label, id }) => (
          <span
            key={id}
            onClick={() => scrollTo(id)}
            style={{
              color: active === id ? neon : "rgba(232,232,240,0.45)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {active === id && (
              <span
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "4px solid transparent",
                  borderBottom: "4px solid transparent",
                  borderLeft: `6px solid ${neon}`,
                  flexShrink: 0,
                }}
              />
            )}
            {label}
          </span>
        ))}
      </div>

      <div style={{ position: "relative" }}>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            background: "transparent",
            border: `2px solid ${accent}`,
            color: accent,
            fontFamily: PIXEL,
            fontSize: 10,
            letterSpacing: "0.12em",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            THEME
            <span
              style={{
                width: 0,
                height: 0,
                borderLeft: "4px solid transparent",
                borderRight: "4px solid transparent",
                borderTop: `6px solid ${accent}`,
                flexShrink: 0,
              }}
            />
          </span>
        </button>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              background: "#1a1a2e",
              border: `2px solid ${accent}`,
              boxShadow: "4px 4px 0 #000",
              zIndex: 100,
              minWidth: 140,
            }}
          >
            {PALETTES.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPalette(p)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  background:
                    p.colors[0] === accent ? "rgba(255,255,255,0.07)" : "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  color: "#e8e8f0",
                  fontFamily: PIXEL,
                  fontSize: 8,
                  letterSpacing: "0.1em",
                  padding: "10px 14px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ display: "flex", gap: 3 }}>
                  {p.colors.map((c, i) => (
                    <span
                      key={i}
                      style={{
                        width: 10,
                        height: 10,
                        background: c,
                        display: "inline-block",
                      }}
                    />
                  ))}
                </span>
                {p.label}
                {p.colors[0] === accent && (
                  <span
                    style={{
                      marginLeft: "auto",
                      width: 0,
                      height: 0,
                      borderTop: "4px solid transparent",
                      borderBottom: "4px solid transparent",
                      borderLeft: `6px solid ${accent}`,
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- CRT screen (shared) ----
function CoverScreen({ g, neon }) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [g.img]);
  return (
    <div
      style={{
        background: "#000",
        aspectRatio: "16 / 9",
        position: "relative",
        overflow: "hidden",
        boxShadow: "inset 0 0 40px rgba(0,0,0,0.9)",
        width: "100%",
      }}
    >
      {g.img && !failed ? (
        <img
          src={g.img}
          alt={g.title}
          onError={() => setFailed(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: "saturate(1.15) contrast(1.05)",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: PIXEL,
            fontSize: 16,
            color: neon,
            textAlign: "center",
            padding: 20,
            background: "radial-gradient(ellipse at center, #2a1a3e 0%, #000 100%)",
          }}
        >
          {g.title.toUpperCase()}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0 1px, transparent 1px 3px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          boxShadow: `inset 0 0 60px ${neon}40`,
        }}
      />
    </div>
  );
}

// ---- Screen bezel (shared by monitor + TV) ----
function ScreenBezel({ g, neon, accent }) {
  return (
    <div
      style={{
        background: "#16162b",
        padding: 0,
        border: "4px solid #2a2a44",
        boxShadow: "6px 6px 0 #000",
        position: "relative",
      }}
    >
      <div style={{ border: "3px solid #0d0d18", boxSizing: "border-box" }}>
        <CoverScreen g={g} neon={neon} />
      </div>
    </div>
  );
}

// ---- Platform chrome components ----
function PCTowerCase({ accent, neon }) {
  return (
    <div
      style={{
        width: 68,
        background: "#1e1e30",
        border: "4px solid #2a2a44",
        boxShadow: "5px 5px 0 #000, inset 0 0 0 2px #0d0d18",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: "8px 6px",
      }}
    >
      <div style={{ height: 3, background: accent, opacity: 0.6 }} />
      <div
        style={{
          height: 11,
          background: "#0d0d18",
          border: "2px solid #3a3a55",
          display: "flex",
          alignItems: "center",
          paddingLeft: 6,
        }}
      >
        <div style={{ width: 28, height: 1, background: "#4a4a66" }} />
      </div>
      <div
        style={{
          height: 11,
          background: "#0d0d18",
          border: "2px solid #3a3a55",
          display: "flex",
          alignItems: "center",
          paddingLeft: 6,
        }}
      >
        <div style={{ width: 28, height: 1, background: "#4a4a66" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, margin: "4px 0" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ height: 2, background: "#0d0d18" }} />
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 2 }}>
        <div
          style={{
            width: 9,
            height: 5,
            background: "#0d0d18",
            border: "1px solid #3a3a55",
          }}
        />
        <div
          style={{
            width: 9,
            height: 5,
            background: "#0d0d18",
            border: "1px solid #3a3a55",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 2,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 8px ${accent}`,
            border: `2px solid ${accent}88`,
          }}
        />
      </div>
    </div>
  );
}

function PCMonitor({ g, accent, neon, idx }) {
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
      <PCTowerCase accent={accent} neon={neon} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          alignSelf: "flex-start",
          marginTop: 52,
        }}
      >
        <div style={{ width: 14, height: 4, background: "#2a2a44" }} />
      </div>
      <div style={{ flex: 1 }}>
        <ScreenBezel g={g} neon={neon} accent={accent} />
        <div
          style={{
            width: 60,
            height: 12,
            margin: "0 auto",
            background: "#1a1a2e",
            border: "4px solid #2a2a44",
            borderTop: "none",
          }}
        />
        <div
          style={{
            width: 160,
            height: 8,
            margin: "0 auto",
            background: "#1a1a2e",
            border: "4px solid #2a2a44",
            boxShadow: "6px 6px 0 #000",
          }}
        />
      </div>
    </div>
  );
}

function PS5TVDisplay({ g, accent, neon, idx }) {
  return (
    <div style={{ width: 460 }}>
      <ScreenBezel g={g} neon={neon} accent={accent} />
      <div
        style={{
          width: 140,
          height: 8,
          margin: "0 auto",
          background: "#1a1a2e",
          border: "4px solid #2a2a44",
          borderTop: "none",
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: 60 }}>
        <div style={{ width: 4, height: 12, background: "#2a2a44" }} />
      </div>
      <div
        style={{
          width: 220,
          marginLeft: "auto",
          marginRight: 30,
          background: "#0d0d18",
          border: "3px solid #ffffff",
          boxShadow: "5px 5px 0 #000",
          padding: 3,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 50px 1fr",
            height: 24,
            alignItems: "stretch",
          }}
        >
          <div style={{ background: "#f0f0f0" }} />
          <div style={{ background: "#1a1a1a", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: PIXEL,
                fontSize: 6,
                color: neon,
                letterSpacing: "0.15em",
              }}
            >
              PS5
            </div>
          </div>
          <div style={{ background: "#f0f0f0" }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            width: 3,
            height: 3,
            background: accent,
            boxShadow: `0 0 5px ${accent}`,
          }}
        />
      </div>
    </div>
  );
}

function SwitchHandheld({ g, accent, neon, idx }) {
  const dot = {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#0a0a1a",
    boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.15)",
  };
  return (
    <div style={{ width: 540, position: "relative" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "70px 1fr 70px",
          boxShadow: "6px 6px 0 #000",
          borderRadius: 45,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "#e60012",
            border: "4px solid #0a0a1a",
            borderRight: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 0",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#1a1a1a",
              border: "2px solid #0a0a1a",
              boxShadow: "inset 2px 2px 0 rgba(255,255,255,0.1)",
            }}
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 10px)", gap: 2 }}
          >
            <div />
            <div style={dot} />
            <div />
            <div style={dot} />
            <div />
            <div style={dot} />
            <div />
            <div style={dot} />
            <div />
          </div>
          <div
            style={{
              width: 14,
              height: 3,
              background: "#0a0a1a",
              position: "absolute",
              top: 8,
              right: 10,
            }}
          />
        </div>
        <div
          style={{
            background: "#1a1a2e",
            borderTop: "4px solid #0a0a1a",
            borderBottom: "4px solid #0a0a1a",
            padding: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              border: "3px solid #0d0d18",
              boxSizing: "border-box",
            }}
          >
            <CoverScreen g={g} neon={neon} />
          </div>
        </div>
        <div
          style={{
            background: "#00aeef",
            border: "4px solid #0a0a1a",
            borderLeft: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 0",
            position: "relative",
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 10px)", gap: 2 }}
          >
            <div />
            <div style={dot} />
            <div />
            <div style={dot} />
            <div />
            <div style={dot} />
            <div />
            <div style={dot} />
            <div />
          </div>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#1a1a1a",
              border: "2px solid #0a0a1a",
              boxShadow: "inset 2px 2px 0 rgba(255,255,255,0.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 10,
              width: 14,
              height: 3,
              background: "#0a0a1a",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 3,
              left: 15,
              width: 3,
              height: 13,
              background: "#0a0a1a",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function PlatformDisplay({ platform, g, accent, neon, idx }) {
  const chrome =
    platform === "ps5" ? (
      <PS5TVDisplay g={g} accent={accent} neon={neon} idx={idx} />
    ) : platform === "switch" ? (
      <SwitchHandheld g={g} accent={accent} neon={neon} idx={idx} />
    ) : (
      <PCMonitor g={g} accent={accent} neon={neon} idx={idx} />
    );
  return (
    <div
      style={{
        width: 540,
        height: 340,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {chrome}
    </div>
  );
}

// ---- Auto-fitting one-line title ----
// Shrinks the font (down to `min`) so the title always fits on a single line.
// Lives inside a fixed-height slot so its vertical position never shifts.
function FitTitle({
  text,
  accent,
  neon,
  meta,
  max = 48,
  min = 18,
  height = 64,
  align = "center",
}) {
  const ref = React.useRef(null);
  const [size, setSize] = React.useState(max);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    let s = max;
    el.style.fontSize = s + "px";
    // Shrink until the single line fits the available width.
    while (s > min && el.scrollWidth > parent.clientWidth) {
      s -= 1;
      el.style.fontSize = s + "px";
    }
    setSize(s);
  }, [text, max, min]);

  return (
    <div
      style={{
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "left" ? "flex-start" : "center",
        margin: "0 0 24px 0",
      }}
    >
      <div
        style={{
          width: "100%",
          minWidth: 0,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: align === "left" ? "flex-start" : "center",
          overflow: "hidden",
        }}
      >
        <h1
          ref={ref}
          style={{
            fontFamily: PIXEL,
            fontSize: size,
            lineHeight: 1.1,
            margin: 0,
            whiteSpace: "nowrap",
            letterSpacing: "0.02em",
            textAlign: align,
            color: "#fff",
            textShadow: `0 0 10px ${neon || accent}88, 4px 4px 0 ${accent}, 8px 8px 0 #000`,
          }}
        >
          {text}
        </h1>
      </div>
      {meta && (
        <div
          style={{
            marginTop: 8,
            color: "#b9b9c9",
            fontFamily: PIXEL,
            fontSize: 9,
            letterSpacing: "0.12em",
            lineHeight: 1.5,
            textTransform: "uppercase",
          }}
        >
          {meta}
        </div>
      )}
      <div
        style={{
          marginTop: 14,
          width: 80,
          height: 6,
          background: accent,
          boxShadow: `0 0 7px ${neon || accent}99`,
        }}
      />
    </div>
  );
}

// ---- Hero / Now Playing carousel ----
function ArcHero({ accent, neon, tagColor, tagBg, tagFont }) {
  const NOW_PLAYING = [
    {
      id: "brotato",
      platform: "pc",
      company: "Blobfish",
      releaseMonth: "September",
      blurb:
        "A sentient potato fights waves of aliens. 20-minute runs, absurd builds, the most addictive loop I've found this year.",
    },
    {
      id: "bloodborne",
      platform: "ps5",
      company: "FromSoftware",
      releaseMonth: "March",
      blurb: "Back in Yharnam. The hunt never really ends.",
    },
    {
      id: "zelda-tears",
      platform: "switch",
      company: "Nintendo",
      releaseMonth: "May",
      blurb:
        "Hyrule from the skies down to the depths. Build anything, go anywhere — the sequel that somehow outdid Breath of the Wild.",
    },
  ];
  const [idx, setIdx] = React.useState(0);
  const entry = NOW_PLAYING[idx];
  const g = GAMES_BY_ID[entry.id] || {
    title: entry.id.toUpperCase(),
    year: "----",
    tag: "",
    img: null,
  };
  const progressLabel = `${String(idx + 1).padStart(2, "0")}/${String(
    NOW_PLAYING.length,
  ).padStart(2, "0")}`;
  const next = () => setIdx((i) => (i + 1) % NOW_PLAYING.length);
  const prev = () => setIdx((i) => (i - 1 + NOW_PLAYING.length) % NOW_PLAYING.length);

  const Arrow = ({ dir, onClick }) => (
    <button
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      style={{
        background: "#1a1a2e",
        color: "#e8e8f0",
        border: `3px solid ${accent}`,
        padding: "12px 14px",
        fontFamily: PIXEL,
        fontSize: 14,
        cursor: "pointer",
        boxShadow: "4px 4px 0 #000",
        lineHeight: 1,
      }}
    >
      {dir === "prev" ? "◄" : "►"}
    </button>
  );

  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #1a0a2e 0%, #0d0d18 100%)",
        overflow: "hidden",
      }}
    >

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 40px 34px", position: "relative" }}>
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 540px",
          gap: 50,
          minHeight: 340,
          alignItems: "center",
        }}
      >
        <div
          style={{
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 18,
              minWidth: 320,
              minHeight: 52,
              padding: "0 16px",
              marginBottom: 22,
              border: `3px solid ${neon}`,
              background: `linear-gradient(90deg, ${neon}1a, ${accent}12)`,
              boxShadow: `4px 4px 0 #000, 0 0 16px ${neon}33`,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                fontFamily: PIXEL,
                fontSize: 10,
                color: neon,
                padding: 0,
                letterSpacing: "0.15em",
                boxSizing: "border-box",
              }}
            >
              ► NOW PLAYING
            </div>
            <div
              style={{
                fontFamily: PIXEL,
                fontSize: 9,
                color: "#0d0d18",
                background: neon,
                padding: "7px 9px",
                letterSpacing: "0.15em",
                boxShadow: "2px 2px 0 #000",
              }}
            >
              {progressLabel}
            </div>
          </div>
          <FitTitle
            text={g.title.toUpperCase()}
            meta={
              <>
                {(entry.company || "UNKNOWN").toUpperCase()} /{" "}
                {`${entry.releaseMonth ? `${entry.releaseMonth} ` : ""}${g.year}`.toUpperCase()}
              </>
            }
            accent={accent}
            neon={neon}
            max={36}
            min={16}
            height={50}
            align="left"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 10,
              width: "100%",
              maxWidth: 430,
            }}
          >
            {(() => {
              const border = tagColor || accent;
              const fg = tagFont || border;
              const bg = tagBg || `${border}22`;
              const chip = {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "0 12px",
                height: 32,
                width: "100%",
                background: bg,
                color: fg,
                border: `2px dashed ${border}`,
                fontFamily: PIXEL,
                fontSize: 8,
                letterSpacing: "0.15em",
                boxSizing: "border-box",
              };
              const platformChip = {
                ...chip,
                background: "#0a0a1a",
                color: neon,
                border: `2px solid ${neon}`,
                boxShadow: `3px 3px 0 #000, inset 0 0 0 2px #1a1a2e, 0 0 12px ${neon}33`,
              };
              return (
                <React.Fragment>
                  <div style={platformChip}>
                    <PlatformIcon platform={entry.platform} scale={2} />
                    <span>{PLATFORM_DEFS[entry.platform].label}</span>
                  </div>
                  <div style={chip}>
                    <span>{(g.tag || "").toUpperCase()}</span>
                  </div>
                </React.Fragment>
              );
            })()}
          </div>
        </div>
        <PlatformDisplay
          platform={entry.platform}
          g={g}
          accent={accent}
          neon={neon}
          idx={idx}
        />
      </div>
      <div
        style={{
          position: "relative",
          marginTop: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <Arrow dir="prev" onClick={prev} />
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {NOW_PLAYING.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to ${i + 1}`}
              style={{
                width: 12,
                height: 12,
                padding: 0,
                cursor: "pointer",
                background: i === idx ? accent : "#3a3a55",
                border: `2px solid ${i === idx ? accent : "#3a3a55"}`,
                boxShadow: i === idx ? `0 0 8px ${accent}` : "inset 2px 2px 0 #0d0d18",
              }}
            />
          ))}
        </div>
        <Arrow dir="next" onClick={next} />
      </div>
      </div>
    </div>
  );
}

// ---- Section heading ----
function ArcSectionHead({ kicker, title, accent, collapsed, onToggle, count }) {
  return (
    <div
      style={{ padding: "50px 40px 24px", cursor: onToggle ? "pointer" : "default", userSelect: "none" }}
      onClick={onToggle}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div style={{ width: 12, height: 12, background: accent }} />
        <div
          style={{
            fontFamily: PIXEL,
            fontSize: 8,
            color: accent,
            letterSpacing: "0.2em",
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            flex: 1,
            height: 2,
            background: `repeating-linear-gradient(90deg, ${accent} 0 8px, transparent 8px 14px)`,
          }}
        />
        {onToggle && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {count !== undefined && (
              <span style={{ fontFamily: PIXEL, fontSize: 7, color: "rgba(232,232,240,0.4)", letterSpacing: "0.1em" }}>
                {count} GAMES
              </span>
            )}
            <span style={{ fontFamily: PIXEL, fontSize: 9, color: accent, letterSpacing: "0.1em" }}>
              {collapsed ? "[ + ]" : "[ − ]"}
            </span>
          </div>
        )}
      </div>
      <h2 style={{ fontFamily: PIXEL, fontSize: 22, margin: 0, letterSpacing: "0.04em" }}>
        {title}
      </h2>
    </div>
  );
}

// ---- Stacked card carousel (for multi-game years) ----
function StackedCards({ gameIds, accent, neon, sticky }) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const n = gameIds.length;

  if (n === 1) {
    const g = GAMES_BY_ID[gameIds[0]];
    return g ? <CRTCover g={g} accent={accent} neon={neon} sticky={sticky} /> : null;
  }

  const CARD_H = 252; // approx card height for the wider CRTCover
  const PEEK = 80; // fixed strip visible for each card below
  const containerH = CARD_H + (n - 1) * PEEK;

  const prev = () => setActiveIdx((activeIdx - 1 + n) % n);
  const next = () => setActiveIdx((activeIdx + 1) % n);

  const arrowStyle = (disabled) => ({
    background: disabled ? "#16162a" : "#1a1a2e",
    border: `2px solid ${disabled ? "#2a2a44" : accent}`,
    boxShadow: disabled ? "none" : `2px 2px 0 #000, 0 0 8px ${accent}44`,
    color: disabled ? "#3a3a55" : accent,
    fontFamily: PIXEL,
    fontSize: 8,
    padding: "5px 14px",
    cursor: disabled ? "default" : "pointer",
    letterSpacing: "0.1em",
  });

  return (
    <div>
      <div style={{ position: "relative", height: containerH }}>
        {gameIds.map((id, i) => {
          const g = GAMES_BY_ID[id];
          if (!g) return null;
          const pos = (i - activeIdx + n) % n;
          return (
            <div
              key={id}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: pos * PEEK,
                zIndex: n - pos,
                ...(pos !== 0 ? { height: CARD_H, overflow: "hidden" } : {}),
                transition: "top 0.25s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <CRTCover g={g} accent={accent} neon={neon} sticky={sticky} hideNote={pos !== 0} />
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 4, marginBottom: -6 }}>
        <button onClick={prev} style={arrowStyle(false)}>▲</button>
        <div style={{ fontFamily: PIXEL, fontSize: 7, color: "rgba(232,232,240,0.4)", display: "flex", alignItems: "center", letterSpacing: "0.1em" }}>
          {activeIdx + 1}/{n}
        </div>
        <button onClick={next} style={arrowStyle(false)}>▼</button>
      </div>
    </div>
  );
}

// ---- GOTY section (horizontal champions timeline) ----
function ArcGOTY({ accent, neon, sticky }) {
  const scrollRef = React.useRef(null);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(false);

  // Build year stations sorted chronologically; "All-Time" pinned at the front.
  const stations = React.useMemo(() => {
    const allTime = GOTYS.filter((y) => isNaN(parseInt(y.year, 10)));
    const dated = GOTYS.filter((y) => !isNaN(parseInt(y.year, 10))).sort(
      (a, b) => parseInt(a.year, 10) - parseInt(b.year, 10),
    );
    return [...allTime, ...dated];
  }, []);

  const STATION_W = 322; // column width + gap, used for arrow stepping

  const updateEdges = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  React.useEffect(() => {
    updateEdges();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const slide = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * STATION_W * 2, behavior: "smooth" });
  };

  const arrowBtn = (dir, disabled) => (
    <button
      onClick={() => slide(dir)}
      disabled={disabled}
      aria-label={dir < 0 ? "Previous years" : "Next years"}
      style={{
        flex: "none",
        width: 40,
        height: 52,
        background: disabled ? "#16162a" : "#1a1a2e",
        border: `3px solid ${disabled ? "#2a2a44" : accent}`,
        boxShadow: disabled ? "none" : `4px 4px 0 #000, 0 0 12px ${accent}44`,
        color: disabled ? "#3a3a55" : accent,
        fontFamily: PIXEL,
        fontSize: 14,
        cursor: disabled ? "default" : "pointer",
        transition: "transform 0.08s",
      }}
    >
      {dir < 0 ? "◄" : "►"}
    </button>
  );

  return (
    <div>
      <ArcSectionHead kicker="HALL OF FAME" title="GAME OF THE YEAR" accent={accent} />
      <div
        style={{
          padding: "0 40px",
          marginTop: -8,
          marginBottom: 18,
          fontFamily: PIXEL,
          fontSize: 8,
          color: "rgba(232,232,240,0.5)",
          letterSpacing: "0.12em",
        }}
      >
        ► RANKED BY THE YEAR I PLAYED THEM
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 14,
          padding: "0 40px 8px",
        }}
      >
        {arrowBtn(-1, atStart)}

        <div
          ref={scrollRef}
          style={{
            flex: 1,
            minWidth: 0,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
          }}
        >
          <div style={{ display: "flex", gap: 22, paddingBottom: 6, alignItems: "flex-start", position: "relative", width: "max-content" }}>
            {/* continuous timeline rail running behind the year nodes */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 17,
                height: 4,
                background: `repeating-linear-gradient(90deg, ${accent} 0 8px, transparent 8px 16px)`,
                opacity: 0.5,
                zIndex: 0,
              }}
            />
            {stations.map((y) => {
              const isAllTime = isNaN(parseInt(y.year, 10));
              return (
                <div
                  key={y.year}
                  style={{
                    flex: "none",
                    width: 300,
                    scrollSnapAlign: "start",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {/* year node on the rail */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: PIXEL,
                        fontSize: isAllTime ? 9 : 11,
                        color: "#0d0d18",
                        background: isAllTime ? sticky : accent,
                        padding: "6px 10px",
                        boxShadow: `3px 3px 0 #000${isAllTime ? `, 0 0 14px ${sticky}66` : ""}`,
                        letterSpacing: "0.06em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isAllTime ? "★ ALL-TIME" : y.year}
                    </div>
                    <div
                      style={{
                        width: 3,
                        height: 14,
                        background: accent,
                        opacity: 0.6,
                      }}
                    />
                  </div>

                  {/* winner cover(s) for this year */}
                  <StackedCards
                    gameIds={y.games}
                    accent={accent}
                    neon={neon}
                    sticky={sticky}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {arrowBtn(1, atEnd)}
      </div>

    </div>
  );
}

// ---- Timeline section ----
function ArcTimeline({ accent, neon, sticky }) {
  const sorted = GAMES.slice().sort((a, b) => a.year - b.year);
  return (
    <div>
      <ArcSectionHead kicker="CHRONOLOGY" title="TIMELINE" accent={accent} />
      <div style={{ padding: "0 40px" }}>
        <div style={{ position: "relative", height: 32, marginBottom: 20 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 14,
              height: 4,
              background: `repeating-linear-gradient(90deg, ${accent} 0 6px, transparent 6px 12px)`,
            }}
          />
          {[1987, 1995, 2005, 2015, 2025].map((y, i) => (
            <div
              key={y}
              style={{
                position: "absolute",
                left: `${(i / 4) * 100}%`,
                transform: "translateX(-50%)",
                top: 0,
                fontFamily: PIXEL,
                fontSize: 9,
                color: neon,
              }}
            >
              ▼<div style={{ marginTop: 4, fontSize: 8 }}>{y}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {sorted.slice(0, 8).map((g) => (
            <CRTCover key={g.id} g={g} accent={accent} neon={neon} sticky={sticky} />
          ))}
        </div>
        <div
          style={{
            fontFamily: PIXEL,
            fontSize: 8,
            color: "rgba(232,232,240,0.4)",
            marginTop: 20,
            letterSpacing: "0.15em",
            textAlign: "center",
          }}
        >
          ► {STATS.earliest} —————— {STATS.latest} · {STATS.total} TITLES TOTAL ◄
        </div>
      </div>
    </div>
  );
}

// ---- Cartridge shelf (genre-coded spines that eject their cover) ----
const ARC_MONO = '"VT323", ui-monospace, "Courier New", monospace';
const ARC_GENRE_COLOR = {
  soulslike: "#ff2e88",
  "open-world": "#00e5ff",
  roguelite: "#a3e635",
  shooter: "#ff7e3e",
  "co-op": "#ffd23e",
  action: "#ee4266",
  rpg: "#9b6cff",
  card: "#3dc8ff",
  moba: "#06d6a0",
  puzzle: "#ff6ec7",
  metroidvania: "#f7b801",
  sports: "#7ee787",
  racing: "#ff5470",
  sandbox: "#62d2ff",
  strategy: "#c792ea",
  adventure: "#ffd166",
  "beat-em-up": "#ff8fab",
  arcade: "#ffd23e",
  "tower-defense": "#a3e635",
  fighting: "#ee4266",
};
const arcGenreColor = (tag) => ARC_GENRE_COLOR[tag] || "#00e5ff";

function CartridgeSpine({ g, neon, edge = "center" }) {
  const [on, setOn] = React.useState(false);
  const col = arcGenreColor(g.tag);
  return (
    <div
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{
        width: 48,
        height: on ? 222 : 204,
        marginBottom: on ? 18 : 0,
        position: "relative",
        cursor: "pointer",
        transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
      }}
    >
      {/* cover ejects above the spine on hover */}
      <div
        style={{
          position: "absolute",
          bottom: "100%",
          ...(edge === "start"
            ? { left: 0 }
            : edge === "end"
              ? { right: 0 }
              : { left: "50%", transform: "translateX(-50%)" }),
          marginBottom: 8,
          width: 178,
          border: `3px solid ${col}`,
          background: "#000",
          boxShadow: `4px 4px 0 #000, 0 0 20px ${col}66`,
          overflow: "hidden",
          opacity: on ? 1 : 0,
          pointerEvents: "none",
          transition: "opacity 0.15s",
          zIndex: 30,
        }}
      >
        <CoverScreen g={g} neon={col} />
        <div
          style={{
            padding: "5px 7px 4px",
            background: "#0a0a1a",
            borderTop: `2px solid ${col}`,
            fontFamily: PIXEL,
            fontSize: 6,
            color: "#e8e8f0",
            letterSpacing: "0.04em",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: neon }}>{g.year}</span>
          <span style={{ color: col, textTransform: "uppercase" }}>{g.tag}</span>
        </div>
      </div>
      {/* the spine */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: on ? "#22223c" : "#1a1a2e",
          border: "2px solid #2a2a44",
          borderTop: `6px solid ${col}`,
          boxShadow: on
            ? `0 0 14px ${col}55, inset 0 0 0 1px ${col}55`
            : "inset -3px 0 6px rgba(0,0,0,0.4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 0 8px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: 24,
            height: 8,
            background: "#0a0a1a",
            border: "1px solid #2a2a44",
          }}
        />
        <div
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontFamily: ARC_MONO,
            fontSize: 18,
            lineHeight: 1,
            color: on ? "#fff" : "#e8e8f0",
            letterSpacing: "0.02em",
            maxHeight: 150,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {g.title}
        </div>
        <div
          style={{
            fontFamily: PIXEL,
            fontSize: 6,
            color: g.platinum ? neon : "rgba(232,232,240,0.32)",
          }}
        >
          {g.platinum ? "◆" : g.goty ? "★" : "·"}
        </div>
      </div>
    </div>
  );
}

function CartridgeShelfRows({ games, accent, neon, perRow = 11 }) {
  const rows = [];
  for (let i = 0; i < games.length; i += perRow) rows.push(games.slice(i, i + perRow));
  return (
    <div style={{ padding: "0 40px 40px" }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ marginTop: ri === 0 ? 56 : 60 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            {row.map((g, gi) => (
              <CartridgeSpine key={g.id} g={g} neon={neon}
                edge={gi === 0 ? "start" : gi === row.length - 1 ? "end" : "center"} />
            ))}
          </div>
          <div
            style={{
              height: 16,
              background: `linear-gradient(180deg, ${accent}cc, #16162b)`,
              border: "3px solid #2a2a44",
              boxShadow: "6px 6px 0 #000",
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ---- Cover wall (image-forward poster gallery) ----
function CoverWallCard({ g, neon }) {
  const [on, setOn] = React.useState(false);
  const col = arcGenreColor(g.tag);
  return (
    <div
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{
        position: "relative",
        aspectRatio: "16 / 9",
        overflow: "hidden",
        border: `3px solid ${on ? neon : "#3a3a5c"}`,
        background: "#000",
        boxShadow: on ? `0 0 20px ${neon}55, 5px 5px 0 #000` : "4px 4px 0 #000",
        cursor: "pointer",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
    >
      <CoverScreen g={g} neon={neon} />
      {g.goty && (
        <div
          style={{
            position: "absolute",
            opacity: on ? 1 : 0,
            transition: "opacity 0.18s",
            top: 12,
            left: -36,
            transform: "rotate(-45deg)",
            width: 130,
            textAlign: "center",
            background: "#ffd23e",
            color: "#0d0d18",
            fontFamily: PIXEL,
            fontSize: 7,
            padding: "4px 0",
            letterSpacing: "0.1em",
            boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
          }}
        >
          ★ GOTY
        </div>
      )}
      {g.platinum && (
        <div
          style={{
            position: "absolute",
            opacity: on ? 1 : 0,
            transition: "opacity 0.18s",
            top: 9,
            right: 9,
            fontFamily: PIXEL,
            fontSize: 7,
            color: neon,
            background: "#0a0a1a",
            border: `2px solid ${neon}`,
            padding: "4px 5px",
            boxShadow: `0 0 8px ${neon}55`,
          }}
        >
          PLAT
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "14px 12px 12px",
          background: `linear-gradient(180deg, rgba(10,10,26,0.55), rgba(10,10,26,0.95))`,
          borderTop: `2px solid ${neon}`,
          opacity: on ? 1 : 0,
          transform: on ? "translateY(0)" : "translateY(100%)",
          transition: "opacity 0.18s, transform 0.18s",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: PIXEL,
            fontSize: g.title.length > 34 ? 8 : g.title.length > 24 ? 9 : 11,
            lineHeight: 1.4,
            color: "#fff",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            overflowWrap: "break-word",
            textShadow: "0 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          {g.title}
        </div>
        <div
          style={{
            marginTop: 9,
            display: "flex",
            alignItems: "center",
            gap: 9,
            fontFamily: PIXEL,
            fontSize: 7,
            letterSpacing: "0.1em",
          }}
        >
          <span style={{ color: neon }}>{g.year}</span>
          <span style={{ color: col, textTransform: "uppercase" }}>{g.tag}</span>
        </div>
      </div>
    </div>
  );
}

function CoverWallGrid({ games, neon }) {
  return (
    <div
      style={{
        padding: "0 40px 40px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
      }}
    >
      {games.map((g) => (
        <CoverWallCard key={g.id} g={g} neon={neon} />
      ))}
    </div>
  );
}

// ---- Library grid (by era) ----
function ArcLibrary({ era, kicker, title, accent, neon, sticky, defaultCollapsed = false, layout = "grid" }) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const games = era === 'online'
    ? GAMES.filter((g) => g.online)
    : GAMES.filter((g) => g.era === era && !g.online && !g.goty);
  return (
    <div>
      <ArcSectionHead
        kicker={kicker}
        title={title}
        accent={accent}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        count={games.length}
      />
      {!collapsed && (
        layout === "shelf" ? (
          <CartridgeShelfRows games={games} accent={accent} neon={neon} />
        ) : layout === "wall" ? (
          <CoverWallGrid games={games} neon={neon} />
        ) : (
          <div
            style={{
              padding: "0 40px 40px",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
            }}
          >
            {games.map((g) => (
              <CRTCover key={g.id} g={g} accent={accent} neon={neon} sticky={sticky} />
            ))}
          </div>
        )
      )}
    </div>
  );
}

// ---- Footer ----
function ArcContactLink({ href, external, neon, icon, label }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        textDecoration: "none",
        fontFamily: PIXEL,
        fontSize: 8,
        letterSpacing: "0.1em",
        color: hover ? neon : "rgba(232,232,240,0.6)",
        transition: "color 0.15s",
      }}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

function ArcFooter({ accent, neon }) {
  const mailIcon = (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke={neon}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: "none" }}
    >
      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
      <path d="m3 6 9 7 9-7"></path>
    </svg>
  );
  const liIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={neon} style={{ flex: "none" }}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"></path>
    </svg>
  );
  return (
    <div
      style={{
        marginTop: 60,
        padding: "32px 40px 34px",
        borderTop: `3px solid ${accent}`,
        background: "#1a1a2e",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: PIXEL,
          fontSize: 30,
          color: accent,
          letterSpacing: "0.08em",
          textShadow: `0 0 18px ${accent}80`,
        }}
      >
        GAME OVER
      </div>
      <div
        style={{
          fontFamily: PIXEL,
          fontSize: 9,
          color: "#e8e8f0",
          letterSpacing: "0.18em",
          marginTop: 20,
        }}
      >
        CONTINUE? - INSERT COIN TO REPLAY
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 34,
          marginTop: 24,
        }}
      >
        <ArcContactLink
          href="mailto:johnnymu0809@gmail.com"
          neon={neon}
          icon={mailIcon}
          label="JOHNNYMU0809@GMAIL.COM"
        />
        <ArcContactLink
          href="https://linkedin.com/in/zicheng-mu"
          external
          neon={neon}
          icon={liIcon}
          label="LINKEDIN.COM/IN/ZICHENG-MU"
        />
      </div>
    </div>
  );
}

// ---- Root component ----
function Arcade({
  accent = "#ff3e6c",
  neon = "#7ee787",
  playerName = "JOHNNY",
  tagline = "Souls connoisseur · open-world tourist · co-op believer",
  platinum = 8,
  sticky = "#ffd23e",
  tagColor,
  tagBg,
  tagFont,
}) {
  return (
    <div style={arcStyles.root}>
      {/* Full-page grid overlay — z-index above section backgrounds, below content */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9,
          opacity: 0.07,
          backgroundImage: `linear-gradient(${neon}60 1px, transparent 1px), linear-gradient(90deg, ${neon}60 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="arc-full-bleed">
        <ArcTopBar accent={accent} neon={neon} />
        <ArcPlayerProfile
          accent={accent}
          neon={neon}
          name={playerName}
          tagline={tagline}
          platinum={platinum}
        />
      </div>
      <div className="arc-full-bleed" id="arc-now-playing">
        <ArcHero
          accent={accent}
          neon={neon}
          tagColor={tagColor}
          tagBg={tagBg}
          tagFont={tagFont}
        />
      </div>
      <div className="arc-shell">
      <div id="arc-goty" style={{ marginBottom: -40 }}>
        <ArcGOTY accent={accent} neon={neon} sticky={sticky} />
      </div>

      <div id="arc-library">
        <ArcLibrary
          era="uni"
          kicker="MAIN QUEST"
          title="UNI → PRESENT DAY"
          accent={accent}
          neon={neon}
          sticky={sticky}
          layout="wall"
        />
        <ArcLibrary
          era="childhood"
          kicker="ORIGIN STORY"
          title="WHERE IT BEGAN"
          accent={accent}
          neon={neon}
          sticky={sticky}
          defaultCollapsed={true}
          layout="shelf"
        />
        <ArcLibrary
          era="online"
          kicker="VERSUS MODE"
          title="ONLINE ARENA"
          accent={accent}
          neon={neon}
          sticky={sticky}
          defaultCollapsed={true}
        />
      </div>
      </div>
      <div className="arc-full-bleed">
        <ArcFooter accent={accent} neon={neon} />
      </div>
      <Scanlines opacity={0.12} />
    </div>
  );
}

window.Arcade = Arcade;
