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
    questions/      # Question input, display, and result components
    builder/        # Questionnaire builder sub-components
  screens/          # Full-screen views, grouped by flow (host/, player/)
  hooks/            # Custom React hooks (usePartySocket, useGameState, etc.)
  context/          # React Context providers (GameContext, QuestionnairesContext)
  navigation/       # Navigator definitions and linking config
  constants/        # colors, spacing, typography, gameConstants (enums)
  types/            # ALL TypeScript types — one file per domain
  lib/              # Pure utility/helper functions (no React)
  party/            # PartyKit server code (Cloudflare Worker)
    __tests__/      # Server unit tests (ts-jest)
```

Entry point: `index.ts` → registers `App.tsx` (imports `react-native-get-random-values` first).

---

## TypeScript Rules

- **`strict: true`** is enforced in `tsconfig.json`. Never disable it.
- **Never use `any`**. Use `unknown` and narrow it, or define a proper type.
- **Never use plain `string` as a discriminator**. Use `enum` or a union of string literals.
- All types live in `src/types/`. One file per domain (e.g. `game.ts`, `player.ts`, `partykit.ts`).
- Export types as named exports, not default exports.
- Use `type` for shape definitions, `enum` for discrete states/categories.
- Props interfaces are co-located with their component (not in `src/types/`).
- Never type a React component as `React.FC` — use plain function signatures with explicit return type `React.ReactElement | null`.

### Key type invariants

```ts
// Questions are pure templates — NO correct answer fields anywhere on Question types.
// Correct answers live on Round, not on the questionnaire.
export type Round = {
  number: number;
  label:          string | null;   // hidden from players until reveal
  correctAnswers: Answer[];        // one per question; server-side only
};

// Sent to clients — correct answers and label stripped:
export type RoundForPlayer = {
  number: number;
  label:  null;
};

// QuestionResult carries pre-resolved label strings (not raw IDs):
export type QuestionResult = {
  questionId:         string;
  prompt:             string;
  playerAnswer:       Answer;
  correctAnswer:      Answer;
  playerAnswerLabel:  string;   // resolved server-side by formatAnswerForDisplay()
  correctAnswerLabel: string;
  pointsAwarded:      number;
};
```

---

## Colour Theme

**All colours are defined in `src/constants/colors.ts` and nowhere else.**
Never write a hex code, rgb(), or named colour anywhere else in the codebase.
Always import from `colors` — no exceptions.

```ts
export const Colors = {
  background:       '#0F0A0B',
  surface:          '#1C1418',
  surfaceElevated:  '#2A1E23',
  primary:          '#C0392B',
  primaryLight:     '#E74C3C',
  primaryDark:      '#922B21',
  gold:             '#D4AC0D',
  goldLight:        '#F1C40F',
  textPrimary:      '#F5F0F1',
  textSecondary:    '#A89298',
  textDisabled:     '#5C4A50',
  success:          '#27AE60',
  warning:          '#E67E22',
  error:            '#C0392B',
  border:           '#2A1E23',
  overlay:          'rgba(0,0,0,0.6)',
  transparent:      'transparent',
} as const;
```

---

## Spacing & Typography

All spacing and font sizes come from `src/constants/spacing.ts` and `src/constants/typography.ts`.

```ts
export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const FontSize = {
  xs: 11, sm: 13, md: 15, lg: 18, xl: 22, xxl: 28, hero: 40,
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
- `StyleSheet.create()` for all styles — never inline style objects.
- Always use `Colors`, `Spacing`, and `FontSize` constants in styles.
- Never hardcode numbers for margin, padding, or font sizes.
- Wrap touch targets in `Pressable` (not `TouchableOpacity`).
- Use `SafeAreaView` / `useSafeAreaInsets` at screen level.

---

## Hooks Rules

- Custom hooks live in `src/hooks/`, prefixed with `use`.
- WebSocket connection logic lives in `src/hooks/usePartySocket.ts`.
- Never put business logic directly in a screen component — extract it to a hook.
- Use `useCallback` and `useMemo` where referential stability matters (passed as props, used in dependency arrays).

---

## PartyKit / Cloudflare Integration

- The PartyKit server lives in `src/party/server.ts`.
- Client connection logic is encapsulated in `src/hooks/usePartySocket.ts`.
- All messages sent over the socket are **typed** via discriminated unions in `src/types/partykit.ts`.
- Never `JSON.parse` a raw socket message without validating its `type` field first.
- The server is the source of truth. Clients reflect server state — never optimistically mutate game state.
- Use `room.getConnections()` on the server — `.connections.values()` is deprecated.
- All game-data broadcasts use `broadcastToAdmitted()` — never `room.broadcast()` (which reaches unadmitted connections).

### Correct answer model

- Questions (`src/types/questionnaire.ts`) are **pure templates**. They have no `correctOptionId`, `correctValue`, or `correctTagIds` fields.
- Correct answers are set per-round by the host in `RoundsBuilderScreen` and live on `Round.correctAnswers`.
- The server grades round N against `rounds[N].correctAnswers` — never against a global answer key.
- `formatAnswerForDisplay(question, answer)` resolves IDs to labels on the server at scoring time. Clients receive strings, not IDs.

---

## Navigation

- All screen names and params are typed in `src/types/navigation.ts` (`RootStackParamList` etc.).
- Never pass navigation props through multiple component layers — use `useNavigation()`.
- Screen params are typed. Never use untyped `route.params`.
- Deep links (`blindtaster://join/:roomCode`) are handled by React Navigation linking config in `AppNavigator.tsx`. No custom hook needed.

---

## Game State Reset

- `GameContext` holds all live game state. `RESET` action returns to `initialState`.
- `RESET` **must** be dispatched before entering a new game (host or player).
- Player flow: dispatched in `JoinGameScreen.doJoin()` and on "Leave Game" / "Done" buttons.
- Host flow: dispatched in `HostLobbyScreen` on game start and on "Done" button.
- Never carry stale `gameResults`, `localPlayerId`, or `isKicked` into a new session.

---

## Error Handling

- Network/socket errors must be caught and surfaced via visible UI state — never silently swallowed.
- Loading and error states are first-class in every hook that does async work.
- The entire app is wrapped in an `ErrorBoundary` class component in `App.tsx`.

---

## Code Style

- No barrel `index.ts` re-exports unless the directory is a published package boundary.
- No default exports except for screen components (required by React Navigation).
- Keep files under 200 lines. Split if larger.
- No commented-out code committed to the repo.
- No `console.log` in production paths — use a `__DEV__` guard if needed for debugging.
