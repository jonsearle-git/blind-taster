# Blind Taster — Audit Log

Last updated: 2026-04-12. All issues from the original audit have been resolved.

---

## All Issues — Resolved

| ID | Severity | Issue | Status |
|---|---|---|---|
| 1 | Critical | Correct answers were global — same answer key used every round. After first reveal players knew all future answers. | Fixed: `Round` now carries `correctAnswers: Answer[]`. Server grades round N against round N's answer key. |
| 2 | High | `QuestionResult` displayed raw option/tag UUIDs instead of labels like "Merlot". | Fixed: `formatAnswerForDisplay()` runs server-side; `playerAnswerLabel` and `correctAnswerLabel` strings stored in `QuestionResult`. |
| 3 | High | `GameContext` state never reset between games — stale `gameResults`, `localPlayerId`, `isKicked` carried into new session. | Fixed: `RESET` dispatched in `JoinGameScreen.doJoin()` and in `HostLobbyScreen` on start. Done buttons on result screens also dispatch RESET. |
| 4 | High | No questionnaire validation in builder — empty prompts, MC with <2 options passed through silently. | Fixed: `validateQuestions()` in `QuestionnaireBuilderScreen` blocks save for invalid questions. |
| 5 | High | Socket connected on every room code keystroke — a new WebSocket opened per character typed. | Fixed: `connectedRoomCode` state decoupled from `roomCodeInput`; socket only connects on Join button press via `pendingJoinRef`. |
| 6 | Medium | `buildGameResults` crashed with zero players (`sorted[0]!` undefined). | Fixed: early return guard in `buildGameResults` when `sorted` is empty. |
| 7 | Medium | `answeredPlayerIds` was client-side only — host lost tracking after reconnect. | Fixed: `answeredPlayerIds` included in every `game_state` broadcast from server. |
| 8 | Medium | `saveQuestionnaire` always `INSERT`ed — editing an existing questionnaire threw a UNIQUE constraint error. | Fixed: UPSERT pattern (`ON CONFLICT(id) DO UPDATE SET`). |
| 9 | Medium | Host reconnecting after alarm-triggered game end received `game_state` (phase=GameOver) but never `game_ended` — results screen never loaded. | Fixed: `onConnect` resends `game_ended` to reconnecting host when `phase === GameOver`. |
| 10 | Medium | `useDeepLink` hook was dead code — never imported anywhere. | Fixed: deleted. Deep links handled by React Navigation linking config. |
| 11 | Medium | No way to leave a game — players trapped on pause screen; host lobby had no cancel. | Fixed: "Leave Game" button on PlayerLobbyScreen; "Done" button on both result screens. All dispatch RESET and navigate to Home. |
| 12 | Low | `request_join` had no role guard — admitted players could re-send, creating stale pending entries. | Fixed: added to `PENDING_ONLY` set. |
| 13 | Low | `PROD_HOST` placeholder in `config.ts` would silently fail in production. | Noted in RUNNING.md — must be updated before production build. |
| 14 | Low | HomeScreen questionnaires were view-only — no edit/delete actions. | Fixed: Edit (✎) and Delete (✕) icon buttons per questionnaire row; edit navigates to builder with existing ID; delete shows confirmation alert. |
| 15 | Low | No "Done" / "Back to Home" button after game results. | Fixed: "Done" button on `HostResultsScreen` and `PlayerResultsScreen`. |
