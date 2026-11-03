import { Tabs } from 'expo-router/tabs';

import { BadgeSync } from '@/components/badge-sync';
import { TabBar } from '@/components/tab-bar';
import { useColors } from '@/providers/settings-provider';

export default function TabsLayout() {
  const c = useColors();
  return (
    <>
      <BadgeSync />
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: c.bg } }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="progress" />
        <Tabs.Screen name="community" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </>
  );
}
