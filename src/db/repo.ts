import type { SQLiteDatabase } from 'expo-sqlite';

import type { AddictionId } from '@/lib/addictions';

export type Profile = {
  name: string;
  addiction: AddictionId;
  perDay: number;
  packSize: number;
  unitPrice: number;
  quitAt: number;
  reasons: string[];
  note: string;
  goalDays: number;
  createdAt: number;
};

export type Streak = { id: number; startedAt: number; endedAt: number | null };
export type Craving = { id: number; createdAt: number; intensity: number; overcome: boolean };
export type JournalEntry = {
  id: number;
  createdAt: number;
  mood: number | null;
  note: string;
  triggers: string[];
};
export type Relapse = { id: number; createdAt: number; triggers: string[]; reset: boolean };
export type EarnedBadge = { id: string; earnedAt: number };
export type SavingsGoal = { id: number; title: string; amount: number; createdAt: number };

type ProfileRow = {
  name: string;
  addiction: AddictionId;
  per_day: number;
  pack_size: number;
  unit_price: number;
  quit_at: number;
  reasons: string;
  note: string;
  goal_days: number;
  created_at: number;
};

const parseList = (value: string): string[] => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

export function dayKey(time: number) {
  const d = new Date(time);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Profile

export async function getProfile(db: SQLiteDatabase): Promise<Profile | null> {
  const row = await db.getFirstAsync<ProfileRow>('SELECT * FROM profile WHERE id = 1');
  if (!row) return null;
  return {
    name: row.name,
    addiction: row.addiction,
    perDay: row.per_day,
    packSize: row.pack_size,
    unitPrice: row.unit_price,
    quitAt: row.quit_at,
    reasons: parseList(row.reasons),
    note: row.note,
    goalDays: row.goal_days,
    createdAt: row.created_at,
  };
}

export async function createProfile(db: SQLiteDatabase, profile: Omit<Profile, 'createdAt'>) {
  const now = Date.now();
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT OR REPLACE INTO profile
        (id, name, addiction, per_day, pack_size, unit_price, quit_at, reasons, note, goal_days, created_at)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      profile.name,
      profile.addiction,
      profile.perDay,
      profile.packSize,
      profile.unitPrice,
      profile.quitAt,
      JSON.stringify(profile.reasons),
      profile.note,
      profile.goalDays,
      now
    );
    await db.runAsync('DELETE FROM streaks WHERE 1');
    await db.runAsync('INSERT INTO streaks (started_at, ended_at) VALUES (?, NULL)', profile.quitAt);
  });
}

export async function updateProfile(
  db: SQLiteDatabase,
  patch: Partial<Pick<Profile, 'name' | 'addiction' | 'perDay' | 'packSize' | 'unitPrice' | 'quitAt' | 'goalDays'>>
) {
  const columns: Record<string, string> = {
    name: 'name',
    addiction: 'addiction',
    perDay: 'per_day',
    packSize: 'pack_size',
    unitPrice: 'unit_price',
    quitAt: 'quit_at',
    goalDays: 'goal_days',
  };
  const entries = Object.entries(patch).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return;
  const sets = entries.map(([k]) => `${columns[k]} = ?`).join(', ');
  const values = entries.map(([, v]) => v as string | number);
  await db.withTransactionAsync(async () => {
    await db.runAsync(`UPDATE profile SET ${sets} WHERE id = 1`, ...values);
    if (patch.quitAt !== undefined) {
      await db.runAsync('UPDATE streaks SET started_at = ? WHERE ended_at IS NULL', patch.quitAt);
    }
  });
}

// Streaks

export async function getStreaks(db: SQLiteDatabase): Promise<Streak[]> {
  const rows = await db.getAllAsync<{ id: number; started_at: number; ended_at: number | null }>(
    'SELECT * FROM streaks ORDER BY started_at DESC'
  );
  return rows.map((r) => ({ id: r.id, startedAt: r.started_at, endedAt: r.ended_at }));
}

// Cravings

export async function addCraving(db: SQLiteDatabase, intensity: number) {
  await db.runAsync(
    'INSERT INTO cravings (created_at, intensity, overcome) VALUES (?, ?, 1)',
    Date.now(),
    intensity
  );
}

export async function getCravings(db: SQLiteDatabase, since = 0): Promise<Craving[]> {
  const rows = await db.getAllAsync<{ id: number; created_at: number; intensity: number; overcome: number }>(
    'SELECT * FROM cravings WHERE created_at >= ? ORDER BY created_at DESC',
    since
  );
  return rows.map((r) => ({
    id: r.id,
    createdAt: r.created_at,
    intensity: r.intensity,
    overcome: r.overcome === 1,
  }));
}

// Journal

export async function addJournalEntry(
  db: SQLiteDatabase,
  entry: { mood: number | null; note: string; triggers: string[] }
) {
  await db.runAsync(
    'INSERT INTO journal_entries (created_at, mood, note, triggers) VALUES (?, ?, ?, ?)',
    Date.now(),
    entry.mood,
    entry.note,
    JSON.stringify(entry.triggers)
  );
}

export async function getJournalEntries(db: SQLiteDatabase): Promise<JournalEntry[]> {
  const rows = await db.getAllAsync<{
    id: number;
    created_at: number;
    mood: number | null;
    note: string;
    triggers: string;
  }>('SELECT * FROM journal_entries ORDER BY created_at DESC');
  return rows.map((r) => ({
    id: r.id,
    createdAt: r.created_at,
    mood: r.mood,
    note: r.note,
    triggers: parseList(r.triggers),
  }));
}

export async function deleteJournalEntry(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM journal_entries WHERE id = ?', id);
}

// Moods

export async function setTodayMood(db: SQLiteDatabase, mood: number) {
  await db.runAsync(
    'INSERT INTO moods (day, mood) VALUES (?, ?) ON CONFLICT(day) DO UPDATE SET mood = excluded.mood',
    dayKey(Date.now()),
    mood
  );
}

export async function getTodayMood(db: SQLiteDatabase): Promise<number | null> {
  const row = await db.getFirstAsync<{ mood: number }>('SELECT mood FROM moods WHERE day = ?', dayKey(Date.now()));
  return row?.mood ?? null;
}

// Relapses

export async function addRelapse(db: SQLiteDatabase, triggers: string[], reset: boolean) {
  const now = Date.now();
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'INSERT INTO relapses (created_at, triggers, reset) VALUES (?, ?, ?)',
      now,
      JSON.stringify(triggers),
      reset ? 1 : 0
    );
    if (reset) {
      await db.runAsync('UPDATE streaks SET ended_at = ? WHERE ended_at IS NULL', now);
      await db.runAsync('INSERT INTO streaks (started_at, ended_at) VALUES (?, NULL)', now);
      await db.runAsync('UPDATE profile SET quit_at = ? WHERE id = 1', now);
    }
  });
}

export async function getRelapses(db: SQLiteDatabase): Promise<Relapse[]> {
  const rows = await db.getAllAsync<{ id: number; created_at: number; triggers: string; reset: number }>(
    'SELECT * FROM relapses ORDER BY created_at DESC'
  );
  return rows.map((r) => ({
    id: r.id,
    createdAt: r.created_at,
    triggers: parseList(r.triggers),
    reset: r.reset === 1,
  }));
}

// Badges

export async function getEarnedBadges(db: SQLiteDatabase): Promise<EarnedBadge[]> {
  const rows = await db.getAllAsync<{ id: string; earned_at: number }>('SELECT * FROM badges ORDER BY earned_at');
  return rows.map((r) => ({ id: r.id, earnedAt: r.earned_at }));
}

export async function awardBadges(db: SQLiteDatabase, ids: string[]) {
  if (ids.length === 0) return;
  const now = Date.now();
  await db.withTransactionAsync(async () => {
    for (const id of ids) {
      await db.runAsync('INSERT OR IGNORE INTO badges (id, earned_at) VALUES (?, ?)', id, now);
    }
  });
}

// Savings goals

export async function getGoals(db: SQLiteDatabase): Promise<SavingsGoal[]> {
  const rows = await db.getAllAsync<{ id: number; title: string; amount: number; created_at: number }>(
    'SELECT * FROM savings_goals ORDER BY amount'
  );
  return rows.map((r) => ({ id: r.id, title: r.title, amount: r.amount, createdAt: r.created_at }));
}

export async function addGoal(db: SQLiteDatabase, title: string, amount: number) {
  await db.runAsync(
    'INSERT INTO savings_goals (title, amount, created_at) VALUES (?, ?, ?)',
    title,
    amount,
    Date.now()
  );
}

export async function deleteGoal(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM savings_goals WHERE id = ?', id);
}

// Settings

export async function getSettingsMap(db: SQLiteDatabase): Promise<Record<string, string>> {
  const rows = await db.getAllAsync<{ key: string; value: string }>('SELECT * FROM settings');
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function setSetting(db: SQLiteDatabase, key: string, value: string) {
  await db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    key,
    value
  );
}

// Export / wipe

const TABLES = [
  'profile',
  'streaks',
  'cravings',
  'journal_entries',
  'relapses',
  'moods',
  'badges',
  'savings_goals',
  'settings',
] as const;

export async function exportAll(db: SQLiteDatabase) {
  const data: Record<string, unknown[]> = {};
  for (const table of TABLES) {
    data[table] = await db.getAllAsync(`SELECT * FROM ${table}`);
  }
  return { exportedAt: new Date().toISOString(), version: 1, data };
}

export async function wipeAll(db: SQLiteDatabase) {
  await db.withTransactionAsync(async () => {
    for (const table of TABLES) {
      // `WHERE 1` disables SQLite's truncate optimization, which would skip change events.
      await db.runAsync(`DELETE FROM ${table} WHERE 1`);
    }
  });
}
