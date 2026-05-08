# Navigation Refactor Plan

## The Problem

The Host and Player game flows use stack navigators, which accumulate screen history. This causes:

- `HostLobbyScreen` can mount multiple times if the stack isn't fully destroyed between games
- `beforeRemove` listeners, `SET_ACTIVE_GAME_ID` effects, and `connect()` calls all fire on every mount
- We're using `CommonActions.reset` as a workaround to destroy the stack — this is not best practice
- Navigation between `HostLobby → HostInGame → HostResults` is not a browsing history, it's a state machine

## The Proper Solution

Replace the multi-screen game flow with a **single screen per role** that renders different views based on `gameState.phase`.

### Host

Replace `HostLobby`, `HostInGame`, `HostResults` with a single `HostGameScreen`:

```
GamePhase.Lobby         → render HostLobbyView (room code, QR, player list, start button)
GamePhase.InRound       → render HostRoundView (player answered status, reveal/next buttons)
GamePhase.AllAnswered   → render HostRoundView (reveal answers button enabled)
GamePhase.AnswersRevealed → render HostRoundView (next round / end game button enabled)
GamePhase.GameOver      → render HostResultsView (leaderboard, done button)
```

### Player

Replace `JoinGame`, `PlayerLobby`, `PlayerRound`, `PlayerResults` with a single `PlayerGameScreen`:

```
localPlayerId === null  → render JoinView (room code input, name input, join button)
GamePhase.Lobby         → render PlayerLobbyView (waiting for host, room code display)
GamePhase.InRound       → render PlayerRoundView (questions, submit button)
GamePhase.AllAnswered   → render PlayerRoundView (submitted, waiting)
GamePhase.AnswersRevealed → render PlayerRoundView (results display)
GamePhase.GameOver      → render PlayerResultsView (leaderboard, done button)
```

### Navigation Structure

```
Root Stack:
  Home         → HomeScreen
  Host         → HostGameScreen   (single screen, no sub-navigator)
  Player       → PlayerGameScreen (single screen, no sub-navigator)
```

`navigate('Host')` and `navigate('Player')` always mount a fresh single screen. No stack. No history. No reset needed.

## Benefits

- No stack accumulation between games
- No `CommonActions.reset` hacks
- No `beforeRemove` listeners
- No `detachPreviousScreen`
- `connect()`/`disconnect()` called once from the single game screen
- Screen mounts once, unmounts once — clean lifecycle
- Phase changes drive UI, not navigation

## What to Keep

- `useHostControls`, `usePlayerActions`, `useGameState`, `useHostGame`, `useRoundNavigation` hooks — all still valid
- `GameContext` with `connect`/`disconnect`/`send`/`leaveGame` — unchanged
- All the individual view components (PlayerRow, Banner, etc.) — just moved into the new screen files
- The setup flow before a game: `SetupGame → Questionnaires → Games → RoundsBuilder` — these stay as a stack inside HostNavigator, they're genuine browsable history

## What Changes

- Remove `HostLobbyScreen`, `HostRoundScreen`, `HostResultsScreen` as separate navigator screens
- Remove `PlayerLobbyScreen`, `PlayerRoundScreen`, `PlayerResultsScreen` as separate navigator screens  
- Remove `JoinGameScreen` as a navigator screen
- Create `HostGameScreen` and `PlayerGameScreen` as the single entry points
- `HostNavigator` still exists for the setup flow, with `HostGameScreen` as the terminal screen after `RoundsBuilder`
- `PlayerNavigator` becomes just `PlayerGameScreen` (no sub-stack needed)
- `useHostSetup` hook moves its `connect()` call into `HostGameScreen` on mount
- Abandon confirm dialog stays in `HostGameScreen` (was in `HostLobbyScreen`)

## Files to Create

- `src/screens/host/HostGameScreen.tsx`
- `src/screens/player/PlayerGameScreen.tsx`

## Files to Delete

- `src/screens/host/HostLobbyScreen.tsx`
- `src/screens/host/HostRoundScreen.tsx`
- `src/screens/host/HostResultsScreen.tsx`
- `src/screens/player/JoinGameScreen.tsx`
- `src/screens/player/PlayerLobbyScreen.tsx`
- `src/screens/player/PlayerRoundScreen.tsx`
- `src/screens/player/PlayerResultsScreen.tsx`

## Rejoin After App Kill

### Host
- `savedHostSession` in AsyncStorage stores `{ roomCode, hostToken, questionnaireId, rounds }`
- Already implemented — `HomeScreen` loads it on mount, shows "Rejoin Game"
- After refactor: "Rejoin Game" navigates to `HostGameScreen` with saved params
- `HostGameScreen` calls `connect()` with saved credentials — server recognises `hostToken`, returns current `game_state`
- `HostGameScreen` renders the correct view from `game_state.phase` — no need to decide which screen to navigate to ✅

### Player (currently not persisted — add this)
- Save player session to AsyncStorage on `player_admitted`: `{ roomCode, playerId, name }`
- New file: `src/lib/playerSession.ts` — same pattern as `hostSession.ts`
- `savePlayerSession(session)`, `loadPlayerSession()`, `clearPlayerSession()`
- Clear on: `leaveGame()`, `you_were_kicked`, `game_abandoned`, `game_ended`
- `HomeScreen` loads `savedPlayerSession` on mount alongside `savedHostSession`
- `isActivePlayer` check: `state.localPlayerId !== null && activePhase` OR `savedPlayerSession !== null`
- "Rejoin Game" navigates to `PlayerGameScreen` with saved `roomCode` and `playerId`
- `PlayerGameScreen` on mount: if saved session exists and `localPlayerId` is null, call `connect()` then send `restore_player` in `onOpen`
- Server re-associates the connection with the existing player — player rejoins mid-game with their existing score ✅

### Key invariant
- Both sessions cleared in `leaveGame()` in `GameContext` — one place, always happens
- `clearPlayerSession()` added to `leaveGame()` alongside `clearHostSession()` (or keep `clearHostSession` host-only and call both from `leaveGame`)
- On app kill mid-game: sessions persist. On reopen: `HomeScreen` detects saved session, shows "Rejoin Game"

## Known Risks & Mitigations

### 1. stale server state after app kill
**Risk:** Host kills app mid-game. Server waits 5 mins then ends game. New game starts before alarm fires. Durable Object may have stale player list or phase.
**Mitigation:** Server's `handleEndGame` idempotency guard (`if phase === GameOver return`) prevents double-processing. Room code is random 8 chars — collision is ~0. No action needed but worth monitoring.
**Test:** Kill host app mid-game. Wait. Reopen. Start new game with same devices.

### 2. connect() firing twice (React strict mode / hot reload)
**Risk:** React double-invokes effects in dev. `connect()` fires twice, creating two sockets.
**Mitigation:** `connect()` in `GameContext` closes any existing socket before opening a new one (`if (socketRef.current) { close; null }`). Second call is safe.
**Test:** In dev, hot reload during an active game. Check logs for double connect.

### 3. leaveGame() timing vs connect() in new screen
**Risk:** `leaveGame()` closes socket synchronously. New screen mounts and `useHostSetup` calls `signRoomCode` (async ~50ms). During that gap, if something triggers `send()`, message is queued. When `connect()` fires, queue flushes to new socket correctly.
**Mitigation:** Already handled — `connect()` clears queue before creating socket. Queue from before `connect()` is discarded. No action needed.
**Test:** Tap "Host a Game" rapidly multiple times. Check only one socket opens.

### 4. sync_state heartbeat firing during role switch
**Risk:** Player's 10-second interval fires `sync_state` after `disconnect()` has been called. `send()` queues it. New host `connect()` fires — queue is cleared. Message lost.
**Mitigation:** `connect()` clears `queueRef` — queued `sync_state` is discarded. Socket is null so `send()` queues but `connect()` clears it. Safe.
**Test:** Switch roles exactly as the 10-second timer fires. Check no stale messages reach server.

### 5. onMsgRef not cleared on disconnect
**Risk:** Late message arrives after `disconnect()` but before socket fully closes. `onMsgRef.current` still points to old handler. Stale state dispatched to `GameContext`.
**Mitigation:** Clear `onMsgRef` in `disconnect()`.
**Fix:** Add `onMsgRef.current = null` to `disconnect()` in `GameContext`.

### 6. game_paused sent after game_ended
**Risk:** Host sends `end_game`, calls `disconnect()`. Server processes `end_game` → sets `phase = GameOver`. Then `onClose` fires for host connection — but `phase !== GameOver` check now prevents `game_paused`. **Already fixed.**
**Test:** End game early. Verify player sees results, not "game paused".

### 7. rapid role switching
**Risk:** User taps "Host a Game" then immediately "Join a Game" before first connection opens. Two `connect()` calls. Second overwrites first correctly due to `GameContext` guard. But `leaveGame()` fires twice — second time `isHost` might be true if game state hasn't cleared yet.
**Mitigation:** `leaveGame()` now checks `phase !== GameOver`. `RESET` fires on first call clearing state. Second `leaveGame()` sees null `gameState`, `isHost = false`, skips `end_game`. Safe.
**Test:** Tap Home buttons rapidly in quick succession.

### 8. three or more devices
**Risk:** Untested. Multiple players, one host. Player A gets kicked while Player B is answering. `checkAllAnswered` fires correctly but `AllAnswered` state needs to reflect only remaining players.
**Mitigation:** `checkAllAnswered` already filters by `connectionId !== null`. Kicked players are deleted from `this.s.players` before check. Safe.
**Test:** 3-player game. Kick one mid-round. Verify remaining players can complete round.

### 9. network drop mid-game (not app kill)
**Risk:** PartySocket auto-reconnects. On reconnect, `onOpen` fires. For player, `restore_player` is sent. For host, server sends `game_state` back. Should work — but if reconnect happens during phase transition (e.g. exactly as `advance_round` is broadcast), player may miss `round_started` and stay on old round.
**Mitigation:** `sync_state` heartbeat every 10s catches this. `resync_players` button on host catches it manually.
**Test:** Force airplane mode on player mid-game for 15 seconds. Reconnect. Verify state is correct.

### 10. host navigates back during game (beforeRemove)
**Risk:** After refactor, `HostGameScreen` is a single screen. Back gesture from `HostGameScreen` goes to `Home`. `beforeRemove` listener must intercept this and show abandon dialog when game is active.
**Mitigation:** Keep `beforeRemove` listener in `HostGameScreen`, same logic as current `HostLobbyScreen` — if `gameState !== null && phase !== GameOver`, intercept and show confirm.
**Test:** During active game, swipe back or tap back. Confirm abandon dialog appears. Confirm cancelling returns to game. Confirm confirming ends game and goes home.

---

## Testing Checklist (run after refactor)

- [ ] Game 1: Android host, iPhone player — complete full game normally
- [ ] Game 2 immediately after: swap roles — iPhone host, Android player — start game works
- [ ] Game 3: swap back — Android host, iPhone player
- [ ] End game early from host dropdown — player sees results not "game paused"
- [ ] Host abandons lobby — player sees "game abandoned"
- [ ] Player leaves lobby — host sees player count drop
- [ ] Player kicked mid-game — remaining players can complete round
- [ ] Host kills app mid-game — players see "game paused" then after 5 min "game ended"
- [ ] Host rejoins after kill — game resumes from correct state
- [ ] Player kills app mid-game — host sees player as "away" — player can rejoin
- [ ] Network drop on player for 15s — player reconnects, game state correct
- [ ] Network drop on host for 15s — players see "game paused" — host reconnects, game resumes
- [ ] Rapid role switching (tap host/join multiple times fast)
- [ ] 3-player game — kick one mid-round — reveal answers works for remaining players
- [ ] Deep link join (QR code scan) — player joins correctly
- [ ] Back gesture on host during active game — abandon dialog appears

## Navigation Type Changes

- `HostStackParamList`: remove `HostLobby`, `HostInGame`, `HostResults` — add `HostGame` with same params as current `HostLobby`
- `PlayerStackParamList`: remove all screens — add `PlayerGame` with no params
- `RootStackParamList`: unchanged (`Home`, `Host`, `Player`)
