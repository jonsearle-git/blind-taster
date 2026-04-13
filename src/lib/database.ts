import * as SQLite from 'expo-sqlite';
import { Questionnaire } from '../types/questionnaire';
import { SavedGame } from '../types/savedGame';

// Bump this whenever the schema changes — old DB is dropped and recreated.
const SCHEMA_VERSION = 2;

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('blind_taster.db');
    const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    if ((row?.user_version ?? 0) !== SCHEMA_VERSION) {
      await db.execAsync(`
        DROP TABLE IF EXISTS questionnaires;
        DROP TABLE IF EXISTS saved_games;
        CREATE TABLE questionnaires (
          id         TEXT PRIMARY KEY NOT NULL,
          name       TEXT NOT NULL,
          data       TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE TABLE saved_games (
          id               TEXT PRIMARY KEY NOT NULL,
          name             TEXT NOT NULL,
          questionnaire_id TEXT NOT NULL,
          data             TEXT NOT NULL,
          created_at       INTEGER NOT NULL,
          updated_at       INTEGER NOT NULL
        );
        PRAGMA user_version = ${SCHEMA_VERSION};
      `);
    }
  }
  return db;
}

// ── Questionnaires ─────────────────────────────────────────────────────────

export async function getAllQuestionnaires(): Promise<Questionnaire[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{ data: string }>(
    'SELECT data FROM questionnaires ORDER BY updated_at DESC'
  );
  return rows.map((row) => JSON.parse(row.data) as Questionnaire);
}

export async function getQuestionnaire(id: string): Promise<Questionnaire | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ data: string }>(
    'SELECT data FROM questionnaires WHERE id = ?', id
  );
  if (!row) return null;
  return JSON.parse(row.data) as Questionnaire;
}

export async function saveQuestionnaire(questionnaire: Questionnaire): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO questionnaires (id, name, data, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name       = excluded.name,
       data       = excluded.data,
       updated_at = excluded.updated_at`,
    questionnaire.id, questionnaire.name, JSON.stringify(questionnaire),
    questionnaire.createdAt, questionnaire.updatedAt
  );
}

export async function updateQuestionnaire(questionnaire: Questionnaire): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE questionnaires SET name = ?, data = ?, updated_at = ? WHERE id = ?`,
    questionnaire.name, JSON.stringify(questionnaire), questionnaire.updatedAt, questionnaire.id
  );
}

export async function deleteQuestionnaire(id: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM questionnaires WHERE id = ?', id);
}

// ── Saved Games ────────────────────────────────────────────────────────────

export async function getAllSavedGames(): Promise<SavedGame[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{ data: string }>(
    'SELECT data FROM saved_games ORDER BY updated_at DESC'
  );
  return rows.map((row) => JSON.parse(row.data) as SavedGame);
}

export async function saveSavedGame(game: SavedGame): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO saved_games (id, name, questionnaire_id, data, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name             = excluded.name,
       questionnaire_id = excluded.questionnaire_id,
       data             = excluded.data,
       updated_at       = excluded.updated_at`,
    game.id, game.name, game.questionnaireId,
    JSON.stringify(game), game.createdAt, game.updatedAt
  );
}

export async function deleteSavedGame(id: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM saved_games WHERE id = ?', id);
}
