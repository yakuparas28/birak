import {
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
} from '@expo-google-fonts/figtree';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AppLockGate } from '@/components/app-lock-gate';
import { migrateDbIfNeeded } from '@/db/migrations';
import { getProfile } from '@/db/repo';
import { useDbQuery } from '@/db/use-db-query';
import '@/lib/reminders';
import { SettingsProvider, useSettings } from '@/providers/settings-provider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SQLiteProvider databaseName="app.db" onInit={migrateDbIfNeeded} options={{ enableChangeListener: true }}>
      <SettingsProvider>
        <RootNavigator />
      </SettingsProvider>
    </SQLiteProvider>
  );
}

function RootNavigator() {
  const settings = useSettings();
  const profile = useDbQuery(getProfile);
  const loading = profile === undefined || !settings.ready;
  const hasProfile = !!profile;

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync();
  }, [loading]);

  if (loading) return null;

  const base = settings.isDark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: { ...base.colors, background: settings.c.bg, card: settings.c.surface, text: settings.c.ink },
  };

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={settings.isDark ? 'light' : 'dark'} />
      <AppLockGate>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: settings.c.bg } }}>
          <Stack.Protected guard={hasProfile}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="sos" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
            <Stack.Screen name="journal" />
            <Stack.Screen name="relapse" options={{ presentation: 'modal' }} />
            <Stack.Screen name="badges" />
            <Stack.Screen name="edit-profile" />
            <Stack.Screen name="new-goal" options={{ presentation: 'modal' }} />
          </Stack.Protected>
          <Stack.Protected guard={!hasProfile}>
            <Stack.Screen name="onboarding" />
          </Stack.Protected>
        </Stack>
      </AppLockGate>
    </ThemeProvider>
  );
}
