# Blind Taster — Design & Polish TODO


## claude do not do the next 2 lines if you happen to read this.
if we have a database to load in games then we need the questionaires to be unique to the game POR make the existing ones read only


## 🔵 Scoring improvements

- **Gemini multi-synonym tag answers** — Gemini should return an array of acceptable synonyms for each tag answer rather than a single word. e.g. correct answer for "grass" should be `["grass", "vegetal", "planty", "herbaceous"]` so that any of these score full marks. Requires changes to the correct answer format for Tags questions, the Gemini prompt, and the tag scoring logic.

## 🟢 Polish — remaining

- **App icon** — Replace `assets/icon.png` with the Monogram rendered at 1024×1024. Set `app.json` `"icon"` and `"android.adaptiveIcon.foregroundImage"`. Spec: squircle with `sun → melon → plum` gradient, `BT` in `AlfaSlabOne`, sparkle top-right.
- **`LoadingSpinner` component** — add a subtle sticker card wrapper for mid-screen loading states.
- **`Banner` component** — add `Lockup` (horizontal, `dark` tone) as an optional prop for screens where the logo should appear in the header.
- **Animations** — see `design_handoff_blind_taster/README.md` § Interactions for entrance animations (stripe stagger on Home, player card slide-in on Lobby, button press physics).
