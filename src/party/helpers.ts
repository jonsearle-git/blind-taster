import { GamePhase, PlayerStatus, QuestionType, RoundPhase } from '../constants/gameConstants';
import type { GameResults, PlayerResult, RoundResult } from '../types/results';
import type { GameState, Round } from '../types/game';
import type { Player } from '../types/player';
import type { Questionnaire, QuestionnaireForPlayer } from '../types/questionnaire';

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
  roundAnswers: Map<string, import('../types/answer').Answer[]>; // playerId -> answers
  roundHistory: Map<number, Map<string, RoundData>>; // round# -> playerId -> data
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function toPlayer(p: InternalPlayer): Player {
  return { id: p.id, name: p.name, status: p.status, score: p.score };
}

export function buildQuestionnaireForPlayer(q: Questionnaire): QuestionnaireForPlayer {
  return {
    id:        q.id,
    name:      q.name,
    questions: q.questions.map((question) => {
      switch (question.type) {
        case QuestionType.MultipleChoiceText: {
          const { correctOptionId: _c, ...rest } = question;
          return rest;
        }
        case QuestionType.MultipleChoiceNumber: {
          const { correctOptionId: _c, ...rest } = question;
          return rest;
        }
        case QuestionType.SliderNumber: {
          const { correctValue: _c, ...rest } = question;
          return rest;
        }
        case QuestionType.Tags: {
          const { correctTagIds: _c, ...rest } = question;
          return rest;
        }
        case QuestionType.Price: {
          const { correctValue: _c, ...rest } = question;
          return rest;
        }
      }
    }),
  };
}

export function buildGameState(state: ServerState, roomId: string): GameState {
  const { phase, roundPhase, currentRound, rounds, questionnaire, players } = state;
  return {
    roomCode:      roomId,
    phase,
    roundPhase,
    players:       [...players.values()].map(toPlayer),
    currentRound,
    totalRounds:   rounds.length,
    questionnaire: questionnaire ? buildQuestionnaireForPlayer(questionnaire) : null,
    rounds,
  };
}

export function buildGameResults(state: ServerState): GameResults {
  const sorted = [...state.players.values()].sort((a, b) => b.score - a.score);

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

  return { players, winner: players[0]?.player ?? toPlayer(sorted[0]!) };
}
