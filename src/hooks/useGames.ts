import { useGamesContext } from '../context/GamesContext';

export function useGames() {
  return useGamesContext();
}
