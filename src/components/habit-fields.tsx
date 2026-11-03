import { View } from 'react-native';

import { Card, Divider } from '@/components/card';
import { Chip } from '@/components/chip';
import { Field } from '@/components/field';
import { Stepper } from '@/components/stepper';
import { Txt } from '@/components/txt';
import type { QuitChoice } from '@/features/onboarding-draft';
import type { Addiction } from '@/lib/addictions';

export type HabitValues = {
  perDay: number;
  packSize: number;
  price: string;
  quitChoice: QuitChoice;
  customDaysAgo: number;
};

type Props = {
  addiction: Addiction;
  values: HabitValues;
  onChange: (patch: Partial<HabitValues>) => void;
  /** Editing an existing profile hides the quit-date question. */
  showQuitDate?: boolean;
};

const quitChoices: { id: QuitChoice; label: string }[] = [
  { id: 'today', label: 'Bugün' },
  { id: 'yesterday', label: 'Dün' },
  { id: 'custom', label: 'Daha önce' },
];

export function HabitFields({ addiction, values, onChange, showQuitDate = true }: Props) {
  return (
    <Card style={{ gap: 18 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="bodyStrong">{addiction.perDayQuestion}</Txt>
          <Txt variant="caption" muted>
            {addiction.perDayHint}
          </Txt>
        </View>
        <Stepper
          label={addiction.perDayQuestion}
          value={values.perDay}
          min={1}
          max={addiction.perDayMax}
          onChange={(perDay) => onChange({ perDay })}
        />
      </View>

      {addiction.usesPack ? (
        <>
          <Divider />
          <View style={{ gap: 10 }}>
            <Txt variant="bodyStrong">Bir pakette kaç adet var?</Txt>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {[10, 20, 25].map((n) => (
                <Chip
                  key={n}
                  label={String(n)}
                  height={44}
                  stretch
                  selected={values.packSize === n}
                  onPress={() => onChange({ packSize: n })}
                />
              ))}
            </View>
          </View>
        </>
      ) : null}

      <Divider />
      <Field
        label={addiction.priceLabel}
        keyboardType="decimal-pad"
        inputMode="decimal"
        value={values.price}
        onChangeText={(price) => onChange({ price })}
        placeholder="Örn. 100"
      />

      {showQuitDate ? (
        <>
          <Divider />
          <View style={{ gap: 10 }}>
            <Txt variant="bodyStrong">Ne zaman bıraktın?</Txt>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {quitChoices.map((q) => (
                <Chip
                  key={q.id}
                  label={q.label}
                  height={44}
                  stretch
                  selected={values.quitChoice === q.id}
                  onPress={() => onChange({ quitChoice: q.id })}
                />
              ))}
            </View>
            {values.quitChoice === 'custom' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Txt muted>Kaç gün önce?</Txt>
                <Stepper
                  label="Kaç gün önce"
                  value={values.customDaysAgo}
                  min={2}
                  max={3650}
                  onChange={(customDaysAgo) => onChange({ customDaysAgo })}
                />
              </View>
            ) : null}
          </View>
        </>
      ) : null}
    </Card>
  );
}
