# Blind Taster — Architecture

## Overview

Blind Taster is a real-time multiplayer quiz app for blind tasting events (wine, spirits, food, etc.). One device acts as the **host**, controlling the game. Any number of player devices join via room code or QR code. Each round represents one item being tasted; players answer a set of questions about it without knowing what the item is.

---

## Stack

| Layer | Technology |
|---|---|
| Mobile app | Expo SDK 54 / React Native 0.81 / React 19 |
| Language | TypeScript (strict mode throughout) |
| Real-time networking | Cloudflare PartyKit via `partysocket` |
| Local storage | `expo-sqlite` with versioned migrations |
| Navigation | `@react-navigation/native` + native stack + bottom tabs |
| Build / distribution | EAS Build |

---

## Project Structure

```
src/
  components/         Reusable UI — Button, Banner, PlayerRow, question inputs, etc.
    questions/        Question display and input components (one per type)
    builder/          Questionnaire builder sub-components
  screens/
    host/             Host flow screens
    player/           Player flow screens
  hooks/              Custom hooks — socket, game state, answers, deep link
  context/            GameContext (game state + socket ref), QuestionnairesContext
  navigation/         AppNavigator, HostNavigator, PlayerNavigator
  constants/          colors, spacing, typography, gameConstants (enums)
  types/              All TypeScript types — one file per domain
  lib/                Pure utilities — database, migrations, config
  party/              PartyKit server code (Cloudflare Worker)
    server.ts         Main server class
    scoring.ts        Answer grading logic
    helpers.ts        State builders shared between handlers
```

Entry point: `index.ts` → imports `react-native-get-random-values` first (required for `uuid`), then registers `App.tsx`.

---

## Navigation Structure

```
NavigationContainer (linking: blindtaster://join/:roomCode → Player/JoinGame)
└── Root Stack
    ├── Home                       HomeScreen
    ├── Host  →  HostNavigator
    │   ├── SetupGame              Pick or create questionnaire
    │   ├── QuestionnaireBuilder   Add/edit questions
    │   ├── RoundsBuilder          Set round count + per-round labels
    │   ├── HostLobby              QR code, admit/deny players, start game
    │   ├── HostInGame  →  Bottom Tabs
    │   │   ├── HostRound          Answer tracking, reveal, advance
    │   │   ├── HostPlayers        Connection status, kick
    │   │   └── HostLeaderboard    Live scores
    │   └── HostResults            Final breakdown, expandable per-player
    └── Player  →  PlayerNavigator
        ├── JoinGame               Room code + name entry
        ├── PlayerLobby            Waiting room, player list
        ├── PlayerRound            Questions, submit, reveal results inline
        └── PlayerResults          Position, score, round breakdown
```

Deep links (`blindtaster://join/ABCDEF`) are handled by React Navigation's `NavigationContainer` linking config — no custom handling required.

---

## State Management

### GameContext

A single `useReducer`-based context (`src/context/GameContext.tsx`) holds all live game state for both the host and player sides:

```
gameState           Full GameState from server (players, phase, round, questionnaire)
isHost              Whether this device is the host
localPlayerId       The admitted player's ID (player side only)
pendingRequests     Join requests waiting for host decision
answeredPlayerIds   Set of playerIds who have submitted this round (host side)
isKicked            Whether the local player was kicked
isPaused            Whether the host has disconnected (game paused)
gameResults         Final GameResults once the game ends
lastRoundResults    This round's QuestionResult[] after reveal (player side)
lastPlayerScores    Score deltas after this round's reveal
```

`GameContext` also holds `sendRef` — a `MutableRefObject` pointing to the active WebSocket send function. This allows any screen to send messages without each owning a socket connection.

### QuestionnairesContext

Wraps `expo-sqlite` for local questionnaire CRUD. Loaded once on app start, reloaded after any write. Used only on the host side (the questionnaire is transmitted to the server at game start, not stored on player devices).

---

## Networking — PartyKit

### Connection Model

- **One connection per device per game.** The host creates the connection in `HostLobbyScreen`; players create theirs in `JoinGameScreen`.
- The owning screen sets `sendRef.current = send` and clears it on unmount. Because both screens remain mounted on their respective navigation stacks throughout the game, the socket stays alive for the full session.
- All screens that need to send messages call `useHostControls` or `usePlayerActions`, which write through `sendRef.current`.

### Message Flow

```
Host device                    PartyKit Server                 Player device
─────────────────────────────────────────────────────────────────────────────
Connect (?isHost=1)  ────────▶ store as host conn
                               broadcast game_state ◀──────── Connect
                    ◀──────── join_request          ◀──────── request_join
admit_player ───────────────▶
                               player_admitted ────────────▶
                               game_state (broadcast) ──────▶
start_game ─────────────────▶
                               game_started ───────────────▶  (questionnaire, no correct answers)
                               game_state (broadcast)
                    ◀──────── player_answered        ◀──────── submit_answers
                    ◀──────── all_players_answered
reveal_answers ─────────────▶
                               grade answers
                               answers_revealed ───────────▶  (personalised per player)
                               answers_revealed (empty qr) ◀─ (host gets playerScores only)
                               game_state (updated scores)
advance_round ──────────────▶
                               round_started (broadcast)
                               game_state (broadcast)
end_game ───────────────────▶
                               game_ended (broadcast) ──────▶
```

### Security — Correct Answers

Correct answers are **never broadcast**. The server holds the full `Questionnaire` (received from the host at `start_game`). Players receive only `QuestionnaireForPlayer` — a version with `correctOptionId`, `correctValue`, and `correctTagIds` stripped at the type level. Correct answers are computed server-side at reveal time and sent only as part of the `QuestionResult` payload after the host triggers reveal.

### Host Disconnect / Reconnect

When the host's connection closes mid-game, the server broadcasts `game_paused` to all players. Players see a full-screen overlay ("Host has disconnected"). When the host reconnects with `?isHost=1`, the server sends the current `game_state` and broadcasts `game_resumed`.

---

## Server Architecture

The PartyKit server (`src/party/server.ts`) is a Cloudflare Durable Object. One instance per room. State lives in memory for the life of the room (while at least one connection is open).

**`server.ts`** — `BlindTasterServer` class:
- `onConnect` — identifies host vs player via `?isHost=1` query param; stores role in connection state
- `onMessage` — routes `ClientMessage` to the appropriate handler method
- `onClose` — handles host disconnect (pause) and player disconnect (status update)

**`scoring.ts`** — pure functions:
- `scoreAnswer(question, answer)` — returns 0–100 points
- `buildCorrectAnswer(question)` — constructs the correct `Answer` object from a question definition
- `gradePlayerAnswers(questions, answers)` — returns `QuestionResult[]` for one player

**`helpers.ts`** — shared types and state builders:
- `buildGameState(state, roomId)` — constructs the `GameState` broadcast to all clients
- `buildQuestionnaireForPlayer(questionnaire)` — strips correct answer fields
- `buildGameResults(state)` — compiles final `GameResults` from round history

### Scoring Rules

| Question type | Full marks | Partial credit |
|---|---|---|
| Multiple choice | Correct option = 100 pts | 0 pts otherwise |
| Slider | Exact match = 100 pts | Linear scale from correct value to range edge |
| Tags | All correct tags selected = 100 pts | Proportional to fraction of correct tags chosen |
| Price | Exact match = 100 pts | Linear scale from 0% to 100% price error |

---

## Local Data — SQLite

Questionnaires are stored locally on the host device using `expo-sqlite`. Schema is versioned via a `schema_version` table; migrations run on app start (`src/lib/migrations.ts`). Players never interact with SQLite — their questionnaire data comes entirely from the server at `game_started`.

---

## Type System

All types live in `src/types/`, one file per domain:

| File | Contents |
|---|---|
| `game.ts` | `GameState`, `Round` |
| `player.ts` | `Player`, `JoinRequest` |
| `questionnaire.ts` | All question types, `Questionnaire`, `QuestionForPlayer`, `QuestionnaireForPlayer` |
| `answer.ts` | All answer types, `PlayerRoundAnswers` |
| `results.ts` | `QuestionResult`, `RoundResult`, `PlayerResult`, `GameResults`, `PlayerScore` |
| `partykit.ts` | `ServerMessage` and `ClientMessage` discriminated unions |
| `navigation.ts` | `RootStackParamList`, `HostStackParamList`, `HostInGameTabParamList`, `PlayerStackParamList` |

Enums (`GamePhase`, `RoundPhase`, `QuestionType`, `PlayerStatus`, etc.) live in `src/constants/gameConstants.ts` — imported by both client and server.

---

## Key Design Decisions

**Host is not a player.** The host knows the correct answers (they built the questionnaire). Playing and hosting simultaneously would compromise the blind testing premise.

**Answers revealed at end of each round, not end of game.** Immediate feedback keeps players engaged between rounds. Round labels (the item name) are included in the reveal, so players learn what they were tasting round by round.

**One questionnaire, multiple rounds.** The same set of questions is asked for every item. Round labels identify each item after reveal; before reveal, players only see "Round N".

**Server is source of truth.** Clients never optimistically mutate game state. All state transitions go through the server and come back as a `game_state` broadcast.

**`sendRef` pattern.** Rather than lifting socket state into context or creating multiple connections, the socket `send` function is stored in a `MutableRefObject` inside `GameContext`. The owning screen (`HostLobbyScreen` / `JoinGameScreen`) sets it on mount; all other screens call it via `useHostControls` / `usePlayerActions`. This avoids re-renders and keeps the socket lifecycle tied to a single component.
