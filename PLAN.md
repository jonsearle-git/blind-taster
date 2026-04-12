# Blind Taster — Implementation Plan

Reference files: CLAUDE.md (coding rules), PROJECT.md (product spec), ARCHITECTURE.md (system design)

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
@types/jest
wrangler ^4.x
@cloudflare/workers-types ^4.x
partyserver ^0.4.x
ts-jest           (used for server unit tests — avoids Expo runtime scope issues)
jest ^29.x
```

---

## Project Config Files

### `wrangler.toml`
```toml
name = "blind-taster"
main = "src/party/server.ts"
compatibility_date = "2025-01-01"
tsconfig = "tsconfig.server.json"

[[durable_objects.bindings]]
name = "main"
class_name = "BlindTasterServer"

[[migrations]]
tag = "v1"
new_classes = ["BlindTasterServer"]
```

### `src/lib/config.ts`
- Exports `PARTYKIT_HOST` — `localhost:8787` in `__DEV__`, `blind-taster.YOUR_SUBDOMAIN.workers.dev` in production
- Single place to change the URL — never hardcoded elsewhere

### `jest.config.js`
- Uses `projects` array: one entry using `jest-expo` preset (for app code), one entry using `ts-jest` preset (for `src/party/` server code)
- ts-jest project avoids Expo's runtime module scope restrictions

### `app.json`
- Deep link scheme: `blindtaster`
- iOS: `bundleIdentifier: com.blindtaster.app`
- Android: `package: com.blindtaster.app`
- Dark UI, splash background `#0F0A0B`
- New architecture enabled

---

## Phase 1 — Foundation

### 1.1 Constants

- `src/constants/colors.ts` — full colour theme (see CLAUDE.md). Used everywhere, no exceptions.
- `src/constants/spacing.ts` — spacing scale (xs/sm/md/lg/xl/xxl)
- `src/constants/typography.ts` — FontSize and FontWeight
- `src/constants/gameConstants.ts` — enums: `GamePhase`, `QuestionType`, `PlayerStatus`, `RoundPhase`

### 1.2 Types

Each file covers one domain. No `any`. No plain string discriminators.

- `src/types/questionnaire.ts`
  - `Question`: discriminated union per QuestionType — **pure templates, no correct answer fields**
  - `QuestionForPlayer` and `QuestionnaireForPlayer`: type aliases for `Question` / `Questionnaire` (no stripping needed)
  - `Questionnaire`: `{ id: string; name: string; questions: Question[]; createdAt: number; updatedAt: number }`

- `src/types/game.ts`
  - `GamePhase` enum: `Lobby | InRound | AllAnswered | AnswersRevealed | GameOver`
  - `RoundPhase` enum: `Answering | AllAnswered | AnswersRevealed`
  - `Round`: `{ number: number; label: string | null; correctAnswers: Answer[] }` — full server-side type
  - `RoundForPlayer`: `{ number: number; label: null }` — stripped for client broadcast
  - `GameState`: includes `answeredPlayerIds: string[]` (server-authoritative)

- `src/types/player.ts`
  - `PlayerStatus` enum: `Connected | Disconnected | Kicked`
  - `Player`: `{ id: string; name: string; status: PlayerStatus; score: number }`

- `src/types/answer.ts`
  - `Answer`: discriminated union per QuestionType

- `src/types/results.ts`
  - `QuestionResult`: includes `playerAnswerLabel: string` and `correctAnswerLabel: string` (resolved server-side, never raw IDs)
  - `RoundResult`, `PlayerResult`, `GameResults`, `PlayerScore`

- `src/types/partykit.ts` — all socket message types

- `src/types/navigation.ts`
  - `RootStackParamList`, `HostStackParamList`, `HostInGameTabParamList`, `PlayerStackParamList`

### 1.3 Navigation

- `src/navigation/AppNavigator.tsx` — root stack: HomeScreen → HostNavigator | PlayerNavigator
- `src/navigation/HostNavigator.tsx` — stack + nested tab navigator
  - Stack: SetupGame → QuestionnaireBuilder → RoundsBuilder → HostLobby → HostInGameTabs → HostResults
  - Tabs: HostRound | HostPlayers | HostLeaderboard
- `src/navigation/PlayerNavigator.tsx` — stack: JoinGame → PlayerLobby → PlayerRound → PlayerResults
- Deep link config: `blindtaster://join/:roomCode` maps to `JoinGameScreen` with `roomCode` param

### 1.4 Local Database

- `src/lib/database.ts` — initialise expo-sqlite, run migrations on app start
- Schema: `questionnaires` table — stores serialised `Questionnaire` JSON
- `saveQuestionnaire` uses UPSERT (`ON CONFLICT(id) DO UPDATE SET`) — safe for create and edit
- `src/lib/migrations.ts` — versioned migrations, runs on startup

---

## Phase 2 — PartyKit Server

### Server Responsibilities

- Owns all game state in memory (per room)
- Correct answers stored in `Round.correctAnswers` server-side — never broadcast until host triggers reveal
- Scores all player answers server-side at reveal time
- Pauses game on host disconnect; sets Durable Object alarm for 5-minute auto-end
- Resends `game_ended` to reconnecting host if phase is `GameOver`
- `request_join` in `PENDING_ONLY` set — admitted players cannot re-request
- Uses `room.getConnections()` (not deprecated `.connections.values()`)

### Message Types (`src/types/partykit.ts`)

**Server → Client (ServerMessage):**
- `game_state` — sanitised state sync (no correct answers, null labels on rounds)
- `join_request` — host only
- `you_were_denied` — sent to denied player only
- `player_joined` — broadcast
- `you_were_kicked` — sent to kicked player only
- `game_started` — `{ questionnaire: QuestionnaireForPlayer; rounds: RoundForPlayer[] }`
- `round_started` — `{ roundNumber: number }`
- `all_players_answered` — broadcast
- `answers_revealed` — personalised per player; host gets `playerScores` only
- `game_ended` — `{ results: GameResults }` — broadcast; includes round labels
- `game_paused`, `game_resumed`

**Client → Server (ClientMessage):**
- `request_join` — `{ name: string }`
- `admit_player`, `deny_player` — host only
- `start_game` — `{ questionnaire: Questionnaire; rounds: Round[] }` — host only; rounds include `correctAnswers`
- `submit_answers` — `{ roundNumber: number; answers: Answer[] }`
- `reveal_answers` — host only
- `advance_round` — host only
- `kick_player` — host only
- `end_game` — host only

---

## Phase 3 — Context & Hooks

### Context

- `src/context/GameContext.tsx` — `useReducer` context for all game state. `RESET` returns to `initialState`.
- No `answeredPlayerIds` field on context — comes from `GameState.answeredPlayerIds` (server-authoritative).

### Hooks

- `src/hooks/usePartySocket.ts` — WebSocket via `partysocket`. Queues messages when not OPEN; flushes on reconnect.
- `src/hooks/useGameState.ts` — subscribes to socket messages, updates GameContext.
- `src/hooks/useHostControls.ts` — typed wrappers: `admitPlayer`, `denyPlayer`, `startGame`, `revealAnswers`, `advanceRound`, `kickPlayer`, `endGame`.
- `src/hooks/usePlayerActions.ts` — `submitAnswers`, `requestJoin`.
- `src/hooks/useQuestionnaires.ts` — CRUD against local DB via QuestionnairesContext.
- `src/hooks/useAnswers.ts` — manages in-progress answer state for current round before submission.

---

## Phase 4 — Shared Components

### Layout
- `ScreenContainer` — SafeAreaView wrapper with background colour, standard padding
- `Banner` — top bar; title, optional player score, optional host dropdown trigger
- `Divider` — horizontal rule

### Inputs
- `TextInput` — styled text input, label, optional error
- `Button` — primary / secondary / destructive variants, loading and disabled states
- `IconButton` — icon-only pressable

### Question Inputs (player-facing)
- `questions/QuestionInput.tsx` — dispatcher: renders correct input component by question type
- `questions/MultipleChoiceQuestion.tsx`, `SliderQuestion.tsx`, `TagsQuestion.tsx`, `PriceQuestion.tsx`

### Question Results (post-reveal)
- `questions/QuestionResult.tsx` — renders `playerAnswerLabel` and `correctAnswerLabel` strings directly; no ID resolution needed

### Question Builders (host-facing)
- `builder/MultipleChoiceBuilder.tsx` — options only, no correct answer field
- `builder/SliderBuilder.tsx` — min/max/step only
- `builder/TagsBuilder.tsx` — tags + maxSelections only
- `builder/PriceBuilder.tsx` — currencySymbol only

### Game UI
- `PlayerRow`, `LeaderboardRow`, `RoundBadge`, `QRCodeDisplay`, `ScoreBadge`, `HostDropdown`

### Overlays
- `GamePausedOverlay` — shown to all when host disconnects
- `KickedOverlay` — shown to kicked player
- `ErrorBoundary` — class component wrapping entire app in `App.tsx`

---

## Phase 5 — Screens (Host Flow)

### HomeScreen
- Host / Join buttons
- Saved questionnaires list with **Edit** and **Delete** per item
- Edit navigates to `QuestionnaireBuilder` with existing `questionnaireId`
- Delete shows confirmation alert

### SetupGameScreen
- Select an existing questionnaire OR create new (→ QuestionnaireBuilder)
- Proceed → RoundsBuilder

### QuestionnaireBuilderScreen
- Add, edit, reorder, delete questions
- Questions are pure templates — type, prompt, options/tags/range. No correct answer entry here.
- Validates before save: name, ≥1 question, all questions have a prompt, MC has ≥2 options
- Uses `save()` for new, `update()` for existing questionnaires (both use DB UPSERT)

### RoundsBuilderScreen
- Number input for total rounds (1–20)
- Per round: optional label (hidden from players), and **correct answers** for every question
- Badge shows `X/Y` questions answered per round; turns green with ✓ when complete
- Expandable answer section per round uses `QuestionInput` components
- `handleContinue()` validates all rounds have all answers before proceeding
- Proceeds → HostLobby with `{ questionnaireId, rounds }`

### HostLobbyScreen
- Large room code + QR code
- Pending join requests: Admit / Deny per player
- Admitted players list
- Start Game — enabled when ≥1 player admitted
- Sends `start_game` with full questionnaire + `rounds` (including `correctAnswers`)

### HostRoundScreen
- Per-player answered/waiting status (from `game.answeredPlayerIds`)
- State machine: Answering → Reveal Answers → Next Round (or End Game)

### HostResultsScreen
- Winner + final leaderboard
- Expandable per-player breakdown: score per round, per-question result with labels
- **Done** button — dispatches RESET, navigates to Home

---

## Phase 6 — Screens (Player Flow)

### JoinGameScreen
- Room code input (pre-filled from deep link route param)
- Name input
- `isActiveGame()` check before connecting — shows "Already in a Game" confirmation dialog if true
- `RESET` dispatched before connecting to new room
- `connectedRoomCode` decoupled from `roomCodeInput` — socket only connects on Join press
- `pendingJoinRef` sends `request_join` in `onOpen` after socket connects

### PlayerLobbyScreen
- Waiting for host to start
- Player list
- **Leave Game** button — dispatches RESET, navigates to Home

### PlayerRoundScreen
- All questions rendered; answers tracked in `useAnswers`
- Submit button enabled when all questions answered
- Post-submit: locked, waiting for reveal
- Post-reveal: inline results with `playerAnswerLabel` / `correctAnswerLabel` strings

### PlayerResultsScreen
- Final position (ordinal) + total score
- Round-by-round breakdown, expandable per round
- **Done** button — dispatches RESET, navigates to Home

---

## Phase 7 — Production Readiness

### Error Handling
- `ErrorBoundary` class component wrapping navigator in `App.tsx`
- All async operations have error states surfaced to UI
- Server: all messages wrapped in `try/catch`; payload size limits enforced

### Reconnection
- `usePartySocket` uses `partysocket` auto-reconnect with exponential backoff
- `usePartySocket` queues outbound messages when socket is not OPEN; flushes on reconnect
- On reconnect: server sends `game_state`; host gets `game_ended` if game is over

### Security
- Host token verified server-side on every connection
- Host-only messages rejected if sender is not the host connection
- `answeredPlayerIds` tracked server-side — re-submission blocked
- `reveal_answers` phase-guarded against double-call
- All broadcasts go through `broadcastToAdmitted()` — unadmitted connections excluded
- Payload size limits: ≤20 questions, ≤20 rounds, prompts ≤500 chars, options ≤10
- Player name 1–24 chars validated server-side
- Room code 8 alphanumeric characters (~1 trillion combinations)
- Deep link room code sanitised in `JoinGameScreen` before use

### Testing
- Unit tests in `src/party/__tests__/`
- `scoring.test.ts` — tests `scoreAnswer(q, player, correct)` and `gradePlayerAnswers(qs, players, corrects)`
- `helpers.test.ts` — tests `buildGameState`, `buildGameResults`, `toPlayer`
- Run: `npx jest "party/__tests__"` (uses ts-jest, no Expo runtime)

### Deployment
- `npx wrangler deploy` — deploys server to Cloudflare
- Update `PROD_HOST` in `src/lib/config.ts` with your Cloudflare workers subdomain before production build
- EAS build profiles: `development` / `preview` / `production`
