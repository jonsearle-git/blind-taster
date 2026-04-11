import { useState, useCallback } from 'react';
import { Answer } from '../types/answer';
import { QuestionForPlayer } from '../types/questionnaire';
import { QuestionType } from '../constants/gameConstants';

type AnswerMap = Map<string, Answer>;

export function useAnswers(questions: QuestionForPlayer[]) {
  const [answers, setAnswers] = useState<AnswerMap>(new Map());

  const setAnswer = useCallback((answer: Answer) => {
    setAnswers((prev) => {
      const next = new Map(prev);
      next.set(answer.questionId, answer);
      return next;
    });
  }, []);

  const clearAnswers = useCallback(() => {
    setAnswers(new Map());
  }, []);

  const isComplete = questions.every((q) => answers.has(q.id));

  const answersArray: Answer[] = Array.from(answers.values());

  return { answers, answersArray, setAnswer, clearAnswers, isComplete };
}
