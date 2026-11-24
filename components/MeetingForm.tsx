'use client';

import { useActionState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  countSpeakerRows,
  type FormState,
  type FormValues,
} from '@/lib/meeting-form';
import { MEETING_TYPE_LABELS } from './meeting-labels';

interface MeetingFormProps {
  /** A Server Action: createMeeting, or updateMeeting.bind(null, id). */
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  initialValues: FormValues;
  submitLabel: string;
}

const inputClass =
  'mt-1 block w-full rounded-md border border-line bg-surface px-3 py-2 text-foreground shadow-sm aria-[invalid=true]:border-red-700';
const labelClass = 'block text-sm font-medium';
const errorClass = 'mt-1 min-h-0 text-sm font-medium text-red-700';

/** Shows a field's errors. The live region always exists so screen readers announce changes. */
function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={`${id}-error`} aria-live="polite" className={errorClass}>
      {errors?.map((message) => <p key={message}>{message}</p>)}
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  errors?: string[];
  hint?: string;
  children: (props: {
    id: string;
    name: string;
    'aria-describedby': string;
    'aria-invalid': boolean;
    className: string;
  }) => ReactNode;
}

function Field({ id, label, errors, hint, children }: FieldProps) {
  const describedBy = [hint ? `${id}-hint` : null, `${id}-error`].filter(Boolean).join(' ');
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {children({
        id,
        name: id,
        'aria-describedby': describedBy,
        'aria-invalid': Boolean(errors?.length),
        className: inputClass,
      })}
      <FieldErrors id={id} errors={errors} />
    </div>
  );
}

export default function MeetingForm({ action, initialValues, submitLabel }: MeetingFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    message: null,
    errors: {},
    values: initialValues,
  } satisfies FormState);

  const values = state.values ?? initialValues;
  const errors = state.errors;
  const speakerRows = countSpeakerRows(values);

  return (
    <form action={formAction} noValidate className="space-y-8">
      <div
        id="form-message"
        role="status"
        aria-live="polite"
        className={state.message ? 'rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-800' : undefined}
      >
        {state.message}
      </div>

      <fieldset className="space-y-4">
        <legend className="font-serif text-xl font-semibold text-brand-dark">Meeting details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="date" label="Date" errors={errors.date}>
            {(props) => <input {...props} type="date" defaultValue={values.date} required />}
          </Field>
          <Field id="meetingType" label="Meeting type" errors={errors.meetingType}>
            {(props) => (
              <select {...props} defaultValue={values.meetingType}>
                {Object.entries(MEETING_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field id="presiding" label="Presiding" errors={errors.presiding}>
            {(props) => <input {...props} type="text" defaultValue={values.presiding} required />}
          </Field>
          <Field id="conducting" label="Conducting" errors={errors.conducting}>
            {(props) => <input {...props} type="text" defaultValue={values.conducting} required />}
          </Field>
        </div>
        <Field
          id="announcements"
          label="Announcements"
          hint="Optional. Put each announcement on its own line."
          errors={errors.announcements}
        >
          {(props) => <textarea {...props} rows={3} defaultValue={values.announcements} />}
        </Field>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-serif text-xl font-semibold text-brand-dark">Opening</legend>
        <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <Field id="openingHymnNumber" label="Opening hymn number" errors={errors.openingHymnNumber}>
            {(props) => (
              <input {...props} type="text" inputMode="numeric" defaultValue={values.openingHymnNumber} required />
            )}
          </Field>
          <Field id="openingHymnTitle" label="Opening hymn title" errors={errors.openingHymnTitle}>
            {(props) => <input {...props} type="text" defaultValue={values.openingHymnTitle} required />}
          </Field>
        </div>
        <Field id="openingPrayer" label="Opening prayer" errors={errors.openingPrayer}>
          {(props) => <input {...props} type="text" defaultValue={values.openingPrayer} required />}
        </Field>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-serif text-xl font-semibold text-brand-dark">Ward business</legend>
        <Field
          id="wardBusiness"
          label="Ward business items"
          hint="Optional. Put each item on its own line."
          errors={errors.wardBusiness}
        >
          {(props) => <textarea {...props} rows={3} defaultValue={values.wardBusiness} />}
        </Field>
        <div className="flex items-center gap-2">
          <input
            id="stakeBusiness"
            name="stakeBusiness"
            type="checkbox"
            defaultChecked={values.stakeBusiness === 'on'}
            className="h-4 w-4"
          />
          <label htmlFor="stakeBusiness" className="text-sm font-medium">
            Stake business will be presented
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-serif text-xl font-semibold text-brand-dark">Sacrament</legend>
        <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <Field id="sacramentHymnNumber" label="Sacrament hymn number" errors={errors.sacramentHymnNumber}>
            {(props) => (
              <input {...props} type="text" inputMode="numeric" defaultValue={values.sacramentHymnNumber} required />
            )}
          </Field>
          <Field id="sacramentHymnTitle" label="Sacrament hymn title" errors={errors.sacramentHymnTitle}>
            {(props) => <input {...props} type="text" defaultValue={values.sacramentHymnTitle} required />}
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-serif text-xl font-semibold text-brand-dark">Speakers and musical numbers</legend>
        <p id="speakers-hint" className="text-sm text-muted">
          Leave a row empty to skip it.
        </p>
        <div id="speakers-error" aria-live="polite" className={errorClass}>
          {errors.speakers?.map((message) => <p key={message}>{message}</p>)}
        </div>
        {Array.from({ length: speakerRows }, (_, i) => (
          <fieldset key={i} className="rounded-lg border border-line bg-surface p-4">
            <legend className="px-1 text-sm font-semibold">Program item {i + 1}</legend>
            <div className="grid gap-4 sm:grid-cols-[11rem_1fr_1fr]">
              <div>
                <label htmlFor={`speakerType${i}`} className={labelClass}>
                  Type
                </label>
                <select
                  id={`speakerType${i}`}
                  name={`speakerType${i}`}
                  defaultValue={values[`speakerType${i}`] ?? 'speaker'}
                  aria-describedby="speakers-error"
                  className={inputClass}
                >
                  <option value="speaker">Speaker</option>
                  <option value="musical-number">Musical number</option>
                </select>
              </div>
              <div>
                <label htmlFor={`speakerName${i}`} className={labelClass}>
                  Name
                </label>
                <input
                  id={`speakerName${i}`}
                  name={`speakerName${i}`}
                  type="text"
                  defaultValue={values[`speakerName${i}`] ?? ''}
                  aria-describedby="speakers-error"
                  aria-invalid={Boolean(errors.speakers?.some((m) => m.startsWith(`Row ${i + 1}:`)))}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor={`speakerTopic${i}`} className={labelClass}>
                  Topic or title
                </label>
                <input
                  id={`speakerTopic${i}`}
                  name={`speakerTopic${i}`}
                  type="text"
                  defaultValue={values[`speakerTopic${i}`] ?? ''}
                  aria-describedby="speakers-error"
                  aria-invalid={Boolean(errors.speakers?.some((m) => m.startsWith(`Row ${i + 1}:`)))}
                  className={inputClass}
                />
              </div>
            </div>
          </fieldset>
        ))}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-serif text-xl font-semibold text-brand-dark">Closing</legend>
        <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <Field id="closingHymnNumber" label="Closing hymn number" errors={errors.closingHymnNumber}>
            {(props) => (
              <input {...props} type="text" inputMode="numeric" defaultValue={values.closingHymnNumber} required />
            )}
          </Field>
          <Field id="closingHymnTitle" label="Closing hymn title" errors={errors.closingHymnTitle}>
            {(props) => <input {...props} type="text" defaultValue={values.closingHymnTitle} required />}
          </Field>
        </div>
        <Field id="closingPrayer" label="Closing prayer" errors={errors.closingPrayer}>
          {(props) => <input {...props} type="text" defaultValue={values.closingPrayer} required />}
        </Field>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-brand px-5 py-2 font-medium text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Saving…' : submitLabel}
        </button>
        <Link href="/meetings" className="text-sm font-medium text-brand hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
