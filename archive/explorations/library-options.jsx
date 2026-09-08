// library-options.jsx — alternative UI treatments for the library sections.
// Same arcade/CRT vocabulary as arcade.jsx, but each option gives the long
// game lists a distinct rhythm instead of the repeated 4-column cover grid.

const C = {
  bg: "#0d0d18",
  panel: "#1a1a2e",
  panel2: "#16162b",
  border: "#2a2a44",
  accent: "#ff2e88",
  neon: "#00e5ff",
  sticky: "#fff066",
  gold: "#ffd23e",
  text: "#e8e8f0",
  dim: "rgba(232,232,240,0.5)",
  dim2: "rgba(232,232,240,0.32)",
};
const PIXEL = '"Press Start 2P", ui-monospace, monospace';
const MONO = '"VT323", ui-monospace, "Courier New", monospace';

if (typeof document !== "undefined" && !document.getElementById("arc-fonts")) {
  const l = document.createElement("link");
  l.id = "arc-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Caveat:wght@600;700&display=swap";
  document.head.appendChild(l);
}

// Genre → hue, used to colour-code spines / genre stacks.
const GENRE_COLOR = {
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
};
const genreColor = (tag) => GENRE_COLOR[tag] || C.neon;

// Curated demo slice: the "UNI → PRESENT DAY" main-quest library, newest first.
const LIB = GAMES.filter((g) => g.era === "uni" && !g.online).sort(
  (a, b) => b.year - a.year,
);

// ── shared cover image with graceful fallback ──────────────────────────────
function Cover({ g, fit = "cover", radius = 0 }) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [g.img]);
  if (g.img && !failed)
    return (
      <img
        src={g.img}
        alt={g.title}
        onError={() => setFailed(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: fit,
          display: "block",
          borderRadius: radius,
          filter: "saturate(1.15) contrast(1.05)",
        }}
      />
    );
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: PIXEL,
        fontSize: 8,
        color: C.neon,
        textAlign: "center",
        padding: 8,
        background: "radial-gradient(ellipse at center,#2a1a3e 0%,#000 100%)",
      }}
    >
      {g.title.toUpperCase()}
    </div>
  );
}

function ScreenFX({ glow }) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(0deg,rgba(0,0,0,0.28) 0 1px,transparent 1px 3px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,0.5) 100%)",
        }}
      />
      {glow && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            boxShadow: `inset 0 0 40px ${glow}40`,
          }}
        />
      )}
    </>
  );
}

// small badge pips reused across options
function Badges({ g, size = 8 }) {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
      {g.goty && (
        <span
          style={{
            fontFamily: PIXEL,
            fontSize: size - 1,
            color: "#0d0d18",
            background: C.gold,
            padding: "3px 5px",
            boxShadow: "2px 2px 0 #000",
            letterSpacing: "0.05em",
          }}
        >
          ★{String(g.goty).slice(0, 4) === "All-" ? "GOTY" : ` ${g.goty}`}
        </span>
      )}
      {g.platinum && (
        <span
          style={{
            fontFamily: PIXEL,
            fontSize: size - 1,
            color: C.neon,
            border: `2px solid ${C.neon}`,
            background: "#0a0a1a",
            padding: "2px 5px",
            boxShadow: `0 0 8px ${C.neon}44`,
          }}
          title="PLATINUM"
        >
          PLAT
        </span>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   OPTION 1 — HIGH SCORE TABLE
   The arcade high-score screen as a library. Dense, scannable rows: rank,
   thumbnail, title, year, genre, trophies. Ideal for the big back-catalogs.
   ════════════════════════════════════════════════════════════════════════ */
function HighScoreTable() {
  const [hover, setHover] = React.useState(-1);
  const rows = LIB.slice(0, 14);
  return (
    <div
      style={{
        border: `3px solid ${C.border}`,
        background: C.panel2,
        boxShadow: "6px 6px 0 #000",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "62px 56px 1fr 84px 150px 110px",
          alignItems: "center",
          padding: "12px 18px",
          borderBottom: `2px solid ${C.accent}`,
          fontFamily: PIXEL,
          fontSize: 8,
          letterSpacing: "0.14em",
          color: C.dim,
          background: "#0a0a1a",
        }}
      >
        <span style={{ color: C.accent }}>RANK</span>
        <span></span>
        <span>TITLE</span>
        <span>YEAR</span>
        <span>GENRE</span>
        <span style={{ textAlign: "right", color: C.neon }}>TROPHIES</span>
      </div>
      {rows.map((g, i) => {
        const on = hover === i;
        return (
          <div
            key={g.id}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(-1)}
            style={{
              display: "grid",
              gridTemplateColumns: "62px 56px 1fr 84px 150px 110px",
              alignItems: "center",
              padding: "9px 18px",
              borderBottom: `1px solid ${C.border}`,
              background: on
                ? `linear-gradient(90deg, ${C.accent}1f, transparent)`
                : i % 2
                  ? "rgba(255,255,255,0.015)"
                  : "transparent",
              transition: "background 0.12s",
            }}
          >
            <span
              style={{
                fontFamily: PIXEL,
                fontSize: 13,
                color: i < 3 ? C.gold : C.dim,
                textShadow: i < 3 ? `0 0 10px ${C.gold}66` : "none",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div
              style={{
                width: 40,
                height: 40,
                position: "relative",
                overflow: "hidden",
                border: `2px solid ${C.border}`,
                background: "#000",
              }}
            >
              <Cover g={g} />
              <ScreenFX />
            </div>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 22,
                lineHeight: 1,
                color: on ? "#fff" : C.text,
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                paddingRight: 12,
              }}
            >
              {g.title}
            </span>
            <span style={{ fontFamily: PIXEL, fontSize: 9, color: C.neon }}>
              {g.year}
            </span>
            <span
              style={{
                fontFamily: PIXEL,
                fontSize: 7,
                color: genreColor(g.tag),
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {g.tag}
            </span>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Badges g={g} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   OPTION 2 — CARTRIDGE SHELF
   A physical rack of game spines. Hover ejects the cart and reveals the
   cover. Reads as a collection you own, not a feed. Great for browsing depth.
   ════════════════════════════════════════════════════════════════════════ */
function CartridgeShelf() {
  const [active, setActive] = React.useState(-1);
  const shelf = LIB.slice(0, 16);
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          padding: "30px 18px 0",
          background: C.panel2,
          border: `3px solid ${C.border}`,
          borderBottom: "none",
          minHeight: 250,
        }}
      >
        {shelf.map((g, i) => {
          const on = active === i;
          const col = genreColor(g.tag);
          return (
            <div
              key={g.id}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(-1)}
              style={{
                width: 46,
                height: on ? 218 : 200,
                marginBottom: on ? 18 : 0,
                position: "relative",
                cursor: "pointer",
                transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
                flexShrink: 0,
              }}
            >
              {/* cover pops above the spine on hover */}
              <div
                style={{
                  position: "absolute",
                  bottom: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginBottom: 8,
                  width: 150,
                  aspectRatio: "16/9",
                  border: `3px solid ${col}`,
                  background: "#000",
                  boxShadow: `4px 4px 0 #000, 0 0 18px ${col}66`,
                  overflow: "hidden",
                  opacity: on ? 1 : 0,
                  pointerEvents: "none",
                  transition: "opacity 0.15s",
                  zIndex: 5,
                }}
              >
                <Cover g={g} />
                <ScreenFX glow={col} />
              </div>
              {/* the spine */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: on ? "#22223c" : C.panel,
                  border: `2px solid ${C.border}`,
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
                    width: 22,
                    height: 8,
                    background: "#0a0a1a",
                    border: `1px solid ${C.border}`,
                  }}
                />
                <div
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    fontFamily: MONO,
                    fontSize: 17,
                    lineHeight: 1,
                    color: on ? "#fff" : C.text,
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
                    color: g.platinum ? C.neon : C.dim2,
                  }}
                >
                  {g.platinum ? "◆" : g.goty ? "★" : "·"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* shelf plank */}
      <div
        style={{
          height: 16,
          background: `linear-gradient(180deg, ${C.accent}, #8a1a4c)`,
          border: `3px solid ${C.border}`,
          boxShadow: "6px 6px 0 #000",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   OPTION 3 — COVER WALL
   Image-forward poster gallery. Big covers, minimal chrome, title slides up
   on hover, GOTY corner ribbon. For sections where the art should carry it.
   ════════════════════════════════════════════════════════════════════════ */
function CoverWall() {
  const [hover, setHover] = React.useState(-1);
  const wall = LIB.slice(0, 12);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
      }}
    >
      {wall.map((g, i) => {
        const on = hover === i;
        return (
          <div
            key={g.id}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(-1)}
            style={{
              position: "relative",
              aspectRatio: "16/9",
              overflow: "hidden",
              border: `3px solid ${on ? C.neon : C.border}`,
              background: "#000",
              boxShadow: on ? `0 0 20px ${C.neon}55, 5px 5px 0 #000` : "4px 4px 0 #000",
              cursor: "pointer",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
          >
            <Cover g={g} />
            <ScreenFX glow={on ? C.neon : null} />
            {/* GOTY corner ribbon */}
            {g.goty && (
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: -34,
                  transform: "rotate(-45deg)",
                  width: 120,
                  textAlign: "center",
                  background: C.gold,
                  color: "#0d0d18",
                  fontFamily: PIXEL,
                  fontSize: 6,
                  padding: "3px 0",
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
                  top: 8,
                  right: 8,
                  fontFamily: PIXEL,
                  fontSize: 6,
                  color: C.neon,
                  background: "#0a0a1a",
                  border: `2px solid ${C.neon}`,
                  padding: "3px 4px",
                  boxShadow: `0 0 8px ${C.neon}55`,
                }}
              >
                PLAT
              </div>
            )}
            {/* title bar */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "20px 10px 8px",
                background:
                  "linear-gradient(180deg, transparent, rgba(5,5,12,0.92))",
                transform: on ? "translateY(0)" : "translateY(0)",
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 19,
                  lineHeight: 1,
                  color: "#fff",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {g.title}
              </div>
              <div
                style={{
                  marginTop: 5,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: PIXEL,
                  fontSize: 6,
                  letterSpacing: "0.1em",
                }}
              >
                <span style={{ color: C.neon }}>{g.year}</span>
                <span style={{ color: genreColor(g.tag), textTransform: "uppercase" }}>
                  {g.tag}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   OPTION 4 — GENRE STACKS
   Browse by what you like. Columns grouped by genre with a marquee header
   and a count; compact cover bars stack vertically. Turns one long list
   into a few short, themed ones.
   ════════════════════════════════════════════════════════════════════════ */
function GenreStacks() {
  const groups = React.useMemo(() => {
    const m = {};
    LIB.forEach((g) => {
      (m[g.tag] = m[g.tag] || []).push(g);
    });
    return Object.entries(m)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 4);
  }, []);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 14,
        alignItems: "start",
      }}
    >
      {groups.map(([tag, list]) => {
        const col = genreColor(tag);
        return (
          <div
            key={tag}
            style={{
              background: C.panel2,
              border: `3px solid ${C.border}`,
              borderTop: `4px solid ${col}`,
              boxShadow: "5px 5px 0 #000",
            }}
          >
            <div
              style={{
                padding: "12px 12px 10px",
                borderBottom: `2px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: `linear-gradient(90deg, ${col}1f, transparent)`,
              }}
            >
              <span
                style={{
                  fontFamily: PIXEL,
                  fontSize: 8,
                  color: col,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {tag}
              </span>
              <span style={{ fontFamily: PIXEL, fontSize: 7, color: C.dim }}>
                {String(list.length).padStart(2, "0")}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {list.slice(0, 6).map((g) => (
                <div
                  key={g.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "8px 10px",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 26,
                      flexShrink: 0,
                      position: "relative",
                      overflow: "hidden",
                      border: `1px solid ${C.border}`,
                      background: "#000",
                    }}
                  >
                    <Cover g={g} />
                    <ScreenFX />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 16,
                        lineHeight: 1,
                        color: C.text,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {g.title}
                    </div>
                    <div
                      style={{
                        fontFamily: PIXEL,
                        fontSize: 6,
                        color: C.dim,
                        marginTop: 3,
                      }}
                    >
                      {g.year}
                      {g.platinum ? "  ◆" : ""}
                      {g.goty ? "  ★" : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE SHELL
   ════════════════════════════════════════════════════════════════════════ */
const OPTIONS = [
  {
    n: "01",
    title: "HIGH SCORE TABLE",
    rec: "Best for the big back-catalogs (childhood, online).",
    why: "An arcade high-score screen as a library. Dense, scannable rows — rank, thumbnail, year, genre, trophies — so 30+ titles read fast instead of becoming an endless wall of identical cards. The most information-dense of the four.",
    render: HighScoreTable,
  },
  {
    n: "02",
    title: "CARTRIDGE SHELF",
    rec: "Best as the hero treatment for one signature section.",
    why: "A physical rack of game spines, colour-coded by genre. Hover ejects the cartridge and reveals its cover. Reads as a collection you own rather than a feed — tactile and memorable, though it shows fewer titles at once.",
    render: CartridgeShelf,
  },
  {
    n: "03",
    title: "COVER WALL",
    rec: "Best where the box art should carry the section.",
    why: "Image-forward poster gallery. Bigger covers, minimal chrome, title slides over the art, GOTY gets a corner ribbon. Same grid DNA as today but with far more presence — a clean upgrade if you want to keep a grid.",
    render: CoverWall,
  },
  {
    n: "04",
    title: "GENRE STACKS",
    rec: "Best for 'browse by what I like' — Souls, open-world, co-op…",
    why: "Splits one long list into a few short, themed columns with marquee headers and counts. Turns the library into something you explore by taste instead of scrolling top-to-bottom. Pairs naturally with your genre tags.",
    render: GenreStacks,
  },
];

function OptionBlock({ o }) {
  const Render = o.render;
  return (
    <section style={{ marginBottom: 78 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 18,
          marginBottom: 22,
        }}
      >
        <div
          style={{
            fontFamily: PIXEL,
            fontSize: 26,
            color: C.accent,
            textShadow: `3px 3px 0 #000`,
            lineHeight: 1,
            flexShrink: 0,
            paddingTop: 2,
          }}
        >
          {o.n}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <h2
              style={{
                fontFamily: PIXEL,
                fontSize: 18,
                margin: 0,
                color: C.text,
                letterSpacing: "0.04em",
              }}
            >
              {o.title}
            </h2>
            <div
              style={{
                flex: 1,
                height: 2,
                background: `repeating-linear-gradient(90deg, ${C.accent} 0 8px, transparent 8px 14px)`,
                minWidth: 30,
              }}
            />
          </div>
          <div
            style={{
              fontFamily: PIXEL,
              fontSize: 8,
              color: C.neon,
              letterSpacing: "0.08em",
              marginTop: 12,
            }}
          >
            ► {o.rec}
          </div>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 19,
              lineHeight: 1.35,
              color: C.dim,
              margin: "8px 0 0",
              maxWidth: 760,
            }}
          >
            {o.why}
          </p>
        </div>
      </div>
      <Render />
    </section>
  );
}

function LibraryOptions() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        position: "relative",
      }}
    >
      {/* grid overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.06,
          backgroundImage: `linear-gradient(${C.neon}60 1px, transparent 1px), linear-gradient(90deg, ${C.neon}60 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* header */}
      <div
        style={{
          borderBottom: `3px solid ${C.accent}`,
          background: C.panel,
          padding: "26px 40px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <a
            href="../index.html"
            style={{
              fontFamily: PIXEL,
              fontSize: 8,
              color: C.dim,
              textDecoration: "none",
              letterSpacing: "0.12em",
            }}
          >
            ◄ BACK TO LIBRARY
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18 }}>
            <div
              style={{
                width: 14,
                height: 14,
                background: C.accent,
                boxShadow: `0 0 12px ${C.accent}`,
              }}
            />
            <h1
              style={{
                fontFamily: PIXEL,
                fontSize: 20,
                margin: 0,
                letterSpacing: "0.04em",
                color: "#fff",
                textShadow: `0 0 12px ${C.accent}55`,
              }}
            >
              LIBRARY LAYOUT · OPTIONS
            </h1>
          </div>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 21,
              lineHeight: 1.4,
              color: C.dim,
              margin: "16px 0 0",
              maxWidth: 820,
            }}
          >
            Right now the last three sections — UNI → PRESENT DAY, WHERE IT BEGAN and
            ONLINE ARENA — all share one 4-column cover grid, so they blur together.
            Here are four alternative treatments, shown with your real games. Mix and
            match: give each section a different layout to build rhythm down the page.
          </p>
        </div>
      </div>
      {/* options */}
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "50px 40px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {OPTIONS.map((o) => (
          <OptionBlock key={o.n} o={o} />
        ))}
        <div
          style={{
            fontFamily: PIXEL,
            fontSize: 8,
            color: C.dim2,
            letterSpacing: "0.14em",
            textAlign: "center",
            borderTop: `2px solid ${C.border}`,
            paddingTop: 30,
          }}
        >
          ► PICK ANY COMBINATION AND I'LL WIRE IT INTO THE MAIN PAGE ◄
        </div>
      </div>
      {/* global scanlines */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 50,
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0 1px, transparent 1px 3px)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}

window.LibraryOptions = LibraryOptions;
