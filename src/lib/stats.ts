import type { Profile, Streak } from '@/db/repo';
import { addictions } from '@/lib/addictions';

const DAY_MS = 86_400_000;

export type Stats = {
  elapsedMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  avoided: number;
  saved: number;
  dailySaving: number;
  minutesGained: number;
  longestStreakMs: number;
  goalProgress: number;
};

export function computeStats(profile: Profile, streaks: Streak[], now: number): Stats {
  const addiction = addictions[profile.addiction];
  const elapsedMs = Math.max(0, now - profile.quitAt);
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const elapsedDays = elapsedMs / DAY_MS;

  const unitCost = addiction.usesPack ? profile.unitPrice / Math.max(1, profile.packSize) : profile.unitPrice;
  const avoided = profile.perDay * elapsedDays;
  const dailySaving = profile.perDay * unitCost;

  const longestPast = streaks.reduce(
    (max, s) => (s.endedAt === null ? max : Math.max(max, s.endedAt - s.startedAt)),
    0
  );

  return {
    elapsedMs,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    avoided,
    saved: avoided * unitCost,
    dailySaving,
    minutesGained: avoided * addiction.minutesPerUnit,
    longestStreakMs: Math.max(longestPast, elapsedMs),
    goalProgress: Math.min(1, elapsedDays / Math.max(1, profile.goalDays)),
  };
}

export function milestoneProgress(profile: Profile, now: number) {
  const elapsedHours = Math.max(0, now - profile.quitAt) / 3_600_000;
  return addictions[profile.addiction].milestones.map((m) => ({
    ...m,
    progress: Math.min(1, elapsedHours / m.hours),
  }));
}

export function formatMoney(value: number) {
  return '₺' + Math.round(value).toLocaleString('tr-TR');
}

export function formatCount(value: number) {
  return Math.floor(value).toLocaleString('tr-TR');
}

export function formatMinutes(totalMinutes: number) {
  const minutes = Math.floor(totalMinutes);
  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  const m = minutes % 60;
  if (d > 0) return `${d}g ${h}sa`;
  if (h > 0) return `${h}sa ${m}dk`;
  return `${m}dk`;
}

export function formatDays(ms: number) {
  return `${Math.floor(ms / DAY_MS)}g`;
}

export function formatDate(time: number) {
  return new Date(time).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatEntryDate(time: number, now = Date.now()) {
  const date = new Date(time);
  const clock = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((startOfToday.getTime() - time) / DAY_MS) + 1;
  if (time >= startOfToday.getTime()) return `Bugün, ${clock}`;
  if (diffDays === 1) return `Dün, ${clock}`;
  if (diffDays < 7) return `${date.toLocaleDateString('tr-TR', { weekday: 'long' })}, ${clock}`;
  return `${date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}, ${clock}`;
}

export function todayLabel(now = Date.now()) {
  const text = new Date(now).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
  return text.charAt(0).toLocaleUpperCase('tr-TR') + text.slice(1);
}
