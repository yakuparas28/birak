import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';

import { awardBadges } from '@/db/repo';
import { useProgress } from '@/hooks/use-progress';
import { qualifyingBadges } from '@/lib/badges';

/** Records newly earned badges with their date. Renders nothing. */
export function BadgeSync() {
  const db = useSQLiteContext();
  const progress = useProgress(60_000);

  const missing = progress
    ? qualifyingBadges({
        stats: progress.stats,
        cravingsOvercome: progress.cravingsOvercome,
        journalCount: progress.journal.length,
      }).filter((id) => !progress.earned.some((b) => b.id === id))
    : [];
  const key = missing.join(',');

  useEffect(() => {
    if (key) awardBadges(db, key.split(','));
  }, [db, key]);

  return null;
}
