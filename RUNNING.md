# Blind Taster — Running & Testing

## Prerequisites

- **Node.js** 18 or later
- **npm** 10 or later
- **Expo Go** app on your test devices (iOS / Android), or a simulator
- A **Cloudflare account** (free tier is sufficient) for deploying the PartyKit server

Install dependencies:

```bash
npm install
```

---

## Local Development

You need two terminals running simultaneously: one for the Expo app, one for the PartyKit server.

### Terminal 1 — Wrangler (local server)

```bash
npx wrangler dev
```

This starts the server at `http://localhost:8787`. The server hot-reloads on changes to `src/party/`.

### Terminal 2 — Expo app

```bash
npm start
```

If you see stale module errors or just ran `npm install`, clear the Metro cache first:

```bash
npx expo start --clear
```

Then press:
- `i` — open iOS Simulator
- `a` — open Android Emulator
- Scan the QR code with Expo Go on a physical device

`src/lib/config.ts` already points to `localhost:8787` in dev mode (`__DEV__ === true`), so the app connects to your local server automatically.

> **Physical devices on the same network:** Replace `localhost` in `config.ts` with your machine's local IP address (e.g. `192.168.1.x:8787`) so phones can reach the server.

---

## Testing a Full Game

You need at least **two devices or simulators** — one acting as host, one as player.

### Step 1 — Start the servers

Run both terminals as described above.

### Step 2 — Host setup

On the host device:

1. Tap **Host a Game**
2. Tap **Create New Questionnaire** (or pick an existing one)
3. Add at least one question of any type — questions are pure templates (no correct answers here), save
4. On the **Rounds Builder** screen:
   - Set the number of rounds (e.g. 2)
   - Optionally add a label per round (e.g. "Château Margaux 2015") — these are hidden from players until reveal
   - Tap the badge next to each round to expand it and **enter the correct answer for every question**. The badge shows `X/Y` answered; turns green with ✓ when complete.
5. Tap **Continue to Lobby**
6. The lobby screen shows a QR code and an 8-character room code

### Step 3 — Player join

On the player device:

1. Tap **Join a Game**
2. Enter the room code shown on the host screen, enter a name, tap **Join Game**
3. The host sees the player in the "Waiting to Join" list — tap **Admit**
4. The player moves to the waiting room

Repeat for additional players.

### Step 4 — Play a round

1. Host taps **Start Game** — all players are sent to the round screen
2. Players answer all questions and tap **Submit Answers**
3. Host sees each player tick off as they submit; the **Reveal Answers** button enables when all have answered
4. Host taps **Reveal Answers** — players see their results inline with correct answers (labels, not IDs) and points
5. Host taps **Next Round** — repeats from step 2 for the next round
6. On the last round, the button says **End Game** instead

### Step 5 — Results

After End Game:
- Host sees the final results screen with the winner and an expandable per-player breakdown including round labels
- Players see their finishing position, total score, and per-round breakdown
- Both host and players have a **Done** button that resets state and returns to Home

### Testing the Kick flow

1. Admit a player to the lobby
2. During the game, open the host dropdown (three-dot menu in the banner) → Players tab → tap the kick icon next to a player
3. Confirm in the dialog — the player sees a "Removed from Game" overlay

### Testing host disconnect / reconnect

1. During a live game, kill the host app (force-quit on iOS/Android)
2. Players see the "Host has disconnected" pause overlay
3. Relaunch the host app and navigate back to the lobby — the server sends the current state and players see the overlay disappear
4. If the host is disconnected for 5 minutes, the game ends automatically

### Testing deep links

On a physical device:

```
blindtaster://join/ABCDEF12
```

Open this URL (e.g. from a notes app or browser) while the app is installed. It should open directly to the Join Game screen with the room code pre-filled.

### Testing the "already in a game" flow

1. Join a game as a player and get admitted
2. While still in the lobby, tap the device back button to go to Home
3. Tap **Join a Game** again and try to join a different room
4. You should see an "Already in a Game" confirmation dialog

---

## Running Unit Tests

```bash
npx jest "party/__tests__"
```

Runs scoring and helpers tests using `ts-jest` (no Expo runtime required). Should produce all passing output.

---

## Running TypeScript Checks

```bash
npx tsc --noEmit
npx tsc --noEmit --project tsconfig.server.json
```

Both should produce no output (zero errors). The first checks the app; the second checks the server (uses cloudflare types, separate from the app config). Run both after any type changes.

---

## Deploying the Server

### One-time setup

```bash
npx wrangler login
```

This authenticates with your Cloudflare account. Note your workers subdomain shown at `dash.cloudflare.com`.

Update `src/lib/config.ts`:

```ts
const PROD_HOST = 'blind-taster.YOUR_SUBDOMAIN.workers.dev';
```

Replace `YOUR_SUBDOMAIN` with your actual Cloudflare workers subdomain.

### Deploy

```bash
npx wrangler deploy
```

The server is now live at `blind-taster.YOUR_SUBDOMAIN.workers.dev`. Production builds of the app connect to this URL automatically.

---

## Building for Distribution

Requires an [Expo EAS](https://expo.dev/eas) account.

### Development build (internal testing, full native features)

```bash
npx eas build --profile development --platform ios
npx eas build --profile development --platform android
```

### Preview build (internal distribution, production server)

```bash
npx eas build --profile preview --platform all
```

### Production build (App Store / Play Store)

```bash
npx eas build --profile production --platform all
```

> Before a production build, make sure the `PROD_HOST` in `config.ts` is set to your deployed server URL.

---

## Environment Summary

| Scenario | Expo target | Server target |
|---|---|---|
| Local dev on simulator | `npm start` | `npx wrangler dev` (localhost:8787) |
| Local dev on physical device | `npm start` | `npx wrangler dev` (use LAN IP) |
| Internal preview | EAS preview build | Deployed Cloudflare Worker |
| Production | EAS production build | Deployed Cloudflare Worker |
