import { addDatabaseChangeListener, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState } from 'react';

/**
 * Runs `query` against the app database and re-runs it whenever any table changes,
 * so screens stay in sync after writes made elsewhere in the app.
 */
export function useDbQuery<T>(query: (db: SQLiteDatabase) => Promise<T>, deps: unknown[] = []) {
  const db = useSQLiteContext();
  const [data, setData] = useState<T | undefined>(undefined);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const subscription = addDatabaseChangeListener(() => setVersion((v) => v + 1));
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    let active = true;
    query(db).then((result) => {
      if (active) setData(result);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, version, ...deps]);

  return data;
}
