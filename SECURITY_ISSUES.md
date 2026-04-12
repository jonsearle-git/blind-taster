# Blind Taster — Security Audit

Audit scope: all server code (`src/party/`), all hooks (`src/hooks/`), context, navigation, screens, types, and local storage.

---

## Remaining Issues

None.

---

## Fixed Issues

| ID | Severity | Issue | Fix |
|---|---|---|---|
| C1 | Critical | Host impersonation via `?isHost=1` | Host token generated with `crypto.getRandomValues()`, verified by server on every host connection |
| C2 | Critical | No authorization on host-only commands | `HOST_ONLY` / `PLAYER_ONLY` role check in `onMessage` before dispatch |
| C3 | Critical | `submit_answers` trusts client-supplied `playerId` | `playerId` derived from `sender.state` (verified connection state); re-submission blocked |
| C4 | Critical | `reveal_answers` can be called multiple times — score inflation | Phase guard: returns early if `roundPhase === AnswersRevealed` |
| — | High | Unadmitted connections received all `room.broadcast()` data including `game_ended` with correct answers | All game-data broadcasts migrated to `broadcastToAdmitted()`; dead `broadcast()` method deleted |
| — | High | `correctAnswer` data in `state.lastRoundResults` persisted between rounds on player device | `useGameState` dispatches `CLEAR_ROUND_RESULTS` on `round_started` |
| H1 | High | Round labels visible in `game_state` before reveal | `buildGameState` strips all labels; rounds sent as `RoundForPlayer` (null label, no `correctAnswers`) |
| H2 | High | No JSON validation — server crash on malformed message | `onMessage` wrapped in `try/catch`; non-string `type` discarded |
| H3 | High | No payload size limits — DoS / memory exhaustion | `handleStartGame` enforces: ≤20 questions, ≤20 rounds, prompts ≤500 chars, options ≤10 |
| H4 | High | `advance_round` / `end_game` not phase-guarded | Phase guards added to both handlers |
| M1 | Medium | Player name not validated server-side | `handleRequestJoin` trims and enforces 1–24 char limit |
| M2 | Medium | Room code enumerable (6 chars) | Increased to 8 chars (~1 trillion combinations) |
| M3 | Medium | Second device can take over as host | Fixed by C1 |
| M4 | Medium | Game pauses indefinitely on host disconnect | Durable Object alarm set on host disconnect; `onAlarm` calls `handleEndGame` after 5 min |
| M5 | Medium | Deep link room code not sanitised | `JoinGameScreen` validates against `/^[A-Z0-9]{4,8}$/i` before use |
| M6 | Medium | Socket messages silently dropped during reconnect | `usePartySocket` queues messages when socket is not OPEN; flushes on next `open` event |
| L1 | Low | `WebSocket.OPEN` global assumption | Replaced with numeric constant `1` |
| L2 | Low | `request_join` had no role guard — admitted players could re-request | Added to `PENDING_ONLY` set; admitted players are rejected |
| — | Design | Correct answers were global (same every round) — players knew all answers after round 1 reveal | Correct answers moved to `Round.correctAnswers`; graded per-round against that round's answer key |
| — | Design | `QuestionResult` displayed raw UUIDs instead of human-readable labels | `formatAnswerForDisplay()` runs server-side at scoring time; `playerAnswerLabel` / `correctAnswerLabel` strings stored in `QuestionResult` |
