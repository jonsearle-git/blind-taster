import { QuestionType } from '../constants/gameConstants';
import type { Answer } from '../types/answer';
import type { Question } from '../types/questionnaire';
import type { QuestionResult } from '../types/results';

// ─── Scoring ─────────────────────────────────────────────────────────────────

/**
 * Score a single answer against an explicit correct answer.
 * The question is needed for type context and range information (slider).
 */
export function scoreAnswer(question: Question, playerAnswer: Answer, correctAnswer: Answer): number {
  switch (question.type) {
    case QuestionType.MultipleChoiceText:
    case QuestionType.MultipleChoiceNumber: {
      if (playerAnswer.type !== question.type) return 0;
      if (correctAnswer.type !== question.type) return 0;
      return playerAnswer.selectedOptionId === correctAnswer.selectedOptionId ? 100 : 0;
    }
    case QuestionType.SliderNumber: {
      if (playerAnswer.type !== QuestionType.SliderNumber)  return 0;
      if (correctAnswer.type !== QuestionType.SliderNumber) return 0;
      const range = question.max - question.min;
      if (range === 0) return playerAnswer.value === correctAnswer.value ? 100 : 0;
      const error = Math.abs(playerAnswer.value - correctAnswer.value) / range;
      return Math.max(0, Math.round(100 * (1 - error)));
    }
    case QuestionType.Tags: {
      if (playerAnswer.type !== QuestionType.Tags)  return 0;
      if (correctAnswer.type !== QuestionType.Tags) return 0;
      if (correctAnswer.tags.length === 0) return 100;
      const matches = correctAnswer.tags.filter((c) =>
        playerAnswer.tags.some((p) => p.toLowerCase() === c.toLowerCase())
      ).length;
      return Math.round((matches / correctAnswer.tags.length) * 100);
    }
    case QuestionType.Price: {
      if (playerAnswer.type !== QuestionType.Price)  return 0;
      if (correctAnswer.type !== QuestionType.Price) return 0;
      if (correctAnswer.value === 0) return playerAnswer.value === 0 ? 100 : 0;
      const pctError = Math.abs(playerAnswer.value - correctAnswer.value) / correctAnswer.value;
      return Math.max(0, Math.round(100 * (1 - Math.min(1, pctError))));
    }
  }
}

// ─── Display helpers ─────────────────────────────────────────────────────────

/** Resolve an Answer to a human-readable string using the question's option/tag definitions. */
export function formatAnswerForDisplay(question: Question, answer: Answer): string {
  switch (question.type) {
    case QuestionType.MultipleChoiceText:
    case QuestionType.MultipleChoiceNumber: {
      if (answer.type !== question.type) return '—';
      return question.options.find((o) => o.id === answer.selectedOptionId)?.label ?? answer.selectedOptionId;
    }
    case QuestionType.SliderNumber: {
      if (answer.type !== QuestionType.SliderNumber) return '—';
      return String(answer.value);
    }
    case QuestionType.Tags: {
      if (answer.type !== QuestionType.Tags) return '—';
      return answer.tags.length > 0 ? answer.tags.join(', ') : '(none)';
    }
    case QuestionType.Price: {
      if (answer.type !== QuestionType.Price) return '—';
      return `${question.currencySymbol}${answer.value.toFixed(2)}`;
    }
  }
}

// ─── Grade ───────────────────────────────────────────────────────────────────

/**
 * Grade all of a player's answers for one round against the round's correct answers.
 * correctAnswers is the host-supplied answer key for this specific round.
 */
export function gradePlayerAnswers(
  questions: Question[],
  playerAnswers: Answer[],
  correctAnswers: Answer[],
): QuestionResult[] {
  const playerMap  = new Map<string, Answer>(playerAnswers.map((a) => [a.questionId, a]));
  const correctMap = new Map<string, Answer>(correctAnswers.map((a) => [a.questionId, a]));

  return questions.map((question) => {
    const correctAnswer = correctMap.get(question.id);
    const playerAnswer  = playerMap.get(question.id);

    if (!correctAnswer) {
      // No correct answer was provided for this question — award 0, display placeholder.
      const fallback = playerAnswer ?? { questionId: question.id, type: question.type } as Answer;
      return {
        questionId:         question.id,
        prompt:             question.prompt,
        playerAnswer:       fallback,
        correctAnswer:      fallback,
        playerAnswerLabel:  playerAnswer ? formatAnswerForDisplay(question, playerAnswer) : '—',
        correctAnswerLabel: '—',
        pointsAwarded:      0,
      };
    }

    const points = playerAnswer ? scoreAnswer(question, playerAnswer, correctAnswer) : 0;

    return {
      questionId:         question.id,
      prompt:             question.prompt,
      playerAnswer:       playerAnswer ?? correctAnswer,
      correctAnswer,
      playerAnswerLabel:  playerAnswer ? formatAnswerForDisplay(question, playerAnswer) : '(no answer)',
      correctAnswerLabel: formatAnswerForDisplay(question, correctAnswer),
      pointsAwarded:      points,
    };
  });
}
