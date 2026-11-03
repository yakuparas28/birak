import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Txt } from '@/components/txt';
import { useColors } from '@/providers/settings-provider';
import { fixed, fonts } from '@/theme/tokens';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  showCheck?: boolean;
  height?: number;
  stretch?: boolean;
  tone?: 'accent' | 'ink';
};

export function Chip({ label, selected, onPress, showCheck, height = 40, stretch, tone = 'accent' }: Props) {
  const c = useColors();
  const activeBg = tone === 'ink' ? c.ink : fixed.accent;
  const activeFg = tone === 'ink' ? c.bg : fixed.onAccent;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={[
        styles.base,
        {
          height,
          borderRadius: height / 2.6,
          backgroundColor: selected ? activeBg : c.surface,
          borderColor: selected ? activeBg : c.line,
          flexGrow: stretch ? 1 : 0,
          flexBasis: stretch ? 0 : 'auto',
          paddingHorizontal: stretch ? 8 : 16,
        },
      ]}>
      <View style={styles.row}>
        {selected && showCheck ? <Icon name="check" size={14} strokeWidth={3} color={activeFg} /> : null}
        <Txt
          numberOfLines={1}
          adjustsFontSizeToFit
          variant="label"
          color={selected ? activeFg : c.ink}
          style={{ fontFamily: selected ? fonts.bold : fonts.semibold, fontSize: 15 }}>
          {label}
        </Txt>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
