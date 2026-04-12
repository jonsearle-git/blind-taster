import { GamePhase, PlayerStatus, QuestionType, RoundPhase } from '../../constants/gameConstants';
import type { Questionnaire } from '../../types/questionnaire';
import type { ServerState, InternalPlayer, RoundData } from '../helpers';
import { toPlayer, buildGameState, buildGameResults } from '../helpers';

// ─── Fixtures ────────────────────────────────────────────────────────────────

function makePlayer(overrides: Partial<InternalPlayer> = {}): InternalPlayer {
  return {
    id: 'p1', name: 'Alice', status: PlayerStatus.Connected,
    score: 0, connectionId: 'conn1', ...overrides,
  };
}

const questionnaire: Questionnaire = {
  id: 'qr1',
  name: 'Wine Tasting',
  createdAt: 0,
  updatedAt: 0,
  questions: [
    {
      id: 'q1',
      type: QuestionType.MultipleChoiceText,
      prompt: 'Which grape?',
      options: [{ id: 'a', label: 'Merlot' }, { id: 'b', label: 'Shiraz' }],
    },
    {
      id: 'q2',
      type: QuestionType.SliderNumber,
      prompt: 'Sweetness',
      min: 0, max: 10, step: 1,
    },
    {
      id: 'q3',
      type: QuestionType.Tags,
      prompt: 'Notes',
      tags: [{ id: 't1', label: 'Cherry' }],
      maxSelections: null,
    },
    {
      id: 'q4',
      type: QuestionType.Price,
      prompt: 'Price',
      currencySymbol: '£',
    },
  ],
};

function makeState(overrides: Partial<ServerState> = {}): ServerState {
  return {
    phase: GamePhase.Lobby,
    roundPhase: RoundPhase.Answering,
    currentRound: 1,
    rounds: [{ number: 1, label: 'Red Wine', correctAnswers: [] }],
    questionnaire: null,
    players: new Map(),
    pending: new Map(),
    roundAnswers: new Map(),
    roundHistory: new Map(),
    ...overrides,
  };
}

// ─── toPlayer ────────────────────────────────────────────────────────────────

describe('toPlayer', () => {
  it('strips connectionId from internal player', () => {
    const internal = makePlayer();
    const result = toPlayer(internal);
    expect(result).toEqual({ id: 'p1', name: 'Alice', status: PlayerStatus.Connected, score: 0 });
    expect(result).not.toHaveProperty('connectionId');
  });
});

// ─── buildGameState ───────────────────────────────────────────────────────────

describe('buildGameState', () => {
  it('returns sanitised state with correct round structure', () => {
    const players = new Map([['p1', makePlayer()]]);
    const state = makeState({ players, questionnaire, phase: GamePhase.InRound });
    const gs = buildGameState(state, 'ROOM123');
    expect(gs.roomCode).toBe('ROOM123');
    expect(gs.phase).toBe(GamePhase.InRound);
    expect(gs.players).toHaveLength(1);
    expect(gs.players[0]).not.toHaveProperty('connectionId');
    expect(gs.rounds[0].label).toBeNull();
  });

  it('strips correctAnswers from rounds sent to clients', () => {
    const state = makeState({
      rounds: [{ number: 1, label: null, correctAnswers: [{ questionId: 'q1', type: QuestionType.MultipleChoiceText, selectedOptionId: 'a' }] }],
    });
    const gs = buildGameState(state, 'X');
    expect(gs.rounds[0]).not.toHaveProperty('correctAnswers');
  });

  it('handles null questionnaire', () => {
    const state = makeState();
    const gs = buildGameState(state, 'X');
    expect(gs.questionnaire).toBeNull();
  });

  it('includes answeredPlayerIds from roundAnswers', () => {
    const state = makeState({
      phase: GamePhase.InRound,
      roundAnswers: new Map([['p1', []]]),
    });
    const gs = buildGameState(state, 'X');
    expect(gs.answeredPlayerIds).toContain('p1');
  });
});

// ─── buildGameResults ─────────────────────────────────────────────────────────

describe('buildGameResults', () => {
  it('sorts players by score descending and assigns positions', () => {
    const alice = makePlayer({ id: 'p1', name: 'Alice', score: 200 });
    const bob = makePlayer({ id: 'p2', name: 'Bob', score: 300, connectionId: 'conn2' });
    const players = new Map([['p1', alice], ['p2', bob]]);

    const roundData = new Map<string, RoundData>([
      ['p1', { questionResults: [], roundScore: 200 }],
      ['p2', { questionResults: [], roundScore: 300 }],
    ]);

    const state = makeState({
      players,
      rounds: [{ number: 1, label: 'Round 1', correctAnswers: [] }],
      roundHistory: new Map([[1, roundData]]),
    });

    const results = buildGameResults(state);
    expect(results.players[0].player.name).toBe('Bob');
    expect(results.players[0].position).toBe(1);
    expect(results.players[1].player.name).toBe('Alice');
    expect(results.players[1].position).toBe(2);
    expect(results.winner.name).toBe('Bob');
  });

  it('includes round labels in results', () => {
    const player = makePlayer({ score: 100 });
    const players = new Map([['p1', player]]);
    const roundData = new Map<string, RoundData>([['p1', { questionResults: [], roundScore: 100 }]]);
    const state = makeState({
      players,
      rounds: [{ number: 1, label: 'Cabernet', correctAnswers: [] }],
      roundHistory: new Map([[1, roundData]]),
    });
    const results = buildGameResults(state);
    expect(results.players[0].rounds[0].roundLabel).toBe('Cabernet');
  });
});
