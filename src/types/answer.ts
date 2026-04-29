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

export type SliderNumberAnswer = {
  questionId: string;
  type: QuestionType.SliderNumber;
  value: number;
};

export type TagsAnswer = {
  questionId: string;
  type: QuestionType.Tags;
  tags: string[];
};

export type PriceAnswer = {
  questionId: string;
  type: QuestionType.Price;
  value: number;
};

export type Answer =
  | MultipleChoiceTextAnswer
  | MultipleChoiceNumberAnswer
  | SliderNumberAnswer
  | TagsAnswer
  | PriceAnswer;

export type PlayerRoundAnswers = {
  playerId: string;
  roundNumber: number;
  answers: Answer[];
};
