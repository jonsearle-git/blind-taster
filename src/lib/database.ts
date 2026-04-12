import * as SQLite from 'expo-sqlite';
import { Questionnaire } from '../types/questionnaire';
import { runMigrations } from './migrations';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('blind_taster.db');
    await runMigrations(db);
  }
  return db;
}

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
    'SELECT data FROM questionnaires WHERE id = ?',
    id
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
    questionnaire.id,
    questionnaire.name,
    JSON.stringify(questionnaire),
    questionnaire.createdAt,
    questionnaire.updatedAt
  );
}

export async function updateQuestionnaire(questionnaire: Questionnaire): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE questionnaires SET name = ?, data = ?, updated_at = ? WHERE id = ?`,
    questionnaire.name,
    JSON.stringify(questionnaire),
    questionnaire.updatedAt,
    questionnaire.id
  );
}

export async function deleteQuestionnaire(id: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM questionnaires WHERE id = ?', id);
}
