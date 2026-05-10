# PartyKit / Durable Objects Recommendations — Remaining Work

Date: 2026-05-10 (originally written), pruned 2026-05-10 after implementation.

## What's Left

### 1. Connection tags for `findHost` and broadcast routing

**Status:** Not done. Current code still iterates `getConnections()` to find the host and to broadcast to players.

**Problem:** `findHost()` is `O(n)` per call; called from many handlers. Fine for ~20 players, wrong shape if we ever scale up under hibernation's 32k-connection ceiling.

**Fix sketch:**

```ts
getConnectionTags(conn: Party.Connection, ctx: Party.ConnectionContext): string[] {
  const url = new URL(ctx.request.url);
  return url.searchParams.get('isHost') === '1' ? ['host-claim'] : ['player-claim'];
}

private findHost(): Party.Connection | undefined {
  for (const c of this.getConnections<ConnState>('host-claim')) {
    if ((c.state as ConnState | null)?.role === 'host') return c;
  }
  return undefined;
}
```

**Caveat:** `partyserver` doesn't support changing tags after acceptance. Tags reflect *initial intent* (host vs player), not current admission state. Filtering by tag still narrows the set, then a `state.role === 'player'` check inside the loop completes it.

**Why I skipped it:** Not load-bearing at our scale. Worth doing as a polish pass; not worth blocking on.

### 2. Stop exposing `dispatch` from `GameContext`

**Status:** Not done. `GameContext` still exports `dispatch` and consumers (`useGameState`, `PlayerGameScreen`) call it directly with raw action types.

**Problem:** Encapsulation hole. Renaming an action type breaks consumers everywhere. There's no single place to add cross-cutting concerns to state transitions.

**Fix:** Replace each external `dispatch` call with a semantic method on the context. `useGameState` should be invoked once inside `GameProvider` and wired to the socket internally — not exported as a hook for screens to call.

**Why I skipped it:** Out of scope for the PartyKit/DO architecture work. This is a client-side encapsulation cleanup. Already documented in `ARCHITECTURE_FIXES.md` item #1; defer to that file.

### 3. `hostSession.ts` is still around (not fully deleted)

**Status:** Slimmed but not removed. Currently keeps `{ questionnaireId, rounds, roomCode }` purely as a rejoin UX hint — no credentials, no token.

**Why it stayed:** The host's `RoundsBuilderScreen` flow currently passes `rounds` via navigation params. If the app is killed and reopened, those params are gone — but the server has the rounds (in `s.rounds`). The server now sends them back to the host via the `host_state` message on reconnect.

**To fully delete `hostSession.ts`:**

- On app boot, `HomeScreen` would need a different way to know "this device was the host of room X." Options:
  - Store just `{ roomCode }` in AsyncStorage as a hint (essentially what we have today, minus the rounds).
  - Drop the rejoin-after-kill UX entirely; require the host to scan the QR or re-enter the room code.

Neither is much smaller than what's there now. Leaving it.

---

## Pitfalls That Will Bite Us Later

In rough order of how soon they'll matter. None of these are bugs in current code — they're reference material for future work.

### 1. `wrangler deploy` disconnects every WebSocket — test it

`partysocket` auto-reconnects, and now that state is persisted, the auto-reconnected client lands in a hydrated DO. Test deploying mid-game; confirm players see a brief "reconnecting" state and resume cleanly.

### 2. `wrangler dev` does not simulate eviction

Local-dev DOs never evict, so eviction-related bugs won't reproduce locally. Plan for this in test scripts: kill and restart the `wrangler dev` process to simulate eviction. If you suspect a hibernation-related bug, deploy to a preview environment.

### 3. Constructor runs on every wake (with hibernation)

Anything in `BlindTasterServer`'s field initializers runs every time the DO wakes. Currently fine — the `s` field is just a small default. But if anyone ever adds an `import` with side effects or a heavy library init, it'll cost real money. Keep the class body lean.

### 4. Storage writes are not atomic across `await` boundaries

Per the [Rules of Durable Objects](https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/): write coalescing only batches writes between `await`s. Pattern: do all `put`s in a single tick at the *end* of a handler, never around external `fetch` calls. Our `persist()` is a single `put`, called once per handler — currently safe.

### 5. `_pk` collisions across multiple installs of the app on one device

If a user reinstalls the app, AsyncStorage clears and a new clientId is generated — they'll appear as a different player. Acceptable. But Android backup restore or iOS iCloud backup can clone AsyncStorage between two physical devices, giving them the same `clientId`. The server currently lets either connect (last-wins on the socket). Mitigation if this becomes an issue: track a server-issued nonce alongside the clientId.

### 6. `getConnections()` iteration order is unstable

In hibernation mode, `getConnections()` iterates `ctx.getWebSockets()`. Order is not guaranteed. Don't rely on `getConnections()[0]`. Our `findHost()` uses early-return on first match, which is fine — but be careful if you ever need "the first host" for ordering reasons.

### 7. Rate limiting key is too broad

`server.ts` rate-limits by IP. A whole student dorm or carrier-NAT looks like one IP. If we ever launch widely, switch to `IP + roomCode` or `IP + clientId` to avoid one user knocking off others.

### 8. `partyserver` is "Work in Progress" per its own README

The library is healthy and Cloudflare-maintained, but it's pre-1.0. We're pinned at `^0.4.1` in `package.json`. Read changelogs before bumping; expect occasional API churn.

### 9. Don't proliferate alarms

Only one alarm per DO. We use it for the 5-minute host-disconnect timeout. If you ever want a per-round timer too, you can't simply `setAlarm` twice — the second call overrides. Pattern: keep a `Map<purpose, timestamp>` in storage, set the alarm to the soonest, and re-derive in `onAlarm` what fired.

### 10. SQLite migration is a one-way door

`wrangler.toml` declares `new_sqlite_classes = ["BlindTasterServer"]`. Don't try to "migrate back" to KV-backed; it's not supported. Stay on SQLite (this is the recommended backend per the Dec 2025 Cloudflare guidance anyway). Note: we use SQLite implicitly via `ctx.storage.put/get` — for relational queries on player history, switching to `ctx.storage.sql.exec` would be a future improvement.

### 11. `onError`/`onException` are unhandled

`partyserver` will log to console, but we don't override either. For production we should at least log to a remote sink.

### 12. `ROOM_SIGNING_KEY` rotation

Currently committed in `src/lib/config.ts` *and* loaded as a Worker secret. If we rotate the secret, every existing client breaks until they update. Eventually want both old and new keys to verify, then a migration window.

---

## Sources (kept for reference)

Cloudflare official docs:
- [Use WebSockets · Cloudflare Durable Objects docs](https://developers.cloudflare.com/durable-objects/best-practices/websockets/)
- [Lifecycle of a Durable Object](https://developers.cloudflare.com/durable-objects/concepts/durable-object-lifecycle/)
- [Rules of Durable Objects (Dec 2025)](https://developers.cloudflare.com/changelog/post/2025-12-15-rules-of-durable-objects/)

PartyKit / partyserver:
- [partyserver README](https://github.com/cloudflare/partykit/blob/main/packages/partyserver/README.md)
- [Scaling PartyKit servers with Hibernation](https://docs.partykit.io/guides/scaling-partykit-servers-with-hibernation/)

Reference implementations:
- [cloudflare/workers-chat-demo](https://github.com/cloudflare/workers-chat-demo) — canonical hibernation pattern
- [thomasgauvin.com — Debugging WebSocket Hibernation](https://thomasgauvin.com/writing/how-cloudflare-durable-objects-websocket-hibernation-works/)
