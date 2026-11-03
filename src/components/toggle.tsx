import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { useColors } from '@/providers/settings-provider';
import { fixed } from '@/theme/tokens';

type Props = { value: boolean; onValueChange: (v: boolean) => void; label: string };

/** Design-matched switch; the native iOS 26 Switch misaligns in rows. */
export function Toggle({ value, onValueChange, label }: Props) {
  const c = useColors();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      hitSlop={8}
      onPress={() => {
        Haptics.selectionAsync();
        onValueChange(!value);
      }}
      style={[styles.track, { backgroundColor: value ? fixed.accent : c.line, alignItems: value ? 'flex-end' : 'flex-start' }]}>
      <View style={styles.thumb} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: 52, height: 32, borderRadius: 16, padding: 3, justifyContent: 'center' },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
  },
});
