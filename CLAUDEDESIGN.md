# Johnny's Game Library

Static site, no build step. Open `index.html` in a browser.

## Writing rules
- Never use a dash character in any copy on this site or in these docs. No hyphen, no en dash, no em dash. Use a comma, a period, a colon, or the word "to" instead.
- Identifiers, file names and CSS keep their hyphens; the rule applies to prose the user reads.

## What to read first
| File | What it is |
| --- | --- |
| `index.html` | App shell: loads React/Babel, sets theme tweak defaults, renders `<Arcade />` |
| `games-data.js` | All game data (`window.GAMES`, `window.GOTYS`, `window.UNFINISHED`). Image paths built from `IMG` |
| `arcade.jsx` | The whole UI: every section component (hero, GOTY, cover wall, cartridge shelf, unfinished business, footer) |
| `tweaks-panel.jsx` | Runtime theme/tweaks panel |

## Directories
- `img/`: game cover art (referenced by `games-data.js`)
- `icon/`: favicons
- `explorations/`: layout studies, not part of the live site
- `legacy/`: CSS/JS from the pre React version, kept for reference only
- `screenshots/`, `scraps/`, `uploads/`: scratch material

## Badges
A game with `goty` set shows the ★ GOTY badge everywhere its cover appears, including the unfinished business case files. Winning GOTY does not require having finished the game.

Source of truth for the live page: `index.html` plus `games-data.js` plus `arcade.jsx`.
