import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import type { Tabs } from 'expo-router/tabs';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { Txt } from '@/components/txt';
import { useColors } from '@/providers/settings-provider';
import { fixed, fonts } from '@/theme/tokens';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const tabs: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Ana sayfa', icon: 'home' },
  progress: { label: 'İlerleme', icon: 'pulse' },
  community: { label: 'Topluluk', icon: 'people' },
  profile: { label: 'Profil', icon: 'user' },
};

export function TabBar({ state, navigation, insets }: TabBarProps) {
  const c = useColors();

  const item = (routeIndex: number) => {
    const route = state.routes[routeIndex];
    const meta = tabs[route.name];
    if (!meta) return null;
    const focused = state.index === routeIndex;
    const color = focused ? c.brand : c.muted;
    return (
      <Pressable
        key={route.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={meta.label}
        style={styles.item}
        onPress={() => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            Haptics.selectionAsync();
            navigation.navigate(route.name);
          }
        }}>
        <Icon name={meta.icon} size={24} color={color} />
        <Txt
          variant="caption"
          color={color}
          style={{ fontSize: 11, lineHeight: 14, fontFamily: focused ? fonts.bold : fonts.medium }}>
          {meta.label}
        </Txt>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.bar,
        { paddingBottom: Math.max(insets.bottom, 10), backgroundColor: c.nav, borderTopColor: c.line },
      ]}>
      {item(0)}
      {item(1)}
      <View style={styles.item}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kriz anı yardımı"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/sos');
          }}
          style={({ pressed }) => [styles.sos, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
          <Txt variant="label" color="#FFFFFF" style={{ fontFamily: fonts.display, fontSize: 16, letterSpacing: 0.5 }}>
            SOS
          </Txt>
        </Pressable>
      </View>
      {item(2)}
      {item(3)}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 8, paddingHorizontal: 8 },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, minHeight: 48 },
  sos: {
    width: 60,
    height: 60,
    marginTop: -30,
    borderRadius: 30,
    backgroundColor: fixed.sos,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 16px rgba(194,69,45,0.35)',
  },
});
