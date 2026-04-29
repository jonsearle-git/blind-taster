# Handoff: Blind Taster — Splash Screen, Logo & Brand System

## Overview

**Blind Taster** is a collaborative party game for taste-testing food and wine. Players join a lobby, then each round answers a fun questionnaire about a numbered sample (e.g. "Glass C") and locks in their answers — flavors picked up, vibe rating, etc. — before everyone reveals.

This handoff covers the **brand system** (logo, palette, type, motifs, components) and the **splash screen** the user selected — *Tickertape* — plus reference designs for the lobby and round questionnaire screens.

## About the Design Files

The files in `reference/` are **HTML/JSX design references** built as React prototypes inside a self-contained Babel-in-the-browser environment. They are not production code.

Your task is to **recreate these designs in the project's target codebase** (React Native, SwiftUI, Flutter, or web — whichever is being used) using its established component library, theming system, and patterns. Treat the JSX as a precise specification of layout, colors, type, and component anatomy — not as files to copy in.

If no codebase exists yet, **React Native + Expo** is recommended for this project (mobile-first party game, real-time multiplayer-friendly).

## Fidelity

**High-fidelity (hifi).** Colors, typography, radii, shadows, spacing and component anatomy are final. Recreate pixel-perfectly.

---

## Design Tokens

### Colors — "Candy Pop" Palette

| Token  | Hex       | Use                                        |
|--------|-----------|--------------------------------------------|
| cream  | `#FFF4E0` | Default background, light text on dark     |
| sun    | `#FFD166` | Accent, highlights, secondary CTAs         |
| melon  | `#EF476F` | Primary CTA, alert/attention               |
| mint   | `#06D6A0` | Success, ready states, secondary accent    |
| ocean  | `#118AB2` | Tertiary accent, info, slider tracks       |
| plum   | `#3D1766` | Deep accent, splash background             |
| ink    | `#2B1055` | All borders, all text on light backgrounds |

Borders and text **always** use `ink` (`#2B1055`) for the chunky "sticker" outline aesthetic. Never use pure black.

### Typography — "Fraunces + DM"

Load via Google Fonts: `Alfa Slab One`, `Fraunces` (400, 700, 900), `DM Sans` (400, 500, 700, 900).

| Role    | Family                                         | Use                              |
|---------|------------------------------------------------|----------------------------------|
| display | `'Alfa Slab One', 'Fraunces', serif`           | Logo wordmark, hero numerals     |
| heading | `'Fraunces', serif` (weight 700–900)           | Question titles, screen titles   |
| body    | `'DM Sans', system-ui, sans-serif`             | All body text, labels, buttons   |

Body labels are **uppercase + letter-spacing 1–3px + weight 800** for the "ticket stub" feel.

### Card Feel — "Sticker"

Every card, chip, button and input uses the same recipe:

```
border-radius: 28px
border: 3px solid #2B1055   (ink)
box-shadow: 6px 6px 0 #2B1055   (no blur — hard offset)
```

Smaller elements (chips, pills) scale down: `2.5px` border, `3px 3px 0` shadow.

### Spacing scale

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 72` (px). Screen-edge padding is `16–20`. Generous: candy-pop wants air around stickers.

### Radii

| Element              | Radius |
|----------------------|--------|
| Pill buttons         | full   |
| Cards                | 28     |
| Inputs / chips       | full   |
| App icon (squircle)  | 28% of side |
| Monogram badge       | 28% of side |

### Shadows

There is only **one shadow style**: hard, no blur, ink-colored.
`Nx Nx 0 #2B1055` where N is `3` (small), `5` (medium), `6–8` (large CTAs/cards).

---

## Logo System

The logo is a **monogram + wordmark lockup**.

### Monogram (also the app icon)

A circular squircle badge with a glossy radial gradient and the letters **"TT"** in chunky display type, rotated -6°, with a small 4-point sparkle in the upper right.

Anatomy (size = `S`):
- Outer shape: rounded rect, radius `S × 0.28`
- Background: `radial-gradient(circle at 30% 26%, #FFD166, #EF476F 60%, #3D1766)`
- Border: `max(3, S × 0.025)px solid #2B1055`
- Inner shadow (gloss): `inset 0 -S×0.10px S×0.14px rgba(0,0,0,.25), inset 0 S×0.12px S×0.12px rgba(255,255,255,.35)`
- Drop shadow: `0 S×0.08px S×0.16px rgba(0,0,0,.2)`
- Letters: "TT", `Alfa Slab One`, color `#FFF4E0`, stroke `S×0.025px #2B1055`, font-size `S×0.52`, rotation `-6deg`
- Sparkle: 4-point star, color `#FFF4E0`, size `S×0.14`, position top: `S×0.12`, right: `S×0.14`

### Lockup variants

| Variant       | Layout                                            | Use                                  |
|---------------|---------------------------------------------------|--------------------------------------|
| horizontal    | Monogram left, "BLIND / TASTER" stacked right     | Headers, top of screens              |
| stacked       | Monogram top, "BLIND TASTER" single line below    | Splash, marketing                    |
| mono-dark     | Horizontal, all `#2B1055` text, monogram in color | Headers on light backgrounds         |
| mono-light    | Horizontal, all `#FFF4E0` text, monogram in color | Headers on dark backgrounds          |

The monogram **keeps its color gradient** in mono variants — only the wordmark color changes.

Wordmark: `Alfa Slab One`, weight 900, **uppercase**, letter-spacing approx `-0.015em`, line-height `0.88` for the stacked rendering.

---

## The Splash Screen — "Tickertape" (selected)

Full-bleed plum background with diagonal stripes of repeating wordmark text, and a centered sticker card holding the logo lockup and a CTA.

### Layout (402 × 874 iOS viewport)

- **Background**: solid `#3D1766` (plum)
- **Diagonal stripes**: 5 horizontal bands rotated `-12°`, each `width: 180%`, `height: 70px`, positioned `left: -40px`, with these top values & colors:

  | Top (px) | Stripe color | Text color | Text content                  |
  |----------|--------------|------------|--------------------------------|
  | 80       | `#FFD166`    | `#2B1055`  | `BLIND TASTER ✦` (×10)         |
  | 170      | `#06D6A0`    | `#2B1055`  | `SIP SCORE SCANDAL ✦` (×10)    |
  | 260      | `#EF476F`    | `#FFF4E0`  | `BLIND TASTER ✦` (×10)         |
  | 580      | `#118AB2`    | `#FFF4E0`  | `SNIFF SWIRL SETTLE ✦` (×10)   |
  | 670      | `#FFD166`    | `#2B1055`  | `BLIND TASTER ✦` (×10)         |

  Each repeat: `Alfa Slab One`, 38px, weight 900, letter-spacing 2, uppercase, with `marginRight: 18px` between repeats.

- **Centered sticker card** (rotated `-3deg`, positioned at viewport center):
  - Background `#FFF4E0` (cream), border `3px solid #2B1055`, radius `32px`, shadow `8px 8px 0 #2B1055`
  - Padding `28px 28px 24px`
  - Inside, vertical flex with `gap: 14px`:
    - Stacked TTLockup (monogram + "Blind Taster" wordmark), size factor `0.65`
    - Pill button: "TAP TO START" — `#EF476F` background, `#FFF4E0` text, `3px solid #2B1055` border, `6px 6px 0 #2B1055` shadow, font `Alfa Slab One`, height 52, padding `0 28px`, font-size 17, uppercase, with a white inner highlight strip on top (gloss)

- **Corner sparkles**:
  - Top-right `(top: 30, right: 30)`: 4-point star, 40px, `#FFD166`
  - Bottom-left `(bottom: 60, left: 30)`: 4-point star, 28px, `#06D6A0`

### Sparkle SVG

```jsx
<svg width={size} height={size} viewBox="0 0 24 24">
  <path d="M12 0 C12 7, 17 12, 24 12 C17 12, 12 17, 12 24 C12 17, 7 12, 0 12 C7 12, 12 7, 12 0 Z" fill={color} />
</svg>
```

### Pill button anatomy

```
height: 52px           (lg: 68; xl: 84; sm: 36)
padding: 0 28px        (proportional to height)
border: 3px solid #2B1055
border-radius: full
box-shadow: 6px 6px 0 #2B1055
font: Alfa Slab One, weight 900, size 17, uppercase, letter-spacing 0.5
text color: #FFF4E0 on melon/ink, #2B1055 on sun/mint/cream
```

**Gloss highlight**: an absolutely-positioned `<span>` inside the button: `top: 4, left: 10%, right: 10%, height: 40%`, `border-radius: 999`, `background: linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,0))`. Required — gives the buttons their glossy candy feel.

---

## Other Screens (reference)

### Round / Questionnaire (`tt-screens.jsx`)
Header with round counter (sticker pill, "3 of 7") and timer pill, then a "GLASS C" sample headline (display font, rotated -2°, with text-stroke + drop shadow), a question card with flavor chips (selectable, melon highlight when on), a rating slider (ocean card, sun-filled track, melon thumb with white "7"), and a primary CTA at the bottom.

### Lobby
Sun→melon gradient background, room code "BRIE7" displayed in a sticker card, then a player list with circular avatars and "READY" / "POURING…" status pills.

### Theme Sheet
A static brand reference page with palette swatches, type samples, motifs (stars, flowers, blobs), buttons, and card feels.

---

## Components to Build

| Component       | Purpose                                                             |
|-----------------|---------------------------------------------------------------------|
| `Monogram`      | Round/squircle TT badge — used as app icon and inside logo lockup   |
| `Lockup`        | Monogram + "Blind Taster" wordmark, with `horizontal`/`stacked` and `dark`/`light`/`color` tones |
| `StickerCard`   | The cream rectangle with ink border + offset shadow                 |
| `PillButton`    | The candy CTA with gloss highlight and offset shadow                |
| `Sparkle`       | 4-point star SVG                                                    |
| `Chip`          | Selectable rounded chip — outline by default, filled when selected  |
| `RatingSlider`  | Sun-filled track, melon thumb showing the value                     |
| `RoomCodeBlock` | Big display-font code in a sticker rectangle                        |

All take a single `palette` prop (the tokens above) and a `size` scale where appropriate.

---

## Interactions & Behavior

### Splash → New Game
- Tap "TAP TO START" → navigate to **Lobby** (create-or-join sheet first if you want)
- Subtle entrance: background stripes fade in from off-screen left in sequence (50ms stagger), then the sticker card scales in from `0.7` with a slight bounce (300ms, easeOutBack)

### Lobby
- Real-time presence: as players connect, their card slides in from below (200ms)
- "Ready" pill toggles per player
- Host's "Start the round" CTA enables only when all players are ready

### Round / Questionnaire
- Chip selection is **multi-select**: tap to toggle on/off (filled vs outline)
- Slider drag updates the value in the melon thumb live
- "LOCK IT IN" pulses when all questions are answered; tapping submits and navigates to a "waiting on others" state, then to results when everyone is in
- Timer counts down from a per-round budget; when ≤10s, timer pill flashes melon

### General
- All buttons: `:active` translates by `(2px, 2px)` and reduces shadow to `4px 4px 0` for a "press" feel
- Card hover/press (touch): scale to `0.98`, shadow shrinks
- Use spring physics for sticker rotations — slight wobble on appear

---

## State Management

Recommended (Redux Toolkit / Zustand / context):

- `room` — `{ code, hostId, players: Player[], status: 'lobby'|'round'|'reveal' }`
- `player` — `{ id, name, color, ready }`
- `round` — `{ index, total, sampleLabel, questions: Question[], answers: Record<questionId, any>, lockedIn: boolean, deadlineAt }`
- `tweaks` (dev only) — current palette / font / cardFeel for theming

Backend: any presence-capable store (Firebase RTDB, Supabase Realtime, Liveblocks, Partykit). Each player publishes their answers under `rooms/{code}/rounds/{idx}/answers/{playerId}`; reveals when all are present.

---

## Assets

No raster assets. Everything is CSS / SVG. No emoji in final UI.

Fonts via Google Fonts:
```
https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Fraunces:wght@400;700;900&family=DM+Sans:wght@400;500;700;900&display=swap
```

---

## Files in this bundle

```
reference/
  Blind Taster.html        — main canvas; loads everything
  tt-theme.jsx             — TT_PALETTES, TT_FONTS, TT_CARD_FEELS, TTStar, TTBlob, TTSticker, TTPill, etc.
  tt-logo.jsx              — TTLetter, TTLogo, TTMonogram, TTLockup
  tt-splash.jsx            — TTSplash1..4 (use TTSplash3 — Tickertape)
  tt-screens.jsx           — TTRoundScreen, TTLobbyScreen, TTThemeSheet, TTAppIconGrid
  design-canvas.jsx        — design canvas wrapper (not needed for production)
  ios-frame.jsx            — iOS device frame mock (not needed for production)
```

The two "not needed" files are only used by the design canvas to present mockups; ignore them when implementing.

---

## Suggested Claude Code prompts

### Prompt 1 — bootstrap

```
Read design_handoff_taste_tester/README.md end-to-end before doing anything.

We're building Blind Taster — a collaborative party game for taste-testing food and
wine. The README is the source of truth for the brand system, splash screen, and
screens.

Set up a new React Native + Expo project (TypeScript) called `blind-taster`. Add:
- Google Fonts (Alfa Slab One, Fraunces, DM Sans) via expo-font
- A `theme/` folder with palette, type, radii, shadows, and a single useTheme() hook
- React Navigation with a stack: Splash → Lobby → Round → Reveal

Stop and show me the project structure before building any screens.
```

### Prompt 2 — brand primitives

```
Build the brand primitives in `components/brand/`:
- Monogram.tsx       (the TT squircle badge — see README §Logo System)
- Lockup.tsx         (monogram + wordmark, horizontal | stacked × color | dark | light)
- StickerCard.tsx    (cream/ink/offset-shadow card wrapper)
- PillButton.tsx     (candy CTA with gloss highlight; sm/md/lg/xl sizes)
- Sparkle.tsx        (4-point star SVG)

Match the anatomy in the README exactly — colors, radii, border widths, the hard
no-blur shadow, the inner gloss highlight on the button. Use the `Sticker` card feel
for everything; do not invent alternates.

Reference: design_handoff_taste_tester/reference/tt-logo.jsx and tt-theme.jsx
```

### Prompt 3 — splash screen

```
Build the Splash screen at `screens/Splash.tsx` exactly as described in the
README's "The Splash Screen — Tickertape" section.

- 5 diagonal stripes of repeating wordmark, rotated -12°, with the colors and
  text content from the README table
- Centered sticker card, rotated -3°, with stacked Lockup + "Tap to start"
  PillButton
- Two corner sparkles

Animate on entry: stripes fade in left-to-right (50ms stagger), then sticker
card scales in 0.7→1 with easeOutBack (300ms).

CTA navigates to Lobby. Reference: reference/tt-splash.jsx → TTSplash3.
```

### Prompt 4 — lobby & round

```
Build Lobby and Round screens following the README sections. Reference
implementations are in reference/tt-screens.jsx (TTLobbyScreen, TTRoundScreen).

Wire them to a Zustand store for now (mock the backend). State shape per the
"State Management" section.

Use only the brand primitives from components/brand/ — no inline styles for
buttons, cards, or chips.
```
