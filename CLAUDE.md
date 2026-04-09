# Blind Taster — Project Standards

This file is the authoritative reference for all development decisions on this project. Read it before writing any code.

---

## Stack

- **Expo SDK 54** (managed workflow, new architecture enabled)
- **React Native 0.81** with **React 19**
- **TypeScript** (strict mode — no exceptions)
- **Cloudflare PartyKit** via `partysocket` for real-time multiplayer
- Navigation: `@react-navigation/native` + `@react-navigation/native-stack`

---

## Project Structure

```
src/
  components/       # Reusable UI components (Button, Card, etc.)
  screens/          # Full-screen views, grouped by flow
  hooks/            # Custom React hooks (usePart ySocket, useGame, etc.)
  context/          # React Context providers (GameContext, etc.)
  navigation/       # Navigator definitions and linking config
  constants/        # colors, spacing, typography, layout, gameConstants
  types/            # ALL TypeScript types and enums — one concern per file
  lib/              # Pure utility/helper functions (no React)
  party/            # PartyKit server code (Cloudflare Worker)
```

Entry point: `index.ts` → `App.tsx`

---

## TypeScript Rules

- **`strict: true`** is enforced in `tsconfig.json`. Never disable it.
- **Never use `any`**. Use `unknown` and narrow it, or define a proper type.
- **Never use plain `string` as a discriminator**. Use `enum` or a union of string literals.
- All types live in `src/types/`. One file per domain (e.g. `game.ts`, `player.ts`, `round.ts`, `partykit.ts`).
- Export types as named exports, not default exports.
- Use `type` for shape definitions, `enum` for discrete states/categories.
- Props interfaces are co-located with their component (not in `src/types/`).
- Never type a React component as `React.FC` — use plain function signatures with explicit return type `React.ReactElement | null`.

### Example

```ts
// src/types/game.ts
export enum GamePhase {
  Lobby = 'lobby',
  Round = 'round',
  Results = 'results',
}

export type Player = {
  id: string;
  name: string;
  isHost: boolean;
  score: number;
};

export type GameState = {
  roomCode: string;
  phase: GamePhase;
  players: Player[];
  currentRound: number;
  totalRounds: number;
};
```

---

## Colour Theme

**All colours are defined in `src/constants/colors.ts` and nowhere else.**
Never write a hex code, rgb(), or named colour anywhere else in the codebase.
Always import from `colors` — no exceptions.

```ts
// src/constants/colors.ts
export const Colors = {
  // Backgrounds
  background:       '#0F0A0B',
  surface:          '#1C1418',
  surfaceElevated:  '#2A1E23',

  // Brand
  primary:          '#C0392B',   // deep red — wine/tasting feel
  primaryLight:     '#E74C3C',
  primaryDark:      '#922B21',

  // Accents
  gold:             '#D4AC0D',   // awards, scores
  goldLight:        '#F1C40F',

  // Text
  textPrimary:      '#F5F0F1',
  textSecondary:    '#A89298',
  textDisabled:     '#5C4A50',

  // Semantic
  success:          '#27AE60',
  warning:          '#E67E22',
  error:            '#C0392B',

  // UI
  border:           '#2A1E23',
  overlay:          'rgba(0,0,0,0.6)',
  transparent:      'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
```

---

## Spacing & Typography

All spacing and font sizes come from `src/constants/spacing.ts` and `src/constants/typography.ts`.

```ts
// src/constants/spacing.ts
export const Spacing = {
  xs:   4,
  sm:   8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const;

// src/constants/typography.ts
export const FontSize = {
  xs:   11,
  sm:   13,
  md:   15,
  lg:   18,
  xl:   22,
  xxl:  28,
  hero: 40,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium:  '500' as const,
  bold:    '700' as const,
  black:   '900' as const,
};
```

---

## Component Rules

- One component per file.
- File name matches the component name (PascalCase).
- Keep components **presentational where possible** — data fetching and state live in hooks/context.
- StyleSheet.create() for all styles — never inline style objects.
- Always use `Colors`, `Spacing`, and `FontSize` constants in styles.
- Never hardcode numbers for margin, padding, or font sizes.
- Wrap touch targets in `Pressable` (not `TouchableOpacity`).
- Use `SafeAreaView` / `useSafeAreaInsets` at screen level.

---

## Hooks Rules

- Custom hooks live in `src/hooks/`, prefixed with `use`.
- A hook that connects to PartyKit lives in `src/hooks/usePartySocket.ts`.
- Never put business logic directly in a screen component — extract it to a hook.
- Use `useCallback` and `useMemo` where referential stability matters (passed as props, used in dependency arrays).

---

## PartyKit / Cloudflare Integration

- The PartyKit server lives in `src/party/server.ts`.
- Client connection logic is encapsulated in `src/hooks/usePartySocket.ts`.
- All messages sent over the socket are **typed**. Define a discriminated union:

```ts
// src/types/partykit.ts
export type ServerMessage =
  | { type: 'game_state'; payload: GameState }
  | { type: 'player_joined'; payload: Player }
  | { type: 'round_started'; payload: RoundState }
  | { type: 'results'; payload: RoundResult[] };

export type ClientMessage =
  | { type: 'join'; payload: { name: string } }
  | { type: 'submit_answer'; payload: { answerId: string } }
  | { type: 'start_game' };
```

- Never `JSON.parse` a raw socket message without validating its `type` field first.
- The server is the source of truth. Clients reflect server state — never optimistically mutate game state.

---

## Navigation

- All screen names are defined as an enum or a typed `RootStackParamList` in `src/types/navigation.ts`.
- Never pass navigation props through multiple component layers — use `useNavigation()`.
- Screen params are typed in `RootStackParamList`. Never use untyped `route.params`.

---

## Error Handling

- Network/socket errors must be caught and surfaced to the user via a visible UI state — never silently swallowed.
- Loading and error states are first-class states in every hook that does async work.

---

## Code Style

- No barrel `index.ts` re-exports unless the directory is a published package boundary.
- No default exports except for screen components (required by React Navigation).
- Keep files under 200 lines. Split if larger.
- No commented-out code committed to the repo.
- No `console.log` in production paths — use a `__DEV__` guard if needed for debugging.
