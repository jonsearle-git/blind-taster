# Blind Taster — Running & Testing

## Prerequisites

- **Node.js** 18 or later
- **npm** 10 or later
- **Expo Go** app on your test devices (iOS / Android), or a simulator
- A **Cloudflare account** (free tier is sufficient) for deploying the PartyKit server

Install dependencies:

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required due to a peer dependency version conflict with `react-test-renderer`.

---

## Local Development

You need two terminals running simultaneously: one for the Expo app, one for the PartyKit server.

### Terminal 1 — PartyKit server

```bash
npx partykit dev
```

This starts the PartyKit server at `http://localhost:1999`. The server hot-reloads on changes to `src/party/`.

### Terminal 2 — Expo app

```bash
npm start
```

Then press:
- `i` — open iOS Simulator
- `a` — open Android Emulator
- Scan the QR code with Expo Go on a physical device

`src/lib/config.ts` already points to `localhost:1999` in dev mode (`__DEV__ === true`), so the app connects to your local server automatically.

> **Physical devices on the same network:** Replace `localhost` in `config.ts` with your machine's local IP address (e.g. `192.168.1.x:1999`) so phones can reach the server.

---

## Testing a Full Game

You need at least **two devices or simulators** — one acting as host, one as player. More players is better but two is enough to test the full loop.

### Step 1 — Start the servers

Run both terminals as described above.

### Step 2 — Host setup

On the host device:

1. Tap **Host a Game**
2. Tap **Create New Questionnaire** (or pick an existing one)
3. Add at least one question of any type, save
4. On the Rounds Builder screen, set the number of rounds (e.g. 2) and optionally add round labels — these are hidden from players until answers are revealed
5. Tap **Continue to Lobby**
6. The lobby screen shows a QR code and a 6-character room code

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
3. Host sees each player tick off as they submit; the **Reveal Answers** button enables when all have answered (or the host can reveal early if a player is taking too long)
4. Host taps **Reveal Answers** — players see their results inline with correct answers and points
5. Host taps **Next Round** — repeats from step 2 for the next round
6. On the last round, the button says **End Game** instead

### Step 5 — Results

After End Game:
- Host sees the final results screen with the winner and an expandable per-player breakdown including round labels
- Players see their finishing position, total score, and per-round breakdown

### Testing the Kick flow

1. Admit a player to the lobby
2. During the game, open the host dropdown (three-dot menu in the banner) → Players tab → tap the kick icon next to a player
3. Confirm in the dialog — the player sees a "Removed from Game" overlay

### Testing host disconnect / reconnect

1. During a live game, kill the host app (force-quit on iOS/Android)
2. Players see the "Host has disconnected" pause overlay
3. Relaunch the host app and navigate back to the lobby — since the game is already in progress, the server sends the current state and players see the overlay disappear

### Testing deep links

On a physical device:

```
blindtaster://join/ABCDEF
```

Open this URL (e.g. from a notes app or browser) while the app is installed. It should open directly to the Join Game screen with the room code pre-filled.

---

## Running TypeScript Checks

```bash
npx tsc --noEmit
```

Should produce no output (zero errors). Run this after any type changes.

---

## Deploying the PartyKit Server

### One-time setup

```bash
npx partykit login
```

This authenticates with your Cloudflare account. Note your PartyKit username shown after login.

Update `src/lib/config.ts`:

```ts
const PROD_HOST = 'blind-taster.YOUR_USERNAME.partykit.dev';
```

Replace `YOUR_USERNAME` with your actual PartyKit username.

### Deploy

```bash
npx partykit deploy
```

The server is now live at `blind-taster.YOUR_USERNAME.partykit.dev`. Production builds of the app connect to this URL automatically.

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

> Before a production build, make sure the `PROD_HOST` in `config.ts` is set to your deployed PartyKit server URL.

---

## Environment Summary

| Scenario | Expo target | PartyKit target |
|---|---|---|
| Local dev on simulator | `npm start` | `npx partykit dev` (localhost:1999) |
| Local dev on physical device | `npm start` | `npx partykit dev` (use LAN IP) |
| Internal preview | EAS preview build | Deployed PartyKit server |
| Production | EAS production build | Deployed PartyKit server |
