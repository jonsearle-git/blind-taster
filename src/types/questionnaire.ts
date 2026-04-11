import { QuestionType } from '../constants/gameConstants';

export type MultipleChoiceOption = {
  id: string;
  label: string;
};

export type MultipleChoiceTextQuestion = {
  id: string;
  type: QuestionType.MultipleChoiceText;
  prompt: string;
  options: MultipleChoiceOption[];
  correctOptionId: string;
};

export type MultipleChoiceNumberQuestion = {
  id: string;
  type: QuestionType.MultipleChoiceNumber;
  prompt: string;
  options: MultipleChoiceOption[];
  correctOptionId: string;
};

export type SliderNumberQuestion = {
  id: string;
  type: QuestionType.SliderNumber;
  prompt: string;
  min: number;
  max: number;
  step: number;
  correctValue: number;
};

export type Tag = {
  id: string;
  label: string;
};

export type TagsQuestion = {
  id: string;
  type: QuestionType.Tags;
  prompt: string;
  tags: Tag[];
  correctTagIds: string[];
  maxSelections: number | null;
};

export type PriceQuestion = {
  id: string;
  type: QuestionType.Price;
  prompt: string;
  currencySymbol: string;
  correctValue: number;
};

export type Question =
  | MultipleChoiceTextQuestion
  | MultipleChoiceNumberQuestion
  | SliderNumberQuestion
  | TagsQuestion
  | PriceQuestion;

export type Questionnaire = {
  id: string;
  name: string;
  questions: Question[];
  createdAt: number;
  updatedAt: number;
};

// Sent to players — no correct answers
export type QuestionForPlayer =
  | Omit<MultipleChoiceTextQuestion, 'correctOptionId'>
  | Omit<MultipleChoiceNumberQuestion, 'correctOptionId'>
  | Omit<SliderNumberQuestion, 'correctValue'>
  | Omit<TagsQuestion, 'correctTagIds'>
  | Omit<PriceQuestion, 'correctValue'>;

export type QuestionnaireForPlayer = {
  id: string;
  name: string;
  questions: QuestionForPlayer[];
};
