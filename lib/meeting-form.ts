import type { SacramentMeeting } from './types';

/** Fewest speaker/musical-number rows the form ever shows. */
export const MIN_SPEAKER_ROWS = 5;
/** Hard cap so a forged request cannot make the server loop forever. */
export const MAX_SPEAKER_ROWS = 20;

/** Raw text of every form field, keyed by the input's `name`. */
export type FormValues = Record<string, string>;

/** What a Server Action hands back to useActionState. */
export type FormState = {
  /** A form-level message (shown in a status region). */
  message: string | null;
  /** Field-level errors, keyed by the input's `name`. */
  errors: Record<string, string[]>;
  /** The text the person typed, so a failed submit does not wipe the form. */
  values: FormValues | null;
};

export const initialFormState: FormState = { message: null, errors: {}, values: null };

const toLines = (items: string[] | undefined): string => (items ?? []).join('\n');

/** Blank values for the create form. */
export function emptyFormValues(): FormValues {
  const values: FormValues = {
    date: '',
    meetingType: 'regular',
    presiding: '',
    conducting: '',
    announcements: '',
    openingHymnNumber: '',
    openingHymnTitle: '',
    openingPrayer: '',
    wardBusiness: '',
    stakeBusiness: '',
    sacramentHymnNumber: '',
    sacramentHymnTitle: '',
    closingHymnNumber: '',
    closingHymnTitle: '',
    closingPrayer: '',
  };
  for (let i = 0; i < MIN_SPEAKER_ROWS; i += 1) {
    values[`speakerName${i}`] = '';
    values[`speakerTopic${i}`] = '';
    values[`speakerType${i}`] = 'speaker';
  }
  return values;
}

/** Fills the edit form from a saved meeting. */
export function meetingToFormValues(meeting: SacramentMeeting): FormValues {
  const values: FormValues = {
    date: meeting.date,
    meetingType: meeting.meetingType,
    presiding: meeting.presiding,
    conducting: meeting.conducting,
    announcements: toLines(meeting.announcements),
    openingHymnNumber: String(meeting.openingHymn.number),
    openingHymnTitle: meeting.openingHymn.title,
    openingPrayer: meeting.openingPrayer,
    wardBusiness: toLines(meeting.wardBusiness.map((item) => item.description)),
    stakeBusiness: meeting.stakeBusiness ? 'on' : '',
    sacramentHymnNumber: String(meeting.sacramentHymn.number),
    sacramentHymnTitle: meeting.sacramentHymn.title,
    closingHymnNumber: String(meeting.closingHymn.number),
    closingHymnTitle: meeting.closingHymn.title,
    closingPrayer: meeting.closingPrayer,
  };
  // One spare row so a leader can add a speaker without losing the existing ones.
  const rows = Math.min(
    MAX_SPEAKER_ROWS,
    Math.max(MIN_SPEAKER_ROWS, meeting.speakers.length + 1),
  );
  for (let i = 0; i < rows; i += 1) {
    const speaker = meeting.speakers[i];
    values[`speakerName${i}`] = speaker?.name ?? '';
    values[`speakerTopic${i}`] = speaker?.topic ?? '';
    values[`speakerType${i}`] = speaker?.type ?? 'speaker';
  }
  return values;
}

/** How many speaker rows a values object contains. */
export function countSpeakerRows(values: FormValues): number {
  let rows = 0;
  while (rows < MAX_SPEAKER_ROWS && `speakerType${rows}` in values) {
    rows += 1;
  }
  return Math.max(rows, MIN_SPEAKER_ROWS);
}
