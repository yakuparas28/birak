import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AppState, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Txt } from '@/components/txt';
import { useSettings } from '@/providers/settings-provider';

export function AppLockGate({ children }: { children: ReactNode }) {
  const { appLock, c } = useSettings();
  const [locked, setLocked] = useState(appLock);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (appLock && appState.current === 'background' && next === 'active') setLocked(true);
      appState.current = next;
    });
    return () => sub.remove();
  }, [appLock]);

  const unlock = () =>
    LocalAuthentication.authenticateAsync({ promptMessage: 'Kilidi aç', cancelLabel: 'Vazgeç' }).then((result) => {
      if (result.success) setLocked(false);
    });

  // Prompt right away whenever the app becomes locked.
  useEffect(() => {
    if (!locked || !appLock) return;
    LocalAuthentication.authenticateAsync({ promptMessage: 'Kilidi aç', cancelLabel: 'Vazgeç' }).then((result) => {
      if (result.success) setLocked(false);
    });
  }, [locked, appLock]);

  return (
    <View style={{ flex: 1 }}>
      {children}
      {locked && appLock ? (
        <View style={[StyleSheet.absoluteFill, styles.overlay, { backgroundColor: c.bg }]}>
          <Icon name="lock" size={40} color={c.brand} />
          <Txt variant="heading">Uygulama kilitli</Txt>
          <Txt muted style={{ textAlign: 'center' }}>
            Devam etmek için kimliğini doğrula.
          </Txt>
          <Button title="Kilidi aç" onPress={unlock} style={{ alignSelf: 'stretch', marginTop: 12 }} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
});
