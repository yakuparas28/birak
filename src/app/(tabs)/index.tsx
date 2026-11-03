import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { IconButton } from '@/components/icon-button';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { Txt } from '@/components/txt';
import { getTodayMood, setTodayMood } from '@/db/repo';
import { useDbQuery } from '@/db/use-db-query';
import { useProgress } from '@/hooks/use-progress';
import { moodOptions, reasonOptions } from '@/lib/addictions';
import { formatCount, formatDate, formatDays, formatMinutes, formatMoney, milestoneProgress, todayLabel } from '@/lib/stats';
import { useColors } from '@/providers/settings-provider';
import { fixed, fonts } from '@/theme/tokens';

const pad = (n: number) => String(n).padStart(2, '0');

export default function HomeScreen() {
  const c = useColors();
  const db = useSQLiteContext();
  const progress = useProgress();
  const mood = useDbQuery(getTodayMood);
  if (!progress) return null;

  const { profile, addiction, stats, cravingsOvercome, now } = progress;
  const next = milestoneProgress(profile, now).find((m) => m.progress < 1);
  const reasons = reasonOptions.filter((r) => profile.reasons.includes(r.id)).map((r) => r.label);

  const tiles = [
    { label: 'Tasarruf', value: formatMoney(stats.saved), show: stats.dailySaving > 0 },
    { label: addiction.avoidedLabel, value: formatCount(stats.avoided), show: true },
    { label: 'Kazanılan zaman', value: formatMinutes(stats.minutesGained), show: addiction.minutesPerUnit > 0 },
    { label: 'Atlatılan kriz', value: String(cravingsOvercome), show: true },
    { label: 'En uzun seri', value: formatDays(stats.longestStreakMs), show: true },
  ]
    .filter((t) => t.show)
    .slice(0, 4);

  return (
    <Screen tabBar>
      <View style={styles.header}>
        <View style={{ gap: 2, flex: 1 }}>
          <Txt variant="label" muted style={{ fontFamily: fonts.regular }}>
            {todayLabel(now)}
          </Txt>
          <Txt variant="heading" accessibilityRole="header">
            {profile.name ? `Merhaba, ${profile.name}` : 'Merhaba'}
          </Txt>
        </View>
        <IconButton icon="badge" label="Rozetler" onPress={() => router.push('/badges')} />
      </View>

      <View style={styles.hero} accessible accessibilityLabel={`${addiction.freeLabel}: ${stats.days} gün ${stats.hours} saat`}>
        <Svg width={220} height={220} viewBox="0 0 220 220" style={styles.rings}>
          {[40, 70, 100].map((r) => (
            <Circle key={r} cx={110} cy={110} r={r} fill="none" stroke="#FFFFFF" strokeOpacity={0.14} strokeWidth={1.5} />
          ))}
        </Svg>
        <Txt variant="label" color="#FFFFFF" style={{ opacity: 0.85 }}>
          {addiction.freeLabel}
        </Txt>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          <Txt variant="hero" color="#FFFFFF">
            {stats.days}
          </Txt>
          <Txt variant="heading" color="#FFFFFF">
            gün
          </Txt>
        </View>
        <Txt variant="bodyStrong" color="#FFFFFF" style={{ fontSize: 18, fontVariant: ['tabular-nums'] }}>
          {pad(stats.hours)} sa  {pad(stats.minutes)} dk  {pad(stats.seconds)} sn
        </Txt>
        <View style={styles.heroFooter}>
          <Txt variant="caption" color="#FFFFFF" style={{ opacity: 0.85 }}>
            Başlangıç: {formatDate(profile.quitAt)}
          </Txt>
          <View style={styles.goalPill}>
            <Txt variant="caption" color="#FFFFFF" style={{ fontFamily: fonts.bold }}>
              Hedef: {profile.goalDays} gün
            </Txt>
          </View>
        </View>
      </View>

      <View style={styles.grid}>
        {tiles.map((t) => (
          <Card key={t.label} style={styles.tile}>
            <Txt variant="caption" muted>
              {t.label}
            </Txt>
            <Txt variant="stat" numberOfLines={1} adjustsFontSizeToFit>
              {t.value}
            </Txt>
          </Card>
        ))}
      </View>

      {next ? (
                <Pressable accessibilityRole="link" onPress={() => router.push('/progress')}>
            <Card style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Txt variant="overline" color={c.brand}>
                    Sıradaki: {next.when}
                  </Txt>
                  <Txt variant="bodyStrong">{next.text}</Txt>
                </View>
                <Txt variant="stat" style={{ fontSize: 20 }}>
                  %{Math.floor(next.progress * 100)}
                </Txt>
              </View>
              <ProgressBar value={next.progress} label="Sıradaki iyileşme" />
            </Card>
          </Pressable>
      ) : null}

      <Card style={{ gap: 12 }}>
        <Txt variant="bodyStrong">Bugün nasıl hissediyorsun?</Txt>
        <View style={{ flexDirection: 'row' }}>
          {moodOptions.map((m, i) => {
            const selected = mood === i;
            return (
              <Pressable
                key={m.label}
                accessibilityRole="radio"
                accessibilityLabel={m.label}
                accessibilityState={{ checked: selected }}
                onPress={() => {
                  Haptics.selectionAsync();
                  setTodayMood(db, i);
                }}
                style={styles.mood}>
                <View style={styles.moodSlot}>
                  <View
                    style={[
                      styles.moodDot,
                      selected
                        ? { backgroundColor: fixed.accent, borderColor: c.soft, borderWidth: 4, width: 34, height: 34, borderRadius: 17 }
                        : { backgroundColor: m.tint, borderColor: c.line },
                    ]}
                  />
                </View>
                <Txt variant="caption" muted style={{ fontSize: 12, fontFamily: fonts.medium }}>
                  {m.label}
                </Txt>
              </Pressable>
            );
          })}
        </View>
                <Pressable accessibilityRole="link" onPress={() => router.push('/journal')} style={[styles.journalBtn, { backgroundColor: c.soft }]}>
            <Icon name="pen" size={18} color={c.brand} />
            <Txt variant="label" color={c.brand} style={{ fontFamily: fonts.bold, fontSize: 15 }}>
              Günlüğe yaz
            </Txt>
          </Pressable>
      </Card>

      {reasons.length > 0 || profile.note ? (
        <Card tone="soft" style={{ gap: 6 }}>
          <Txt variant="overline" color={c.brand}>
            Neden başladın
          </Txt>
          {profile.note ? <Txt variant="bodyStrong">“{profile.note}”</Txt> : null}
          {reasons.length > 0 ? (
            <Txt variant="caption" muted>
              {reasons.join(' · ')}
            </Txt>
          ) : null}
        </Card>
      ) : null}

            <Pressable accessibilityRole="link" onPress={() => router.push('/relapse')} style={styles.relapse}>
          <Txt variant="label" muted>
            Bir kayma mı yaşadın? Sorun değil.
          </Txt>
        </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hero: {
    borderRadius: 28,
    borderCurve: 'continuous',
    backgroundColor: fixed.accent,
    padding: 22,
    paddingBottom: 20,
    gap: 6,
    overflow: 'hidden',
  },
  rings: { position: 'absolute', right: -70, top: -60 },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.22)',
  },
  goalPill: { backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: { width: '47%', flexGrow: 1, gap: 4, paddingVertical: 14 },
  mood: { flex: 1, alignItems: 'center', gap: 6, minHeight: 56, justifyContent: 'flex-end' },
  moodSlot: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  moodDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 1 },
  journalBtn: { height: 44, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  relapse: { alignSelf: 'center', minHeight: 44, justifyContent: 'center' },
});
