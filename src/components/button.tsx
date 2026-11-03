import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Txt } from '@/components/txt';
import { useColors } from '@/providers/settings-provider';
import { fixed, fonts } from '@/theme/tokens';

type Variant = 'primary' | 'outline' | 'soft';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: 'lg' | 'md';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ title, onPress, variant = 'primary', size = 'lg', disabled, style }: Props) {
  const c = useColors();
  const height = size === 'lg' ? 56 : 48;
  const background = variant === 'primary' ? fixed.accent : variant === 'soft' ? c.soft : 'transparent';
  const color = variant === 'primary' ? fixed.onAccent : variant === 'soft' ? c.brand : c.ink;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        {
          height,
          borderRadius: height / 2,
          backgroundColor: background,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: c.line,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
        style,
      ]}>
      <Txt
        variant="bodyStrong"
        color={color}
        style={{ fontFamily: fonts.bold, fontSize: size === 'lg' ? 17 : 15 }}>
        {title}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
});
