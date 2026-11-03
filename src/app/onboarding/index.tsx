import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { StepHeader } from '@/components/step-header';
import { Txt } from '@/components/txt';
import { useDraft } from '@/features/onboarding-draft';
import { addictionList, addictions, type AddictionId } from '@/lib/addictions';
import { useColors } from '@/providers/settings-provider';
import { fixed, fonts } from '@/theme/tokens';

export default function ChooseAddictionScreen() {
  const c = useColors();
  const { draft, update } = useDraft();

  const pick = (id: AddictionId) => {
    Haptics.selectionAsync();
    const a = addictions[id];
    update({ addiction: id, perDay: a.perDayDefault, price: String(a.priceDefault), packSize: a.usesPack ? 20 : 1 });
  };

  return (
    <Screen
      gap={24}
      footer={
        <>
          <View style={styles.privacy}>
            <Icon name="lock" size={16} color={c.muted} />
            <Txt variant="caption" muted>
              Verilerin yalnızca bu cihazda saklanır.
            </Txt>
          </View>
          <Button title="Devam et" onPress={() => router.push('/onboarding/habit')} />
        </>
      }>
      <StepHeader step={1} />
      <View style={{ gap: 10 }}>
        <Txt variant="title" accessibilityRole="header">
          Neyi geride bırakmak istiyorsun?
        </Txt>
        <Txt muted>Her yolculuk tek bir kararla başlar. Seçimini daha sonra değiştirebilirsin.</Txt>
      </View>

      <View style={styles.grid}>
        {addictionList.map((a) => {
          const selected = draft.addiction === a.id;
          return (
            <Pressable
              key={a.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => pick(a.id)}
              style={[
                styles.card,
                {
                  backgroundColor: c.surface,
                  borderColor: selected ? fixed.accent : c.line,
                  borderWidth: selected ? 2 : 1,
                  padding: selected ? 15 : 16,
                },
              ]}>
              <View style={[styles.mark, { backgroundColor: a.chip }]}>
                <Txt color={fixed.chipInk} style={{ fontFamily: fonts.display, fontSize: 17 }}>
                  {a.mark}
                </Txt>
              </View>
              <Txt variant="bodyStrong">{a.label}</Txt>
              {selected ? (
                <View style={styles.check}>
                  <Icon name="check" size={14} strokeWidth={3} color="#FFFFFF" />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47.5%',
    flexGrow: 1,
    height: 112,
    borderRadius: 22,
    borderCurve: 'continuous',
    padding: 16,
    justifyContent: 'space-between',
  },
  mark: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  check: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: fixed.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacy: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
});
