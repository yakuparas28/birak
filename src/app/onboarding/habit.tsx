import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { HabitFields } from '@/components/habit-fields';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { StepHeader } from '@/components/step-header';
import { Txt } from '@/components/txt';
import { parsePrice, useDraft } from '@/features/onboarding-draft';
import { addictions } from '@/lib/addictions';
import { formatMoney } from '@/lib/stats';
import { useColors } from '@/providers/settings-provider';

export default function HabitScreen() {
  const c = useColors();
  const { draft, update } = useDraft();
  const addiction = addictions[draft.addiction];
  const unitCost = addiction.usesPack ? parsePrice(draft.price) / draft.packSize : parsePrice(draft.price);
  const monthly = draft.perDay * unitCost * 30;

  return (
    <Screen gap={22} footer={<Button title="Devam et" onPress={() => router.push('/onboarding/motivation')} />}>
      <StepHeader step={2} />
      <View style={{ gap: 10 }}>
        <Txt variant="title" accessibilityRole="header">
          Alışkanlığını biraz anlat
        </Txt>
        <Txt muted>Tasarrufunu ve ilerlemeni bu bilgilere göre hesaplayacağız.</Txt>
      </View>

      <HabitFields addiction={addiction} values={draft} onChange={update} />

      {monthly > 0 ? (
        <Card tone="soft" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="money" size={22} color={c.brand} />
          <Txt variant="label" style={{ flex: 1, fontSize: 14 }}>
            Bırakınca ayda yaklaşık {formatMoney(monthly)} biriktireceksin.
          </Txt>
        </Card>
      ) : null}
    </Screen>
  );
}
