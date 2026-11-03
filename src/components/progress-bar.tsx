import { View } from 'react-native';

import { useColors } from '@/providers/settings-provider';
import { fixed } from '@/theme/tokens';

type Props = { value: number; height?: number; color?: string; label?: string };

export function ProgressBar({ value, height = 8, color = fixed.accent, label }: Props) {
  const c = useColors();
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: pct }}
      style={{ height, borderRadius: height / 2, backgroundColor: c.track, overflow: 'hidden' }}>
      <View style={{ width: `${pct}%`, height, borderRadius: height / 2, backgroundColor: color }} />
    </View>
  );
}
