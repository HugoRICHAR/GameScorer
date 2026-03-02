# 🎮 GameScorer

A collection of mobile-friendly HTML scoring apps for card games — no install needed, works directly in your browser or as a home screen app on iPhone.

---

## Games

| Game | File | Status |
|------|------|--------|
| 🃏 Scopa | `scopa/index.html` | ✅ Ready |
| ☠️ Skull King | `skull-king/index.html` | ✅ Ready |

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

## 📱 How to use on iPhone

1. Open the HTML file in **Safari**
2. Tap the **Share** button → **Add to Home Screen**
3. It will appear as an app icon on your home screen

---

## 🗂 Project Structure

```
GameScorer/
├── scopa/
│   └── index.html
├── skull-king/
│   └── index.html
└── README.md
```

---

## 🚀 GitHub Pages

Once enabled, the apps are accessible at:
- `https://YOUR_USERNAME.github.io/GameScorer/scopa/`
- `https://YOUR_USERNAME.github.io/GameScorer/skull-king/`
