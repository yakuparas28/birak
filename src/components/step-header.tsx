import { router } from 'expo-router';
import { View } from 'react-native';

import { IconButton } from '@/components/icon-button';
import { Txt } from '@/components/txt';
import { useColors } from '@/providers/settings-provider';
import { fixed } from '@/theme/tokens';

export function StepHeader({ step, total = 3 }: { step: number; total?: number }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      {step > 1 ? (
        <IconButton icon="back" label="Geri" onPress={() => router.back()} />
      ) : (
        <View style={{ width: 44, height: 44 }} />
      )}
      <View
        style={{ flex: 1, flexDirection: 'row', gap: 6 }}
        accessibilityRole="progressbar"
        accessibilityLabel={`Adım ${step} / ${total}`}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i < step ? fixed.accent : c.line }}
          />
        ))}
      </View>
      <Txt variant="label" muted style={{ fontSize: 13 }}>
        {step}/{total}
      </Txt>
    </View>
  );
}
