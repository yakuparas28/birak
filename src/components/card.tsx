import { View, type ViewProps } from 'react-native';

import { useColors } from '@/providers/settings-provider';
import { radius } from '@/theme/tokens';

type Props = ViewProps & { padded?: boolean; tone?: 'surface' | 'soft' };

export function Card({ padded = true, tone = 'surface', style, ...rest }: Props) {
  const c = useColors();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: tone === 'soft' ? c.soft : c.surface,
          borderRadius: radius.lg,
          padding: padded ? 16 : 0,
          borderCurve: 'continuous',
        },
        style,
      ]}
    />
  );
}

export function Divider() {
  const c = useColors();
  return <View style={{ height: 1, marginHorizontal: 16, backgroundColor: c.line }} />;
}
