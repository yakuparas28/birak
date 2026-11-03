import { Text, type TextProps, type TextStyle } from 'react-native';

import { useColors } from '@/providers/settings-provider';
import { fonts } from '@/theme/tokens';

type Variant = 'hero' | 'title' | 'heading' | 'stat' | 'body' | 'bodyStrong' | 'label' | 'caption' | 'overline';

const variants: Record<Variant, TextStyle> = {
  hero: { fontFamily: fonts.display, fontSize: 76, lineHeight: 80, letterSpacing: -3 },
  title: { fontFamily: fonts.display, fontSize: 32, lineHeight: 36, letterSpacing: -1 },
  heading: { fontFamily: fonts.displayBold, fontSize: 26, lineHeight: 32, letterSpacing: -0.5 },
  stat: { fontFamily: fonts.displayBold, fontSize: 26, lineHeight: 32 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 23 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22 },
  label: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 19 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  overline: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16, letterSpacing: 0.6, textTransform: 'uppercase' },
};

type Props = TextProps & { variant?: Variant; color?: string; muted?: boolean };

export function Txt({ variant = 'body', color, muted, style, ...rest }: Props) {
  const c = useColors();
  return <Text {...rest} style={[variants[variant], { color: color ?? (muted ? c.muted : c.ink) }, style]} />;
}
