import { Question } from '../types/questionnaire';

export const questionEditorCallback = { current: null as ((q: Question) => void) | null };
