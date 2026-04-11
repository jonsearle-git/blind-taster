import { QuestionType } from '../constants/gameConstants';
import type { Answer } from '../types/answer';
import type { Question } from '../types/questionnaire';
import type { QuestionResult } from '../types/results';

export function scoreAnswer(question: Question, answer: Answer): number {
  switch (question.type) {
    case QuestionType.MultipleChoiceText:
    case QuestionType.MultipleChoiceNumber: {
      if (answer.type !== question.type) return 0;
      return answer.selectedOptionId === question.correctOptionId ? 100 : 0;
    }
    case QuestionType.SliderNumber: {
      if (answer.type !== QuestionType.SliderNumber) return 0;
      const range = question.max - question.min;
      if (range === 0) return answer.value === question.correctValue ? 100 : 0;
      const error = Math.abs(answer.value - question.correctValue) / range;
      return Math.max(0, Math.round(100 * (1 - error)));
    }
    case QuestionType.Tags: {
      if (answer.type !== QuestionType.Tags) return 0;
      if (question.correctTagIds.length === 0) return 100;
      const matches = question.correctTagIds.filter((id) =>
        answer.selectedTagIds.includes(id),
      ).length;
      return Math.round((matches / question.correctTagIds.length) * 100);
    }
    case QuestionType.Price: {
      if (answer.type !== QuestionType.Price) return 0;
      if (question.correctValue === 0) return answer.value === 0 ? 100 : 0;
      const pctError = Math.abs(answer.value - question.correctValue) / question.correctValue;
      return Math.max(0, Math.round(100 * (1 - Math.min(1, pctError))));
    }
  }
}

export function buildCorrectAnswer(question: Question): Answer {
  switch (question.type) {
    case QuestionType.MultipleChoiceText:
      return { questionId: question.id, type: QuestionType.MultipleChoiceText, selectedOptionId: question.correctOptionId };
    case QuestionType.MultipleChoiceNumber:
      return { questionId: question.id, type: QuestionType.MultipleChoiceNumber, selectedOptionId: question.correctOptionId };
    case QuestionType.SliderNumber:
      return { questionId: question.id, type: QuestionType.SliderNumber, value: question.correctValue };
    case QuestionType.Tags:
      return { questionId: question.id, type: QuestionType.Tags, selectedTagIds: question.correctTagIds };
    case QuestionType.Price:
      return { questionId: question.id, type: QuestionType.Price, value: question.correctValue };
  }
}

export function gradePlayerAnswers(
  questions: Question[],
  playerAnswers: Answer[],
): QuestionResult[] {
  const answerMap = new Map<string, Answer>(playerAnswers.map((a) => [a.questionId, a]));

  return questions.map((question) => {
    const playerAnswer  = answerMap.get(question.id);
    const correctAnswer = buildCorrectAnswer(question);
    const pointsAwarded = playerAnswer ? scoreAnswer(question, playerAnswer) : 0;
    return {
      questionId:    question.id,
      prompt:        question.prompt,
      playerAnswer:  playerAnswer ?? correctAnswer,
      correctAnswer,
      pointsAwarded,
    };
  });
}
