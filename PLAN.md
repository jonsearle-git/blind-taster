# Blind Taster — Implementation Plan

Reference files: CLAUDE.md (coding rules), PROJECT.md (product spec)

---

## Phase 1 — Foundation

Set up the project skeleton. Nothing visual yet, just the plumbing.

### 1.1 Constants
- `src/constants/colors.ts` — full colour theme, used everywhere
- `src/constants/spacing.ts` — spacing scale
- `src/constants/typography.ts` — font sizes and weights
- `src/constants/gameConstants.ts` — enums for game phase, question types, reveal mode, game mode

### 1.2 Types
- `src/types/questionnaire.ts` — Question, QuestionType enum, Questionnaire
- `src/types/game.ts` — GameState, GameMode, GamePhase, Round, RoundLabel
- `src/types/player.ts` — Player, PlayerStatus
- `src/types/answer.ts` — Answer, PlayerAnswers, RoundAnswers
- `src/types/results.ts` — PlayerResult, RoundResult, GameResults
- `src/types/partykit.ts` — ServerMessage and ClientMessage discriminated unions
- `src/types/navigation.ts` — RootStackParamList, HostStackParamList, PlayerStackParamList

### 1.3 Navigation
- `src/navigation/AppNavigator.tsx` — root stack
- `src/navigation/HostNavigator.tsx` — host flow
- `src/navigation/PlayerNavigator.tsx` — player flow
- Deep link config for `blindtaster://join/:roomCode`

### 1.4 Local Database
- `src/lib/database.ts` — SQLite wrapper (expo-sqlite)
- CRUD for saved questionnaires

---

## Phase 2 — PartyKit Server

- `src/party/server.ts` — Cloudflare Worker (PartyKit)
- Handles: player join requests, host admit/deny, game state broadcast, round advancement, kick, reconnection, pause on disconnect

### Server message types (from `src/types/partykit.ts`)
All traffic is typed. Server is source of truth.

**Server → Client:**
- `game_state` — full state sync on connect/reconnect
- `join_request` — sent to host when player wants to join
- `player_admitted` / `player_denied`
- `player_joined` / `player_kicked`
- `game_started`
- `round_started` — includes round number, hides label
- `round_ended`
- `game_ended` — includes results payload
- `game_paused` / `game_resumed`

**Client → Server:**
- `request_join` — player sends name
- `admit_player` / `deny_player` — host only
- `start_game` — host only
- `submit_answers` — player submits answers for current round
- `advance_round` — host only
- `kick_player` — host only
- `end_game` — host only

---

## Phase 3 — Core Hooks

- `src/hooks/usePartySocket.ts` — connect, send, receive, reconnect logic
- `src/hooks/useGameState.ts` — subscribe to server state, expose typed game state
- `src/hooks/useHostControls.ts` — admit/deny, advance, kick, start, end
- `src/hooks/useQuestionnaires.ts` — load/save/delete from local DB
- `src/hooks/useAnswers.ts` — manage current round answer state before submission

---

## Phase 4 — Shared Components

- `src/components/Button.tsx`
- `src/components/Card.tsx`
- `src/components/TextInput.tsx`
- `src/components/ScreenContainer.tsx`
- `src/components/Banner.tsx` — top bar, includes host dropdown if host
- `src/components/HostDropdown.tsx` — host controls overlay
- `src/components/PlayerStatusList.tsx` — shows answered/waiting per player
- `src/components/QRCode.tsx` — displays join QR code
- `src/components/RoundLabel.tsx` — shows round number, hides label
- `src/components/GamePausedOverlay.tsx` — full-screen overlay shown when game is paused (disconnect)
- `src/components/KickedOverlay.tsx` — full-screen overlay shown to a player when they are kicked

---

## Phase 5 — Screens (Host Flow)

### HomeScreen
- Choose: Host a game / Join a game
- Access saved questionnaires

### SetupGameScreen
- Pick or create questionnaire
- Set number of rounds
- Label each round (warn: hidden from players until end)
- Choose mode: Quiz / Feedback
- If quiz: choose reveal timing (after each round / end of game)
- Toggle: host also plays (disabled if quiz mode with answers set)
- If feedback mode: set custom thank you message shown to players at the end

### QuestionnaireBuilderScreen
- Add/edit/remove questions
- Per question: set type, set options/tags, set answer limit (tags), set correct answer (quiz mode)
- Save questionnaire locally

### RoundsBuilderScreen
- Set round count
- Optionally label each round
- Clear warning that labels are hidden from players

### HostLobbyScreen
- Display room code + QR code
- Incoming join requests — admit / deny
- Player list
- Start game button (enabled when ≥1 player admitted)

### RoundMonitorScreen
- Current round number
- Per-player: answered / waiting indicator
- Advance to next round button (active when all answered)
- Host dropdown: kick player, skip to results, etc.
- If host is also player: questionnaire is shown here (same as PlayerRoundScreen)

### HostResultsScreen
- Quiz mode: leaderboard, winner, per-player breakdown, round labels revealed
- Feedback mode: all responses per round per player, round labels revealed

---

## Phase 6 — Screens (Player Flow)

### JoinGameScreen
- Enter room code manually or land here via deep link
- Enter name
- Submit join request

### PlayerLobbyScreen
- Waiting for host to start
- Show own name, connection status

### PlayerRoundScreen
- Round number shown
- Questionnaire rendered question by question (or all at once — TBD)
- Submit answers button
- Waiting state after submission until host advances

### PlayerResultsScreen
- Quiz mode: own score, finishing position (1st, 2nd, 3rd etc.), right/wrong per question, round labels revealed
- Feedback mode: custom thank you message set by host

---

## Phase 7 — Polish

- Deep link handling (joining via URL)
- Reconnection UX (game paused banner, rejoin flow)
- Error states on all async operations
- Empty states (no saved questionnaires, no players in lobby)
- Kick handling on player side (booted screen)
- Host disconnect handling (paused screen for players)
- Animations and transitions
- App icon, splash screen

---

## Build Order

1. Phase 1 (constants, types, navigation skeleton)
2. Phase 4 (shared components — needed by all screens)
3. Phase 5 + 6 (screens with static/mock data first)
4. Phase 2 (PartyKit server)
5. Phase 3 (hooks wiring real data into screens)
6. Phase 1.4 (local DB for questionnaires)
7. Phase 7 (polish)
