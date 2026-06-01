import { QuestionType } from '../constants/gameConstants';

export type MultipleChoiceTextAnswer = {
  questionId: string;
  type: QuestionType.MultipleChoiceText;
  selectedOptionId: string;
};

export type MultipleChoiceNumberAnswer = {
  questionId: string;
  type: QuestionType.MultipleChoiceNumber;
  selectedOptionId: string;
};

export type TagsAnswer = {
  questionId: string;
  type: QuestionType.Tags;
  // Player answers: string[] (one word per tag).
  // Correct answers (Gemini): string[][] (each tag is an array of accepted synonyms).
  tags: string[] | string[][];
};

export type PriceAnswer = {
  questionId: string;
  type: QuestionType.Price;
  value: number;
};

export type TextInputAnswer = {
  questionId: string;
  type: QuestionType.TextInput;
  value: string;
};

export type NumberInputAnswer = {
  questionId: string;
  type: QuestionType.NumberInput;
  value: number;
};

export type Answer =
  | MultipleChoiceTextAnswer
  | MultipleChoiceNumberAnswer
  | TagsAnswer
  | PriceAnswer
  | TextInputAnswer
  | NumberInputAnswer;

export type PlayerRoundAnswers = {
  playerId: string;
  roundNumber: number;
  answers: Answer[];
};
