import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Questionnaire } from '../types/questionnaire';
import {
  getAllQuestionnaires,
  saveQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
} from '../lib/database';

type QuestionnairesContextValue = {
  questionnaires: Questionnaire[];
  loading:        boolean;
  error:          string | null;
  reload:         () => Promise<void>;
  save:           (q: Questionnaire) => Promise<void>;
  update:         (q: Questionnaire) => Promise<void>;
  remove:         (id: string) => Promise<void>;
};

const QuestionnairesContext = createContext<QuestionnairesContextValue | null>(null);

type Props = { children: React.ReactNode };

export function QuestionnairesProvider({ children }: Props): React.ReactElement {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllQuestionnaires();
      setQuestionnaires(data);
    } catch (e) {
      setError('Failed to load questionnaires');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = useCallback(async (q: Questionnaire) => {
    await saveQuestionnaire(q);
    await reload();
  }, [reload]);

  const update = useCallback(async (q: Questionnaire) => {
    await updateQuestionnaire(q);
    await reload();
  }, [reload]);

  const remove = useCallback(async (id: string) => {
    await deleteQuestionnaire(id);
    await reload();
  }, [reload]);

  return (
    <QuestionnairesContext.Provider value={{ questionnaires, loading, error, reload, save, update, remove }}>
      {children}
    </QuestionnairesContext.Provider>
  );
}

export function useQuestionnairesContext(): QuestionnairesContextValue {
  const ctx = useContext(QuestionnairesContext);
  if (!ctx) throw new Error('useQuestionnairesContext must be used within QuestionnairesProvider');
  return ctx;
}
