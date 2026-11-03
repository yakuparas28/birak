import type { Stats } from '@/lib/stats';
import { formatMoney } from '@/lib/stats';

type BadgeKind = 'days' | 'money' | 'cravings' | 'journal';

export type BadgeDef = {
  id: string;
  name: string;
  mark: string;
  color: string;
  kind: BadgeKind;
  target: number;
};

export type BadgeInput = {
  stats: Stats;
  cravingsOvercome: number;
  journalCount: number;
};

export const badgeDefs: BadgeDef[] = [
  { id: 'day-1', name: 'İlk gün', mark: '1G', color: '#CFE8DC', kind: 'days', target: 1 },
  { id: 'day-3', name: '3 gün', mark: '3G', color: '#CFE8DC', kind: 'days', target: 3 },
  { id: 'day-7', name: '1 hafta', mark: '7G', color: '#F3D9A6', kind: 'days', target: 7 },
  { id: 'day-14', name: '2 hafta', mark: '2H', color: '#F3D9A6', kind: 'days', target: 14 },
  { id: 'day-30', name: '1 ay', mark: '1A', color: '#F2C6BB', kind: 'days', target: 30 },
  { id: 'day-90', name: '3 ay', mark: '3A', color: '#F2C6BB', kind: 'days', target: 90 },
  { id: 'day-180', name: '6 ay', mark: '6A', color: '#DFEAF4', kind: 'days', target: 180 },
  { id: 'day-365', name: '1 yıl', mark: '1Y', color: '#E9E3F3', kind: 'days', target: 365 },
  { id: 'money-500', name: 'İlk ₺500', mark: '₺', color: '#F3D9A6', kind: 'money', target: 500 },
  { id: 'money-2000', name: '₺2.000', mark: '₺₺', color: '#F3D9A6', kind: 'money', target: 2000 },
  { id: 'money-10000', name: '₺10.000', mark: '₺₺₺', color: '#F3D9A6', kind: 'money', target: 10000 },
  { id: 'craving-1', name: 'İlk kriz atlatıldı', mark: '1', color: '#F2C6BB', kind: 'cravings', target: 1 },
  { id: 'craving-10', name: '10 kriz atlatıldı', mark: '10', color: '#F2C6BB', kind: 'cravings', target: 10 },
  { id: 'craving-50', name: '50 kriz', mark: '50', color: '#F2C6BB', kind: 'cravings', target: 50 },
  { id: 'journal-1', name: 'İlk günlük', mark: 'G', color: '#DFEAF4', kind: 'journal', target: 1 },
  { id: 'journal-10', name: '10 günlük', mark: '10G', color: '#DFEAF4', kind: 'journal', target: 10 },
];

function current(def: BadgeDef, input: BadgeInput) {
  switch (def.kind) {
    case 'days':
      return input.stats.elapsedMs / 86_400_000;
    case 'money':
      return input.stats.saved;
    case 'cravings':
      return input.cravingsOvercome;
    case 'journal':
      return input.journalCount;
  }
}

export function qualifyingBadges(input: BadgeInput) {
  return badgeDefs.filter((def) => current(def, input) >= def.target).map((def) => def.id);
}

export function remainingText(def: BadgeDef, input: BadgeInput) {
  const left = Math.max(0, def.target - current(def, input));
  switch (def.kind) {
    case 'days':
      return `${Math.ceil(left)} gün kaldı`;
    case 'money':
      return `${formatMoney(left)} kaldı`;
    case 'cravings':
      return `${Math.ceil(left)} kriz kaldı`;
    case 'journal':
      return `${Math.ceil(left)} kayıt kaldı`;
  }
}
