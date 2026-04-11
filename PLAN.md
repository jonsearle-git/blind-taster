# Blind Taster — Implementation Plan

Reference files: CLAUDE.md (coding rules), PROJECT.md (product spec)

---

## Dependencies

### Runtime
```
expo ~54.0.33
react 19.1.0
react-native 0.81.5
partysocket ^1.0.3
@react-navigation/native ^7.x
@react-navigation/native-stack ^7.x
@react-navigation/bottom-tabs ^7.x
react-native-screens ^4.x
react-native-safe-area-context ^5.x
expo-sqlite ~15.x
expo-linking ~7.x
expo-clipboard ~7.x
react-native-svg ^15.x
react-native-qrcode-svg ^6.x
expo-status-bar ~3.x
```

### Dev
```
typescript ~5.9.x
@types/react ~19.x
partykit ^0.0.x
jest-expo ~54.x
@testing-library/react-native ^12.x
jest ^29.x
```

---

## Project Config Files

### `partykit.json`
```json
{
  "name": "blind-taster",
  "main": "src/party/server.ts"
}
```

### `src/lib/config.ts`
- Exports `PARTYKIT_HOST` — `localhost:1999` in `__DEV__`, `blind-taster.yourname.partykit.dev` in production
- Single place to change the URL — never hardcoded elsewhere

### `app.json`
- Deep link scheme: `blindtaster`
- iOS: `bundleIdentifier: com.blindtaster.app`
- Android: `package: com.blindtaster.app`
- Dark UI, splash background `#0F0A0B`
- New architecture enabled

### `eas.json`
- `development` profile — debug build, dev client
- `preview` profile — internal distribution
- `production` profile — app store submission

---

## Phase 1 — Foundation

Nothing visual. Project skeleton only.

### 1.1 Constants

- `src/constants/colors.ts` — full colour theme (see CLAUDE.md). Used everywhere, no exceptions.
- `src/constants/spacing.ts` — spacing scale (xs/sm/md/lg/xl/xxl)
- `src/constants/typography.ts` — FontSize and FontWeight
- `src/constants/gameConstants.ts` — enums: `GamePhase`, `QuestionType`, `PlayerStatus`, `RoundPhase`

### 1.2 Types

Each file covers one domain. No `any`. No plain string discriminators.

- `src/types/questionnaire.ts`
  - `QuestionType` enum: `MultipleChoiceText | MultipleChoiceNumber | SliderNumber | Tags | Price`
  - `MultipleChoiceOption`: `{ id: string; label: string; value: string | number }`
  - `Question`: discriminated union per QuestionType (each has its own shape)
  - `Questionnaire`: `{ id: string; name: string; questions: Question[] }`

- `src/types/game.ts`
  - `GamePhase` enum: `Lobby | InRound | AllAnswered | AnswersRevealed | GameOver`
  - `RoundPhase` enum: `Answering | AllAnswered | AnswersRevealed`
  - `Round`: `{ number: number; label?: string }`
  - `GameState`: `{ roomCode: string; phase: GamePhase; players: Player[]; currentRound: number; totalRounds: number; roundPhase: RoundPhase }`

- `src/types/player.ts`
  - `PlayerStatus` enum: `Connected | Disconnected | Kicked`
  - `Player`: `{ id: string; name: string; status: PlayerStatus; isHost: boolean; score: number }`

- `src/types/answer.ts`
  - `Answer`: discriminated union per QuestionType (matches question shape)
  - `PlayerRoundAnswers`: `{ playerId: string; roundNumber: number; answers: Answer[] }`

- `src/types/results.ts`
  - `QuestionResult`: `{ questionId: string; playerAnswer: Answer; correctAnswer: Answer; pointsAwarded: number }`
  - `RoundResult`: `{ roundNumber: number; roundLabel?: string; questions: QuestionResult[]; roundScore: number }`
  - `PlayerResult`: `{ player: Player; rounds: RoundResult[]; totalScore: number; position: number }`
  - `GameResults`: `{ players: PlayerResult[]; winner: Player }`

- `src/types/partykit.ts` — all socket message types (see Phase 2)

- `src/types/navigation.ts`
  - `RootStackParamList`
  - `HostStackParamList`
  - `HostInGameTabParamList`
  - `PlayerStackParamList`

### 1.3 Navigation

- `src/navigation/AppNavigator.tsx` — root stack: HomeScreen → HostNavigator | PlayerNavigator
- `src/navigation/HostNavigator.tsx` — stack (pre-game screens) + nested tab navigator (in-game)
  - Stack: SetupGameScreen → QuestionnaireBuilderScreen → RoundsBuilderScreen → HostLobbyScreen → HostInGameTabs
  - Tabs: HostRoundScreen | HostPlayersScreen | HostLeaderboardScreen → HostResultsScreen
- `src/navigation/PlayerNavigator.tsx` — stack: JoinGameScreen → PlayerLobbyScreen → PlayerRoundScreen → PlayerResultsScreen
- Deep link config: `blindtaster://join/:roomCode` maps to `JoinGameScreen` with `roomCode` param

### 1.4 Local Database

- `src/lib/database.ts` — initialise expo-sqlite, run schema migrations on app start
- Schema: `questionnaires` table — stores serialised `Questionnaire` JSON with `id`, `name`, `created_at`, `updated_at`
- `src/lib/migrations.ts` — versioned migrations array, runs on startup to bring DB to latest schema
- Functions: `getAllQuestionnaires`, `getQuestionnaire`, `saveQuestionnaire`, `updateQuestionnaire`, `deleteQuestionnaire`

---

## Phase 2 — PartyKit Server

### Files

- `src/party/server.ts` — Cloudflare Worker (PartyKit `Party.Server`)
- `partykit.json` — project config

### Server Responsibilities

- Owns all game state in memory (per room)
- Correct answers stored server-side only, never broadcast until host triggers reveal
- Scores all player answers server-side
- Pauses game on host disconnect, resumes on reconnect
- Reserves player names — rejoining player with same name reclaims their slot
- Tracks connection status per player

### Server State Shape (internal, never fully exposed to clients)

```ts
type ServerGameState = {
  phase: GamePhase;
  host: { connectionId: string; name: string };
  players: Map<string, ServerPlayer>;
  questionnaire: Questionnaire; // includes correct answers — never sent to players
  rounds: Round[];
  currentRound: number;
  totalRounds: number;
  roundPhase: RoundPhase;
  answers: Map<string, PlayerRoundAnswers>; // keyed by playerId
};
```

### Message Types (`src/types/partykit.ts`)

**Server → Client (ServerMessage discriminated union):**
- `game_state` — sanitised state sync (no correct answers). Sent on connect/reconnect.
- `join_request` — `{ playerId: string; name: string }` — host only
- `player_admitted` — `{ playerId: string; name: string }`
- `player_denied` — `{ playerId: string }` — sent to that player only
- `player_joined` — `{ player: Player }` — broadcast
- `player_kicked` — `{ playerId: string }` — broadcast; kicked player gets `you_were_kicked`
- `you_were_kicked` — sent to kicked player only
- `game_started` — `{ questionnaire: QuestionnaireForPlayer; rounds: Round[] }` — no correct answers
- `round_started` — `{ roundNumber: number }` — label NOT included
- `player_answered` — `{ playerId: string }` — broadcast so host can track status
- `all_players_answered` — broadcast; triggers Reveal Answers button on host
- `answers_revealed` — `{ roundNumber: number; correctAnswers: Answer[]; playerScores: PlayerScore[] }` — broadcast
- `round_ended` — broadcast; players wait for next round
- `game_ended` — `{ results: GameResults }` — broadcast; includes round labels
- `game_paused` — `{ reason: PauseReason }` — host disconnected
- `game_resumed` — host reconnected

**Client → Server (ClientMessage discriminated union):**
- `request_join` — `{ name: string }`
- `admit_player` — `{ playerId: string }` — host only
- `deny_player` — `{ playerId: string }` — host only
- `start_game` — `{ questionnaire: Questionnaire; totalRounds: number }` — host only; questionnaire includes correct answers
- `submit_answers` — `{ roundNumber: number; answers: Answer[] }`
- `reveal_answers` — host only; triggers scoring + broadcast
- `advance_round` — host only
- `kick_player` — `{ playerId: string }` — host only
- `end_game` — host only

### Validation

- All incoming messages validated for shape and type before processing
- Host-only messages rejected if sender is not the host connection
- Duplicate name on rejoin: restore existing player slot, do not create new

---

## Phase 3 — Context & Hooks

### Context

- `src/context/GameContext.tsx` — provides game state + dispatch to all screens. Wraps the entire navigator.
- `src/context/QuestionnairesContext.tsx` — provides saved questionnaires from local DB

### Hooks

- `src/hooks/usePartySocket.ts` — manages WebSocket connection via `partysocket`. Handles connect, disconnect, reconnect, message parsing, error state. Exposes `send(message: ClientMessage)` and `connectionStatus`.
- `src/hooks/useGameState.ts` — subscribes to socket messages, updates GameContext. Single source of truth for client-side game state.
- `src/hooks/useHostControls.ts` — typed wrappers: `admitPlayer`, `denyPlayer`, `startGame`, `revealAnswers`, `advanceRound`, `kickPlayer`, `endGame`.
- `src/hooks/usePlayerActions.ts` — `submitAnswers`, `requestJoin`.
- `src/hooks/useQuestionnaires.ts` — CRUD against local DB via QuestionnairesContext.
- `src/hooks/useAnswers.ts` — manages in-progress answer state for current round before submission.
- `src/hooks/useDeepLink.ts` — listens for incoming `blindtaster://join/:roomCode` deep links, extracts room code.

---

## Phase 4 — Shared Components

### Layout
- `src/components/ScreenContainer.tsx` — SafeAreaView wrapper with background colour, standard padding
- `src/components/Banner.tsx` — top bar. Shows title/round. Optionally shows player score (right side). Optionally shows host dropdown trigger (right side).
- `src/components/Divider.tsx` — horizontal rule using border colour

### Inputs
- `src/components/TextInput.tsx` — styled text input, error state, label
- `src/components/Button.tsx` — primary / secondary / destructive variants, loading state, disabled state
- `src/components/IconButton.tsx` — icon-only pressable (kick, copy, etc.)

### Question Renderers (player-facing)
- `src/components/questions/MultipleChoiceQuestion.tsx` — text or number options, single select
- `src/components/questions/SliderQuestion.tsx` — slider + numeric display, or number input toggle
- `src/components/questions/TagsQuestion.tsx` — tag grid, enforces max selection limit
- `src/components/questions/PriceQuestion.tsx` — currency symbol + decimal number input

### Question Result Renderers (post-reveal, player-facing)
- `src/components/questions/MultipleChoiceResult.tsx`
- `src/components/questions/SliderResult.tsx`
- `src/components/questions/TagsResult.tsx`
- `src/components/questions/PriceResult.tsx`

Each result renderer shows player's answer, correct answer, points awarded. Green/red highlight.

### Question Builder (host-facing)
- `src/components/builder/QuestionTypeSelector.tsx` — pick question type
- `src/components/builder/MultipleChoiceBuilder.tsx`
- `src/components/builder/SliderBuilder.tsx`
- `src/components/builder/TagsBuilder.tsx`
- `src/components/builder/PriceBuilder.tsx`

### Game UI
- `src/components/PlayerRow.tsx` — player name + status dot + optional score + optional kick icon
- `src/components/PlayerStatusList.tsx` — list of PlayerRow, answered/waiting state
- `src/components/LeaderboardRow.tsx` — position + name + score
- `src/components/RoundBadge.tsx` — shows "Round 3 of 5"
- `src/components/QRCodeDisplay.tsx` — QR code + room code text + copy button
- `src/components/ScoreBadge.tsx` — score shown in banner
- `src/components/HostDropdown.tsx` — overlay dropdown with: Players list, Room Code, End Game Early

### Overlays
- `src/components/GamePausedOverlay.tsx` — full-screen. Shown to all when host disconnects.
- `src/components/KickedOverlay.tsx` — full-screen. Shown to player when kicked.
- `src/components/ConfirmDialog.tsx` — reusable confirmation dialog (used for kick, end game early)

### Feedback
- `src/components/EmptyState.tsx` — illustration + message for empty lists
- `src/components/ErrorMessage.tsx` — inline error display
- `src/components/LoadingSpinner.tsx`

---

## Phase 5 — Screens (Host Flow)

### HomeScreen
- Two primary actions: **Host a Game** / **Join a Game**
- List of saved questionnaires with edit/delete/duplicate actions
- Empty state if no questionnaires saved

### SetupGameScreen
- Select an existing questionnaire OR create a new one (→ QuestionnaireBuilderScreen)
- Proceed to RoundsBuilderScreen
- Only enabled once a questionnaire is selected

### QuestionnaireBuilderScreen
- Add, edit, reorder, delete questions
- Each question: type selector, prompt text, options/tags/range config, correct answer
- Validate before save: at least 1 question, all questions have a prompt, multiple choice has ≥2 options
- Save locally (create or update)
- On save: modal prompt — "Remember to label the items you are testing. Labels are hidden from players until the end."

### RoundsBuilderScreen
- Number input for total rounds (min 1)
- Optional label per round — inline list, tap to edit
- Persistent banner: "Round labels are hidden from players until the end of the game"
- Proceed to create game (connects to PartyKit, gets room code) → HostLobbyScreen

### HostLobbyScreen
- Large room code display
- QRCodeDisplay component (+ copy button)
- Pending join requests list — Admit / Deny per player
- Admitted players list with connection status
- Start Game button — enabled only when ≥1 player admitted
- Connecting/error state if PartyKit connection fails

### HostRoundScreen (in-game tab 1)
- RoundBadge (e.g. "Round 2 of 5")
- PlayerStatusList — answered (tick) / waiting (clock) per player
- State machine:
  - `Answering` — waiting for all players
  - `AllAnswered` — **Reveal Answers** button enabled
  - `AnswersRevealed` — **Next Round** button (or **End Game** on final round)
- Host dropdown in banner

### HostPlayersScreen (in-game tab 2)
- PlayerRow per player: name + green/grey dot + kick icon
- Kick → ConfirmDialog → kick_player message sent

### HostLeaderboardScreen (in-game tab 3)
- LeaderboardRow per player: position + name + score
- Updates live after each round's reveal

### HostResultsScreen
- Final leaderboard with winner highlighted
- Per-player expandable breakdown: score per round, right/wrong per question, round labels revealed
- Share/export results (Phase 7)

---

## Phase 6 — Screens (Player Flow)

### JoinGameScreen
- Room code input (pre-filled if arrived via deep link)
- Name input
- Submit join request → waiting state ("Waiting for host to admit you…")
- Denied state: "You were not admitted into the game" with option to try again
- Connection error state

### PlayerLobbyScreen
- "Waiting for the host to start the game…"
- Player's own name shown
- Animated waiting indicator

### PlayerRoundScreen
- RoundBadge in banner + ScoreBadge in banner
- Scrollable list of all questions rendered by type-specific component
- Answers tracked in `useAnswers` hook
- Submit button (fixed at bottom) — disabled until all questions answered
- Post-submit state: questions locked, "Waiting for host to reveal answers…"
- Post-reveal state: each question switches to result renderer (green/red), score delta shown ("+ 3 points this round")
- Advances automatically to next round when host triggers `advance_round`
- GamePausedOverlay if host disconnects
- KickedOverlay if player is kicked

### PlayerResultsScreen
- Final score + finishing position ("You came 2nd!")
- Round-by-round breakdown: each round's label revealed, questions right/wrong
- Animated score reveal

---

## Phase 7 — Polish & Production Readiness

### Error Handling
- `src/components/ErrorBoundary.tsx` — React error boundary wrapping the navigator. Catches render errors, shows recovery UI.
- All async operations (DB reads, socket sends) have error states surfaced to UI
- Network timeout handling on PartyKit connection attempts
- If PartyKit is unreachable on game create: show error, do not proceed to lobby

### Reconnection
- `usePartySocket` uses `partysocket` auto-reconnect with exponential backoff
- On reconnect: server sends `game_state` to restore full client state
- `GamePausedOverlay` shown to all players while host is disconnected
- Player rejoins same room + name → server restores their slot and score

### Accessibility
- All interactive elements have `accessibilityLabel` and `accessibilityRole`
- Colour is never the only indicator of state (always paired with icon or text)
- Minimum touch target 44×44pt

### Performance
- `FlatList` for all lists (player lists, questionnaire list, leaderboard)
- `useCallback` / `useMemo` on all handlers passed as props
- `React.memo` on pure display components (PlayerRow, LeaderboardRow, etc.)
- Avoid re-renders: game state updates only trigger re-renders in consuming components

### Validation & Security
- Questionnaire builder validates before save — no empty prompts, no options without labels
- All server messages validated before dispatch to state
- Correct answers never leave the server until host reveals
- Host-only messages rejected server-side if sender is not the authenticated host connection

### Deep Links
- `useDeepLink` hook handles cold-start and warm-start deep links
- `blindtaster://join/ROOMCODE` → pre-fills room code on JoinGameScreen

### Animations
- Screen transitions: native stack slide
- Overlay entry/exit: fade
- Score update in banner: count-up animation
- Answer reveal: staggered green/red highlight per question
- Leaderboard reorder: animated position change

### App Store Preparation
- App icon (1024×1024, no alpha)
- Splash screen
- `eas.json` build profiles: development / preview / production
- iOS: privacy descriptions in `app.json` (no Bluetooth needed — remove old BLE permissions)
- Android: no special permissions needed for PartyKit (internet only)
- EAS build for both platforms before submission

### Testing
- Unit tests for: scoring logic, DB helpers, message parsing, answer validation
- Component tests: question renderers, builder components
- Integration: full game flow with mock socket
- Test files co-located: `ComponentName.test.tsx` next to component

---

## Build Order

1. **Phase 1** — constants, types, navigation skeleton, DB setup
2. **Phase 4** — all shared components with static/mock props (no real data)
3. **Phase 5 + 6** — all screens with mock data (no socket, no DB)
4. **Phase 2** — PartyKit server, local dev with `npx partykit dev`
5. **Phase 3** — context + hooks wiring real socket data into screens
6. Wire DB — questionnaire save/load working end to end
7. **Phase 7** — error handling, reconnection, polish, EAS builds
8. QA full game flow on real devices (iOS + Android)
9. `npx partykit deploy` — deploy server to production
10. App store submission via EAS
