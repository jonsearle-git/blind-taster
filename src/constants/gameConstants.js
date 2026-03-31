// Game configuration and state constants

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE_TEXT: 'multiple_choice_text',
  MULTIPLE_CHOICE_NUMBER: 'multiple_choice_number',
  TEXT_KEYWORDS: 'text_keywords',
};

export const REVEAL_MODES = {
  AFTER_EACH_QUESTION: 'after_each_question',
  END_OF_GAME: 'end_of_game',
};

export const GAME_STATES = {
  SETUP: 'setup',
  LOBBY: 'lobby',
  IN_ROUND: 'in_round',
  REVEALING: 'revealing',
  FINISHED: 'finished',
};

export const PLAYER_STATES = {
  PENDING: 'pending',       // Join request sent, awaiting host approval
  ACCEPTED: 'accepted',     // Host accepted, in lobby
  DENIED: 'denied',         // Host denied
  IN_GAME: 'in_game',       // Game started
  ANSWERED: 'answered',     // Has submitted answer for current round
  WAITING: 'waiting',       // Has not yet submitted for current round
  DROPPED: 'dropped',       // Disconnected and max reconnect attempts exceeded
};

export const HOST_MODES = {
  HOST_ONLY: 'host_only',
  HOST_AND_PLAYER: 'host_and_player',
};

export const BLE_MESSAGE_TYPES = {
  JOIN_REQUEST: 'JOIN_REQUEST',
  JOIN_ACCEPTED: 'JOIN_ACCEPTED',
  JOIN_DENIED: 'JOIN_DENIED',
  GAME_START: 'GAME_START',
  ROUND_START: 'ROUND_START',
  PLAYER_ANSWER: 'PLAYER_ANSWER',
  ROUND_REVEAL: 'ROUND_REVEAL',
  GAME_RESULTS: 'GAME_RESULTS',
  PLAYER_SCORE: 'PLAYER_SCORE',
};

export const MAX_PLAYERS = 20;
export const MAX_ROUNDS = 20;
export const MAX_CHOICES_PER_QUESTION = 8;
export const APP_NAME = 'Blind Tester';
