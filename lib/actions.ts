'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { isIsoDate } from './dates';
import {
  UNIQUE_VIOLATION,
  addMeeting,
  deleteMeeting as deleteMeetingRow,
  updateMeeting as updateMeetingRow,
  type NewMeeting,
} from './meetings-db';
import { MAX_SPEAKER_ROWS, type FormState, type FormValues } from './meeting-form';

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const text = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `Enter ${label}.`)
    .max(255, `${label[0].toUpperCase()}${label.slice(1)} must be 255 characters or fewer.`);

const hymnNumber = z
  .string()
  .trim()
  .regex(/^\d{1,4}$/, 'Enter the hymn number using digits only.')
  .transform(Number)
  .pipe(z.number().min(1, 'The hymn number must be at least 1.').max(1500, 'The hymn number must be 1500 or less.'));

/** A textarea where each non-empty line becomes one list item. */
const lines = (maxLines: number) =>
  z
    .string()
    .transform((value) =>
      value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .pipe(
      z
        .array(z.string().max(300, 'Each line must be 300 characters or fewer.'))
        .max(maxLines, `Use ${maxLines} lines or fewer.`),
    );

const SpeakerRowSchema = z.object({
  name: z.string().trim(),
  topic: z.string().trim(),
  type: z.enum(['speaker', 'musical-number']),
});

const MeetingFormSchema = z.object({
  date: z.string().trim().refine(isIsoDate, 'Enter a valid date.'),
  meetingType: z.enum(['regular', 'testimony', 'stake', 'general', 'special'], {
    error: 'Choose a meeting type.',
  }),
  presiding: text('who is presiding'),
  conducting: text('who is conducting'),
  announcements: lines(20),
  openingHymnNumber: hymnNumber,
  openingHymnTitle: text('the opening hymn title'),
  openingPrayer: text('who will give the opening prayer'),
  wardBusiness: lines(20),
  stakeBusiness: z.boolean(),
  sacramentHymnNumber: hymnNumber,
  sacramentHymnTitle: text('the sacrament hymn title'),
  speakers: z
    .array(SpeakerRowSchema)
    .superRefine((rows, ctx) => {
      rows.forEach((row, index) => {
        if (!row.name && !row.topic) {
          return; // an empty row is simply ignored
        }
        const label = `Row ${index + 1}`;
        if (!row.name) {
          ctx.addIssue({ code: 'custom', message: `${label}: enter a name.` });
        }
        if (!row.topic) {
          ctx.addIssue({
            code: 'custom',
            message: `${label}: enter a ${row.type === 'speaker' ? 'topic' : 'title'}.`,
          });
        }
        if (row.name.length > 255 || row.topic.length > 255) {
          ctx.addIssue({ code: 'custom', message: `${label}: keep each entry to 255 characters or fewer.` });
        }
      });
    })
    .transform((rows) => rows.filter((row) => row.name || row.topic)),
  closingHymnNumber: hymnNumber,
  closingHymnTitle: text('the closing hymn title'),
  closingPrayer: text('who will give the closing prayer'),
});

/** Reads every field as plain text, exactly as the person typed it. */
function readFormValues(formData: FormData): FormValues {
  const values: FormValues = {};
  for (const [key, value] of formData.entries()) {
    // Ignore file inputs and Next's own hidden "$ACTION_..." fields.
    if (typeof value === 'string' && !key.startsWith('$')) {
      values[key] = value;
    }
  }
  return values;
}

/** Collects the speaker rows (speakerName0, speakerTopic0, speakerType0, ...). */
function readSpeakerRows(formData: FormData) {
  const rows: { name: string; topic: string; type: string }[] = [];
  for (let i = 0; i < MAX_SPEAKER_ROWS && formData.has(`speakerType${i}`); i += 1) {
    rows.push({
      name: String(formData.get(`speakerName${i}`) ?? ''),
      topic: String(formData.get(`speakerTopic${i}`) ?? ''),
      type: String(formData.get(`speakerType${i}`) ?? ''),
    });
  }
  return rows;
}

type Parsed = { ok: true; meeting: NewMeeting } | { ok: false; state: FormState };

/** Validates raw FormData with Zod and turns it into the shape the database expects. */
function parseMeetingForm(formData: FormData): Parsed {
  const values = readFormValues(formData);

  const result = MeetingFormSchema.safeParse({
    date: values.date ?? '',
    meetingType: values.meetingType ?? '',
    presiding: values.presiding ?? '',
    conducting: values.conducting ?? '',
    announcements: values.announcements ?? '',
    openingHymnNumber: values.openingHymnNumber ?? '',
    openingHymnTitle: values.openingHymnTitle ?? '',
    openingPrayer: values.openingPrayer ?? '',
    wardBusiness: values.wardBusiness ?? '',
    stakeBusiness: values.stakeBusiness === 'on',
    sacramentHymnNumber: values.sacramentHymnNumber ?? '',
    sacramentHymnTitle: values.sacramentHymnTitle ?? '',
    speakers: readSpeakerRows(formData),
    closingHymnNumber: values.closingHymnNumber ?? '',
    closingHymnTitle: values.closingHymnTitle ?? '',
    closingPrayer: values.closingPrayer ?? '',
  });

  if (!result.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const field = String(issue.path[0] ?? 'form');
      (errors[field] ??= []).push(issue.message);
    }
    return {
      ok: false,
      state: {
        message: 'Some fields need your attention. Please fix them and try again.',
        errors,
        values,
      },
    };
  }

  const data = result.data;
  return {
    ok: true,
    meeting: {
      date: data.date,
      meetingType: data.meetingType,
      presiding: data.presiding,
      conducting: data.conducting,
      announcements: data.announcements,
      openingHymn: { number: data.openingHymnNumber, title: data.openingHymnTitle },
      openingPrayer: data.openingPrayer,
      wardBusiness: data.wardBusiness.map((description) => ({ description })),
      stakeBusiness: data.stakeBusiness,
      sacramentHymn: { number: data.sacramentHymnNumber, title: data.sacramentHymnTitle },
      speakers: data.speakers,
      closingHymn: { number: data.closingHymnNumber, title: data.closingHymnTitle },
      closingPrayer: data.closingPrayer,
    },
  };
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { code?: unknown }).code === UNIQUE_VIOLATION;
}

function duplicateDateState(values: FormValues): FormState {
  return {
    message: 'Some fields need your attention. Please fix them and try again.',
    errors: { date: ['A meeting is already planned for that date. Choose another Sunday or edit the existing one.'] },
    values,
  };
}

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

export async function createMeeting(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseMeetingForm(formData);
  if (!parsed.ok) {
    return parsed.state;
  }

  try {
    await addMeeting(parsed.meeting);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return duplicateDateState(readFormValues(formData));
    }
    console.error('createMeeting failed', error);
    throw new Error('Could not save the meeting. Please try again.');
  }

  // redirect() works by throwing, so it must stay outside the try...catch.
  revalidatePath('/meetings');
  redirect('/meetings');
}

export async function updateMeeting(
  id: number,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parseMeetingForm(formData);
  if (!parsed.ok) {
    return parsed.state;
  }

  let saved;
  try {
    saved = await updateMeetingRow(id, parsed.meeting);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return duplicateDateState(readFormValues(formData));
    }
    console.error(`updateMeeting(${id}) failed`, error);
    throw new Error('Could not update the meeting. Please try again.');
  }

  if (!saved) {
    return {
      message: 'This meeting no longer exists. It may have been deleted.',
      errors: {},
      values: readFormValues(formData),
    };
  }

  revalidatePath('/meetings');
  revalidatePath(`/meetings/${id}`);
  redirect('/meetings');
}

export async function deleteMeeting(id: number): Promise<void> {
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error('Could not delete the meeting. Please try again.');
  }

  try {
    await deleteMeetingRow(id);
  } catch (error) {
    console.error(`deleteMeeting(${id}) failed`, error);
    throw new Error('Could not delete the meeting. Please try again.');
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}
