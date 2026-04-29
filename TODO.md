# Blind Taster — Design & Polish TODO

---

## 🟡 Screens needing design treatment

The design handoff covers: Home (splash), Lobby, and Round screens.
These screens have no reference design yet — apply the design system (colours, sticker cards, fonts, pill buttons) consistently.

| Screen | File |
|--------|------|
| Join Game | `src/screens/player/JoinGameScreen.tsx` |
| Player Round | `src/screens/player/PlayerRoundScreen.tsx` |
| Player Results | `src/screens/player/PlayerResultsScreen.tsx` |
| Host In-Game (tab bar) | `src/navigation/HostNavigator.tsx` |
| Host Round | `src/screens/host/HostRoundScreen.tsx` |
| Host Players | `src/screens/host/HostPlayersScreen.tsx` |
| Host Leaderboard | `src/screens/host/HostLeaderboardScreen.tsx` |
| Host Results | `src/screens/host/HostResultsScreen.tsx` |
| Setup Game | `src/screens/host/SetupGameScreen.tsx` |
| Questionnaires list | `src/screens/host/QuestionnairesScreen.tsx` |
| Questionnaire Builder | `src/screens/host/QuestionnaireBuilderScreen.tsx` |
| Rounds Builder | `src/screens/host/RoundsBuilderScreen.tsx` |
| Games list | `src/screens/host/GamesScreen.tsx` |


## 🟢 Polish — remaining

- **App icon** — Replace `assets/icon.png` with the Monogram rendered at 1024×1024. Set `app.json` `"icon"` and `"android.adaptiveIcon.foregroundImage"`. Spec: squircle with `sun → melon → plum` gradient, `BT` in `AlfaSlabOne`, sparkle top-right.
- **`LoadingSpinner` component** — add a subtle sticker card wrapper for mid-screen loading states.
- **`Banner` component** — add `Lockup` (horizontal, `dark` tone) as an optional prop for screens where the logo should appear in the header.
- **Animations** — see `design_handoff_blind_taster/README.md` § Interactions for entrance animations (stripe stagger on Home, player card slide-in on Lobby, button press physics).
