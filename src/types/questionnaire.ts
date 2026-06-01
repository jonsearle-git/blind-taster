import { QuestionType } from '../constants/gameConstants';

export type QuestionDifficulty = 'easy' | 'hard';

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
  difficulty?: QuestionDifficulty;
};

export type MultipleChoiceNumberQuestion = {
  id: string;
  type: QuestionType.MultipleChoiceNumber;
  prompt: string;
  options: MultipleChoiceOption[];
  difficulty?: QuestionDifficulty;
};

export type TagsQuestion = {
  id: string;
  type: QuestionType.Tags;
  prompt: string;
  difficulty?: QuestionDifficulty;
};

export type PriceQuestion = {
  id: string;
  type: QuestionType.Price;
  prompt: string;
  currencySymbol: string;
  difficulty?: QuestionDifficulty;
};

export type TextInputQuestion = {
  id: string;
  type: QuestionType.TextInput;
  prompt: string;
  placeholder?: string;
  difficulty?: QuestionDifficulty;
};

export type NumberInputQuestion = {
  id: string;
  type: QuestionType.NumberInput;
  prompt: string;
  placeholder?: string;
  unit?: string;
  difficulty?: QuestionDifficulty;
};

export type Question =
  | MultipleChoiceTextQuestion
  | MultipleChoiceNumberQuestion
  | TagsQuestion
  | PriceQuestion
  | TextInputQuestion
  | NumberInputQuestion;

export type Questionnaire = {
  id: string;
  name: string;
  questions: Question[];
  createdAt: number;
  updatedAt: number;
};

