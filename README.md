# 🎮 GameScorer

A collection of mobile-friendly HTML scoring apps for card games — no install needed, works directly in your browser or as a home screen app on iPhone.

---

## Games

| Game | File | Status |
|------|------|--------|
| 🃏 Scopa | `scopa/index.html` | ✅ Ready |
| ☠️ Skull King | `skull-king/index.html` | ✅ Ready |
| 🎯 Darts (X01, Cricket) | `darts/index.html` | ✅ Ready |

---

## 🃏 Scopa

Classic Italian card game scorer.

**Features:**
- Players mode (2–4) or Teams mode (2 teams)
- Per-round scoring: Scopa count, Most Cards, Most Coins, ⭐ Bito Bello, Primiera
- Tie option for shared categories
- Customizable target score (default: 11 pts)
- Round history with undo
- Auto-detects winner when target is reached
- Dark gold themed UI, optimized for iPhone

---

## ☠️ Skull King

Pirate trick-taking game scorer (2–8 players, 10 rounds).

**Features:**
- Flexible player count (up to 8 pirates)
- Bid entry + tricks won per round
- Bonus tracking: Skull King captures, Mermaids, special 14-value cards
- Optional bonus mode toggle: apply bonuses even on missed bids (house rule)
- Round-by-round score history
- Running total leaderboard
- Dark navy pirate-themed UI

**Scoring rules:**
- Bid 0 and succeed: `+10 × round number`
- Bid exact and succeed: `+20 × bid` + bonuses
- Miss bid (either direction): `-10 × difference`
- Skull King captures a Pirate: `+30` per pirate
- Bonus mode toggle: standard (bonuses only on exact bid) or always (house rule)

---

## 🎯 Darts

X01 (301/501/701, straight/double/master out, sets & legs) and Cricket (20–15 + Bull, 2–4 players).

**Features:** per-dart input, live averages, checkout hints, undo, post-game stats, match history (stored on the device).

---

## 📱 How to use on iPhone

1. Open https://hugorichar.github.io/GameScorer/ in **Safari**
2. Tap **Share** → **Add to Home Screen**
3. It opens full-screen like an app; each game can also be added on its own from its page

In-progress games are saved on the device, so a reload or a closed tab picks up where you left off (the hub shows "Resume").

---

## 🗂 Project Structure

```
GameScorer/
├── index.html               hub
├── manifest.webmanifest     home-screen app (standalone, start = hub)
├── apple-touch-icon.png, icon-192.png, icon-512.png
├── shared/
│   ├── reset.css            baseline, safe areas, motion (screen-in, stagger, bump, confetti, bottom sheet)
│   ├── components.css       optional cards / buttons / stepper (Scopa)
│   └── base.js              showScreen() + GS helpers (esc, save/load, bump, tween, confetti)
├── scopa/        index.html + apple-touch-icon.png
├── skull-king/   index.html + apple-touch-icon.png
├── darts/        index.html + apple-touch-icon.png
└── README.md
```

---

## 🚀 GitHub Pages

Live (deployed from `main`, repo root):
- `https://hugorichar.github.io/GameScorer/` — hub, links to every scorer
- `https://hugorichar.github.io/GameScorer/scopa/`
- `https://hugorichar.github.io/GameScorer/skull-king/`
- `https://hugorichar.github.io/GameScorer/darts/`
