import type { SQLiteDatabase } from 'expo-sqlite';

import { getCravings, getEarnedBadges, getJournalEntries, getProfile, getStreaks } from '@/db/repo';
import { useDbQuery } from '@/db/use-db-query';
import { useNow } from '@/hooks/use-now';
import { addictions } from '@/lib/addictions';
import { computeStats } from '@/lib/stats';

async function loadProgress(db: SQLiteDatabase) {
  const [profile, streaks, cravings, journal, earned] = await Promise.all([
    getProfile(db),
    getStreaks(db),
    getCravings(db),
    getJournalEntries(db),
    getEarnedBadges(db),
  ]);
  return { profile, streaks, cravings, journal, earned };
}

/** Profile plus everything derived from it, ticking every `intervalMs`. */
export function useProgress(intervalMs = 1000) {
  const data = useDbQuery(loadProgress);
  const now = useNow(intervalMs);
  if (!data?.profile) return null;
  const { profile, streaks, cravings, journal, earned } = data;
  return {
    profile,
    addiction: addictions[profile.addiction],
    stats: computeStats(profile, streaks, now),
    cravings,
    cravingsOvercome: cravings.filter((x) => x.overcome).length,
    journal,
    earned,
    now,
  };
}
