# GameScorer Hub + Shared Base — Design

## Problem

GameScorer has two standalone, single-file card-game scorer apps (Scopa, Skull King), each self-contained (HTML+CSS+JS in one file), deployed as separate pages on GitHub Pages. There is no entry point tying them together, and no shared structure — adding a third scorer means copy-pasting a whole file and re-deriving the same UI patterns (screens, cards, buttons, history lists, steppers) from scratch.

Goal: a hub page that lists all scorers, and a small shared CSS/JS layer so new scorers reuse proven structural patterns instead of reinventing them, while keeping each game's own visual identity.

## Architecture

Static multi-page site, no build tooling, no framework. Same GitHub Pages deploy model as today (`https://hugorichar.github.io/GameScorer/<game>/`).

```
GameScorer/
├── index.html            (hub / launcher)
├── shared/
│   ├── base.css           (shared structural component styles)
│   └── base.js             (shared screen-nav / confirm helpers)
├── scopa/
│   └── index.html          (reworked: links shared/, own theme)
└── skull-king/
    └── index.html          (reworked: links shared/, own theme)
```

### Hub (`/index.html`)

Simple game list/launcher. Own neutral visual identity, distinct from any individual game's theme (see Visual Direction below). Cards (icon, name, short tagline) built from a hardcoded JS array in the page, linking to `<game>/index.html`. No persistence, no "last played" — pure launcher.

### Shared layer (`/shared/`)

- `base.css` — the structural component classes duplicated across both existing games today: `.screen`/`.screen.active`, `.card`/`.card-title`, `.btn`/`.btn-primary`/`.btn-secondary`/`.btn-danger`/`.btn-sm`, grid/players-grid patterns, history list rows, mode-selector buttons, winner-dot selector, stepper/counter controls, scrollbar reset. All colors, fonts, radii, and shadows are driven by CSS custom properties (`--bg`, `--card`, `--card2`, `--accent`, `--accent-light`, `--text`, `--muted`, `--border`, `--shadow`, `--radius`, `--font-display`, `--font-body`) with sane fallback defaults; each game defines its own values on `:root` in its own `<style>` block to get its own theme without touching shared code.
- `base.js` — only what's genuinely duplicated today: `showScreen(id)` screen-nav helper, and a small confirm-before-destructive-action wrapper (used by "New Game"/"Restart"). Game-specific state and scoring logic stay local to each game's file — no shared "framework", just the two functions that were byte-for-byte identical in both files.
- Both linked via plain `<link>`/`<script>` tags — no bundler, no build step, works identically to opening the file directly or via GitHub Pages.

### Games (`/scopa/index.html`, `/skull-king/index.html`)

Reworked to link `shared/base.css` and `shared/base.js`. Their own `<style>` blocks shrink to: theme variable overrides + any genuinely game-specific rules (Scopa's scopa-counter, Skull King's bonus-fields/stepper details, etc.). Game state, scoring rules, and screen content are untouched functionally — this is a structural/visual rework, not a rules or feature change. Each game gets a small "← Hub" link back to `/index.html`.

### Extensibility

Adding a new scorer later: new folder + `index.html` that links `shared/base.css`/`base.js`, defines its own theme variables, writes its own game logic — plus one entry added to the hub's game array. Nothing else changes.

## Visual Direction

Explicit user instruction: **be creative, avoid AI-slop visuals.** Concretely, that means avoiding generic patterns: default purple/blue gradient heroes, glassmorphism-for-its-own-sake, Inter/system-font-everywhere, generic rounded-card-with-drop-shadow grids, emoji used as the entire visual identity, boilerplate "feature grid" layouts.

Each surface gets its own considered identity rather than one reused skin:

- **Scopa** keeps and refines its Italian-tavern gold/cream/burgundy palette and serif pairing (Playfair Display + Crimson Pro) — already has a real point of view, worth preserving through the rework.
- **Skull King** keeps and refines its navy/gold pirate-map identity (Cinzel + Crimson Text) — same reasoning.
- **Hub** needs its own distinct identity — not a neutral "template chooser" screen, not a reuse of either game's palette. Concept: a small personal collection/shelf of games rather than a SaaS dashboard — think a card table / games-cabinet framing that lets each game's own accent color show through on its card (so the hub visually previews each game's identity) while the hub's own chrome (background, type, layout) stays its own thing.
- Exact palettes/type choices are a build-time creative decision, not locked numerically in this spec — the constraint is "distinct, intentional, no generic AI-dashboard look," not a fixed hex list.

## Non-Goals

- No localStorage / persistence / cross-session memory.
- No change to game rules or scoring logic.
- No build tooling, no framework, no dependency additions.
- No automated test suite (matches existing project — none today).

## Testing

Manual, in-browser, per the project's existing practice (no test framework in this repo):
1. Open hub — verify game cards render and link correctly.
2. Open each game from the hub — verify visuals intact/improved, "← Hub" link works.
3. Play a full round in each game — verify scoring/history/undo/win-screen behavior unchanged from pre-rework.
4. Verify relative paths still resolve as documented (`/scopa/`, `/skull-king/` GitHub Pages URLs).
