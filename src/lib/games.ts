import type { SavedGame } from '../types/savedGame';

// True if any saved game references this questionnaire — used to gate edits.
export function questionnaireHasGames(questionnaireId: string, games: SavedGame[]): boolean {
  return games.some((g) => g.questionnaireId === questionnaireId);
}
