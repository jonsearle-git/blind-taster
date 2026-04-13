import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SavedGame } from '../types/savedGame';
import { getAllSavedGames, saveSavedGame, deleteSavedGame } from '../lib/database';

type GamesContextValue = {
  games:   SavedGame[];
  loading: boolean;
  error:   string | null;
  reload:  () => Promise<void>;
  save:    (g: SavedGame) => Promise<void>;
  remove:  (id: string)   => Promise<void>;
};

const GamesContext = createContext<GamesContextValue | null>(null);

type Props = { children: React.ReactNode };

export function GamesProvider({ children }: Props): React.ReactElement {
  const [games,   setGames]   = useState<SavedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setGames(await getAllSavedGames());
    } catch {
      setError('Failed to load games');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  const save   = useCallback(async (g: SavedGame) => { await saveSavedGame(g);  await reload(); }, [reload]);
  const remove = useCallback(async (id: string)   => { await deleteSavedGame(id); await reload(); }, [reload]);

  return (
    <GamesContext.Provider value={{ games, loading, error, reload, save, remove }}>
      {children}
    </GamesContext.Provider>
  );
}

export function useGamesContext(): GamesContextValue {
  const ctx = useContext(GamesContext);
  if (!ctx) throw new Error('useGamesContext must be used within GamesProvider');
  return ctx;
}
