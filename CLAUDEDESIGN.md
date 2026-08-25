# Johnny's Game Library

Static site — no build step. Open `index.html` in a browser.

## What to read first

| File               | What it is                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `index.html`       | App shell: loads React/Babel, sets theme tweak defaults, renders `<Arcade />`            |
| `games-data.js`    | All game data (`window.GAMES`, `window.GOTYS`). Image paths built from `IMG`             |
| `arcade.jsx`       | The whole UI — every section component (hero, GOTY, cover wall, cartridge shelf, footer) |
| `tweaks-panel.jsx` | Runtime theme/tweaks panel                                                               |

## Directories

- `img/` — game cover art (referenced by `games-data.js`)
- `icon/` — favicons
- `explorations/` — layout studies, not part of the live site
- `legacy/` — CSS/JS from the pre-React version, kept for reference only
- `screenshots/`, `scraps/`, `uploads/` — scratch material

Source of truth for the live page: `index.html` + `games-data.js` + `arcade.jsx`.
