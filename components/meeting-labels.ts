import type { MeetingType } from '@/lib/types';

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  regular: 'Regular',
  testimony: 'Fast & Testimony',
  stake: 'Stake Meeting',
  general: 'General Conference',
};

/** Stake and general meetings are held without the sacrament. */
export function hasSacrament(type: MeetingType): boolean {
  return type === 'regular' || type === 'testimony';
}

export const MEETING_TYPE_STYLES: Record<MeetingType, string> = {
  regular: 'bg-brand-light text-brand-dark',
  testimony: 'bg-amber-100 text-amber-900',
  stake: 'bg-violet-100 text-violet-900',
  general: 'bg-emerald-100 text-emerald-900',
};
