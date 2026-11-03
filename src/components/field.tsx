import { TextInput, View, type TextInputProps } from 'react-native';

import { Txt } from '@/components/txt';
import { useColors } from '@/providers/settings-provider';
import { fonts } from '@/theme/tokens';

type Props = TextInputProps & { label: string; background?: string };

export function Field({ label, background, multiline, style, ...rest }: Props) {
  const c = useColors();
  return (
    <View style={{ gap: 8 }}>
      <Txt variant="bodyStrong" nativeID={`label-${label}`}>
        {label}
      </Txt>
      <TextInput
        {...rest}
        accessibilityLabel={label}
        accessibilityLabelledBy={`label-${label}`}
        multiline={multiline}
        placeholderTextColor={c.muted}
        style={[
          {
            minHeight: multiline ? 92 : 48,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: c.line,
            backgroundColor: background ?? c.bg,
            color: c.ink,
            paddingHorizontal: 14,
            paddingVertical: multiline ? 12 : 0,
            fontFamily: multiline ? fonts.regular : fonts.semibold,
            fontSize: multiline ? 15 : 17,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          style,
        ]}
      />
    </View>
  );
}
