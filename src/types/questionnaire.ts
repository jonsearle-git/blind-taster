import { QuestionType } from '../constants/gameConstants';

export type MultipleChoiceOption = {
  id: string;
  label: string;
};

// Questions are templates — correct answers live on each Round, not here.

export type MultipleChoiceTextQuestion = {
  id: string;
  type: QuestionType.MultipleChoiceText;
  prompt: string;
  options: MultipleChoiceOption[];
};

export type MultipleChoiceNumberQuestion = {
  id: string;
  type: QuestionType.MultipleChoiceNumber;
  prompt: string;
  options: MultipleChoiceOption[];
};

export type SliderNumberQuestion = {
  id: string;
  type: QuestionType.SliderNumber;
  prompt: string;
  min: number;
  max: number;
  step: number;
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
  maxSelections: number | null;
};

export type PriceQuestion = {
  id: string;
  type: QuestionType.Price;
  prompt: string;
  currencySymbol: string;
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

// Identical to Questionnaire — questions never contained sensitive data now.
// Kept as alias so existing imports don't break.
export type QuestionForPlayer = Question;
export type QuestionnaireForPlayer = Questionnaire;
