# Architecture Fixes

Issues identified from the post-refactor audit, in priority order. Each item explains the problem, the correct fix, and what not to do.

---

## 1. GameContext exposes `dispatch` — breaks encapsulation

**Problem:** `dispatch` is part of `GameContextValue` and is called directly by `useHostControls`, `useGameState`, and `PlayerGameScreen`. This means consumers depend on internal action type strings. If the reducer changes, every consumer breaks. There is no single place to add cross-cutting concerns (logging, validation) to state transitions.

**Fix:** Remove `dispatch` from `GameContextValue`. Replace every external `dispatch` call with a semantic method on the context:

- `useGameState` → its `handleMessage` calls dispatch internally; this is fine since `useGameState` is the designated message handler. But it should not be exported as a hook — it should be called once inside `GameProvider` and wired to the socket, not passed around as a callback.
- `useHostControls` → `admitPlayer`/`denyPlayer` call `dispatch({ type: 'REMOVE_JOIN_REQUEST' })` before sending. This is an optimistic update that the server will confirm via `game_state`. Move it: let the server's `game_state` broadcast clear the pending request, remove the optimistic dispatch. Simpler and always correct.
- `advanceRound`/`endGame` in `useHostControls` → call `dispatch({ type: 'CLEAR_ROUND_RESULTS' })` before sending. Same problem — server sends `round_started` which already triggers `CLEAR_ROUND_RESULTS` in `useGameState`. Remove the optimistic dispatch. The server is the source of truth.
- `PlayerGameScreen` line 158 → dispatches `RESET` on denial. Add a `resetGame()` method to context instead.

**Do not** add more action types to paper over this — the fix is fewer dispatch call sites, not more.

---

## 2. Message handling is split between `useGameState` and `PlayerGameScreen`

**Problem:** `PlayerGameScreen.buildOnMessage()` intercepts `name_taken`, `you_were_denied`, and `player_admitted` before passing to `handleMessage`. This means:
- Message handling logic is in two places
- `player_admitted` triggers `SET_LOCAL_PLAYER_ID` in `useGameState` AND `savePlayerSession` in the screen — two side effects on one message with no coordination
- If you add a new message type that needs screen-local handling, you have to remember the pattern exists

**Fix:** `useGameState.handleMessage` should handle all message types. For `name_taken` and `you_were_denied`, add reducer actions (`SET_NAME_TAKEN`, `SET_DENIED`) so the screen can react to state rather than intercepting messages. For `player_admitted`, `savePlayerSession` should be called inside `handleMessage` itself — it is always the right behaviour when a player is admitted, not just in this one screen.

This means `connect()` takes a single `onMessage` that is always `handleMessage`, and the screen never builds its own message handler.

---

## 3. `isPaused`, `isKicked`, `isAbandoned` shadow server state

**Problem:** These three booleans are client-side flags set by individual socket messages. They can get out of sync with `gameState`. The `game_paused` fix (ignoring pause when `gameResults !== null`) was a symptom of this — we patched the symptom rather than the cause.

**Fix:** Derive these from `gameState` where possible:
- `isPaused` → add a `paused: boolean` field to `GameState` on the server and include it in every `game_state` broadcast. The client reads `gameState.paused`. No separate flag needed.
- `isAbandoned` → `game_abandoned` arrives as a message; the server could instead broadcast a final `game_state` with `phase: GamePhase.Abandoned` and close the room. The client renders the abandoned view based on phase, not a separate flag.
- `isKicked` → legitimately client-only (kicked players don't receive further state). Keep this one.

This eliminates the category of bugs where a late-arriving message sets a flag that conflicts with the current phase.

---

## 4. Session persistence is a workaround for missing reconnection design

**Problem:** `hostSession.ts` and `playerSession.ts` exist solely because the app kills state on close. They store room code, player ID, and credentials in AsyncStorage, then attempt to reconnect on mount. This is fragile:
- Sessions can persist after a game ends (we handle this, but it requires careful clearing)
- The rejoin path is different code from the initial join path, so bugs can exist in one but not the other
- Host session stores `rounds` (potentially large) in AsyncStorage unnecessarily

**Fix:** Use a stable `clientId` per device (generated once, persisted to AsyncStorage permanently, never cleared). Pass it as a query param on every socket connection. The server can use it to identify returning connections and restore state. This turns reconnection into a first-class feature of the socket layer rather than a recovery mechanism bolted on top.

Until that is implemented: at minimum, validate the persisted session against the current server state on reconnect (send `restore_player`/restore host, and if the server rejects it, clear the session and show the join screen). The current code already does this for players via `restore_player` — verify the host path does the same.

---

## 5. `useHostSetup` has no error handling

**Problem:** `signRoomCode()` is called inside a `useEffect` with no `.catch()`. If signing fails (network issue, worker error), the promise rejects silently. The screen renders with a room code displayed, but no socket is connected. Players who scan the QR code or enter the room code will get no response.

**Fix:**
```ts
signRoomCode(roomCode)
  .then((sig) => {
    if (cancelled) return;
    void saveHostSession({ questionnaireId, rounds, roomCode, hostToken });
    connect({ roomCode, isHost: true, hostToken, sig, onMessage: handleMessage });
  })
  .catch(() => {
    if (!cancelled) setError('Failed to create room. Check your connection and try again.');
  });
```

The hook needs to return an `error` state, and `HostGameScreen` needs to render it in the lobby view.

---

## 6. `useAnswers` exposes both `answers` (Map) and `answersArray` (Array)

**Problem:** Two representations of the same data returned from one hook. Consumers have to know which to use where. `answersArray` is only ever used in one place (`handleSubmit`), so it doesn't need to be in the hook's public API.

**Fix:** Remove `answersArray` from the return value. In `PlayerGameScreen.handleSubmit`, call `Array.from(answers.values())` inline. The hook returns `{ answers, setAnswer, clearAnswers, isComplete }` only.

---

## What not to fix

- **`GameContextState` is too large** — splitting into multiple contexts would require prop drilling or nested providers. The current structure is workable at this scale; splitting is complexity for its own sake.
- **`useHostGame` doesn't memoize** — player counts are small (< 20). Not a real problem.
- **TypeScript branded types for answers** — over-engineering for this domain. The current union type is clear enough.
