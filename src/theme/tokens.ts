export const palette = {
  light: {
    bg: '#F2F4F1',
    surface: '#FFFFFF',
    ink: '#14211C',
    muted: '#55635D',
    line: '#DDE3DE',
    track: '#E4EAE6',
    soft: '#DDEDE6',
    brand: '#1E6B55',
    nav: '#FFFFFF',
  },
  dark: {
    bg: '#0F1714',
    surface: '#1A2420',
    ink: '#EEF2EF',
    muted: '#A3B1AA',
    line: '#2A3631',
    track: '#2A3631',
    soft: '#1F3A30',
    brand: '#7CC8AB',
    nav: '#141D19',
  },
} as const;

export type Palette = { [K in keyof typeof palette.light]: string };

export const fixed = {
  accent: '#1E6B55',
  onAccent: '#FFFFFF',
  sos: '#C2452D',
  amber: '#E3A13B',
  crisisBg: '#12201B',
  crisisInk: '#F2F4F1',
  crisisMuted: '#B7C4BE',
  crisisMint: '#9FD8C2',
  crisisCoral: '#F2A493',
  chipInk: '#14211C',
} as const;

export const fonts = {
  display: 'BricolageGrotesque_800ExtraBold',
  displayBold: 'BricolageGrotesque_700Bold',
  regular: 'Figtree_400Regular',
  medium: 'Figtree_500Medium',
  semibold: 'Figtree_600SemiBold',
  bold: 'Figtree_700Bold',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;

export const radius = { sm: 14, md: 18, lg: 20, xl: 22, xxl: 28, pill: 999 } as const;
