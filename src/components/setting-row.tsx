import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Toggle } from '@/components/toggle';
import { Txt } from '@/components/txt';
import { useColors } from '@/providers/settings-provider';
import { fixed, fonts } from '@/theme/tokens';

type Props = {
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  toggle?: { value: boolean; onChange: (v: boolean) => void };
};

export function SettingRow({ label, value, onPress, destructive, toggle }: Props) {
  const c = useColors();
  const color = destructive ? fixed.sos : c.ink;

  const body = (
    <View style={styles.row}>
      <Txt
        variant="body"
        color={color}
        style={[{ flex: 1, fontSize: 15 }, destructive && { fontFamily: fonts.semibold }]}>
        {label}
      </Txt>
      {value ? (
        <Txt variant="body" muted style={{ fontSize: 15 }}>
          {value}
        </Txt>
      ) : null}
      {toggle ? (
        <Toggle label={label} value={toggle.value} onValueChange={toggle.onChange} />
      ) : null}
      {onPress && !toggle ? <Icon name="chevron" size={16} strokeWidth={2} color={destructive ? color : c.muted} /> : null}
    </View>
  );

  if (!onPress || toggle) return body;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 54, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
});
