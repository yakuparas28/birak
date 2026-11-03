import type { SQLiteDatabase } from 'expo-sqlite';

const DATABASE_VERSION = 1;

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = result?.user_version ?? 0;
  if (currentVersion >= DATABASE_VERSION) return;

  if (currentVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        name TEXT NOT NULL DEFAULT '',
        addiction TEXT NOT NULL,
        per_day REAL NOT NULL,
        pack_size INTEGER NOT NULL DEFAULT 1,
        unit_price REAL NOT NULL DEFAULT 0,
        quit_at INTEGER NOT NULL,
        reasons TEXT NOT NULL DEFAULT '[]',
        note TEXT NOT NULL DEFAULT '',
        goal_days INTEGER NOT NULL DEFAULT 30,
        created_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS streaks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        started_at INTEGER NOT NULL,
        ended_at INTEGER
      );
      CREATE TABLE IF NOT EXISTS cravings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at INTEGER NOT NULL,
        intensity INTEGER NOT NULL,
        overcome INTEGER NOT NULL DEFAULT 1
      );
      CREATE TABLE IF NOT EXISTS journal_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at INTEGER NOT NULL,
        mood INTEGER,
        note TEXT NOT NULL DEFAULT '',
        triggers TEXT NOT NULL DEFAULT '[]'
      );
      CREATE TABLE IF NOT EXISTS relapses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at INTEGER NOT NULL,
        triggers TEXT NOT NULL DEFAULT '[]',
        reset INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS moods (
        day TEXT PRIMARY KEY NOT NULL,
        mood INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS badges (
        id TEXT PRIMARY KEY NOT NULL,
        earned_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS savings_goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
