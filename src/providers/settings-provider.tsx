import { useSQLiteContext } from 'expo-sqlite';
import { createContext, use, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { getSettingsMap, setSetting } from '@/db/repo';
import { useDbQuery } from '@/db/use-db-query';
import { palette, type Palette } from '@/theme/tokens';

export type ThemePreference = 'system' | 'light' | 'dark';

type Settings = {
  ready: boolean;
  theme: ThemePreference;
  notifications: boolean;
  reminderTime: string;
  appLock: boolean;
  isDark: boolean;
  c: Palette;
  set: (key: 'theme' | 'notifications' | 'reminderTime' | 'appLock', value: string) => Promise<void>;
};

const SettingsContext = createContext<Settings | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const map = useDbQuery(getSettingsMap);
  const scheme = useColorScheme();

  const theme = (map?.theme as ThemePreference | undefined) ?? 'system';
  const isDark = theme === 'dark' || (theme === 'system' && scheme === 'dark');

  const value: Settings = {
    ready: map !== undefined,
    theme,
    notifications: map?.notifications === '1',
    reminderTime: map?.reminderTime ?? '21:00',
    appLock: map?.appLock === '1',
    isDark,
    c: isDark ? palette.dark : palette.light,
    set: (key, v) => setSetting(db, key, v),
  };

  return <SettingsContext value={value}>{children}</SettingsContext>;
}

export function useSettings() {
  const ctx = use(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}

export function useColors() {
  return useSettings().c;
}
