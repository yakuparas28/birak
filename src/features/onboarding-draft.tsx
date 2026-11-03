import { createContext, use, useState, type ReactNode } from 'react';

import { addictions, type AddictionId } from '@/lib/addictions';

export type QuitChoice = 'today' | 'yesterday' | 'custom';

export type Draft = {
  name: string;
  addiction: AddictionId;
  perDay: number;
  packSize: number;
  price: string;
  quitChoice: QuitChoice;
  /** Days ago when quitChoice is 'custom'. */
  customDaysAgo: number;
  reasons: string[];
  note: string;
  remind: boolean;
};

type Ctx = { draft: Draft; update: (patch: Partial<Draft>) => void };

const DraftContext = createContext<Ctx | null>(null);

const initial: Draft = {
  name: '',
  addiction: 'sigara',
  perDay: addictions.sigara.perDayDefault,
  packSize: 20,
  price: String(addictions.sigara.priceDefault),
  quitChoice: 'today',
  customDaysAgo: 2,
  reasons: ['saglik', 'para'],
  note: '',
  remind: true,
};

export function OnboardingDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<Draft>(initial);
  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));
  return <DraftContext value={{ draft, update }}>{children}</DraftContext>;
}

export function useDraft() {
  const ctx = use(DraftContext);
  if (!ctx) throw new Error('useDraft must be used inside OnboardingDraftProvider');
  return ctx;
}

export function parsePrice(value: string) {
  const n = parseFloat(value.replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function quitTimestamp(draft: Draft, now = Date.now()) {
  if (draft.quitChoice === 'today') return now;
  const daysAgo = draft.quitChoice === 'yesterday' ? 1 : draft.customDaysAgo;
  return now - daysAgo * 86_400_000;
}
