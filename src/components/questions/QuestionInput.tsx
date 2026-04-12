import { QuestionType } from '../../constants/gameConstants';
import type { Question } from '../../types/questionnaire';
import type { Answer } from '../../types/answer';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { SliderQuestion } from './SliderQuestion';
import { TagsQuestion } from './TagsQuestion';
import { PriceQuestion } from './PriceQuestion';

type Props = {
  question: Question;
  answer:   Answer | null;
  onAnswer: (answer: Answer) => void;
};

export function QuestionInput({ question, answer, onAnswer }: Props): React.ReactElement {
  switch (question.type) {
    case QuestionType.MultipleChoiceText: {
      const selectedId = answer?.type === QuestionType.MultipleChoiceText ? answer.selectedOptionId : null;
      return (
        <MultipleChoiceQuestion
          question={question}
          selectedOptionId={selectedId}
          onSelect={(id) => onAnswer({ questionId: question.id, type: QuestionType.MultipleChoiceText, selectedOptionId: id })}
        />
      );
    }
    case QuestionType.MultipleChoiceNumber: {
      const selectedId = answer?.type === QuestionType.MultipleChoiceNumber ? answer.selectedOptionId : null;
      return (
        <MultipleChoiceQuestion
          question={question}
          selectedOptionId={selectedId}
          onSelect={(id) => onAnswer({ questionId: question.id, type: QuestionType.MultipleChoiceNumber, selectedOptionId: id })}
        />
      );
    }
    case QuestionType.SliderNumber: {
      const value = answer?.type === QuestionType.SliderNumber ? answer.value : null;
      return (
        <SliderQuestion
          question={question}
          value={value}
          onChange={(v) => onAnswer({ questionId: question.id, type: QuestionType.SliderNumber, value: v })}
        />
      );
    }
    case QuestionType.Tags: {
      const selectedTagIds = answer?.type === QuestionType.Tags ? answer.selectedTagIds : [];
      return (
        <TagsQuestion
          question={question}
          selectedTagIds={selectedTagIds}
          onToggle={(tagId) => {
            const next = selectedTagIds.includes(tagId)
              ? selectedTagIds.filter((id) => id !== tagId)
              : [...selectedTagIds, tagId];
            onAnswer({ questionId: question.id, type: QuestionType.Tags, selectedTagIds: next });
          }}
        />
      );
    }
    case QuestionType.Price: {
      const value = answer?.type === QuestionType.Price ? answer.value : null;
      return (
        <PriceQuestion
          question={question}
          value={value}
          onChange={(v) => onAnswer({ questionId: question.id, type: QuestionType.Price, value: v })}
        />
      );
    }
  }
}
