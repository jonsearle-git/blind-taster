import { QuestionType } from '../../constants/gameConstants';
import { QuestionForPlayer } from '../../types/questionnaire';
import { Answer } from '../../types/answer';
import {
  MultipleChoiceTextQuestion,
  MultipleChoiceNumberQuestion,
  SliderNumberQuestion,
  TagsQuestion as TagsQ,
  PriceQuestion as PriceQ,
} from '../../types/questionnaire';
import {
  MultipleChoiceTextAnswer,
  MultipleChoiceNumberAnswer,
  SliderNumberAnswer,
  TagsAnswer,
  PriceAnswer,
} from '../../types/answer';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { SliderQuestion } from './SliderQuestion';
import { TagsQuestion } from './TagsQuestion';
import { PriceQuestion } from './PriceQuestion';

type Props = {
  question: QuestionForPlayer;
  answer:   Answer | null;
  onAnswer: (answer: Answer) => void;
};

export function QuestionInput({ question, answer, onAnswer }: Props): React.ReactElement {
  switch (question.type) {
    case QuestionType.MultipleChoiceText: {
      const q   = question as unknown as MultipleChoiceTextQuestion;
      const ans = answer as MultipleChoiceTextAnswer | null;
      return (
        <MultipleChoiceQuestion
          question={q}
          selectedOptionId={ans?.selectedOptionId ?? null}
          onSelect={(id) => onAnswer({ questionId: q.id, type: QuestionType.MultipleChoiceText, selectedOptionId: id })}
        />
      );
    }
    case QuestionType.MultipleChoiceNumber: {
      const q   = question as unknown as MultipleChoiceNumberQuestion;
      const ans = answer as MultipleChoiceNumberAnswer | null;
      return (
        <MultipleChoiceQuestion
          question={q}
          selectedOptionId={ans?.selectedOptionId ?? null}
          onSelect={(id) => onAnswer({ questionId: q.id, type: QuestionType.MultipleChoiceNumber, selectedOptionId: id })}
        />
      );
    }
    case QuestionType.SliderNumber: {
      const q   = question as unknown as SliderNumberQuestion;
      const ans = answer as SliderNumberAnswer | null;
      return (
        <SliderQuestion
          question={q}
          value={ans?.value ?? null}
          onChange={(value) => onAnswer({ questionId: q.id, type: QuestionType.SliderNumber, value })}
        />
      );
    }
    case QuestionType.Tags: {
      const q       = question as unknown as TagsQ;
      const ans     = answer as TagsAnswer | null;
      const current = ans?.selectedTagIds ?? [];
      return (
        <TagsQuestion
          question={q}
          selectedTagIds={current}
          onToggle={(tagId) => {
            const next = current.includes(tagId)
              ? current.filter((id) => id !== tagId)
              : [...current, tagId];
            onAnswer({ questionId: q.id, type: QuestionType.Tags, selectedTagIds: next });
          }}
        />
      );
    }
    case QuestionType.Price: {
      const q   = question as unknown as PriceQ;
      const ans = answer as PriceAnswer | null;
      return (
        <PriceQuestion
          question={q}
          value={ans?.value ?? null}
          onChange={(value) => onAnswer({ questionId: q.id, type: QuestionType.Price, value })}
        />
      );
    }
  }
}
