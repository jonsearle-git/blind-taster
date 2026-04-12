import { QuestionType } from '../../constants/gameConstants';
import type { Question } from '../../types/questionnaire';
import type { Answer } from '../../types/answer';
import { scoreAnswer, gradePlayerAnswers } from '../scoring';

// ─── Question Fixtures ───────────────────────────────────────────────────────

const mcTextQ: Question = {
  id: 'q1',
  type: QuestionType.MultipleChoiceText,
  prompt: 'Which grape?',
  options: [
    { id: 'a', label: 'Merlot' },
    { id: 'b', label: 'Shiraz' },
  ],
};

const mcNumQ: Question = {
  id: 'q2',
  type: QuestionType.MultipleChoiceNumber,
  prompt: 'Vintage year?',
  options: [
    { id: 'x', label: '2018' },
    { id: 'y', label: '2020' },
  ],
};

const sliderQ: Question = {
  id: 'q3',
  type: QuestionType.SliderNumber,
  prompt: 'Rate sweetness',
  min: 0,
  max: 10,
  step: 1,
};

const tagsQ: Question = {
  id: 'q4',
  type: QuestionType.Tags,
  prompt: 'Select flavour notes',
  tags: [
    { id: 't1', label: 'Cherry' },
    { id: 't2', label: 'Oak' },
    { id: 't3', label: 'Vanilla' },
  ],
  maxSelections: null,
};

const priceQ: Question = {
  id: 'q5',
  type: QuestionType.Price,
  prompt: 'Guess the price',
  currencySymbol: '£',
};

// ─── Correct Answer Fixtures ─────────────────────────────────────────────────

const mcTextCorrect:  Answer = { questionId: 'q1', type: QuestionType.MultipleChoiceText,   selectedOptionId: 'a' };
const mcNumCorrect:   Answer = { questionId: 'q2', type: QuestionType.MultipleChoiceNumber, selectedOptionId: 'y' };
const sliderCorrect:  Answer = { questionId: 'q3', type: QuestionType.SliderNumber,         value: 7 };
const tagsCorrect:    Answer = { questionId: 'q4', type: QuestionType.Tags,                 selectedTagIds: ['t1', 't3'] };
const priceCorrect:   Answer = { questionId: 'q5', type: QuestionType.Price,                value: 20 };

// ─── scoreAnswer ─────────────────────────────────────────────────────────────

describe('scoreAnswer', () => {
  describe('MultipleChoiceText', () => {
    it('awards 100 for correct answer', () => {
      const answer: Answer = { questionId: 'q1', type: QuestionType.MultipleChoiceText, selectedOptionId: 'a' };
      expect(scoreAnswer(mcTextQ, answer, mcTextCorrect)).toBe(100);
    });

    it('awards 0 for wrong answer', () => {
      const answer: Answer = { questionId: 'q1', type: QuestionType.MultipleChoiceText, selectedOptionId: 'b' };
      expect(scoreAnswer(mcTextQ, answer, mcTextCorrect)).toBe(0);
    });

    it('awards 0 for type mismatch', () => {
      const answer: Answer = { questionId: 'q1', type: QuestionType.Price, value: 10 };
      expect(scoreAnswer(mcTextQ, answer, mcTextCorrect)).toBe(0);
    });
  });

  describe('MultipleChoiceNumber', () => {
    it('awards 100 for correct answer', () => {
      const answer: Answer = { questionId: 'q2', type: QuestionType.MultipleChoiceNumber, selectedOptionId: 'y' };
      expect(scoreAnswer(mcNumQ, answer, mcNumCorrect)).toBe(100);
    });

    it('awards 0 for wrong answer', () => {
      const answer: Answer = { questionId: 'q2', type: QuestionType.MultipleChoiceNumber, selectedOptionId: 'x' };
      expect(scoreAnswer(mcNumQ, answer, mcNumCorrect)).toBe(0);
    });
  });

  describe('SliderNumber', () => {
    it('awards 100 for exact match', () => {
      const answer: Answer = { questionId: 'q3', type: QuestionType.SliderNumber, value: 7 };
      expect(scoreAnswer(sliderQ, answer, sliderCorrect)).toBe(100);
    });

    it('awards partial score proportional to proximity', () => {
      const answer: Answer = { questionId: 'q3', type: QuestionType.SliderNumber, value: 5 };
      expect(scoreAnswer(sliderQ, answer, sliderCorrect)).toBe(80);
    });

    it('awards minimum score at maximum distance', () => {
      const answer: Answer = { questionId: 'q3', type: QuestionType.SliderNumber, value: 0 };
      expect(scoreAnswer(sliderQ, answer, sliderCorrect)).toBe(30);
    });

    it('handles zero-range slider (exact match only)', () => {
      const zeroRange: Question = { ...sliderQ, min: 5, max: 5 };
      const correctAtFive: Answer = { questionId: 'q3', type: QuestionType.SliderNumber, value: 5 };
      const right: Answer = { questionId: 'q3', type: QuestionType.SliderNumber, value: 5 };
      const wrong: Answer = { questionId: 'q3', type: QuestionType.SliderNumber, value: 3 };
      expect(scoreAnswer(zeroRange, right, correctAtFive)).toBe(100);
      expect(scoreAnswer(zeroRange, wrong, correctAtFive)).toBe(0);
    });
  });

  describe('Tags', () => {
    it('awards 100 for all correct tags', () => {
      const answer: Answer = { questionId: 'q4', type: QuestionType.Tags, selectedTagIds: ['t1', 't3'] };
      expect(scoreAnswer(tagsQ, answer, tagsCorrect)).toBe(100);
    });

    it('awards partial score for some correct tags', () => {
      const answer: Answer = { questionId: 'q4', type: QuestionType.Tags, selectedTagIds: ['t1'] };
      expect(scoreAnswer(tagsQ, answer, tagsCorrect)).toBe(50);
    });

    it('awards 0 for no matching tags', () => {
      const answer: Answer = { questionId: 'q4', type: QuestionType.Tags, selectedTagIds: ['t2'] };
      expect(scoreAnswer(tagsQ, answer, tagsCorrect)).toBe(0);
    });

    it('awards 100 when correct has no tags', () => {
      const emptyCorrect: Answer = { questionId: 'q4', type: QuestionType.Tags, selectedTagIds: [] };
      const answer: Answer = { questionId: 'q4', type: QuestionType.Tags, selectedTagIds: ['t2'] };
      expect(scoreAnswer(tagsQ, answer, emptyCorrect)).toBe(100);
    });
  });

  describe('Price', () => {
    it('awards 100 for exact price', () => {
      const answer: Answer = { questionId: 'q5', type: QuestionType.Price, value: 20 };
      expect(scoreAnswer(priceQ, answer, priceCorrect)).toBe(100);
    });

    it('awards partial score for close guess', () => {
      const answer: Answer = { questionId: 'q5', type: QuestionType.Price, value: 15 };
      expect(scoreAnswer(priceQ, answer, priceCorrect)).toBe(75);
    });

    it('awards 0 for 100%+ error', () => {
      const answer: Answer = { questionId: 'q5', type: QuestionType.Price, value: 40 };
      expect(scoreAnswer(priceQ, answer, priceCorrect)).toBe(0);
    });

    it('handles zero correct value', () => {
      const freeCorrect: Answer = { questionId: 'q5', type: QuestionType.Price, value: 0 };
      const right: Answer = { questionId: 'q5', type: QuestionType.Price, value: 0 };
      const wrong: Answer = { questionId: 'q5', type: QuestionType.Price, value: 5 };
      expect(scoreAnswer(priceQ, right, freeCorrect)).toBe(100);
      expect(scoreAnswer(priceQ, wrong, freeCorrect)).toBe(0);
    });
  });
});

// ─── gradePlayerAnswers ──────────────────────────────────────────────────────

describe('gradePlayerAnswers', () => {
  const questions: Question[] = [mcTextQ, sliderQ, priceQ];
  const correctAnswers: Answer[] = [mcTextCorrect, sliderCorrect, priceCorrect];

  it('grades all correct answers', () => {
    const playerAnswers: Answer[] = [
      { questionId: 'q1', type: QuestionType.MultipleChoiceText, selectedOptionId: 'a' },
      { questionId: 'q3', type: QuestionType.SliderNumber, value: 7 },
      { questionId: 'q5', type: QuestionType.Price, value: 20 },
    ];
    const results = gradePlayerAnswers(questions, playerAnswers, correctAnswers);
    expect(results).toHaveLength(3);
    expect(results.every((r) => r.pointsAwarded === 100)).toBe(true);
  });

  it('awards 0 for missing player answers', () => {
    const results = gradePlayerAnswers(questions, [], correctAnswers);
    expect(results).toHaveLength(3);
    expect(results.every((r) => r.pointsAwarded === 0)).toBe(true);
  });

  it('awards 0 and shows placeholder when correct answer is missing', () => {
    const results = gradePlayerAnswers([mcTextQ], [], []);
    expect(results).toHaveLength(1);
    expect(results[0].pointsAwarded).toBe(0);
    expect(results[0].correctAnswerLabel).toBe('—');
  });

  it('resolves option IDs to human-readable labels', () => {
    const playerAnswers: Answer[] = [
      { questionId: 'q1', type: QuestionType.MultipleChoiceText, selectedOptionId: 'a' },
    ];
    const results = gradePlayerAnswers([mcTextQ], playerAnswers, [mcTextCorrect]);
    expect(results[0].playerAnswerLabel).toBe('Merlot');
    expect(results[0].correctAnswerLabel).toBe('Merlot');
  });
});
