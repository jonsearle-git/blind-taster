import { useQuestionnairesContext } from '../context/QuestionnairesContext';
import { Questionnaire } from '../types/questionnaire';

export function useQuestionnaires() {
  return useQuestionnairesContext();
}
