import { GamePhase, PlayerStatus, RoundPhase } from '../constants/gameConstants';
import type { GameResults, PlayerResult, RoundResult } from '../types/results';
import type { GameState, Round, RoundForPlayer } from '../types/game';
import type { Player } from '../types/player';
import type { Questionnaire } from '../types/questionnaire';
import type { Answer } from '../types/answer';

// ─── Internal state types (shared with server.ts) ────────────────────────────

export type InternalPlayer = Player & { connectionId: string | null };

export type RoundData = {
  questionResults: import('../types/results').QuestionResult[];
  roundScore:      number;
};

export type ServerState = {
  phase:        GamePhase;
  roundPhase:   RoundPhase;
  currentRound: number;
  rounds:       Round[];
  questionnaire: Questionnaire | null;
  players:      Map<string, InternalPlayer>;
  pending:      Map<string, string>; // connectionId -> name
  roundAnswers: Map<string, Answer[]>; // playerId -> answers
  roundHistory: Map<number, Map<string, RoundData>>; // round# -> playerId -> data
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function toPlayer(p: InternalPlayer): Player {
  return { id: p.id, name: p.name, status: p.status, score: p.score };
}

export function buildGameState(state: ServerState, roomId: string): GameState {
  const { phase, roundPhase, currentRound, rounds, questionnaire, players, roundAnswers } = state;

  const roundsForPlayer: RoundForPlayer[] = rounds.map((r) => ({
    number: r.number,
    label:  null, // always hidden mid-game
  }));

  return {
    roomCode:          roomId,
    phase,
    roundPhase,
    players:           [...players.values()].map(toPlayer),
    currentRound,
    totalRounds:       rounds.length,
    questionnaire:     questionnaire ?? null, // no stripping needed — questions have no correct answers
    rounds:            roundsForPlayer,
    answeredPlayerIds: [...roundAnswers.keys()],
  };
}

export function buildGameResults(state: ServerState): GameResults {
  const sorted = [...state.players.values()].sort((a, b) => b.score - a.score);

  if (sorted.length === 0) {
    return { players: [], winner: { id: '', name: 'Nobody', status: PlayerStatus.Disconnected, score: 0 } };
  }

  const players: PlayerResult[] = sorted.map((player, index) => {
    const rounds: RoundResult[] = state.rounds.map((round) => {
      const data = state.roundHistory.get(round.number)?.get(player.id);
      return {
        roundNumber:     round.number,
        roundLabel:      round.label,
        questionResults: data?.questionResults ?? [],
        roundScore:      data?.roundScore ?? 0,
      };
    });
    return { player: toPlayer(player), rounds, totalScore: player.score, position: index + 1 };
  });

  return { players, winner: players[0]!.player };
}
