import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { Txt } from '@/components/txt';
import { addCraving, getProfile } from '@/db/repo';
import { useDbQuery } from '@/db/use-db-query';
import { reasonOptions } from '@/lib/addictions';
import { fixed, fonts } from '@/theme/tokens';

const PHASES = [
  { label: 'Nefes al', scale: 1.08 },
  { label: 'Tut', scale: 1.08 },
  { label: 'Nefes ver', scale: 0.72 },
];
const PHASE_SECONDS = 4;

const tips: { id: string; icon: IconName; label: string }[] = [
  { id: 'water', icon: 'drop', label: 'Bir bardak su iç' },
  { id: 'walk', icon: 'walk', label: '10 dakika yürüyüşe çık' },
];

export default function SosScreen() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const profile = useDbQuery(getProfile);
  const [running, setRunning] = useState(true);
  const [tick, setTick] = useState(0);
  const [level, setLevel] = useState(3);
  const [done, setDone] = useState<string[]>([]);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const phaseIndex = Math.floor(tick / PHASE_SECONDS) % PHASES.length;
  const phase = PHASES[phaseIndex];
  const count = PHASE_SECONDS - (tick % PHASE_SECONDS);

  useEffect(() => {
    scale.value = withTiming(running ? phase.scale : 0.85, {
      duration: PHASE_SECONDS * 1000,
      easing: Easing.inOut(Easing.ease),
    });
    if (running) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [phaseIndex, running, phase.scale, scale]);

  const circleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const reason = reasonOptions.find((r) => profile?.reasons.includes(r.id));

  const finish = async () => {
    await addCraving(db, level);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kapat"
            onPress={() => router.back()}
            style={styles.close}>
            <Icon name="close" size={20} strokeWidth={2} color={fixed.crisisInk} />
          </Pressable>
          <Txt variant="overline" color={fixed.crisisCoral} style={{ fontSize: 13 }}>
            Kriz anı
          </Txt>
          <View style={{ width: 44 }} />
        </View>

        <View style={{ gap: 8 }}>
          <Txt variant="title" color={fixed.crisisInk} accessibilityRole="header">
            Bu his geçecek.
          </Txt>
          <Txt color={fixed.crisisMuted}>
            İstek dalga gibidir; yükselir ve birkaç dakikada zayıflar. Birlikte nefes alalım.
          </Txt>
          {reason ? (
            <Txt variant="label" color={fixed.crisisMint}>
              Unutma: {reason.label}
              {profile?.note ? ` · “${profile.note}”` : ''}
            </Txt>
          ) : null}
        </View>

        <View style={styles.breathArea}>
          <View style={styles.ring} />
          <Animated.View style={[styles.outer, circleStyle]}>
            <View style={styles.inner} />
          </Animated.View>
          <View style={styles.breathLabel} accessibilityLiveRegion="polite">
            <Txt color={fixed.crisisBg} style={{ fontFamily: fonts.display, fontSize: 22 }}>
              {running ? phase.label : 'Hazır'}
            </Txt>
            <Txt variant="label" color={fixed.crisisBg} style={{ fontSize: 15 }}>
              {running ? String(count) : 'Başlamak için dokun'}
            </Txt>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setRunning((r) => !r);
            setTick(0);
          }}
          style={styles.toggle}>
          <Txt variant="label" color={fixed.crisisInk} style={{ fontSize: 15 }}>
            {running ? 'Duraklat' : 'Nefes egzersizini başlat'}
          </Txt>
        </Pressable>

        <View style={{ gap: 10 }}>
          <Txt variant="label" color={fixed.crisisMuted}>
            İsteğin ne kadar güçlü?
          </Txt>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[1, 2, 3, 4, 5].map((n) => {
              const selected = level === n;
              return (
                <Pressable
                  key={n}
                  accessibilityRole="radio"
                  accessibilityLabel={`Güç ${n}`}
                  accessibilityState={{ checked: selected }}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setLevel(n);
                  }}
                  style={[styles.level, { backgroundColor: selected ? fixed.crisisCoral : 'rgba(255,255,255,0.08)' }]}>
                  <Txt
                    color={selected ? fixed.crisisBg : fixed.crisisInk}
                    style={{ fontFamily: selected ? fonts.display : fonts.semibold, fontSize: 16 }}>
                    {n}
                  </Txt>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.list}>
          {tips.map((t) => {
            const checked = done.includes(t.id);
            return (
              <Pressable
                key={t.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                onPress={() => setDone((d) => (checked ? d.filter((x) => x !== t.id) : [...d, t.id]))}
                style={styles.row}>
                <Icon name={checked ? 'check' : t.icon} size={20} color={fixed.crisisMint} />
                <Txt color={fixed.crisisInk} style={{ flex: 1, fontSize: 15, opacity: checked ? 0.6 : 1 }}>
                  {t.label}
                </Txt>
              </Pressable>
            );
          })}
          <Pressable
            accessibilityRole="link"
            onPress={() => {
              router.back();
              router.navigate('/community');
            }}
            style={styles.row}>
            <Icon name="phone" size={20} color={fixed.crisisMint} />
            <Txt color={fixed.crisisInk} style={{ flex: 1, fontSize: 15 }}>
              Destek kişini ya da danışma hattını ara
            </Txt>
            <Icon name="chevron" size={16} strokeWidth={2} color="#6F7F78" />
          </Pressable>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 16, paddingTop: 8 }}>
        <Pressable accessibilityRole="button" onPress={finish} style={styles.cta}>
          <Txt color={fixed.crisisBg} style={{ fontFamily: fonts.display, fontSize: 17 }}>
            Krizi atlattım
          </Txt>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: fixed.crisisBg },
  content: { paddingHorizontal: 20, gap: 18, paddingBottom: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  close: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathArea: { height: 236, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 228,
    height: 228,
    borderRadius: 114,
    borderWidth: 1,
    borderColor: 'rgba(159,216,194,0.18)',
  },
  outer: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(159,216,194,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: { width: 150, height: 150, borderRadius: 75, backgroundColor: fixed.crisisMint },
  breathLabel: { position: 'absolute', alignItems: 'center', gap: 2 },
  toggle: {
    alignSelf: 'center',
    height: 44,
    paddingHorizontal: 22,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
  },
  level: { flex: 1, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  list: { borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' },
  row: { minHeight: 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  cta: { height: 56, borderRadius: 28, backgroundColor: fixed.crisisMint, alignItems: 'center', justifyContent: 'center' },
});
