# Handoff: Blind Taster — Full App Redesign

## Overview

**Blind Taster** is a collaborative party game for taste-testing food and wine. A host creates a *questionnaire* (the questions players will answer about each sample), bundles questionnaires into *games* (a number of rounds), then hosts a live session where players join via QR/code, answer each round's questions, and see their score against the host's answers.

This handoff is a **complete redesign of every screen in the app** in the Blind Taster brand system. Your existing app is functionally close — this brings it onto the design system end-to-end so every screen looks like part of the same product.

## About the Design Files

The files in `reference/` are **React/JSX design references** built as Babel-in-the-browser prototypes. They are *not* production code.

Your job is to **rebuild each screen in the existing target codebase** (React Native, SwiftUI, etc.) so it matches the reference pixel-for-pixel — using your existing component libraries, theming, and state management. Don't ship the HTML. Treat the JSX as a precise spec of layout, color, type, and component anatomy.

## Fidelity

**High-fidelity.** Every color, radius, shadow, font size, spacing value, and component anatomy is final. Recreate exactly.

---

## Brand System (unchanged from previous handoff)

### Palette — "Candy Pop"

| Token  | Hex       |
|--------|-----------|
| cream  | `#FFF4E0` |
| sun    | `#FFD166` |
| melon  | `#EF476F` |
| mint   | `#06D6A0` |
| ocean  | `#118AB2` |
| plum   | `#3D1766` |
| ink    | `#2B1055` |

All borders & text on light backgrounds use **ink** (`#2B1055`). Never pure black.

### Typography — "Fraunces + DM"

Load via Google Fonts: `Alfa Slab One`, `Fraunces` (400/700/900), `DM Sans` (400/500/700/900).

| Role    | Stack                                          |
|---------|------------------------------------------------|
| display | `'Alfa Slab One', 'Fraunces', serif`           |
| heading | `'Fraunces', serif` (weight 700–900)           |
| body    | `'DM Sans', system-ui, sans-serif`             |

### Sticker recipe (use everywhere)

```
border: 2.5px solid #2B1055
border-radius: 18–28 (cards), full (pills)
box-shadow: Nx Nx 0 #2B1055    (N = 3 small · 5 medium · 6–8 hero)
```

Hard, no-blur shadows — the candy "sticker" look. Never use soft drop shadows.

### Spacing

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 72` px. Screen-edge padding is `16–20`.

### Logo

- **Monogram** — squircle badge, radius 28% of side, radial gradient `sun → melon → plum`, ink-stroked "BT" rotated -6°, sparkle top-right. Used as the app icon and in headers.
- **Lockup** — Monogram + "Blind Taster" wordmark. Stacked or horizontal. `Alfa Slab One`, weight 900, uppercase, letter-spacing ~-0.015em, line-height 0.88 stacked.

---

## Components — build these first

All in `components/brand/`. Every one takes a `palette` and (where relevant) `fonts` prop.

### Primitives
| Component | Purpose | Reference |
|-----------|---------|-----------|
| `Monogram` | TT squircle badge (see brand system) | `tt-logo.jsx` |
| `Lockup` | Monogram + wordmark, stacked or horizontal | `tt-logo.jsx` |
| `Sparkle` | 4-point star SVG | `tt-theme.jsx` |
| `StickerCard` | Cream rectangle with ink border + offset shadow | `bt-chrome.jsx → BTCard` |
| `PillButton` | Primary CTA — sticker + gloss highlight | `bt-chrome.jsx → BTCta` |
| `OutlineButton` | Secondary CTA — sticker, cream fill | `bt-chrome.jsx → BTOutlineCta` |
| `TextInput` | Pill-shaped input with sticker border | `bt-chrome.jsx → BTInput` |
| `Chip` | Selectable pill — outline by default, filled when on | `bt-chrome.jsx → BTChip` |
| `StatusPill` | Small uppercase badge (sun/mint/melon) | `bt-chrome.jsx → BTPill` |
| `Avatar` | Circle with initial, palette-color background | `bt-chrome.jsx → BTAvatar` |
| `Dialog` | Modal confirm dialog with title, message, Cancel + OK | `bt-chrome.jsx → BTDialog` |

### Chrome
| Component | Purpose | Notes |
|-----------|---------|-------|
| `AppBar` | Top bar with circular sticker back-button + centered Fraunces title | Title 22px / weight 800. Trailing slot for actions. |
| `SectionLabel` | Tiny uppercase caption used everywhere as a section header | DM Sans 12px / weight 900 / letter-spacing 2 / ~70% opacity |
| `SettingsFab` | Round ocean-blue branded settings cog (was grey) | 48px circle, ocean fill, ink border, 3px offset shadow, white gear icon |

**Notes on the current app's chrome** (from the screenshots): the grey circular settings cog and the grey circular back chevron are placeholder. Replace globally with `SettingsFab` (ocean) and `AppBar`'s built-in back button (cream sticker with offset shadow). The plain Fraunces titles need the `AppBar` wrapper so they sit centered with proper top padding.

### Button gloss highlight (don't skip this)

Every `PillButton` has an absolutely-positioned highlight inside it:

```jsx
<span style={{
  position: 'absolute', top: 4, left: '10%', right: '10%', height: '40%',
  borderRadius: 999,
  background: 'linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,0))',
  pointerEvents: 'none',
}}/>
```

This is what makes them feel candy/glossy. The current implementation has it on some buttons but missing on others (e.g. the disabled "Reveal Answers" / "Next Round" buttons should still keep their outline + reduced opacity, no gloss). Be consistent.

### Disabled state

Disabled buttons drop the offset shadow, reduce both fill and border to ~45% opacity. Cursor stays default. Currently the app shows them just "washed out" — keep the sticker outline visible, just at reduced opacity, and remove the gloss + shadow.

### Dialogs

Reference: `BTDialog` in `bt-chrome.jsx`. Use for any confirm/cancel decision — leave the game, delete a questionnaire, save changes, etc.

Anatomy:
- Backdrop: `rgba(43, 16, 85, 0.55)` (plum at 55%) over the dimmed (opacity 0.3) screen content behind.
- Card: cream fill, **3px** ink border, radius `26`, shadow `8px 8px 0 #2B1055`, rotated `-1°` to feel sticker-like. Width `296`, padding `22px 22px 20px`.
- Icon tile (top-left of the card body): 54×54 rounded square, palette-colored, ink border + 3px offset shadow, rotated `-3°`. Glyph is a single display-font character.
- Title: Fraunces 22 / weight 800.
- Message: DM Sans 14 / weight 500 / opacity 0.75.
- Buttons: equal-width row of `OutlineButton` (Cancel) + `PillButton` (OK), both size `md` (52px). Cancel always on the left.

Three intents:

| Intent    | Icon tile  | OK button | Use for                                  |
|-----------|------------|-----------|------------------------------------------|
| `default` | sun + "?"  | melon     | Generic confirm (leave game, exit form)  |
| `danger`  | melon + "!"| melon     | Destructive (delete questionnaire/game)  |
| `success` | mint + "✓" | mint      | Save / commit                            |

Three example screens are in the canvas under the "Dialogs" section — artboards 19A/B/C in `Blind Taster App.html`.

#### Motion
- Backdrop fades in 180ms.
- Card scales `0.92 → 1` over 240ms with `easeOutBack`. Reverse on dismiss.
- Tapping the backdrop = same as Cancel.
- `Esc` (web) / hardware back (Android) = Cancel.

---

## Screens

Each screen has a reference component in the JSX files. The list below is the implementation order with the most important call-outs. **Always open the JSX reference for the exact anatomy** — the notes here are the *intent*, the JSX is the *truth*.

### Flow 1 — Host setup

#### 01. Home / Splash
Reference: `BTHome` in `bt-screens-host.jsx`.

Plum background with 4 diagonal "tickertape" stripes of repeating wordmark text (rotated -12°), and a centered sticker card (tilted -2°) holding: Monogram → "BLIND TASTER" wordmark → tagline pill → Host a Game (primary) → Join a Game (outline). Two corner sparkles.

#### 02. Host a Game (menu)
Reference: `BTHostMenu`. Replaces the screen with two stacked pill buttons.

Big monogram + Fraunces title at top with a one-line description. Two large sticker tiles below: **Questionnaires** (melon fill, cream icon-tile, "Build your taste-test forms") and **Games** (mint fill, "Pick a game and start hosting"). Each tile is a full-width `StickerCard` with a 56px white icon-tile on the left.

#### 03. Questionnaires list
Reference: `BTQuestionnairesList`. Replaces the bare list rows.

Each row is a `StickerCard` (radius 20, 4px shadow) with: 44×44 palette-colored letter tile · name · "6 questions · Locked" caption (uppercase mini-cap). The lock/duplicate/delete buttons become three small sticker icon-buttons (cream for duplicate, melon for delete). Top action is the "+ Create New" outline pill.

#### 04. New Questionnaire
Reference: `BTNewQuestionnaire`. The "no questions yet" empty state gets a sparkle illustration, the Save button gets proper primary styling.

#### 05. Choose Question Type modal
Reference: `BTChooseType`. Replace the plain list with a bottom-sheet (top-rounded, ink-bordered) holding 5 sticker rows, each with a colored icon tile (melon / sun / mint / ocean / plum), the type label, and a chevron.

#### 06. Edit Questionnaire
Reference: `BTEditQuestionnaire`. The current Q1/Q2/Q3 cards become sticker cards with: a colored "Q1" letter tile (melon/sun/mint/ocean/plum, rotating through the palette), the question type as an uppercase mini-cap above the question text. Delete button becomes a small melon sticker.

#### 07. Edit Question (Multiple Choice — Text)
Reference: `BTEditQuestion`. The yellow rectangle for question type becomes a proper `StatusPill` (sun). Question text sits in its own sticker card. Options sit in a second sticker card with a count badge (mint), each option an outline-pill with a melon delete button. "+ Add Option" is a dashed-border ghost button.

---

### Flow 2 — Games

#### 08. Games list
Reference: `BTGamesList`. Same treatment as questionnaires list. Row layout: letter-tile · name + caption · "Answers" outline-pill · "Host ▶" melon CTA pill. "Edit" in the top-right becomes a melon `StatusPill`.

#### 09. Game info modal
Reference: `BTGameInfoModal`. The current beer-night modal becomes a sticker card (tilted -1°) with: caption "BEER · 3 ROUNDS" (melon section-label) · name "Beer Night" (Fraunces) · letter-tile in corner · 3 round rows each in a mini sticker chip with a numbered tile · big "DONE" primary CTA.

#### 10. New Game
Reference: `BTNewGame`. Form inputs get sticker styling. Number-of-rounds gets a chunky stepper: `−` (cream) · `3` (cream readout) · `+` (mint), all 50px sticker circles. The "CONTINUE →" button stays melon primary.

#### 11. Set Round Answers (host setting correct answers per round)
Reference: `BTHostSetAnswers`. This is the host's view of the questionnaire while preparing a round — they set the sample name + the correct answer for each question. The sample input gets its own plum sticker card. Each question is in its own card with mint-fill chips marking the selected (correct) answer.

Bottom bar has `← Back` outline + `Next →` melon side-by-side.

---

### Flow 3 — Live game

#### 12. Host Lobby (empty)
Reference: `BTHostLobby` (without `withJoiners`). 

Top: cream bar with the game label (e.g. "BEER · HOSTING" / "Beer Night") and meatballs menu. Body: sun→melon gradient with sparkles. Centered: a fake QR code on a cream sticker card · "ROOM CODE" caption · the code in a chunky display-font sticker block · "TAP TO COPY" hint. Below: "The crew (0)" heading, "No players yet" placeholder. Footer: cream bar with disabled "Start Game" primary.

#### 13. Player joining
Reference: `BTHostLobby` with `withJoiners`. Adds a "Waiting to Join" section above "The crew": a player row card with name · mint ✓ check (admit) · melon ✕ (reject) buttons.

#### 14. Host monitoring round
Reference: `BTHostMonitor`. Top bar: `R 1/3` pill + game name + meatballs. Body has "Players" label with a refresh circle. Then **Not answered** (with a count pill, players in melon-bordered cards) and **Answered** (mint, with point totals). Footer: disabled "Reveal Answers" primary + "Next Round →" outline.

---

### Flow 4 — Player

#### 15. Player Round (mostly MCQ-text questions)
Reference: `BTPlayerRound`. Top bar shows `OLIVE OIL` mini-cap · `Round 1 of 3` Fraunces title · `0 pts` sun sticker pill on the right.

Each question is a sticker card with a "Question N" sun-colored mini-cap above. Inside: the question text (Fraunces 20px / weight 800), then the answers as chips. Selected chips fill with a palette color (cycles: melon → mint → ocean) and gain the offset shadow. The current app has only outlines — selected state is invisible. **Fix this.** Selected = filled + shadow + slight translate.

Submit button at the bottom (full-width melon primary).

#### 16. Player Round (Tags + Price + Slider)
Reference: `BTPlayerTagsPrice`. Demonstrates the other 3 question types:
- **Tags** — input pill + melon "Add" button. Added tags appear as filled mini-pills in rotating palette colors with a × delete glyph.
- **Price** — split input: sun left segment with "£" glyph, cream right segment with the value, both wrapped in one ink-bordered sticker.
- **Slider** — ocean card with cream track, sun-filled progress, melon thumb showing the value (was "Rate the vibe" in the existing brand sheet).

The current screenshot shows tags + price; add a slider question to demonstrate the third type. The current "Add" button has a glossy gradient — replace with the standard sticker button recipe (no gradient, just flat melon + ink border + small offset shadow).

#### 17. Round Results (reveal)
Reference: `BTPlayerResults`. Top bar: same chrome but the pts pill is mint with the just-earned score.

Body opens with a **big reveal card** — plum background, sun "THE ANSWER" mini-cap, then the sample's actual name in display font (e.g. "Frantoio Muraglia EVOO"), with a sparkle in the corner.

Below that, per-question cards with: an 8px **left-edge accent** (mint if correct, melon if wrong), the question, "+100" mint pill or "0" tinted-melon pill, and Your answer / Correct labels.

The existing screenshot has the green/red left edge already — just tighten the typography and use proper section labels.

#### 18. End of game
Reference: `BTEndGame`. Cream → sun gradient background.

Hero: a tilted melon sticker card containing "WINNER" mini-cap (cream) · giant "1st" (display, 88px, stroked + drop-shadowed) · "630 pts" subtitle. Sparkles around it.

Below: "Round by round" section header, then 3 sticker-card rows: round number tile (mint/sun/melon), round answer name, `+N` mint pill, expand chevron. Big melon "DONE" CTA at the bottom.

---

## Interactions & motion

- **Chip select**: instant fill + 1px translate(-1px,-1px) for the "press down" feeling. Add a 120ms ease transition on `background-color, box-shadow, transform`.
- **Button press**: translate by `(2px, 2px)` and reduce shadow from `5px 5px 0` to `3px 3px 0` for the press feel.
- **Card press** (e.g. tapping a game in the list): scale 0.98 on touchdown, return on release.
- **Modal entry** (game info, choose type): backdrop fades 200ms, sheet/card scales 0.94 → 1 with `easeOutBack` over 260ms.
- **Reveal screen** (round results): the big plum reveal card scales 0.7 → 1 with a slight wobble (450ms `easeOutBack`), then per-question cards stagger in from below at 60ms intervals.
- **End game**: "1st" badge scales 0.4 → 1 with bounce; sparkles fade-rotate in 200ms after.

---

## State Management

```ts
type Player = { id: string; name: string; color: string; }
type AnswerValue = string | string[] | number;
type Question = {
  id: string;
  type: 'mcq-text' | 'mcq-number' | 'slider' | 'tags' | 'price';
  prompt: string;
  options?: string[];      // for mcq
  min?: number; max?: number; step?: number;  // for slider
  currency?: 'GBP' | 'USD' | 'EUR';            // for price
};
type Questionnaire = { id: string; name: string; locked: boolean; questions: Question[]; };
type Round = {
  index: number;
  sampleName: string;
  correctAnswers: Record<string /* questionId */, AnswerValue>;
};
type Game = { id: string; name: string; questionnaireId: string; rounds: Round[]; };
type Session = {
  code: string;
  hostId: string;
  gameId: string;
  status: 'lobby' | 'round-active' | 'round-reveal' | 'finished';
  currentRound: number;
  players: Player[];
  pending: Player[];      // waiting-to-join
  answers: Record<string /* playerId */, Record<string /* questionId */, AnswerValue>>;
};
```

Realtime backend recommendation: Firebase RTDB, Supabase Realtime, Liveblocks, or Partykit. Each player writes their answer under `sessions/{code}/rounds/{idx}/answers/{playerId}`. The host's "Reveal Answers" toggles `status` to `round-reveal`.

---

## Files in this bundle

```
reference/
  Blind Taster.html              — original brand canvas (logo + splash variants + theme sheet)
  Blind Taster App.html          — NEW: every app screen redesigned
  tt-theme.jsx                   — palette, fonts, primitives (TTStar, TTBlob, TTPill, TTSticker)
  tt-logo.jsx                    — Monogram, Lockup
  tt-splash.jsx                  — 4 splash variants (Tickertape is the selected splash)
  tt-screens.jsx                 — original Round / Lobby / Theme sheet (kept for color reference)
  bt-chrome.jsx                  — shared app chrome (AppBar, SettingsFab, BTCard, BTCta, BTInput, BTChip, BTPill, BTAvatar, BTDialog)
  bt-screens-host.jsx            — BTHome, BTHostMenu, BTQuestionnairesList, BTNewQuestionnaire, BTChooseType, BTEditQuestionnaire, BTEditQuestion
  bt-screens-game.jsx            — BTGamesList, BTGameInfoModal, BTNewGame, BTHostSetAnswers, BTHostLobby, BTHostMonitor
  bt-screens-player.jsx          — BTPlayerRound, BTPlayerTagsPrice, BTPlayerResults, BTEndGame
  design-canvas.jsx, ios-frame.jsx — preview wrappers (ignore for production)
```

Open `Blind Taster App.html` to see every screen at once.

---

## Suggested Claude Code Prompts

### Prompt 1 — Audit & plan

```
Read design_handoff_blind_taster/README.md end-to-end before doing anything.

Then open the existing codebase and:

1. Identify every screen that's already implemented and map it 1:1 to the
   numbered screens in the README (01 Home → 18 End of game).
2. For each, note: which design tokens are wrong (hardcoded colors,
   missing borders, soft shadows instead of offset shadows), which
   primitives are missing (StickerCard, PillButton, Chip, AppBar,
   SettingsFab, etc.), and which interactions don't match.
3. Produce a punch-list ordered by visual impact: chrome first
   (SettingsFab, AppBar back-button, button styling), then components
   (chip selected state, sticker shadows), then per-screen polish.

Don't change any code yet. Just produce the punch-list.
```

### Prompt 2 — Brand primitives

```
Build the brand primitives in components/brand/ following the README's
"Components — build these first" section exactly.

Match anatomy in reference/bt-chrome.jsx:
  Monogram, Lockup, Sparkle, StickerCard, PillButton, OutlineButton,
  TextInput, Chip, StatusPill, Avatar, AppBar, SectionLabel, SettingsFab.

Each takes a single `palette` prop (the tokens from the README) and
`fonts` where relevant. Use the project's existing pattern (styled
components / Tailwind / RN StyleSheet) — don't introduce a new system.

When you're done, refactor the app's entry-point so SettingsFab and
AppBar are mounted globally — every screen in the punch-list uses these.
```

### Prompt 3 — Host flow (screens 01–11)

```
Replace screens 01–11 (Home through "Set Round Answers") with the
new designs. Reference: bt-screens-host.jsx and bt-screens-game.jsx
in the handoff folder.

Important:
- Home (01) is the splash — full plum bg with tickertape stripes.
  This is the user's existing splash from the brand handoff. Keep
  the same anatomy.
- The questionnaire create/edit flow (04–07) is the heaviest lift.
  Build the bottom-sheet for "Choose Question Type" once and reuse.
- The "Set Round Answers" screen (11) is host-only — it's where they
  enter the sample name and pick the correct answer per question.

Don't ship until every button has a proper sticker shadow + gloss
highlight (except disabled state).
```

### Prompt 4 — Live game & player (screens 12–18)

```
Replace screens 12–18 (Host Lobby through End of game). Reference:
bt-screens-game.jsx (lobby & monitor) and bt-screens-player.jsx.

The biggest visual bugs in the current app:
- Player chips have NO selected state (just outline). Fix: filled chip
  with offset shadow + slight translate on select. Use rotating palette
  colors (melon → mint → ocean) so a round of selections looks
  intentional, not monochrome.
- The "Add" button on tag inputs has a glossy gradient — replace with
  the standard sticker button (flat melon + ink border + 2px offset
  shadow). The gloss highlight only goes on PillButton CTAs, not on
  utility buttons.
- The end-game "1st" needs to be HUGE and tilted with a stroke + ink
  drop shadow. Currently it's the same size as body text — fix.
- The round-results "left-edge accent" (green/red) is on the wrong
  side and too thin in the current build. Make it 8px on the LEFT
  edge of the card.

Wire the reveal animation: when the host taps "Reveal Answers", the
player's screen transitions to screen 17 with the plum hero card
scaling in (0.7 → 1, easeOutBack 450ms), then per-question cards
stagger in from below.
```
