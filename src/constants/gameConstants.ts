export enum GamePhase {
  Lobby           = 'lobby',
  InRound         = 'in_round',
  AllAnswered     = 'all_answered',
  AnswersRevealed = 'answers_revealed',
  Paused          = 'paused',
  Abandoned       = 'abandoned',
  GameOver        = 'game_over',
}

export enum RoundPhase {
  Answering       = 'answering',
  AllAnswered     = 'all_answered',
  AnswersRevealed = 'answers_revealed',
}

export enum QuestionType {
  MultipleChoiceText   = 'multiple_choice_text',
  MultipleChoiceNumber = 'multiple_choice_number',
  SliderNumber         = 'slider_number',
  Tags                 = 'tags',
  Price                = 'price',
}

export enum PlayerStatus {
  Connected    = 'connected',
  Disconnected = 'disconnected',
  Kicked       = 'kicked',
}

export enum ConnectionStatus {
  Connecting    = 'connecting',
  Connected     = 'connected',
  Disconnected  = 'disconnected',
  Reconnecting  = 'reconnecting',
  Error         = 'error',
}
