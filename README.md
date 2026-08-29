# Handoff: Johnny's Game Library (arcade / CRT direction)

## Overview
A single-page personal game library site. It presents a lifetime of games as an arcade
cabinet / CRT interface: a player-profile header, a "Now Playing" hero carousel with
platform-shaped chrome (PC tower + monitor, PS5 + TV, Switch handheld), a horizontal
Game-of-the-Year champions timeline, and three collapsible library sections rendered in
three different visual modes (poster wall, cartridge shelf, card grid).

Repo: `jo-muuuuuu/game-library` (branch `main`). **The project files here are ahead of
that repo** — treat this bundle, not the repo, as current.

## About the design files
Unlike a pure mock, this bundle **is a working static site**, not a throwaway prototype:
no build step, React + Babel loaded from CDN and JSX transpiled in the browser.

That means two valid paths, and you should pick one deliberately:

1. **Keep as static site** (recommended if it stays a personal site): keep the file
   structure, but move off in-browser Babel — precompile `arcade.jsx` with Vite/esbuild
   and pin React to the production UMD builds (currently the `.development.js` ones).
2. **Port into a real app** (Next/Vite/Astro): treat the files as high-fidelity design
   reference and rebuild with the target codebase's component and styling conventions.
   Every style in `arcade.jsx` is an inline JS object, so it maps to Tailwind /
   CSS-modules / styled-components mechanically.

Either way: **do not ship the current `index.html` as-is to production.** In-browser
Babel transpiles ~2,700 lines of JSX on every page load.

## Fidelity
**High fidelity.** Colors, typography, spacing, hover states, and animations are all
final. Recreate pixel-for-pixel.

## Files in this bundle
| File | Role |
| --- | --- |
| `index.html` | App shell. Loads React 18.3.1 / ReactDOM / Babel standalone from unpkg (pinned + SRI), declares `TWEAK_DEFAULTS`, restores tweaks from `localStorage`, renders `<Arcade />` |
| `games-data.js` | All content. Sets `window.GAMES` and `window.GOTYS`. Plain script, no module system |
| `arcade.jsx` | The entire UI — ~2,700 lines, every section component. Exports via `window.Arcade` |
| `tweaks-panel.jsx` | Runtime theme panel. `useTweaks()` hook + control components |
| `CLAUDEDESIGN.md` | Short orientation doc that lives at the project root |

### Assets
- `img/` — 80 game cover images (`.jpg` / `.png` / `.jpeg`, mixed). Paths are built in
  `games-data.js` from `const IMG = window.__IMG_BASE || './img'`, so you can retarget
  the whole set by setting `window.__IMG_BASE` before `games-data.js` loads (useful for
  a CDN or a Next `/public` path).
- `icon/orange.ico` — favicon.

Every cover has an `onError` fallback in `CRTCover` / `CoverScreen` / `CoverWallCard`
(renders a title-only pixel card), so a missing image degrades rather than breaks.

## Data model
`games-data.js` → `GAMES: Game[]`, `GOTYS` (year → game id mapping for the champions row).

```js
{
  id: 'elden-ring',              // unique slug, also the image basename
  title: 'Elden Ring',
  img: `${IMG}/elden-ring.jpg`,
  year: 2022,                    // release year, drives the timeline sort
  era: 'uni',                    // 'childhood' | 'uni' | 'current'  → which section
  tag: 'soulslike',              // genre; keys into ARC_GENRE_COLOR
  platinum: true,                // optional — renders the pixel trophy
  online: true,                  // optional — pulls it into the ONLINE ARENA section
  goty: '2022',                  // optional — year string, or 'All-Time'
  personalNote: 'line one\nline two', // optional — sticky-note text, \n = line break
}
```

Notes on the filtering rules, because they are non-obvious:
- `era` sections render `GAMES.filter(g => g.era === era)`.
- The `online` section is special-cased: `era === 'online'` selects `g.online === true`
  regardless of that game's own `era`.
- Profile STATS **exclude** `online: true` titles from the childhood/uni counts and
  report `online` as its own number, so a game is never double-counted.

## Screens / sections
There is one page. Top to bottom:

**1. Top bar** (`ArcTopBar`) — sticky. Left: wordmark. Right: anchor nav to
`#arc-now-playing`, `#arc-goty`, `#arc-library`, with an active-section highlight driven
by scroll position, and a palette switcher that calls `window.__setTweak`. Collapses to a
hamburger + dropdown on narrow widths.

**2. Player profile** (`ArcPlayerProfile`) — full bleed. Player name (`arcPlayerName`),
tagline (`arcTagline`), pixel-art platinum trophy with a count (`arcPlatinum`), and the
STATS block described above.

**3. Now Playing hero** (`ArcHero`) — full bleed, the centerpiece. A carousel over a
`NOW_PLAYING` array declared inline in `arcade.jsx` (not in `games-data.js` — move it
there if you want it data-driven). Each entry renders inside platform-appropriate chrome:
`PCMonitor` + `PCTowerCase`, `PS5TVDisplay`, or `SwitchHandheld`. The cover art sits
behind a `ScreenBezel` with `Scanlines` and a colored CRT glow.

**4. GOTY champions** (`ArcGOTY`) — horizontal scroller with left/right controls that
disable at each end (`atStart` / `atEnd` state). Multi-winner years use `StackedCards`, a
small fan-out stack with its own `activeIdx`.

**5. Library** (`ArcLibrary` ×3) — each has a collapsible `ArcSectionHead` (kicker,
title, count, toggle) and one of three layouts via the `layout` prop:
| Section | kicker / title | era | layout | default |
| --- | --- | --- | --- | --- |
| Main | `MAIN QUEST` / `UNI → PRESENT DAY` | `uni` | `wall` (`CoverWallGrid`) | expanded |
| Origin | `ORIGIN STORY` / `WHERE IT BEGAN` | `childhood` | `shelf` (`CartridgeShelfRows`, 11 per row) | collapsed |
| Online | `VERSUS MODE` / `ONLINE ARENA` | `online` | `grid` (default `CRTCover`) | collapsed |

**6. Footer** (`ArcFooter`) — contact links via `ArcContactLink` (inline SVG mail icon +
external links, hover-lift).

**Global overlays** — a fixed 40×40px grid of `neon` lines at `opacity: 0.07`,
`zIndex: 9`; and a full-page `<Scanlines opacity={0.12} />` on top.

## Layout system
- `body` background `#0d0d18`; `#root` is `min-height: 100vh`.
- Two width classes, defined in `index.html`:
  - `.arc-full-bleed` — `width: 100vw` (top bar, profile, hero, footer).
  - `.arc-shell` — `width: 1280px; max-width: 100%; margin: 0 auto`, collapsing to
    `100%` under 1280px (GOTY + library sections).
- `body { overflow-x: hidden }` — required, several sections overflow deliberately.
- Font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`.
  Monospace and pixel-flavored type inside `arcade.jsx` come from `letter-spacing` +
  uppercase + tight line-height, not a webfont — so there is **no font to license**.

## Design tokens
Themeable (props on `<Arcade />`, defaults in `index.html` `TWEAK_DEFAULTS`):
| Token | Default | Role |
| --- | --- | --- |
| `arcAccent` | `#ff2e88` | primary neon — buttons, borders, headings |
| `arcNeon` | `#00e5ff` | secondary neon — CRT glow, stats, year labels, grid overlay |
| `arcSticky` | `#fff066` | sticky-note background |
| `arcTagColor` | `#ff7e3e` | Now Playing badge text |
| `arcTagBg` | `#1a1a2e` | Now Playing badge background |
| `arcTagFont` | `#e8e8f0` | Now Playing badge secondary text |

Ship-ready alternate palettes (accent / neon / sticky), documented in `index.html`:
- Hot pink / Cyan / Yellow — `#ff2e88` `#00e5ff` `#fff066` (default)
- Orange / Blue / Gold — `#ff7e3e` `#3dc8ff` `#ffd23e`
- Lime / Pink / Cream — `#a3e635` `#ff6ec7` `#fef08a`
- Amber / Red / Teal — `#f7b801` `#ee4266` `#06a77d`

Fixed: page background `#0d0d18`, badge/panel dark `#1a1a2e`, light text `#e8e8f0`.

Genre colors (`ARC_GENRE_COLOR` in `arcade.jsx`, fallback `#00e5ff`) drive cartridge
spines and cover-wall hover edges — the map is the source of truth, read it directly.

Alpha convention: colors are composed as 8-digit hex string concatenation
(`` `${neon}60` ``), so any replacement token **must be a 6-digit hex string**, not
`rgb()` or a CSS variable.

## Interactions & behavior
- **Section collapse** — `ArcLibrary` local `collapsed` state; not persisted.
- **Hero carousel** — index state in `ArcHero`; platform chrome swaps with the entry.
- **GOTY scroller** — native horizontal scroll + buttons; end-detection disables arrows.
- **Hover** — cartridge spines and cover-wall cards lift and reveal a genre-colored edge
  (`on` boolean per card). Contact links lift on hover.
- **Image failure** — per-card `failed` state, reset on `g.img` change.
- **FitCaption / FitTitle** — measure-and-shrink: font size steps down until the text
  fits one line (`FitCaption` max 8.5 / min 4.5, in the card's own units).
  `FitTitle` breaks after a colon onto a second line, otherwise stays one line.
  These use `useRef` + measurement in an effect; a port must keep the measure pass or
  long titles will overflow.
- **PixelArt** — the pixel trophy and platform icons are rendered as box-shadow clone
  grids. There is a comment in `arcade.jsx` explaining that the parent must sit on an
  integer pixel offset or the art breaks into dots. Keep that constraint in mind if you
  wrap these in a layout with fractional positioning.

## State management
All local `useState`; no store, no router, no data fetching. The only persistence is the
tweaks object:
- `localStorage` key `johnny-lib-tweaks` — a partial of `TWEAK_DEFAULTS`, merged over the
  defaults at boot.
- A `tweakchange` window event writes each change back.
- `window.__setTweak` is the escape hatch `arcade.jsx` uses to change theme from the top
  bar.

If you port this: the tweaks panel is a **design-time tool, not a product feature.**
Drop `tweaks-panel.jsx`, the `useTweaks` hook, and the `localStorage` layer, and hard-code
the chosen palette — unless you want the palette switcher as a real user-facing control,
in which case keep only `arcAccent` / `arcNeon` / `arcSticky`.

## Suggested first task for Claude Code
> This is a working browser-Babel React site. Set up a Vite + React project, move
> `arcade.jsx` in as real modules (split the ~2,700-line file by section: hero, GOTY,
> library, cartridge, cover-wall, footer, shared pixel-art primitives), move
> `games-data.js` to a typed data module, drop the tweaks panel and hard-code the default
> palette as CSS custom properties, and copy `img/` + `icon/` into `public/`. Match the
> current rendering exactly — compare against the original `index.html` in a browser.
