import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { BackButton } from '@/components/icon-button';
import { Screen } from '@/components/screen';
import { Txt } from '@/components/txt';
import { dayKey } from '@/db/repo';
import { useProgress } from '@/hooks/use-progress';
import { badgeDefs, remainingText } from '@/lib/badges';
import { useColors } from '@/providers/settings-provider';
import { fixed, fonts } from '@/theme/tokens';

const DAY_MS = 86_400_000;
const BAR_MAX = 80;

export default function BadgesScreen() {
  const c = useColors();
  const progress = useProgress(60_000);
  if (!progress) return null;

  const { stats, cravings, journal, cravingsOvercome, earned, now } = progress;
  const input = { stats, cravingsOvercome, journalCount: journal.length };

  const days = Array.from({ length: 7 }, (_, i) => {
    const time = now - (6 - i) * DAY_MS;
    const key = dayKey(time);
    const label = new Date(time).toLocaleDateString('tr-TR', { weekday: 'short' }).slice(0, 3);
    return { key, label, count: cravings.filter((x) => x.overcome && dayKey(x.createdAt) === key).length };
  });
  const thisWeek = days.reduce((sum, d) => sum + d.count, 0);
  const prevWeek = cravings.filter((x) => x.overcome && x.createdAt < now - 6 * DAY_MS && x.createdAt >= now - 13 * DAY_MS).length;
  const peak = Math.max(1, ...days.map((d) => d.count));

  const earnedDefs = badgeDefs.filter((d) => earned.some((e) => e.id === d.id));
  const nextDefs = badgeDefs.filter((d) => !earned.some((e) => e.id === d.id));

  const trend =
    thisWeek === 0 && prevWeek === 0
      ? 'Bu hafta kayıtlı kriz yok. SOS butonu her zaman burada.'
      : thisWeek < prevWeek
        ? `Krizler azalıyor. Geçen haftaya göre ${prevWeek - thisWeek} daha az.`
        : `Her atlattığın kriz seni güçlendiriyor.`;

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <BackButton />
        <Txt variant="title" style={{ fontSize: 30, flex: 1 }} accessibilityRole="header">
          Rozetler
        </Txt>
        <Txt variant="label" muted>
          {earnedDefs.length} / {badgeDefs.length}
        </Txt>
      </View>

      <Card style={{ gap: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Txt variant="bodyStrong">Bu hafta atlatılan kriz</Txt>
          <Txt style={{ fontFamily: fonts.display, fontSize: 24 }}>{thisWeek}</Txt>
        </View>
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel={`Son 7 günde atlatılan krizler: ${days.map((d) => `${d.label} ${d.count}`).join(', ')}`}
          style={styles.chart}>
          {days.map((d, i) => (
            <View key={d.key} style={styles.barCol}>
              <View
                style={{
                  width: '100%',
                  height: Math.max(6, (d.count / peak) * BAR_MAX),
                  borderRadius: 8,
                  backgroundColor: i === 6 ? fixed.accent : d.count === 0 ? c.track : '#A9CFBF',
                }}
              />
              <Txt variant="caption" muted style={{ fontSize: 11, fontFamily: fonts.semibold }}>
                {d.label}
              </Txt>
            </View>
          ))}
        </View>
        <Txt variant="caption" muted>
          {trend}
        </Txt>
      </Card>

      {earnedDefs.length > 0 ? (
        <>
          <Txt variant="bodyStrong" style={{ fontSize: 18, fontFamily: fonts.bold }}>
            Kazandıkların
          </Txt>
          <View style={styles.grid}>
            {earnedDefs.map((b) => (
              <Card key={b.id} style={styles.badge}>
                <View style={[styles.medal, { backgroundColor: b.color }]}>
                  <Txt color={fixed.chipInk} style={{ fontFamily: fonts.display, fontSize: 17 }}>
                    {b.mark}
                  </Txt>
                </View>
                <Txt variant="label" style={{ fontSize: 13, textAlign: 'center' }}>
                  {b.name}
                </Txt>
              </Card>
            ))}
          </View>
        </>
      ) : null}

      <Txt variant="bodyStrong" style={{ fontSize: 18, fontFamily: fonts.bold }}>
        Sıradakiler
      </Txt>
      <View style={styles.grid}>
        {nextDefs.map((b) => (
          <Card key={b.id} style={styles.badge}>
            <View style={[styles.medal, { borderWidth: 2, borderStyle: 'dashed', borderColor: c.line }]}>
              <Icon name="lock" size={20} color={c.muted} />
            </View>
            <Txt variant="label" style={{ fontSize: 13, textAlign: 'center' }}>
              {b.name}
            </Txt>
            <Txt variant="caption" muted style={{ fontSize: 11, textAlign: 'center' }}>
              {remainingText(b, input)}
            </Txt>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chart: { height: 104, flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  barCol: { flex: 1, alignItems: 'center', gap: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badge: { width: '31%', alignItems: 'center', gap: 8, paddingHorizontal: 8, paddingVertical: 14, borderRadius: 18 },
  medal: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
});
