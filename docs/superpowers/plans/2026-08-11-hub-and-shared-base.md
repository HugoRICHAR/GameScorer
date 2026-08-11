# GameScorer Hub + Shared Base Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a hub/launcher page listing all GameScorer apps, and a shared CSS/JS layer so Scopa and Skull King (and future games) reuse proven structural patterns instead of duplicating them, while each game keeps its own distinct theme.

**Architecture:** Static multi-page site, no build tooling, no framework, same GitHub Pages deploy model. New `shared/base.css` + `shared/base.js` provide structural primitives (reset, screen-nav, card, buttons, form inputs, stepper, hub-link) driven by CSS custom properties; each game defines its own values for those properties and keeps any genuinely game-specific CSS local. New root `index.html` is the hub — fully self-contained, its own distinct visual identity (not derived from either game's theme).

**Tech Stack:** Plain HTML/CSS/JS, Google Fonts via `<link>`, no dependencies, no package manager.

## Global Constraints

- No build tooling, no framework, no new dependencies (per spec Non-Goals).
- No change to game rules or scoring logic — this is a structural/visual rework only.
- No localStorage or persistence added (per spec Non-Goals).
- No automated test suite — this repo has none; verification is manual in-browser (per spec Testing section).
- Visual direction: distinct, intentional per-surface identity — no generic AI-dashboard look (purple gradients, glassmorphism-for-its-own-sake, default system fonts, generic shadow-card grids). Scopa and Skull King keep their existing gold/burgundy and navy/gold identities; the hub gets its own separate identity (per spec Visual Direction).
- Shared vars contract every game's `:root` must define: `--bg --card --card2 --primary --primary-light --text --text-dim --danger --border --shadow --font-display --font-body`. Optional (fall back to sane defaults if unset): `--primary-shadow --danger-light --danger-border`. Games may define additional custom vars beyond this contract for their own use.

---

## Task 1: Shared base layer + Scopa rework

**Files:**
- Create: `shared/base.css`
- Create: `shared/base.js`
- Modify: `scopa/index.html`

**Interfaces:**
- Produces: `.screen`/`.screen.active` CSS convention + global `showScreen(id)` JS function (used by Task 2's Skull King rework and any future game).
- Produces: CSS custom-property contract listed in Global Constraints above (used by Task 2 and Task 3).
- Produces: `.card`, `.card-title`, `.btn`/`.btn-primary`/`.btn-secondary`/`.btn-danger`/`.btn-sm`, `label`/`input[type=text]`/`input[type=number]`, `.player-input-row`, `.stepper`/`.stepper-btn`/`.stepper-val`, `.hub-link`, `.spacer`/`.divider`/`.text-center`/`.text-muted`/`.mt8`/`.pb-safe` CSS classes in `shared/base.css`.

- [ ] **Step 1: Create `shared/base.css`**

```css
/* ============================================================
   GameScorer — shared structural base
   Structural/behavioral primitives reused across scorer apps.
   Each game sets its own look by defining these custom
   properties on :root in its own <style> block (linked AFTER
   this file), and may override any rule below where its layout
   genuinely differs.

   Required per-game variables:
     --bg --card --card2 --primary --primary-light
     --text --text-dim --danger --border --shadow
     --font-display --font-body
   Optional (fall back to sane defaults if unset):
     --primary-shadow --danger-light --danger-border
   ============================================================ */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: var(--font-body, Georgia, serif);
  background: var(--bg, #111);
  color: var(--text, #eee);
  min-height: 100vh;
  min-height: -webkit-fill-available;
  overflow-x: hidden;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border, rgba(255,255,255,0.2)); border-radius: 4px; }

/* ── SCREENS ── */
.screen { display: none; min-height: 100vh; min-height: -webkit-fill-available; }
.screen.active { display: flex; flex-direction: column; }

/* ── HUB LINK ── */
.hub-link {
  position: fixed;
  top: 12px;
  left: 12px;
  font-family: var(--font-display);
  font-size: 0.8rem;
  color: var(--text-dim);
  text-decoration: none;
  letter-spacing: 0.05em;
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--card);
  z-index: 50;
  opacity: 0.85;
  transition: opacity 0.2s, color 0.2s, border-color 0.2s;
}
.hub-link:hover, .hub-link:active {
  opacity: 1;
  color: var(--primary);
  border-color: var(--primary);
}

/* ── CARD ── */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin: 0 16px 16px;
  box-shadow: var(--shadow);
}
.card-title {
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 14px;
}

/* ── FORM ELEMENTS ── */
label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-dim);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 5px;
}
input[type="text"], input[type="number"] {
  width: 100%;
  background: var(--card2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
  color: var(--text);
  font-family: var(--font-body);
  font-size: 1.05rem;
  outline: none;
  margin-bottom: 12px;
  transition: border-color 0.2s;
}
input:focus { border-color: var(--primary); }

/* ── BUTTONS ── */
.btn {
  display: block;
  width: calc(100% - 32px);
  margin: 0 16px 12px;
  padding: 16px;
  border: none;
  border-radius: 10px;
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}
.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0);
  transition: background 0.15s;
}
.btn:active::after { background: rgba(255,255,255,0.08); }

.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 50%, var(--primary) 100%);
  color: var(--bg);
  font-weight: 700;
  box-shadow: 0 2px 16px var(--primary-shadow, rgba(0,0,0,0.35));
}
.btn-secondary {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--border);
}
.btn-danger {
  background: transparent;
  color: var(--danger-light, var(--danger));
  border: 1px solid var(--danger-border, var(--danger));
  font-size: 0.9rem;
  padding: 12px;
}
.btn-sm {
  display: inline-block;
  width: auto;
  margin: 0;
  padding: 8px 18px;
  font-size: 0.9rem;
}

/* ── PLAYER INPUT ROW (numbered input, e.g. player-name entry) ── */
.player-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.player-input-row .player-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary);
  color: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  flex-shrink: 0;
}
.player-input-row input { margin-bottom: 0; flex: 1; }

/* ── STEPPER (− value + counter control) ── */
.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}
.stepper-btn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--border);
  background: var(--card2);
  color: var(--primary);
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}
.stepper-btn:first-child { border-radius: 6px 0 0 6px; border-right: none; }
.stepper-btn:last-child { border-radius: 0 6px 6px 0; border-left: none; }
.stepper-btn:hover { background: var(--primary); color: var(--bg); }
.stepper-val {
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--text);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--card2);
}

/* ── UTILS ── */
.spacer { flex: 1; }
.divider { height: 1px; background: var(--border); margin: 12px 16px; }
.text-center { text-align: center; }
.text-muted { color: var(--text-dim); font-size: 0.85rem; }
.mt8 { margin-top: 8px; }
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 16px); }
```

- [ ] **Step 2: Create `shared/base.js`**

```js
// ============================================================
// GameScorer — shared behavior helpers
// Pairs with the .screen / .screen.active classes in
// shared/base.css. Mark each top-level screen with
// class="screen" (plus class="active" on the one shown first),
// then call showScreen(id) to switch between them.
// ============================================================

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function (s) {
    s.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}
```

- [ ] **Step 3: Link shared files into `scopa/index.html`**

Edit `scopa/index.html`. Find:

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Crimson+Pro:wght@300;400;600&display=swap" rel="stylesheet">
<style>
```

Replace with:

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Crimson+Pro:wght@300;400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../shared/base.css">
<style>
```

Find:

```html
<script>
// ── STATE ──
```

Replace with:

```html
<script src="../shared/base.js"></script>
<script>
// ── STATE ──
```

- [ ] **Step 4: Replace Scopa's `:root` theme block**

Find:

```css
  :root {
    --bg: #1a0f00;
    --card: #2a1a08;
    --card2: #3a2510;
    --gold: #c9993a;
    --gold-light: #e8c46a;
    --cream: #f2e8d0;
    --muted: #8a7060;
    --accent: #8b2020;
    --accent-light: #c04040;
    --green: #2d6040;
    --green-light: #4a9060;
    --border: rgba(201,153,58,0.25);
    --shadow: 0 4px 24px rgba(0,0,0,0.5);
  }
```

Replace with:

```css
  :root {
    --bg: #1a0f00;
    --card: #2a1a08;
    --card2: #3a2510;
    --primary: #c9993a;
    --primary-light: #e8c46a;
    --primary-shadow: rgba(201,153,58,0.35);
    --text: #f2e8d0;
    --text-dim: #8a7060;
    --danger: #8b2020;
    --danger-light: #c04040;
    --danger-border: rgba(139,32,32,0.3);
    --border: rgba(201,153,58,0.25);
    --shadow: 0 4px 24px rgba(0,0,0,0.5);
    --font-display: 'Playfair Display', serif;
    --font-body: 'Crimson Pro', Georgia, serif;
  }
```

(`--green`/`--green-light` are dropped — unused anywhere else in the file.)

- [ ] **Step 5: Rename variable usages throughout the file**

Using find-and-replace-all (every occurrence in the file, including inline `style="..."` attributes and JS template strings), apply in this exact order:

1. `var(--gold-light)` → `var(--primary-light)`
2. `var(--gold)` → `var(--primary)`
3. `var(--accent-light)` → `var(--danger-light)`
4. `var(--muted)` → `var(--text-dim)`
5. `var(--cream)` → `var(--text)`

- [ ] **Step 6: Fix hardcoded hex colors to use the renamed vars**

Find:

```html
        <div class="player-num" style="background:#c9993a;">A</div>
```

Replace with:

```html
        <div class="player-num" style="background:var(--primary);">A</div>
```

Find:

```html
        <div class="player-num" style="background:#8b2020;">B</div>
```

Replace with:

```html
        <div class="player-num" style="background:var(--danger);">B</div>
```

- [ ] **Step 7: Delete CSS rules now provided by `shared/base.css`**

Delete each of the following blocks entirely (they are byte-for-byte superseded by base.css after Steps 4–5's renames):

Reset line — find and delete:
```css
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
```

Body rule — find and delete:
```css
  body {
    font-family: 'Crimson Pro', Georgia, serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    min-height: -webkit-fill-available;
    overflow-x: hidden;
  }
```
(Leave the `body::before` texture rule immediately below it — that stays, it's Scopa-specific.)

Screens block — find and delete:
```css
  /* ── SCREENS ── */
  .screen { display: none; min-height: 100vh; min-height: -webkit-fill-available; }
  .screen.active { display: flex; flex-direction: column; }
```

Card block — find:
```css
  /* ── CARD ── */
  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    margin: 0 16px 16px;
    box-shadow: var(--shadow);
  }
  .card-title {
    font-family: 'Playfair Display', serif;
    font-size: 0.75rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--primary);
    margin-bottom: 14px;
    opacity: 0.8;
  }
```
Replace with just the Scopa-specific delta (base.css's `.card-title` has no opacity, Scopa wants one):
```css
  .card-title { opacity: 0.8; }
```

Form elements block — find and delete:
```css
  /* ── FORM ELEMENTS ── */
  label {
    display: block;
    font-size: 0.85rem;
    color: var(--text-dim);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
  input[type="text"], input[type="number"] {
    width: 100%;
    background: var(--card2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 14px;
    color: var(--text);
    font-family: 'Crimson Pro', serif;
    font-size: 1.05rem;
    outline: none;
    margin-bottom: 12px;
    transition: border-color 0.2s;
  }
  input:focus { border-color: var(--primary); }
```

Buttons block — find and delete:
```css
  /* ── BUTTONS ── */
  .btn {
    display: block;
    width: calc(100% - 32px);
    margin: 0 16px 12px;
    padding: 16px;
    border: none;
    border-radius: 10px;
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0);
    transition: background 0.15s;
  }
  .btn:active::after { background: rgba(255,255,255,0.08); }

  .btn-primary {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 50%, var(--primary) 100%);
    color: var(--bg);
    font-weight: 700;
    box-shadow: 0 2px 16px rgba(201,153,58,0.35);
  }
  .btn-secondary {
    background: transparent;
    color: var(--primary);
    border: 1px solid var(--border);
  }
  .btn-danger {
    background: transparent;
    color: var(--danger-light);
    border: 1px solid rgba(139,32,32,0.3);
    font-size: 0.9rem;
    padding: 12px;
  }
  .btn-sm {
    display: inline-block;
    width: auto;
    margin: 0;
    padding: 8px 18px;
    font-size: 0.9rem;
  }
```

Player-input block — find and delete:
```css
  /* ── PLAYER INPUTS ── */
  .player-input-row {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
  }
  .player-input-row .player-num {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--primary);
    color: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 0.85rem;
    font-weight: 700;
    flex-shrink: 0;
  }
  .player-input-row input { margin-bottom: 0; flex: 1; }
```

Utils block — find and delete:
```css
  /* ── UTILS ── */
  .spacer { flex: 1; }
  .divider {
    height: 1px;
    background: var(--border);
    margin: 12px 16px;
  }
  .text-center { text-align: center; }
  .text-muted { color: var(--text-dim); font-size: 0.85rem; }
  .mt8 { margin-top: 8px; }
  .pb-safe { padding-bottom: env(safe-area-inset-bottom, 16px); }
```

Scrollbar block — find and delete:
```css
  /* scroll */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
```

- [ ] **Step 8: Move the scopa-count control onto the shared stepper component**

Find:

```css
  /* scopa count input */
  .scopa-count {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
  }
  .scopa-count button {
    width: 28px;
    height: 28px;
    border: 1px solid var(--border);
    background: var(--card2);
    color: var(--primary);
    font-size: 1.1rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
  .scopa-count .count-val {
    width: 28px;
    text-align: center;
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    color: var(--text);
  }
```

Delete it entirely (superseded by `shared/base.css`'s `.stepper`/`.stepper-btn`/`.stepper-val`).

Find, in the `buildScoringTable` function:

```js
      let tds = state.players.map((_, i) => `
        <td>
          <div class="scopa-count">
            <button onclick="adjScopa(${i},-1)">−</button>
            <span class="count-val" id="scopa-${i}">0</span>
            <button onclick="adjScopa(${i},1)">+</button>
          </div>
        </td>`).join('');
```

Replace with:

```js
      let tds = state.players.map((_, i) => `
        <td>
          <div class="stepper">
            <button class="stepper-btn" onclick="adjScopa(${i},-1)">−</button>
            <span class="stepper-val" id="scopa-${i}">0</span>
            <button class="stepper-btn" onclick="adjScopa(${i},1)">+</button>
          </div>
        </td>`).join('');
```

- [ ] **Step 9: Remove the now-duplicated local `showScreen` function**

Find and delete:

```js
// ── SCREEN NAV ──
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}
```

(`shared/base.js`, linked in Step 3, now provides this globally.)

- [ ] **Step 10: Add the hub-back link**

Find:

```html
<body>
<div id="app">
```

Replace with:

```html
<body>
<a href="../index.html" class="hub-link">← Hub</a>
<div id="app">
```

- [ ] **Step 11: Manual verification**

Open `scopa/index.html` directly in a browser (e.g. `file:///C:/Users/HugoR/Desktop/GameScorer/scopa/index.html`, or use the Claude Browser tool's `navigate`). Verify:
- Setup screen renders with the same gold/cream Scopa look as before (no visual regression).
- "← Hub" link is visible top-left (will 404 until Task 3 creates the hub — that's expected at this point).
- Switch mode Players ↔ Teams, set player count, start a game.
- In the round-entry table, the Scopa counter (now using `.stepper`) increments/decrements correctly and looks the same as the old `.scopa-count` control.
- Pick category winners, confirm a round, see history update with a working "undo".
- Play to the target score and confirm the win screen shows the right winner and scores.
- "New Game" and "Change Settings" both work.

- [ ] **Step 12: Commit**

```bash
git add shared/base.css shared/base.js scopa/index.html
git commit -m "$(cat <<'EOF'
Extract shared base layer, rework Scopa onto it

shared/base.css + base.js hold the structural patterns (screen-nav,
card, buttons, form inputs, stepper) that scorer apps share; Scopa's
own styles now only cover its theme variables and genuinely
game-specific rules.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Skull King rework onto shared base

**Files:**
- Modify: `skull-king/index.html`

**Interfaces:**
- Consumes: `shared/base.css`, `shared/base.js`, `.screen`/`.screen.active` convention, `showScreen(id)` — all from Task 1.

**Note on scope:** Skull King's button/card layout is genuinely different from Scopa's (inline-flex action-row buttons vs. full-width stacked buttons; centered max-width `<main>` vs. fixed mobile margins) — those rules stay local to Skull King rather than being forced to match base.css's defaults. What's shared here is what's actually identical or worth unifying: the reset, the scrollbar, the screen-nav mechanism, and the variable-naming contract.

- [ ] **Step 1: Link shared files into `skull-king/index.html`**

Find:

```html
<title>Skull King — Score Tracker</title>
<style>
```

Replace with:

```html
<title>Skull King — Score Tracker</title>
<link rel="stylesheet" href="../shared/base.css">
<style>
```

Find:

```html
<script>
// ═══ STATE ═══
```

Replace with:

```html
<script src="../shared/base.js"></script>
<script>
// ═══ STATE ═══
```

- [ ] **Step 2: Align Skull King's `:root` with the shared contract**

Find:

```css
  :root {
    --gold: #d4a017;
    --gold-light: #f0c040;
    --dark: #0d0d1a;
    --navy: #0f1e36;
    --navy-mid: #162848;
    --navy-light: #1e3560;
    --red: #8b1a1a;
    --red-light: #c0392b;
    --text: #e8d5b0;
    --text-dim: #a89070;
    --success: #2ecc71;
    --danger: #e74c3c;
  }
```

Replace with:

```css
  :root {
    --primary: #d4a017;
    --primary-light: #f0c040;
    --bg: #0d0d1a;
    --navy: #0f1e36;
    --card: #162848;
    --card2: #1e3560;
    --red: #8b1a1a;
    --red-light: #c0392b;
    --text: #e8d5b0;
    --text-dim: #a89070;
    --success: #2ecc71;
    --danger: #e74c3c;
    --border: rgba(212,160,23,0.25);
    --shadow: 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,160,23,0.1);
    --font-display: 'Cinzel', serif;
    --font-body: 'Crimson Text', Georgia, serif;
  }
```

(`--navy`, `--red`, `--red-light`, `--success` are kept as Skull-King-specific extras beyond the shared contract — they're used for things with no shared equivalent, like the header gradient and win/loss score chips.)

- [ ] **Step 3: Rename variable usages throughout the file**

Using find-and-replace-all (every occurrence, including inline `style="..."` attributes and JS template strings), apply in this exact order:

1. `var(--gold-light)` → `var(--primary-light)`
2. `var(--gold)` → `var(--primary)`
3. `var(--dark)` → `var(--bg)`
4. `var(--navy-mid)` → `var(--card)`
5. `var(--navy-light)` → `var(--card2)`

- [ ] **Step 4: Delete the now-redundant reset rule**

Find and delete:

```css
  * { box-sizing: border-box; margin: 0; padding: 0; }
```

(`shared/base.css` provides an equivalent, slightly more complete reset — adds `-webkit-tap-highlight-color: transparent`, a harmless touch-UX improvement.)

- [ ] **Step 5: Convert screen switching to the shared `.screen`/`.screen.active` pattern**

Find:

```css
  /* ═══ SETUP SCREEN ═══ */
  #setup-screen { display: block; }
  #game-screen { display: none; }
```

Delete it (replaced by the `.screen`/`.screen.active` rule from `shared/base.css`, driven by the classes added below).

Find:

```css
  /* ═══ GAME OVER ═══ */
  #gameover-screen { display: none; }
```

Replace with:

```css
  /* ═══ GAME OVER ═══ */
```

(keep the comment, drop the now-redundant display rule; the `.podium` rules immediately below stay.)

Find:

```html
<div id="setup-screen">
```

Replace with:

```html
<div id="setup-screen" class="screen active">
```

Find:

```html
<div id="game-screen">
```

Replace with:

```html
<div id="game-screen" class="screen">
```

Find:

```html
<div id="gameover-screen">
```

Replace with:

```html
<div id="gameover-screen" class="screen">
```

Find, in `startGame()`:

```js
  document.getElementById('setup-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';
  document.getElementById('gameover-screen').style.display = 'none';
```

Replace with:

```js
  showScreen('game-screen');
```

Find, in `showGameOver()`:

```js
  document.getElementById('game-screen').style.display = 'none';
  document.getElementById('gameover-screen').style.display = 'block';
```

Replace with:

```js
  showScreen('gameover-screen');
```

Find, in `confirmRestart()`:

```js
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('gameover-screen').style.display = 'none';
    document.getElementById('setup-screen').style.display = 'block';
```

Replace with:

```js
    showScreen('setup-screen');
```

- [ ] **Step 6: Add the hub-back link**

Find:

```html
<body>

<header>
```

Replace with:

```html
<body>
<a href="../index.html" class="hub-link">← Hub</a>

<header>
```

- [ ] **Step 7: Manual verification**

Open `skull-king/index.html` in a browser (`file:///C:/Users/HugoR/Desktop/GameScorer/skull-king/index.html`, or via Claude Browser's `navigate`). Verify:
- Setup screen renders with the same navy/gold pirate look as before.
- "← Hub" link visible top-left (404 until Task 3 — expected).
- Change pirate count, set names, toggle the "Bonus toujours accordés" option, start game.
- Enter bid/won and a couple of bonus fields for round 1, confirm the live score preview updates, validate the round.
- Go back a round with "← Manche préc.", confirm it re-loads for editing.
- Play through to round 10 and confirm the game-over podium renders correctly.
- Restart via "↩ Recommencer" (or "⚓ Nouvelle Partie" from game-over) returns cleanly to setup.
- Rules panel (bottom-right "?") opens/closes.

- [ ] **Step 8: Commit**

```bash
git add skull-king/index.html
git commit -m "$(cat <<'EOF'
Rework Skull King onto the shared base layer

Aligns Skull King's theme variables with the shared contract and
switches its screen-nav to the shared .screen/.screen.active +
showScreen() mechanism. Layout/button rules that are genuinely
game-specific stay local.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Hub page + cross-links + README

**Files:**
- Create: `index.html`
- Modify: `README.md`

**Interfaces:**
- Consumes: `scopa/index.html`, `skull-king/index.html` (link targets), and each game's `.hub-link` (created in Task 1 Step 10 / Task 2 Step 6) which points to `../index.html` — this task's `index.html` is what makes those links resolve.

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="GameScorer">
<title>GameScorer</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --felt: #0e2018;
    --paper: #f3ecd8;
    --paper-shadow: #d8cca4;
    --ink: #241c12;
    --ink-dim: #6b6152;
    --brass: #c9a227;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

  body {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    background: var(--felt);
    background-image:
      radial-gradient(ellipse 90% 60% at 50% -10%, rgba(201,162,39,0.10) 0%, transparent 55%),
      repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 14px);
    color: var(--paper);
    min-height: 100vh;
    min-height: -webkit-fill-available;
    overflow-x: hidden;
  }

  header {
    text-align: center;
    padding: 3.5rem 1.5rem 1.5rem;
  }
  header .kicker {
    font-size: 0.75rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--brass);
    opacity: 0.85;
  }
  h1 {
    font-family: 'Fraunces', serif;
    font-optical-sizing: auto;
    font-weight: 600;
    font-size: clamp(2.4rem, 8vw, 3.6rem);
    color: var(--paper);
    margin-top: 0.3rem;
    letter-spacing: -0.01em;
  }
  header p {
    color: var(--paper);
    opacity: 0.55;
    font-size: 0.95rem;
    margin-top: 0.5rem;
    font-style: italic;
    font-family: 'Fraunces', serif;
  }

  main {
    max-width: 620px;
    margin: 0 auto;
    padding: 1rem 1.25rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
  }

  .ticket {
    display: block;
    position: relative;
    background: var(--paper);
    color: var(--ink);
    text-decoration: none;
    border-radius: 6px;
    padding: 1.5rem 1.5rem 1.5rem 1.75rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.35), 0 2px 0 var(--paper-shadow);
    transform: rotate(var(--tilt, -1deg));
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .ticket:nth-child(even) { --tilt: 1.2deg; }
  .ticket:hover, .ticket:focus-visible {
    transform: rotate(0deg) translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.45), 0 2px 0 var(--paper-shadow);
  }
  .ticket::before {
    content: '';
    position: absolute;
    left: 0; top: 10%; bottom: 10%;
    width: 6px;
    border-radius: 3px;
    background: var(--accent, var(--brass));
  }
  .ticket::after {
    content: '';
    position: absolute;
    left: -3px; top: 50%;
    width: 10px; height: 10px;
    background: var(--felt);
    border-radius: 50%;
    transform: translateY(-50%);
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.15);
  }

  .ticket-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
  }
  .ticket-icon { font-size: 1.6rem; line-height: 1; }
  .ticket-name {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    font-size: 1.5rem;
    flex: 1;
  }
  .ticket-tag {
    margin-top: 0.4rem;
    font-size: 0.9rem;
    color: var(--ink-dim);
    line-height: 1.4;
  }
  .ticket-play {
    margin-top: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent, var(--brass));
    font-weight: 600;
  }
  .ticket-play::after { content: '→'; transition: transform 0.2s; }
  .ticket:hover .ticket-play::after { transform: translateX(3px); }

  footer {
    text-align: center;
    padding-bottom: 2.5rem;
    color: var(--paper);
    opacity: 0.35;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
  }
</style>
</head>
<body>

<header>
  <div class="kicker">The Cabinet</div>
  <h1>GameScorer</h1>
  <p>Pick a table.</p>
</header>

<main id="tickets"></main>

<footer>+ more scorers as they get made</footer>

<script>
const GAMES = [
  {
    name: 'Scopa',
    tagline: 'Italian trick-taking. Scopa, coins, primiera — first to 11.',
    icon: '🃏',
    href: 'scopa/index.html',
    accent: '#c9993a'
  },
  {
    name: 'Skull King',
    tagline: 'Pirate bidding across 10 rounds. Mind the mermaids.',
    icon: '☠️',
    href: 'skull-king/index.html',
    accent: '#d4a017'
  }
];

document.getElementById('tickets').innerHTML = GAMES.map(g => `
  <a class="ticket" href="${g.href}" style="--accent:${g.accent}">
    <div class="ticket-top">
      <span class="ticket-icon">${g.icon}</span>
      <span class="ticket-name">${g.name}</span>
    </div>
    <div class="ticket-tag">${g.tagline}</div>
    <div class="ticket-play">Play</div>
  </a>
`).join('');
</script>

</body>
</html>
```

- [ ] **Step 2: Update `README.md`**

Find:

```markdown
## 🗂 Project Structure

```
GameScorer/
├── scopa/
│   └── index.html
├── skull-king/
│   └── index.html
└── README.md
```
```

Replace with:

```markdown
## 🗂 Project Structure

```
GameScorer/
├── index.html
├── shared/
│   ├── base.css
│   └── base.js
├── scopa/
│   └── index.html
├── skull-king/
│   └── index.html
└── README.md
```
```

Find:

```markdown
## 🚀 GitHub Pages

Once enabled, the apps are accessible at:
- `https://hugorichar.github.io/GameScorer/scopa/`
- `https://hugorichar.github.io/GameScorer/skull-king/`
```

Replace with:

```markdown
## 🚀 GitHub Pages

Once enabled, the apps are accessible at:
- `https://hugorichar.github.io/GameScorer/` — hub, links to every scorer
- `https://hugorichar.github.io/GameScorer/scopa/`
- `https://hugorichar.github.io/GameScorer/skull-king/`
```

- [ ] **Step 3: Manual verification — full navigation loop**

Using the Claude Browser tool (or a local file:// browse):
1. Open `index.html`. Confirm both game tickets render (icon, name, tagline), tilted, with Scopa's gold left-edge stamp and Skull King's gold left-edge stamp, on the dark felt background.
2. Hover/click the Scopa ticket → lands on `scopa/index.html`. Click "← Hub" → returns to the hub.
3. Hover/click the Skull King ticket → lands on `skull-king/index.html`. Click "← Hub" → returns to the hub.
4. Confirm no console errors on any of the three pages (check via Claude Browser's `read_console_messages`).

- [ ] **Step 4: Commit**

```bash
git add index.html README.md
git commit -m "$(cat <<'EOF'
Add hub page linking to all scorer apps

Root index.html is the launcher (own visual identity, not derived
from either game's theme); README structure/URLs updated to match.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
