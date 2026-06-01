import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Questionnaire } from '../types/questionnaire';
import { getAllQuestionnaires } from '../lib/database';

type QuestionnairesContextValue = {
  questionnaires: Questionnaire[];
  loading:        boolean;
  error:          string | null;
  reload:         () => Promise<void>;
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
    } catch {
      setError('Failed to load questionnaires');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return (
    <QuestionnairesContext.Provider value={{ questionnaires, loading, error, reload }}>
      {children}
    </QuestionnairesContext.Provider>
  );
}

export function useQuestionnairesContext(): QuestionnairesContextValue {
  const ctx = useContext(QuestionnairesContext);
  if (!ctx) throw new Error('useQuestionnairesContext must be used within QuestionnairesProvider');
  return ctx;
}
