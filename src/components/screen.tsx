import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColors } from '@/providers/settings-provider';

type Props = {
  children: ReactNode;
  /** Pinned below the scroll content, e.g. a primary button. */
  footer?: ReactNode;
  /** Extra bottom space for screens that sit above the tab bar. */
  tabBar?: boolean;
  /** Presented as an iOS page sheet, which already sits below the status bar. */
  modal?: boolean;
  scroll?: boolean;
  gap?: number;
  background?: string;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({ children, footer, tabBar, modal, scroll = true, gap = 16, background, contentStyle }: Props) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const topPadding = modal && Platform.OS === 'ios' ? 20 : insets.top + 12;
  const content = [
    { paddingTop: topPadding, paddingHorizontal: 20, paddingBottom: footer ? 16 : tabBar ? 24 : insets.bottom + 24, gap },
    contentStyle,
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: background ?? c.bg }}>
      {scroll ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={content}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="never">
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, content]}>{children}</View>
      )}
      {footer ? (
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: insets.bottom + 16, gap: 10 }}>{footer}</View>
      ) : null}
    </KeyboardAvoidingView>
  );
}
