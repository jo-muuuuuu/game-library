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
    "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Silkscreen:wght@400;700&family=Caveat:wght@600;700&display=swap";
  document.head.appendChild(l);
}

const PIXEL = '"Press Start 2P", ui-monospace, monospace';

if (typeof document !== "undefined" && !document.getElementById("arc-adboard-css")) {
  const s = document.createElement("style");
  s.id = "arc-adboard-css";
  s.textContent = "@keyframes arcFlicker{0%,100%{opacity:1}44%{opacity:1}46%{opacity:.55}48%{opacity:1}72%{opacity:.78}74%{opacity:1}}";
  document.head.appendChild(s);
}

// ---- Pixel art primitives ----
// Drawn as SVG rects in a 1-unit-per-pixel viewBox rather than box-shadow
// clones: shadow offsets round to device pixels independently, so on any
// element sitting at a fractional offset the art breaks into dots.
function PixelArt({ pixels, palette, scale = 5 }) {
  const w = pixels[0].length,
    h = pixels.length;
  const rects = [];
  for (let y = 0; y < h; y++) {
    let x = 0;
    while (x < w) {
      const ch = pixels[y][x];
      if (ch === "." || ch === " ") {
        x++;
        continue;
      }
      // Merge horizontal runs of the same colour into a single rect.
      let run = 1;
      while (x + run < w && pixels[y][x + run] === ch) run++;
      rects.push(
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={run}
          height={1}
          fill={palette[ch] || "#fff"}
        />,
      );
      x += run;
    }
  }
  return (
    <svg
      width={w * scale}
      height={h * scale}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      style={{ display: "block", flex: "none" }}
      aria-hidden="true"
    >
      {rects}
    </svg>
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

// ---- Single-line auto-fitting caption ----
// Shrinks the font until the title fits one line, so cards need only one
// line's worth of space no matter how long the name is.
function FitCaption({ text, max = 8.5, min = 4.5, style }) {
  const ref = React.useRef(null);
  const [size, setSize] = React.useState(max);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const fit = () => {
      let s = max;
      el.style.fontSize = s + "px";
      while (s > min && el.scrollWidth > parent.clientWidth) {
        s -= 0.25;
        el.style.fontSize = s + "px";
      }
      setSize(s);
    };
    fit();
    // The pixel webfont loads lazily and is wider than the fallback face, so
    // the first pass can measure too small — re-fit after each font swap.
    if (document.fonts) {
      document.fonts.ready.then(fit);
      document.fonts.addEventListener("loadingdone", fit);
    }
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    return () => {
      ro.disconnect();
      if (document.fonts) document.fonts.removeEventListener("loadingdone", fit);
    };
  }, [text, max, min]);
  return (
    <div ref={ref} style={{ ...style, fontSize: size, whiteSpace: "nowrap", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
      {text}
    </div>
  );
}

// ---- CRT cover card (16:9 landscape) ----
function CRTCover({ g, accent, neon, sticky = "#ffd23e", hideNote = false, hideTrophy = false, bigTitle = false }) {
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
        zIndex: g.personalNote && !hideNote ? 6 : undefined,
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
        {g.dlc && (
          <div
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              zIndex: 3,
              fontFamily: PIXEL,
              fontSize: 6,
              letterSpacing: "0.12em",
              color: neon,
              background: "#0a0a1acc",
              border: `1px solid ${neon}`,
              padding: "3px 5px",
              boxShadow: "2px 2px 0 #000",
            }}
            title="EXPANSION"
          >
            DLC
          </div>
        )}
        {g.platinum && !hideTrophy && (
          <div
            style={{
              position: "absolute",
              bottom: 6,
              left: 6,
              zIndex: 3,
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
          marginTop: 7,
          minWidth: 0,
          minHeight: 14,
          display: "flex",
          alignItems: "center",
        }}
      >
        <FitCaption
          text={g.title}
          max={bigTitle ? 8.5 : 7}
          min={4.5}
          style={{
            fontFamily: PIXEL,
            lineHeight: 1.45,
            color: "#e8e8f0",
            letterSpacing: "0.02em",
          }}
        />
      </div>
      {g.parts && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 5, fontFamily: '"Silkscreen",monospace', fontSize: 9, lineHeight: 1.35, color: neon }}>
          {g.parts.map((p) => <span key={p}>{p}</span>)}
        </div>
      )}

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
  { label: "ON ROTATION", id: "arc-now-playing" },
  { label: "CHAMPIONS", id: "arc-goty" },
  { label: "LIBRARY", id: "arc-library" },
  { label: "UNFINISHED", id: "arc-unfinished" },
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
function CoverScreen({ g, neon, hidePlatinum = false }) {
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
      {g.platinum && !hidePlatinum && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            zIndex: 3,
            padding: "6px 7px 4px",
            background: "#0a0a1a",
            border: `3px solid ${neon}`,
            boxShadow: `3px 3px 0 #000, 0 0 14px ${neon}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="PLATINUM"
        >
          <PlatinumTrophy scale={3} />
        </div>
      )}
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
  // The console art is drawn at a fixed 540×340; scale it down to whatever
  // width the hero's art column actually gets so it never overflows.
  const wrapRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  React.useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setScale(Math.min(1, el.clientWidth / 540));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div
      ref={wrapRef}
      style={{ width: "100%", maxWidth: 540, height: 340 * scale, position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 540,
          height: 340,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {chrome}
      </div>
    </div>
  );
}

// ---- Auto-fitting title ----
// Shrinks the font (down to `min`) so each line fits the available width.
// Titles with a subtitle ("The Legend of Zelda: Tears of the Kingdom") break
// after the colon onto a second line; everything else stays on one line.
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
  // When a line can't fit even at `min`, let it wrap instead of clipping.
  const [wrap, setWrap] = React.useState(false);
  const ci = text.indexOf(":");
  const lines =
    ci > 0 && ci < text.length - 1
      ? [text.slice(0, ci + 1).trim(), text.slice(ci + 1).trim()]
      : [text];

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    // Two-line titles start smaller so they don't tower over short one-liners.
    const maxSize = lines.length > 1 ? Math.round(max * 0.66) : max;
    let lastW = -1;
    const widest = () =>
      Math.max(...Array.from(el.children).map((c) => c.scrollWidth), 0);
    const fit = (force) => {
      const pw = parent.clientWidth;
      // Re-fit only when the available width actually changed — otherwise the
      // wrap fallback's own reflow would retrigger this and cancel itself out.
      // `force` bypasses the guard for font-swap re-measures.
      if (!force && pw === lastW) return;
      lastW = pw;
      el.style.whiteSpace = "nowrap";
      let s = maxSize;
      el.style.fontSize = s + "px";
      while (s > min && widest() > pw) {
        s -= 1;
        el.style.fontSize = s + "px";
      }
      setSize(s);
      const needsWrap = widest() > pw + 1;
      el.style.whiteSpace = needsWrap ? "normal" : "nowrap";
      setWrap(needsWrap);
    };
    fit(true);
    // The pixel webfont is wider than the fallback face, so the first pass can
    // measure too small — re-fit once fonts settle.
    const refit = () => fit(true);
    if (document.fonts) {
      document.fonts.ready.then(refit);
      document.fonts.addEventListener("loadingdone", refit);
    }
    const ro = new ResizeObserver(() => fit(false));
    ro.observe(parent);
    return () => {
      ro.disconnect();
      if (document.fonts) document.fonts.removeEventListener("loadingdone", refit);
    };
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
          minHeight: height,
          display: "flex",
          alignItems: "center",
          justifyContent: align === "left" ? "flex-start" : "center",
        }}
      >
        <h1
          ref={ref}
          style={{
            fontFamily: PIXEL,
            fontSize: size,
            lineHeight: 1.16,
            margin: 0,
            whiteSpace: wrap ? "normal" : "nowrap",
            overflowWrap: "anywhere",
            letterSpacing: "0.02em",
            textAlign: align,
            color: "#fff",
            textShadow: `0 0 10px ${neon || accent}88, 4px 4px 0 ${accent}, 8px 8px 0 #000`,
          }}
        >
          {lines.map((l, n) => (
            <div key={n} style={{ minWidth: 0 }}>{l}</div>
          ))}
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
function ArcHero({ accent, neon, sticky, tagColor, tagBg, tagFont }) {
  const NOW_PLAYING = [
    {
      id: "zelda-tears",
      platform: "switch",
      company: "Nintendo",
      releaseMonth: "May",
      blurb:
        "Hyrule from the skies down to the depths. Build anything, go anywhere — the sequel that somehow outdid Breath of the Wild.",
    },
    {
      id: "bloodborne",
      platform: "ps5",
      company: "FromSoftware",
      releaseMonth: "March",
      status: "LAST PLAYED",
      blurb: "Back in Yharnam. The hunt never really ends.",
    },
    {
      id: "brotato",
      platform: "pc",
      company: "Blobfish",
      releaseMonth: "September",
      status: "JUST FINISHED",
      blurb:
        "A sentient potato fights waves of aliens. 20-minute runs, absurd builds — ran it until the platinum popped.",
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
  // Each status gets its own colour scheme: live = cyan, finished = gold, dormant = muted violet.
  const STATUS_COLORS = { "NOW PLAYING": neon, "JUST FINISHED": sticky || "#fff066", "LAST PLAYED": "#9a8cc7" };
  const statusLabel = entry.status || "NOW PLAYING";
  const statusColor = STATUS_COLORS[statusLabel] || neon;
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

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "34px 40px 34px", position: "relative" }}>
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "minmax(min(100%, 400px), 1fr) minmax(0, 540px)",
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
              border: `3px solid ${statusColor}`,
              background: `linear-gradient(90deg, ${statusColor}1a, ${accent}12)`,
              boxShadow: `4px 4px 0 #000, 0 0 16px ${statusColor}33`,
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
                color: statusColor,
                padding: 0,
                letterSpacing: "0.15em",
                boxSizing: "border-box",
              }}
            >
              ► {statusLabel}
            </div>
            <div
              style={{
                fontFamily: PIXEL,
                fontSize: 9,
                color: "#0d0d18",
                background: statusColor,
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
            max={34}
            min={14}
            height={88}
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
    return g ? <GOTYAdBoard g={g} neon={neon} frame={cyberFrame(g.id)} /> : null;
  }

  const CARD_H = 195; // cover-wall card + ad-board housing at station width
  const PEEK = 68; // fixed strip visible for each card below
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
              <GOTYAdBoard g={g} neon={neon} frame={cyberFrame(g.id)} />
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14 }}>
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
  mmorpg: "#b98cff",
  fighting: "#ee4266",
};
const arcGenreColor = (tag) => ARC_GENRE_COLOR[tag] || "#00e5ff";

function CartridgeSpine({ g, neon, edge = "center", flex = false }) {
  const [on, setOn] = React.useState(false);
  const col = arcGenreColor(g.tag);
  return (
    <div
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{
        ...(flex ? { flex: "0 0 44px" } : { width: 40, flexShrink: 0 }),
        height: on ? 190 : 174,
        marginBottom: on ? 18 : 0,
        position: "relative",
        cursor: "pointer",
        transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
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
            flexDirection: "column",
            gap: 5,
          }}
        >
          <span style={{ fontSize: 7, lineHeight: 1.4, color: "#fff", letterSpacing: "0.02em" }}>{g.title}</span>
          <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: neon }}>{g.year}</span>
            <span style={{ color: col, textTransform: "uppercase" }}>{g.tag}</span>
          </span>
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
            fontSize: 16,
            lineHeight: 1,
            color: on ? "#fff" : "#e8e8f0",
            letterSpacing: "0.02em",
            maxHeight: 126,
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
          {g.dlc ? "DLC" : g.platinum ? "◆" : g.goty ? "★" : "·"}
        </div>
      </div>
    </div>
  );
}

// Pixel-art desk objects stand between studio groups instead of a rule.
// Sizes are read off the case itself: a spine is ~19 cm tall = 174 px.
const spr = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
const SHELF_PROPS = {
  controller: { w: 22, h: 14, pxW: 108, art:
    spr(1,4,20,8,'#2a2a44')+spr(0,6,3,5,'#2a2a44')+spr(19,6,3,5,'#2a2a44')+
    spr(2,3,18,2,'#3a3a5c')+
    spr(4,6,2,4,'#0f0f1e')+spr(3,7,4,2,'#0f0f1e')+
    spr(15,6,2,2,'#ff2e88')+spr(17,8,2,2,'#00e5ff')+spr(13,8,2,2,'#a3e635')+spr(15,10,2,2,'#ffd23e')+
    spr(2,1,4,2,'#3a3a5c')+spr(16,1,4,2,'#3a3a5c') },
  deer: { w: 32, h: 30, px: 122, art:
    spr(7,27,3,3,'#5a3b22')+spr(11,27,3,3,'#5a3b22')+spr(16,27,3,3,'#5a3b22')+spr(20,27,3,3,'#5a3b22')+
    spr(7,29,3,1,'#2a1a10')+spr(11,29,3,1,'#2a1a10')+spr(16,29,3,1,'#2a1a10')+spr(20,29,3,1,'#2a1a10')+
    spr(6,17,18,10,'#8a5a34')+spr(6,17,18,2,'#a06b3f')+
    spr(8,22,3,2,'#c99a6a')+spr(14,21,3,2,'#c99a6a')+spr(19,23,2,2,'#c99a6a')+
    spr(6,24,18,3,'#6f4526')+
    spr(21,14,4,6,'#8a5a34')+spr(22,12,3,3,'#a06b3f')+
    spr(20,7,7,6,'#a06b3f')+spr(26,9,4,3,'#8a5a34')+
    spr(29,10,2,2,'#2a1a10')+spr(27,10,2,1,'#6f4526')+
    spr(23,8,2,2,'#0f0f1e')+spr(23,8,1,1,'#ffffff')+
    spr(18,6,3,3,'#a06b3f')+spr(19,7,1,1,'#6f4526')+
    spr(21,2,2,6,'#c9a06a')+spr(25,2,2,6,'#c9a06a')+
    spr(19,1,2,3,'#c9a06a')+spr(23,0,2,3,'#c9a06a')+spr(27,1,2,3,'#c9a06a')+
    spr(17,2,2,2,'#c9a06a')+spr(29,2,2,2,'#c9a06a')+
    spr(4,18,3,6,'#8a5a34')+spr(4,17,2,2,'#a06b3f') },
  egg: { w: 20, h: 24, px: 96, art:
    spr(8,0,4,1,'#eddcbe')+spr(7,1,6,1,'#eddcbe')+spr(6,2,8,1,'#eddcbe')+
    spr(5,3,10,2,'#eddcbe')+spr(4,5,12,3,'#eddcbe')+spr(3,8,14,6,'#eddcbe')+
    spr(4,14,12,2,'#eddcbe')+spr(5,16,10,1,'#eddcbe')+spr(6,17,8,1,'#eddcbe')+
    spr(7,18,6,1,'#eddcbe')+
    spr(9,0,1,1,'#f7ecd8')+spr(8,1,1,1,'#f7ecd8')+spr(7,2,2,1,'#f7ecd8')+
    spr(6,3,4,2,'#f7ecd8')+spr(5,5,5,1,'#f7ecd8')+spr(5,6,4,2,'#f7ecd8')+
    spr(4,8,5,1,'#f7ecd8')+spr(4,9,4,5,'#f7ecd8')+spr(5,14,3,2,'#f7ecd8')+
    spr(6,16,2,1,'#f7ecd8')+spr(7,17,1,1,'#f7ecd8')+
    spr(7,2,2,1,'#fffaf0')+spr(7,3,3,2,'#fffaf0')+spr(6,5,2,1,'#fffaf0')+
    spr(10,0,2,1,'#d9c3a0')+spr(10,1,3,1,'#d9c3a0')+spr(10,2,4,1,'#d9c3a0')+
    spr(11,3,4,2,'#d9c3a0')+spr(11,5,5,1,'#d9c3a0')+spr(10,6,6,2,'#d9c3a0')+
    spr(10,8,7,1,'#d9c3a0')+spr(9,9,8,5,'#d9c3a0')+spr(9,14,7,2,'#d9c3a0')+
    spr(9,16,6,1,'#d9c3a0')+spr(9,17,5,1,'#d9c3a0')+spr(9,18,4,1,'#d9c3a0')+
    spr(13,6,2,2,'#bfa77f')+spr(13,8,3,6,'#bfa77f')+spr(12,14,2,2,'#bfa77f')+
    spr(11,16,2,1,'#bfa77f')+spr(11,17,1,1,'#bfa77f')+
    spr(4,15,1,1,'#e5d4b4')+spr(5,16,1,1,'#e5d4b4')+spr(6,17,2,1,'#e5d4b4')+
    spr(7,18,2,1,'#e5d4b4')+
    spr(10,3,1,1,'#cba97a')+spr(12,7,1,1,'#cba97a')+spr(6,9,1,1,'#cba97a')+
    spr(5,11,1,1,'#cba97a')+spr(14,11,1,1,'#cba97a')+spr(8,13,1,1,'#cba97a')+
    spr(11,15,1,1,'#cba97a')+spr(9,17,1,1,'#cba97a')+
    spr(6,19,8,2,'#3a3a5c')+spr(7,19,6,1,'#4a4a70')+
    spr(4,21,12,2,'#2a2a44')+spr(5,23,10,1,'#1a1a2e') },
  'figure-shanks': { w: 22, h: 32, px: 140, art:
    spr(6,29,10,3,'#2a2a44')+spr(5,31,12,1,'#3a3a5c')+spr(7,30,8,1,'#1a1a2e')+
    spr(6,26,4,3,'#3b2a1d')+spr(12,26,4,3,'#3b2a1d')+spr(5,28,6,1,'#14141f')+spr(11,28,6,1,'#14141f')+
    spr(7,20,8,7,'#2b2b3a')+
    spr(4,13,14,10,'#14141f')+spr(3,14,3,10,'#14141f')+spr(18,14,2,8,'#14141f')+
    spr(4,22,14,2,'#0a0a12')+spr(6,13,2,10,'#22222e')+spr(14,13,2,10,'#22222e')+
    spr(8,13,6,8,'#e8e8f0')+spr(9,14,4,7,'#d8d8e4')+
    spr(8,18,6,3,'#ffd23e')+spr(8,19,6,1,'#e0a800')+
    spr(7,21,8,1,'#8a5a2a')+spr(10,21,2,1,'#c9a227')+
    spr(3,19,3,5,'#22222e')+spr(3,23,3,2,'#e8c9a0')+
    spr(17,15,3,7,'#14141f')+spr(16,16,2,2,'#22222e')+
    spr(15,13,6,4,'#c8102e')+spr(17,16,4,8,'#8a0b20')+
    spr(8,11,6,2,'#e8c9a0')+
    spr(6,3,10,9,'#f0d2ab')+
    spr(5,1,12,4,'#c8102e')+spr(4,3,2,5,'#c8102e')+spr(16,3,2,5,'#c8102e')+spr(6,5,3,2,'#a80d24')+
    spr(7,6,2,2,'#0f0f1e')+spr(12,6,2,2,'#0f0f1e')+spr(7,6,1,1,'#ffffff')+spr(12,6,1,1,'#ffffff')+
    spr(6,4,3,1,'#8a0b20')+spr(6,5,1,4,'#a83a3a')+spr(7,4,1,1,'#a83a3a')+
    spr(10,8,2,1,'#d9b487')+spr(8,10,5,1,'#c98a7a') },
  tapes: { w: 22, h: 16, pxW: 96, art:
    spr(1,9,18,7,'#2a2a44')+spr(2,10,16,2,'#3a3a5c')+spr(6,13,8,2,'#0f0f1e')+
    spr(7,13,2,2,'#8a8aa0')+spr(11,13,2,2,'#8a8aa0')+
    spr(3,2,18,6,'#b06cff')+spr(4,3,16,2,'#d3aaff')+spr(8,5,8,2,'#0f0f1e')+
    spr(9,5,2,2,'#e8e8f0')+spr(13,5,2,2,'#e8e8f0')+spr(3,7,18,1,'#7d3fd0') },
  keyboard: { w: 46, h: 15, pxW: 176, art:
    spr(0,3,46,12,'#2a2a44')+spr(1,2,44,2,'#3a3a5c')+spr(1,13,44,2,'#22223c')+
    [...Array(20)].map((_,i)=>spr(2+i*2.2,4,1.4,1.4,'#00e5ff')).join('')+
    [...Array(20)].map((_,i)=>spr(2+i*2.2,6,1.4,1.4,'#e8e8f0')).join('')+
    [...Array(19)].map((_,i)=>spr(2.6+i*2.2,8,1.4,1.4,'#e8e8f0')).join('')+
    [...Array(18)].map((_,i)=>spr(3.2+i*2.2,10,1.4,1.4,'#e8e8f0')).join('')+
    spr(3,12,4,1.4,'#8a8aa8')+spr(8,12,3,1.4,'#8a8aa8')+spr(12,12,18,1.4,'#8a8aa8')+
    spr(31,12,3,1.4,'#8a8aa8')+spr(35,12,3,1.4,'#8a8aa8')+spr(39,12,4,1.4,'#ff2e88') },
  headphones: { w: 18, h: 26, px: 186, art:
    spr(4,24,10,2,'#3a3a5c')+spr(6,22,6,2,'#2a2a44')+
    spr(8,6,2,17,'#2a2a44')+spr(7,5,4,2,'#3a3a5c')+
    spr(4,3,10,2,'#e8e8f0')+spr(3,4,2,4,'#e8e8f0')+spr(13,4,2,4,'#e8e8f0')+
    spr(2,7,4,7,'#ff2e88')+spr(12,7,4,7,'#ff2e88')+spr(3,9,2,3,'#0f0f1e')+spr(13,9,2,3,'#0f0f1e') },
  mug: { w: 16, h: 16, pxW: 70, art:
    spr(2,4,10,11,'#e8e8f0')+spr(2,4,10,2,'#ffffff')+spr(3,5,8,2,'#3b2a1d')+
    spr(2,14,10,1,'#c9c9d8')+spr(11,5,1,10,'#c9c9d8')+
    spr(12,7,3,2,'#e8e8f0')+spr(14,8,2,4,'#e8e8f0')+spr(12,12,3,2,'#e8e8f0')+
    spr(5,1,1,2,'#3a3a5c')+spr(8,0,1,3,'#3a3a5c') },
};
// Each explicit break in the section list gets the next prop, so no two
// dividers on a shelf repeat.
const SHELF_PROP_ORDER = ["controller", "deer", "keyboard", "headphones", "egg", "figure-shanks", "tapes"];
// authored size, identical on every shelf (never flex-shrunk)
const shelfPropSize = (name) => {
  const p = SHELF_PROPS[name];
  const scale = p.pxW ? p.pxW / p.w : p.px / p.h;
  return { w: Math.round(p.w * scale), h: Math.round(p.h * scale) };
};
const SHELF_SPINE_W = 44;
const SHELF_GAP = 6;

function ShelfDivider({ name }) {
  const p = SHELF_PROPS[name];
  const { w, h } = shelfPropSize(name);
  return (
    <div style={{ flex: `0 0 ${w + 10}px`, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
      <svg width={w} height={h} viewBox={`0 0 ${p.w} ${p.h}`} shapeRendering="crispEdges" aria-hidden="true"
        style={{ display: "block", flex: "none", filter: "drop-shadow(3px 3px 0 rgba(0,0,0,0.55))" }}
        dangerouslySetInnerHTML={{ __html: p.art }} />
    </div>
  );
}

// Rows are packed to the measured shelf width so nothing has to shrink:
// spines keep their 44 px basis and props keep their authored size.
function CartridgeShelfRows({ items, games, accent, neon }) {
  const hostRef = React.useRef(null);
  const [avail, setAvail] = React.useState(0);
  React.useEffect(() => {
    const el = hostRef.current;
    if (!el) return undefined;
    const measure = () => setAvail(el.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Curated order straight from the list: every break becomes a prop divider.
  const cells = React.useMemo(() => {
    const src = items && items.length ? items : games;
    let n = 0;
    const list = [];
    src.forEach((it) => {
      if (!it) list.push({ prop: SHELF_PROP_ORDER[n++ % SHELF_PROP_ORDER.length] });
      else list.push({ g: it });
    });
    while (list.length && list[0].prop) list.shift();
    while (list.length && list[list.length - 1].prop) list.pop();
    return list;
  }, [items, games]);

  const rows = React.useMemo(() => {
    const width = avail || 820;
    const cellW = (c) => (c.prop ? shelfPropSize(c.prop).w + 10 : SHELF_SPINE_W);
    // A break-delimited run and the prop that closes it move as one unit, so a
    // group never splits across shelves while its divider strands elsewhere.
    const groups = [];
    let cur = [];
    cells.forEach((c) => {
      cur.push(c);
      if (c.prop) { groups.push(cur); cur = []; }
    });
    if (cur.length) groups.push(cur);
    const span = (g) => g.reduce((a, c, i) => a + cellW(c) + (i ? SHELF_GAP : 0), 0);
    const out = [];
    let row = [];
    let used = 0;
    const flush = () => { if (row.length) { out.push(row); row = []; used = 0; } };
    groups.forEach((g) => {
      const gw = span(g);
      if (row.length && used + SHELF_GAP + gw > width) flush();
      if (gw > width) {
        // A run longer than one shelf still has to wrap somewhere.
        g.forEach((c) => {
          const w = cellW(c);
          if (row.length && used + SHELF_GAP + w > width) flush();
          used += w + (used ? SHELF_GAP : 0);
          row.push(c);
        });
        return;
      }
      used += gw + (used ? SHELF_GAP : 0);
      row.push(...g);
    });
    flush();
    // A shelf that ends on a divider may borrow spines from the next run — but
    // only from a long run (4+), so short groups like the CS/WC3/PvZ trio stay
    // intact instead of being orphaned across two shelves.
    for (let i = 0; i < out.length - 1; i += 1) {
      let w = span(out[i]);
      const runLen = out[i + 1].findIndex((c) => c.prop);
      let left = (runLen < 0 ? out[i + 1].length : runLen) - 3;
      const endsOnProp = !!out[i][out[i].length - 1].prop;
      while (
        endsOnProp &&
        left > 0 &&
        !out[i + 1][0].prop &&
        w + SHELF_GAP + SHELF_SPINE_W <= width
      ) {
        out[i].push(out[i + 1].shift());
        w += SHELF_GAP + SHELF_SPINE_W;
        left -= 1;
      }
    }
    return out.filter((r) => r.some((c) => c.g));
  }, [cells, avail]);

  return (
    <div style={{ padding: "0 40px 40px" }}>
      <div ref={hostRef}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ marginTop: ri === 0 ? 56 : 60 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: SHELF_GAP }}>
            {row.map((c, gi) => (
              c.prop
                ? <ShelfDivider key={`p${gi}`} name={c.prop} />
                : <CartridgeSpine key={c.g.id} g={c.g} neon={neon} flex
                    edge={gi === 0 ? "start" : gi === row.length - 1 ? "end" : "center"} />
            ))}
            <div style={{ flex: "1 0 0", minWidth: 0 }} />
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
    </div>
  );
}

// ---- Cover wall (image-forward poster gallery) ----
const CYBER_FRAMES = ["#ff2e88", "#00e5ff", "#a3e635", "#ff7e3e", "#b06cff", "#ffd23e", "#00ffa3", "#ff4d6d"];
function cyberFrame(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return CYBER_FRAMES[h % CYBER_FRAMES.length];
}
function CoverWallCard({ g, neon, frame }) {
  const [on, setOn] = React.useState(false);
  const col = arcGenreColor(g.tag);
  const edge = frame || (on ? neon : "#3a3a5c");
  return (
    <div
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{
        position: "relative",
        aspectRatio: "16 / 9",
        overflow: "hidden",
        border: `3px solid ${edge}`,
        background: "#000",
        boxShadow: frame
          ? on
            ? `0 0 24px ${edge}88, 0 0 4px ${edge}, 5px 5px 0 #000`
            : `0 0 12px ${edge}55, 4px 4px 0 #000`
          : on
            ? `0 0 20px ${neon}55, 5px 5px 0 #000`
            : "4px 4px 0 #000",
        cursor: "pointer",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
    >
      {frame && (
        <div style={{ position: "absolute", inset: 3, border: `1px solid ${frame}`, opacity: 0.5, pointerEvents: "none", zIndex: 4 }} />
      )}
      <CoverScreen g={g} neon={neon} hidePlatinum />
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
            background: frame || "#ffd23e",
            color: "#0d0d18",
            fontFamily: PIXEL,
            fontSize: 7,
            padding: "4px 0",
            letterSpacing: "0.1em",
            boxShadow: frame ? `0 2px 6px rgba(0,0,0,0.6), 0 0 12px ${frame}88` : "0 2px 6px rgba(0,0,0,0.6)",
          }}
        >
          ★ GOTY
        </div>
      )}
      {g.dlc && (
        <div
          style={{
            position: "absolute",
            bottom: 7,
            left: 7,
            zIndex: 5,
            fontFamily: PIXEL,
            fontSize: 6,
            letterSpacing: "0.12em",
            color: frame || neon,
            background: "#0a0a1acc",
            border: `1px solid ${frame || neon}`,
            padding: "3px 5px",
          }}
          title="EXPANSION"
        >
          DLC
        </div>
      )}
      {g.platinum && (
        <div
          style={{
            position: "absolute",
            top: 7,
            right: 7,
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontFamily: PIXEL,
            fontSize: 6,
            letterSpacing: "0.08em",
            color: neon,
            background: "#0a0a1acc",
            border: `1px solid ${neon}`,
            padding: "3px 5px",
            boxShadow: `0 0 6px ${neon}44`,
          }}
          title="PLATINUM"
        >
          <PlatinumTrophy scale={1.25} />
          <span>PLATINUM</span>
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

// ---- GOTY ad-board (neon billboard housing around a cover) ----
function GOTYAdBoard({ g, neon, frame }) {
  const tube = { position: "absolute", left: 10, right: 10, height: 2, background: frame, boxShadow: `0 0 8px ${frame}, 0 0 16px ${frame}88` };
  const strut = (side) => (
    <div style={{ position: "absolute", top: "32%", bottom: "32%", width: 5, background: "#15152a", border: "1px solid #2a2a44", [side]: 0 }} />
  );
  return (
    <div style={{ position: "relative", padding: "0 9px" }}>
      {strut("left")}
      {strut("right")}
      <div
        style={{
          position: "relative",
          background: "#101022",
          padding: 7,
          border: "2px solid #2a2a44",
          boxShadow: `0 0 18px ${frame}33, 0 0 3px ${frame}66, 6px 6px 0 #000`,
          animation: "arcFlicker 7s infinite steps(1,end)",
          animationDelay: `${(g.id.length % 7) * 0.9}s`,
        }}
      >
        <div style={{ ...tube, top: 2 }} />
        <div style={{ ...tube, bottom: 2 }} />
        {[{ top: 2, left: 2 }, { top: 2, right: 2 }, { bottom: 2, left: 2 }, { bottom: 2, right: 2 }].map((p, i) => (
          <div key={i} style={{ position: "absolute", width: 5, height: 5, background: frame, boxShadow: `0 0 6px ${frame}`, ...p }} />
        ))}
        <CoverWallCard g={g} neon={neon} frame={frame} />
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
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 12,
      }}
    >
      {games.map((g) => (
        <CoverWallCard key={g.id} g={g} neon={neon} />
      ))}
    </div>
  );
}

// ---- Mosaic hover grid (library layout) ----
// Mixed square / wide / hero tiles on a dense 8-col grid; hover lifts a
// 16:9 preview so covers are never cropped. Shapes are seeded per game id,
// so the wall is identical on every load.
if (typeof document !== "undefined" && !document.getElementById("arc-mosaic-css")) {
  const st = document.createElement("style");
  st.id = "arc-mosaic-css";
  st.textContent = `
.arcm{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));grid-auto-rows:var(--arcm-u,132px);gap:10px;padding:4px 0 40px}
.arcm-groups{position:relative}
.arcm-t{position:relative;padding:0;border:0;background:none;font:inherit;color:inherit;text-align:left;cursor:pointer;-webkit-appearance:none;appearance:none;z-index:1}
.arcm-box{position:relative;width:100%;height:100%;background:#0a0a1a;border:2px solid #2a2a44;box-shadow:3px 3px 0 #000;overflow:hidden;transition:border-color .16s,box-shadow .16s}
.arcm-t.cend .arcm-box{border-right:2px dashed rgba(232,232,240,.45)}
.arcm-box img{width:100%;height:100%;object-fit:cover;filter:saturate(.7) brightness(.6);transition:filter .16s}
.arcm-box::after{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px)}
.arcm-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:8px;font-family:"Press Start 2P",monospace;font-size:7px;line-height:1.5;color:var(--arcm-neon);background:#0a0a1a}
.arcm-trophy{position:relative;display:block}
.arcm-plat{position:absolute;bottom:4px;left:4px;padding:3px 4px 1px;background:#0a0a1a;border:2px solid var(--arcm-neon);box-shadow:2px 2px 0 #000,0 0 10px var(--arcm-glow);line-height:0;z-index:3}
.arcm-goty{position:absolute;bottom:4px;right:4px;background:var(--arcm-accent);color:#0d0d18;font-family:"Press Start 2P",monospace;font-size:6px;padding:3px 5px;box-shadow:2px 2px 0 #000;z-index:3}
.arcm-dlc{position:absolute;top:4px;left:4px;background:#1a1a2e;color:var(--arcm-neon);border:1px solid var(--arcm-neon);font-family:"Press Start 2P",monospace;font-size:5px;padding:2px 4px;letter-spacing:.1em;z-index:3}
.arcm-parts{display:flex;flex-direction:column;gap:3px;margin-top:7px;font-family:"Silkscreen",monospace;font-size:10px;line-height:1.35;color:var(--arcm-neon)}
.arcm-t:hover,.arcm-t:focus-visible{z-index:60;outline:none}
.arcm-t:hover .arcm-box,.arcm-t:focus-visible .arcm-box{border-color:var(--arcm-neon);box-shadow:3px 3px 0 #000,0 0 22px var(--arcm-glow)}
.arcm-t:hover .arcm-box img,.arcm-t:focus-visible .arcm-box img{filter:saturate(1.05) brightness(.85)}
.arcm-pop{position:absolute;left:50%;top:50%;width:340px;transform:translate(-50%,-50%) scale(.94);background:#1a1a2e;border:3px solid var(--arcm-neon);box-shadow:inset 0 0 0 2px #0d0d18,6px 6px 0 #000,0 0 30px var(--arcm-glow);padding:10px 10px 11px;opacity:0;pointer-events:none;transition:opacity .13s,transform .13s cubic-bezier(.3,0,.2,1);z-index:70}
.arcm-t:hover .arcm-pop,.arcm-t:focus-visible .arcm-pop{opacity:1;transform:translate(-50%,-50%) scale(1)}
.arcm-scr{position:relative;aspect-ratio:16/9;width:100%;background:#000;overflow:hidden;box-shadow:inset 0 0 30px rgba(0,0,0,.8)}
.arcm-scr img{width:100%;height:100%;object-fit:cover;filter:saturate(1.15) contrast(1.05)}
.arcm-scr::after{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.22) 0 1px,transparent 1px 3px),radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.55) 100%)}
.arcm-pop .arcm-ttl{font-family:"Silkscreen",monospace;font-size:15px;letter-spacing:.02em;line-height:1.25;margin-top:11px}
.arcm-pop .arcm-plat{bottom:6px;left:6px;padding:4px 5px 2px}
.arcm-pop .arcm-goty{bottom:6px;right:6px;font-size:7px;padding:4px 6px}
.arcm-pop .arcm-dlc{top:6px;left:6px;font-size:6px;padding:3px 5px}
.arcm-note{position:absolute;top:-12px;right:-12px;transform:rotate(4deg);background:var(--arcm-sticky);color:#1a1a1a;padding:7px 10px;max-width:130px;font-family:Caveat,"Comic Sans MS",cursive;font-weight:700;font-size:14px;line-height:1.25;box-shadow:3px 3px 0 rgba(0,0,0,.7);white-space:pre-line;z-index:5}
.arcm-prog{margin-top:8px;font-family:"Press Start 2P",monospace;font-size:6px;line-height:1.5;letter-spacing:.12em;color:var(--arcm-neon);border:1px solid var(--arcm-neon);padding:5px 6px;text-align:center}
.arcm-t.edge-l .arcm-pop{left:0;transform:translate(0,-50%) scale(.94)}
.arcm-t.edge-l:hover .arcm-pop,.arcm-t.edge-l:focus-visible .arcm-pop{transform:translate(0,-50%) scale(1)}
.arcm-t.edge-r .arcm-pop{left:auto;right:0;transform:translate(0,-50%) scale(.94)}
.arcm-t.edge-r:hover .arcm-pop,.arcm-t.edge-r:focus-visible .arcm-pop{transform:translate(0,-50%) scale(1)}
`;
  document.head.appendChild(st);
}

function arcmGlow(hex, alpha) {
  const m = /^#?([\da-f]{6})$/i.exec(String(hex || "").trim());
  if (!m) return `rgba(0,229,255,${alpha})`;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

function arcmHash(str, salt) {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967295;
}
// Lay every tile out in strict list order on one 8-column grid. All tiles are
// exactly one row tall and spans are capped at 2, so a row of k tiles fills
// exactly when 4 <= k <= 8 (k singles + (8-k) doubles). Row boundaries are
// therefore chosen to keep k in that range — which both guarantees 100% fill
// and keeps every tile at 1:1 or 2:1, never a cropped strip. Width carries
// emphasis and tracks the GAME (GOTY winners take the double cells first), so
// prominence never depends on how the list happens to be grouped.
const ARCM_COLS = 8;
const ARCM_TARGET = 6; // tiles per row; leaves 2 double-width cells to award

// Ordered packer: keeps the curated sequence exactly (so DLC tiles stay
// beside their base game) and picks each tile's size from the free slot,
// placing everything explicitly so no holes are left behind.
const ARCM_HERO = new Set(['wukong', 'gta-vc', 'bloodborne', 'sekiro', 'cyberpunk', 'it-takes-two']);
// Letterbox-prone wide art that must never be cropped to a square.
const ARCM_WIDE = new Set(['diablo-2-dlc']);
function arcmPack(items) {
  const occ = [];
  const free = (r, c, w, h) => {
    for (let y = r; y < r + h; y++) for (let x = c; x < c + w; x++) if ((occ[y] || [])[x]) return false;
    return true;
  };
  const fill = (r, c, w, h) => {
    for (let y = r; y < r + h; y++) { occ[y] = occ[y] || []; for (let x = c; x < c + w; x++) occ[y][x] = 1; }
  };
  const out = [];
  const holes = [];
  let r = 0, c = 0;
  items.forEach((it, i) => {
    const hero = ARCM_HERO.has(it.g.id);
    let w = hero ? 2 : (ARCM_WIDE.has(it.g.id) || (!it.g.dlc && i % 4 === 1) ? 2 : 1);
    const h = hero ? 2 : 1;
    const nx = items[i + 1];
    const paired = it.g.dlc || (nx && nx.g.dlc && nx.g.baseOf === it.g.id);
    // Backfill a cell an oversized tile had to skip, but never with half of a
    // base+DLC pair (that would split them).
    if (w === 1 && h === 1 && !paired && holes.length) {
      const hole = holes.shift();
      fill(hole.r, hole.c, 1, 1);
      out.push({ ...it, cs: 1, rs: 1, col: hole.c, row: hole.r });
      return;
    }
    while (true) {
      if (c >= ARCM_COLS) { c = 0; r++; }
      if ((occ[r] || [])[c]) { c++; continue; }
      if (c + w > ARCM_COLS || !free(r, c, w, h)) {
        // Heroes keep their 2x2 footprint: advance instead of shrinking.
        if (w > 1 && !hero) { w = 1; continue; }
        holes.push({ r, c });
        c++; continue;
      }
      break;
    }
    fill(r, c, w, h);
    out.push({ ...it, cs: w, rs: h, col: c, row: r });
    c += w;
  });
  return out;
}

function arcmLayout(items, salt) {  const n = items.length;
  if (!n) return [];
  // Fewest rows that keeps every row within [4, 8] tiles.
  let r = Math.max(1, Math.ceil(n / ARCM_TARGET));
  while (r > 1 && n < 4 * r) r--;
  while (n > ARCM_COLS * r) r++;
  const base = Math.floor(n / r), extra = n % r;

  const out = [];
  let i = 0;
  for (let row = 0; row < r; row++) {
    const k = base + (row < extra ? 1 : 0);
    const slice = items.slice(i, i + k);
    i += k;
    // k tiles need (COLS - k) of them widened to span 2.
    const wideCount = Math.max(0, Math.min(k, ARCM_COLS - k));
    const wide = new Set(
      slice
        .map((it, j) => ({ j, rank: (it.g.goty ? 1 : 0) + arcmHash(it.g.id, salt) }))
        .sort((a, b) => b.rank - a.rank)
        .slice(0, wideCount)
        .map((x) => x.j),
    );
    const start = out.length;
    slice.forEach((it, j) => out.push({ ...it, cs: wide.has(j) ? 2 : 1 }));
    // Only reachable when the whole list is shorter than 4 tiles.
    let left = ARCM_COLS - out.slice(start).reduce((a, t) => a + t.cs, 0);
    for (let q = 0; left > 0; q++, left--) out[start + (q % k)].cs += 1;
  }
  return out;
}

// DLC badge label: the expansion's own name, with the base game's title
// stripped so the badge reads "LORD OF DESTRUCTION", not the whole thing.
function arcmDlcName(g) {
  const t = g.title || "";
  const cut = t.indexOf(": ");
  return (cut > 0 ? t.slice(cut + 2) : t).toUpperCase();
}

function MosaicTile({ g, cs, rs, col, row, cend, note }) {
  const [failed, setFailed] = React.useState(false);
  const fail = (e) => { if (!e.target.naturalWidth) setFailed(true); };
  const art = g.img && !failed
    ? <img src={g.img} alt="" loading="lazy" onError={() => setFailed(true)} onLoad={fail} style={g.fit ? { objectFit: g.fit } : undefined} />
    : <div className="arcm-ph">{g.title.toUpperCase()}</div>;
  const popArt = g.img && !failed
    ? <img src={g.img} alt="" loading="lazy" onError={() => setFailed(true)} onLoad={fail} style={g.fit ? { objectFit: g.fit } : undefined} />
    : <div className="arcm-ph" style={{ fontSize: 12 }}>{g.title.toUpperCase()}</div>;
  return (
    <button
      type="button"
      className={"arcm-t" + (cend ? " cend" : "")}
      title={g.title}
      style={{
        gridColumn: col == null ? `span ${cs}` : `${col + 1} / span ${cs}`,
        gridRow: row == null ? `span ${rs || 1}` : `${row + 1} / span ${rs || 1}`,
      }}
    >
      <div className="arcm-box">
        {art}
        {g.dlc && <div className="arcm-dlc">DLC</div>}
        {g.platinum && <div className="arcm-plat"><PlatinumTrophy scale={1} /></div>}
      </div>
      <div className="arcm-pop">
        <div className="arcm-scr">
          {popArt}
          {g.dlc && <div className="arcm-dlc">DLC</div>}
          {g.platinum && <div className="arcm-plat"><PlatinumTrophy scale={2} /></div>}
          {g.goty && <div className="arcm-goty">★ GOTY</div>}
        </div>
        <div className="arcm-ttl">{g.title}</div>
        {g.parts && <div className="arcm-parts">{g.parts.map((p) => <span key={p}>{p}</span>)}</div>}
        {note && <div className="arcm-prog">{note}</div>}
        {g.personalNote && <div className="arcm-note">{g.personalNote}</div>}
      </div>
    </button>
  );
}

function MosaicGrid({ items, accent, neon, sticky, salt = 7, notes }) {
  const ref = React.useRef(null);
  // Flatten the curated list into one ordered run, flagging the last tile of
  // each cluster so group boundaries read as an inline rule (no row break).
  const tiles = React.useMemo(() => {
    const out = [];
    items.forEach((g) => {
      if (g === null) { if (out.length) out[out.length - 1].cend = true; return; }
      if (g) out.push({ g, cend: false });
    });
    if (out.length) out[out.length - 1].cend = false;
    // Pack in curated order (so a DLC always lands next to its base game),
    // sizing each cell to whatever slot is actually free — no dense reflow.
    return arcmPack(out);
  }, [items, salt]);
  React.useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const run = () => {
      const gap = 10, w = host.clientWidth;
      if (w) host.style.setProperty("--arcm-u", (w - gap * (ARCM_COLS - 1)) / ARCM_COLS + "px");
      const hb = host.getBoundingClientRect();
      host.querySelectorAll(".arcm-t").forEach((t) => {
        const r = t.getBoundingClientRect();
        t.classList.toggle("edge-l", r.left - hb.left < 4);
        t.classList.toggle("edge-r", hb.right - r.right < 4);
      });
    };
    run();
    const ro = new ResizeObserver(run);
    ro.observe(host);
    window.addEventListener("resize", run);
    return () => { ro.disconnect(); window.removeEventListener("resize", run); };
  }, [tiles]);
  return (
    <div
      className="arcm"
      ref={ref}
      style={{
        "--arcm-accent": accent,
        "--arcm-neon": neon,
        "--arcm-glow": arcmGlow(neon, 0.32),
        "--arcm-sticky": sticky || "#fff066",
      }}
    >
      {tiles.map(({ g, cs, rs, col, row, cend }, i) => (
        <MosaicTile key={g.id + "-" + i} g={g} cs={cs} rs={rs} col={col} row={row} cend={cend} note={notes && notes[g.id]} />
      ))}
    </div>
  );
}

// ---- Library grid (explicit curated order from game-list.txt) ----
function ArcLibrary({ section, kicker, title, accent, neon, sticky, defaultCollapsed = false, layout = "grid" }) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const items = React.useMemo(
    () => (window.sectionGames ? window.sectionGames(section) : []).filter((g) => g !== undefined),
    [section],
  );
  const games = React.useMemo(() => items.filter(Boolean), [items]);
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
        layout === "mosaic" ? (
          <div style={{ padding: "0 40px" }}>
            <MosaicGrid items={items} accent={accent} neon={neon} sticky={sticky} />
          </div>
        ) : layout === "shelf" ? (
          <CartridgeShelfRows items={items} games={games} accent={accent} neon={neon} />
        ) : layout === "wall" ? (
          <CoverWallGrid games={games} neon={neon} />
        ) : (
          <div
            style={{
              padding: "0 40px 40px",
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
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

// ---- Unfinished business (started, stalled, may resume) ----
// Case-file card: stamped cover + dossier rows. Status tag: PAUSED (amber) / DROPPED (red).
function ArcCaseFile({ u, accent, neon, sticky }) {
  const g = u.g;
  const [failed, setFailed] = React.useState(false);
  const dropped = u.status === "dropped";
  const tagBg = dropped ? "#e0344f" : sticky;
  const tagInk = dropped ? "#fff2f4" : "#0d0d18";
  const rows = [
    ["REASON", u.reason],
    ["VERDICT", u.verdict],
  ].filter((r) => r[1]);
  return (
    <div style={{ background: "#14141f", padding: "10px 10px 8px", border: "3px solid #3a3a2f", boxShadow: "inset 0 0 0 2px #0d0d18, 4px 4px 0 #000", position: "relative" }}>
      <div style={{ position: "relative", background: "#000", overflow: "hidden", aspectRatio: "16 / 9", width: "100%", boxShadow: "inset 0 0 30px rgba(0,0,0,0.8)" }}>
        {g.img && !failed ? (
          <img src={g.img} alt={g.title} onError={() => setFailed(true)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: dropped ? "saturate(0.85) contrast(1.05) brightness(0.9)" : "saturate(1.15) contrast(1.05)" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PIXEL, fontSize: 8, color: neon, textAlign: "center", padding: 10, background: "#0a0a1a" }}>{g.title.toUpperCase()}</div>
        )}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 3px)" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
        <div style={{ position: "absolute", top: 8, left: 8, zIndex: 3, fontFamily: PIXEL, fontSize: 7, letterSpacing: "0.14em", color: tagInk, background: tagBg, padding: "4px 6px", boxShadow: dropped ? "2px 2px 0 #000, 0 0 12px rgba(224,52,79,0.5)" : "2px 2px 0 #000" }}>
          {dropped ? "DROPPED" : "PAUSED"}
        </div>
      </div>
      <div style={{ marginTop: 8, minWidth: 0, minHeight: 14, display: "flex", alignItems: "center" }}>
        <FitCaption text={g.title} max={7} min={4.5} style={{ fontFamily: PIXEL, lineHeight: 1.45, color: "#e8e8f0", letterSpacing: "0.02em" }} />
      </div>
      {rows.length > 0 && (
        <div style={{ marginTop: 9, background: "#26261c", border: "1px solid #4a4a37", padding: "9px 10px" }}>
          {rows.map(([k, v], i) => (
            <div key={k} style={{ display: "grid", gap: 3, fontSize: 17, lineHeight: 1.3, marginTop: i ? 7 : 0, paddingTop: i ? 7 : 0, borderTop: i ? "1px solid #3a3a2c" : "none" }}>
              <span style={{ fontFamily: PIXEL, fontSize: 6, letterSpacing: "0.1em", color: "#c9b872" }}>{k}</span>
              <span style={{ color: k === "VERDICT" && dropped ? "#f0a3ad" : "#e6e4d3" }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArcUnfinished({ accent, neon, sticky }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const entries = React.useMemo(
    () => (window.UNFINISHED || []).map((u) => ({ ...u, g: GAMES_BY_ID[u.id] })).filter((u) => u.g),
    [],
  );
  if (!entries.length) return null;
  return (
    <div>
      <ArcSectionHead
        kicker="SHELVED · NOT DONE"
        title="UNFINISHED BUSINESS"
        accent={accent}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        count={entries.length}
      />
      {!collapsed && (
        <>
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
            ► PUT DOWN, NOT GIVEN UP — SAVE FILES STILL WARM
          </div>
          <div
            style={{
              padding: "0 40px 40px",
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 14,
            }}
          >
            {entries.map((u) => (
              <ArcCaseFile key={u.id} u={u} accent={accent} neon={neon} sticky={sticky} />
            ))}
          </div>
        </>
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
          sticky={sticky}
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
          section="uni"
          kicker="MAIN QUEST"
          title="UNI → PRESENT DAY"
          accent={accent}
          neon={neon}
          sticky={sticky}
          layout="mosaic"
        />
        <div id="arc-unfinished">
          <ArcUnfinished accent={accent} neon={neon} sticky={sticky} />
        </div>
        <ArcLibrary
          section="childhood"
          kicker="ORIGIN STORY"
          title="CRT CHILDHOOD"
          accent={accent}
          neon={neon}
          sticky={sticky}
          layout="shelf"
        />
        <ArcLibrary
          section="online"
          kicker="VERSUS MODE"
          title="ONLINE ARENA"
          accent={accent}
          neon={neon}
          sticky={sticky}
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
