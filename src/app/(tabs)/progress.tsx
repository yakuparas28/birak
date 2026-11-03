import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { Txt } from '@/components/txt';
import { deleteGoal, getGoals } from '@/db/repo';
import { useDbQuery } from '@/db/use-db-query';
import { useProgress } from '@/hooks/use-progress';
import { formatMoney, milestoneProgress } from '@/lib/stats';
import { useColors } from '@/providers/settings-provider';
import { fixed, fonts } from '@/theme/tokens';

export default function ProgressScreen() {
  const c = useColors();
  const db = useSQLiteContext();
  const progress = useProgress(30_000);
  const goals = useDbQuery(getGoals) ?? [];
  const [tab, setTab] = useState<'health' | 'money'>('health');
  if (!progress) return null;

  const { profile, addiction, stats, earned, now } = progress;
  const steps = milestoneProgress(profile, now);

  const removeGoal = (id: number, title: string) =>
    Alert.alert(`“${title}” silinsin mi?`, undefined, [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => deleteGoal(db, id) },
    ]);

  return (
    <Screen tabBar>
      <View style={styles.header}>
        <Txt variant="title" style={{ fontSize: 30 }} accessibilityRole="header">
          İlerleme
        </Txt>
                <Pressable accessibilityRole="link" onPress={() => router.push('/badges')} style={[styles.badgeBtn, { backgroundColor: c.surface, borderColor: c.line }]}>
            <Icon name="badge" size={18} color={c.ink} />
            <Txt variant="label" style={{ fontFamily: fonts.bold }}>
              Rozetler · {earned.length}
            </Txt>
          </Pressable>
      </View>

      <View accessibilityRole="tablist" style={[styles.segment, { backgroundColor: c.track }]}>
        {(['health', 'money'] as const).map((id) => {
          const selected = tab === id;
          return (
            <Pressable
              key={id}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => {
                Haptics.selectionAsync();
                setTab(id);
              }}
              style={[styles.segmentItem, { backgroundColor: selected ? c.surface : 'transparent' }]}>
              <Txt variant="label" style={{ fontFamily: fonts.bold }}>
                {id === 'health' ? (addiction.milestoneSource ? 'Sağlık' : 'Kilometre taşları') : 'Tasarruf'}
              </Txt>
            </Pressable>
          );
        })}
      </View>

      {tab === 'health' ? (
        <View style={{ gap: 10 }}>
          {steps.map((s) => {
            const done = s.progress >= 1;
            const pct = `${Math.floor(s.progress * 100)}%`;
            return (
              <Card key={s.when} style={styles.step}>
                {done ? (
                  <View style={[styles.stepIcon, { backgroundColor: fixed.accent }]}>
                    <Icon name="check" size={16} strokeWidth={3} color="#FFFFFF" />
                  </View>
                ) : (
                  <View style={[styles.stepIcon, { borderWidth: 2, borderColor: c.line }]}>
                    <Txt variant="caption" muted style={{ fontSize: 11, fontFamily: fonts.bold }}>
                      {pct}
                    </Txt>
                  </View>
                )}
                <View style={{ flex: 1, gap: 4 }}>
                  <Txt variant="overline" color={c.brand}>
                    {s.when}
                  </Txt>
                  <Txt variant="bodyStrong" style={{ fontSize: 15 }}>
                    {s.text}
                  </Txt>
                  {!done ? (
                    <View style={{ marginTop: 6 }}>
                      <ProgressBar value={s.progress} height={6} label={s.when} />
                    </View>
                  ) : null}
                </View>
              </Card>
            );
          })}
          {addiction.milestoneSource ? (
            <Txt variant="caption" muted style={{ textAlign: 'center', fontSize: 12 }}>
              {addiction.milestoneSource}
            </Txt>
          ) : null}
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          <View style={styles.savedHero}>
            <Txt variant="label" color="#FFFFFF" style={{ opacity: 0.85 }}>
              Şimdiye kadar biriktirdin
            </Txt>
            <Txt color="#FFFFFF" style={{ fontFamily: fonts.display, fontSize: 48, lineHeight: 54, letterSpacing: -1.5 }}>
              {formatMoney(stats.saved)}
            </Txt>
            <Txt variant="caption" color="#FFFFFF" style={{ opacity: 0.85 }}>
              Günde ortalama {formatMoney(stats.dailySaving)}
            </Txt>
          </View>

          {goals.map((g) => {
            const ratio = g.amount > 0 ? stats.saved / g.amount : 0;
            const daysLeft = stats.dailySaving > 0 ? Math.ceil((g.amount - stats.saved) / stats.dailySaving) : null;
            return (
              <Pressable key={g.id} onLongPress={() => removeGoal(g.id, g.title)} accessibilityHint="Silmek için basılı tut">
                <Card style={{ gap: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <Txt variant="bodyStrong" style={{ flex: 1 }}>
                      {g.title}
                    </Txt>
                    <Txt variant="label" style={{ fontFamily: fonts.bold }}>
                      {formatMoney(Math.min(stats.saved, g.amount))} / {formatMoney(g.amount)}
                    </Txt>
                  </View>
                  <ProgressBar value={ratio} color={fixed.amber} label={g.title} />
                  <Txt variant="caption" muted>
                    {ratio >= 1
                      ? 'Hedefe ulaştın. Kendini ödüllendir!'
                      : daysLeft !== null
                        ? `Bu hızla yaklaşık ${daysLeft} gün sonra hedefine ulaşırsın.`
                        : 'Tasarruf hesabı için fiyat bilgisini profilden ekleyebilirsin.'}
                  </Txt>
                </Card>
              </Pressable>
            );
          })}

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              ['1 ay', 30],
              ['6 ay', 182],
              ['1 yıl', 365],
            ].map(([label, days]) => (
              <Card key={label} style={{ flex: 1, gap: 2, padding: 12, borderRadius: 16 }}>
                <Txt variant="caption" muted style={{ fontSize: 12 }}>
                  {label}
                </Txt>
                <Txt variant="bodyStrong" style={{ fontSize: 17, fontFamily: fonts.bold }} numberOfLines={1} adjustsFontSizeToFit>
                  {formatMoney(stats.dailySaving * Number(days))}
                </Txt>
              </Card>
            ))}
          </View>
          <Button title="Yeni hedef ekle" variant="outline" size="md" onPress={() => router.push('/new-goal')} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badgeBtn: { height: 40, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  segment: { height: 44, borderRadius: 22, padding: 4, flexDirection: 'row', gap: 4 },
  segmentItem: { flex: 1, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  step: { flexDirection: 'row', gap: 14, alignItems: 'flex-start', borderRadius: 18 },
  stepIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  savedHero: { backgroundColor: fixed.accent, borderRadius: 24, borderCurve: 'continuous', padding: 20, gap: 4 },
});
