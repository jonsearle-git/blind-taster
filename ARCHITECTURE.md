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
    questions/        Question display, input, and result components (one per type)
    builder/          Questionnaire builder sub-components
  screens/
    host/             Host flow screens
    player/           Player flow screens
  hooks/              Custom hooks — socket, game state, answers, player/host actions
  context/            GameContext (game state + socket ref), QuestionnairesContext
  navigation/         AppNavigator, HostNavigator, PlayerNavigator
  constants/          colors, spacing, typography, gameConstants (enums)
  types/              All TypeScript types — one file per domain
  lib/                Pure utilities — database, migrations, config
  party/              PartyKit server code (Cloudflare Worker)
    server.ts         Main server class
    scoring.ts        Answer grading logic
    helpers.ts        State builders shared between handlers
    __tests__/        Unit tests for scoring and helpers (ts-jest)
```

Entry point: `index.ts` → imports `react-native-get-random-values` first (required for `uuid`), then registers `App.tsx`.

`App.tsx` wraps the navigator in an `ErrorBoundary` class component and the `GameProvider` context.

---

## Navigation Structure

```
NavigationContainer (linking: blindtaster://join/:roomCode → Player/JoinGame)
└── Root Stack
    ├── Home                       HomeScreen
    ├── Host  →  HostNavigator
    │   ├── SetupGame              Pick or create questionnaire
    │   ├── QuestionnaireBuilder   Add/edit questions (pure templates)
    │   ├── RoundsBuilder          Set round count + labels + correct answers per round
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

Deep links (`blindtaster://join/ABCDEF`) are handled by React Navigation's `NavigationContainer` linking config.

---

## State Management

### GameContext

A single `useReducer`-based context (`src/context/GameContext.tsx`) holds all live game state for both the host and player sides:

```
gameState           Full GameState from server (players, phase, round, questionnaire,
                    answeredPlayerIds)
isHost              Whether this device is the host
localPlayerId       The admitted player's ID (player side only)
pendingRequests     Join requests waiting for host decision
isKicked            Whether the local player was kicked
isPaused            Whether the host has disconnected (game paused)
gameResults         Final GameResults once the game ends
lastRoundResults    This round's QuestionResult[] after reveal (player side)
lastPlayerScores    Score deltas after this round's reveal
```

`answeredPlayerIds` lives inside `GameState` (server-authoritative) — not as a separate client-side field. This means the host sees the correct answer tracking state even after reconnecting.

`GameContext` also holds `sendRef` — a `MutableRefObject` pointing to the active WebSocket send function. This allows any screen to send messages without each owning a socket connection.

### QuestionnairesContext

Wraps `expo-sqlite` for local questionnaire CRUD. Loaded once on app start, reloaded after any write. Used only on the host side (the questionnaire is transmitted to the server at game start, not stored on player devices).

---

## Correct Answer Model

Questions are **pure templates** — they define structure (options, tags, slider range) but carry no correct answers. The `Question` type has no `correctOptionId`, `correctValue`, or `correctTagIds` fields.

Correct answers live on `Round`:
```ts
type Round = {
  number: number;
  label: string | null;
  correctAnswers: Answer[];  // one per question; set by host in RoundsBuilder
};
```

This allows each round to test a different item with different correct answers. Round 1 might have "Merlot, £20" as correct; Round 2 "Shiraz, £35".

When sent to clients, `Round` becomes `RoundForPlayer` — `correctAnswers` and `label` are stripped. Players see neither correct answers nor round labels until reveal.

---

## Networking — PartyKit

### Connection Model

- **One connection per device per game.** The host creates the connection in `HostLobbyScreen`; players create theirs in `JoinGameScreen`.
- The owning screen sets `sendRef.current = send` and clears it on unmount. Because both screens remain mounted on their respective navigation stacks throughout the game, the socket stays alive for the full session.
- All screens that need to send messages call `useHostControls` or `usePlayerActions`, which write through `sendRef.current`.
- **One game at a time:** `JoinGameScreen` checks `isActiveGame(phase)` before connecting — if the player is already in a game, a confirmation dialog prompts them to leave first. `RESET` is dispatched before connecting to a new room.

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
start_game ─────────────────▶  (questionnaire + per-round correct answers)
                               game_started ───────────────▶  (questionnaire, no answers; rounds, no labels/answers)
                               game_state (broadcast)
                    ◀──────── game_state (updated)   ◀──────── submit_answers
                    ◀──────── all_players_answered (if all submitted)
reveal_answers ─────────────▶
                               grade answers (server-side, using round's correctAnswers)
                               answers_revealed ───────────▶  (personalised QuestionResult[] per player)
                               game_state (updated scores)
advance_round ──────────────▶
                               round_started (broadcast)
                               game_state (broadcast)
end_game ───────────────────▶
                               game_ended (broadcast) ──────▶
```

### Security — Correct Answers

Correct answers are **never broadcast**. The server holds `Round[]` with `correctAnswers` intact. Players receive `RoundForPlayer[]` — `correctAnswers` and `label` stripped at the type level. Scoring happens server-side at reveal time; results are sent as `QuestionResult` objects containing only `playerAnswerLabel` and `correctAnswerLabel` strings (human-readable, not IDs).

### Host Disconnect / Reconnect

When the host's connection closes mid-game, the server broadcasts `game_paused` to all players. When the host reconnects with `?isHost=1`, the server sends the current `game_state` and broadcasts `game_resumed`. If the game ended via alarm while the host was disconnected, the server resends `game_ended` on the host's reconnect.

---

## Server Architecture

The PartyKit server (`src/party/server.ts`) is a Cloudflare Durable Object. One instance per room. State lives in memory for the life of the room.

**`server.ts`** — `BlindTasterServer` class:
- `onConnect` — identifies host vs player via `?isHost=1`; sends `game_ended` on reconnect if game is over
- `onMessage` — routes `ClientMessage` to the appropriate handler with role checks (`HOST_ONLY` / `PLAYER_ONLY`)
- `onClose` — handles host disconnect (pause + alarm) and player disconnect (status update)
- `onAlarm` — fires 5 minutes after host disconnect; calls `handleEndGame`

**`scoring.ts`** — pure functions:
- `scoreAnswer(question, playerAnswer, correctAnswer)` — returns 0–100 points; correct answer is explicit
- `formatAnswerForDisplay(question, answer)` — resolves option/tag IDs to human-readable labels
- `gradePlayerAnswers(questions, playerAnswers, correctAnswers)` — returns `QuestionResult[]` with precomputed label strings

**`helpers.ts`** — shared types and state builders:
- `buildGameState(state, roomId)` — constructs the `GameState` broadcast to all clients; strips labels and `correctAnswers` from rounds; includes `answeredPlayerIds`
- `buildGameResults(state)` — compiles final `GameResults` from round history; crash-guarded for zero players

### Scoring Rules

| Question type | Full marks | Partial credit |
|---|---|---|
| Multiple choice | Correct option = 100 pts | 0 pts otherwise |
| Slider | Exact match = 100 pts | Linear from correct value to range edge |
| Tags | All correct tags selected = 100 pts | Proportional to fraction of correct tags chosen |
| Price | Exact match = 100 pts | Linear from 0% to 100% price error |

---

## Local Data — SQLite

Questionnaires are stored locally on the host device using `expo-sqlite`. Schema is versioned via a `schema_version` table; migrations run on app start (`src/lib/migrations.ts`). `saveQuestionnaire` uses an UPSERT pattern (`ON CONFLICT(id) DO UPDATE SET`) — safe for both create and edit flows.

Players never interact with SQLite — their questionnaire data comes entirely from the server at `game_started`.

---

## Type System

All types live in `src/types/`, one file per domain:

| File | Contents |
|---|---|
| `game.ts` | `GameState`, `Round`, `RoundForPlayer` |
| `player.ts` | `Player`, `JoinRequest` |
| `questionnaire.ts` | All question types, `Questionnaire`. `QuestionForPlayer` and `QuestionnaireForPlayer` are type aliases (questions are pure templates with no correct-answer fields to strip). |
| `answer.ts` | All answer types, `PlayerRoundAnswers` |
| `results.ts` | `QuestionResult` (with `playerAnswerLabel`/`correctAnswerLabel`), `RoundResult`, `PlayerResult`, `GameResults`, `PlayerScore` |
| `partykit.ts` | `ServerMessage` and `ClientMessage` discriminated unions |
| `navigation.ts` | `RootStackParamList`, `HostStackParamList`, `HostInGameTabParamList`, `PlayerStackParamList` |

Enums (`GamePhase`, `RoundPhase`, `QuestionType`, `PlayerStatus`, etc.) live in `src/constants/gameConstants.ts` — imported by both client and server.

---

## Key Design Decisions

**Host is not a player.** The host knows the correct answers (they built the questionnaire and set per-round answers). Playing and hosting simultaneously would compromise the blind testing premise.

**Correct answers are per-round, not per-question.** The same questionnaire is reused each round but each round tests a different item. Round N's `correctAnswers` is an `Answer[]` keyed by `questionId`, set by the host in the Rounds Builder before the game starts.

**Answer labels resolved server-side at scoring time.** `formatAnswerForDisplay` runs on the server when grading; `QuestionResult` stores `playerAnswerLabel` and `correctAnswerLabel` as plain strings. Clients never need to resolve option IDs — they just render the strings.

**`answeredPlayerIds` is server-authoritative.** Included in every `game_state` broadcast. The host sees accurate tracking even after a reconnect.

**Server is source of truth.** Clients never optimistically mutate game state. All state transitions go through the server and come back as a `game_state` broadcast.

**`sendRef` pattern.** Rather than lifting socket state into context or creating multiple connections, the socket `send` function is stored in a `MutableRefObject` inside `GameContext`. The owning screen (`HostLobbyScreen` / `JoinGameScreen`) sets it on mount; all other screens call it via `useHostControls` / `usePlayerActions`. This avoids re-renders and keeps the socket lifecycle tied to a single component.

**One device, one role.** A device is either a host or a player in a given session. Attempting both simultaneously would overwrite `sendRef` and `GameContext` state. The join flow guards against switching games (confirmation dialog + RESET); the host flow assumes the device starts fresh.
