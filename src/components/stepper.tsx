import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { Txt } from '@/components/txt';
import { useColors } from '@/providers/settings-provider';
import { fonts } from '@/theme/tokens';

type Props = { value: number; min: number; max: number; step?: number; onChange: (v: number) => void; label: string };

export function Stepper({ value, min, max, step = 1, onChange, label }: Props) {
  const c = useColors();
  const change = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    if (next !== value) {
      Haptics.selectionAsync();
      onChange(next);
    }
  };
  const btn = (text: string, delta: number, a11y: string) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${a11y}`}
      onPress={() => change(delta)}
      style={({ pressed }) => [styles.btn, { borderColor: c.line, backgroundColor: c.bg, opacity: pressed ? 0.6 : 1 }]}>
      <Txt variant="body" style={{ fontSize: 22, lineHeight: 26 }}>
        {text}
      </Txt>
    </Pressable>
  );
  return (
    <View style={styles.row} accessibilityLabel={`${label}: ${value}`}>
      {btn('−', -step, 'azalt')}
      <Txt variant="stat" style={{ minWidth: 44, textAlign: 'center', fontFamily: fonts.display, fontVariant: ['tabular-nums'] }}>
        {value}
      </Txt>
      {btn('+', step, 'artır')}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
