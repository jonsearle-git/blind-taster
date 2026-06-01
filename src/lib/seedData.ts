import { clearQuestionnaires, saveQuestionnaire } from './database';
import { WHITE_WINE } from './seed/whiteWine';
import { RED_WINE } from './seed/redWine';
import { ROSE } from './seed/roseWine';
import { ORANGE } from './seed/orangeWine';
import { SPARKLING } from './seed/sparklingWine';
import { FORTIFIED } from './seed/fortifiedWine';
import { CIDER } from './seed/cider';
import { BEER } from './seed/beer';
import { GIN } from './seed/gin';
import { WHISKY } from './seed/whisky';

const ALL_QUESTIONNAIRES = [
  WHITE_WINE,
  RED_WINE,
  ROSE,
  ORANGE,
  SPARKLING,
  FORTIFIED,
  CIDER,
  BEER,
  GIN,
  WHISKY,
];

export async function seedDatabase(): Promise<void> {
  await clearQuestionnaires();
  for (const q of ALL_QUESTIONNAIRES) await saveQuestionnaire(q);
}

export const seedIfNeeded = seedDatabase;
