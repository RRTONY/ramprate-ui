"use client";

import { useState } from "react";
import * as Yup from "yup";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

type KumbayaFormData = {
  companyWebsite: string;
  event: string;
  eventDetails: string;
  date: string;
  deadline: string;
  venue: string;
  eventLink: string;
  venueLink: string;
  organizer: string;
  contact: string;
  attendance: string;
  audience: string;
  eventStage: string;
  moodboardUrl: string;
  priority: string;
  opportunity: string;
  venueAttachment?: VenueAttachment;
};

type VenueAttachment = {
  key: string;
  name: string;
  size: number;
  type: string;
  url: string;
};

type FieldName = keyof KumbayaFormData;
type FieldErrors = Partial<Record<FieldName, string>>;

const initialValues: KumbayaFormData = {
  companyWebsite: "",
  event: "",
  eventDetails: "",
  date: "",
  deadline: "",
  venue: "",
  eventLink: "",
  venueLink: "",
  organizer: "",
  contact: "",
  attendance: "",
  audience: "",
  eventStage: "",
  moodboardUrl: "",
  priority: "",
  opportunity: "",
};

const optionalUrl = Yup.string().test(
  "valid-url",
  "Enter a complete https:// URL.",
  (value) => !value || /^https:\/\/.+/.test(value),
);

const stepSchemas = [
  Yup.object({
    companyWebsite: optionalUrl,
    event: Yup.string()
      .trim()
      .min(2, "Tell us the event or opportunity name.")
      .required("Tell us the event or opportunity name."),
    eventDetails: Yup.string().trim().max(1600),
    date: Yup.string().required("Choose an event date or approximate date."),
    deadline: Yup.string(),
    venue: Yup.string()
      .trim()
      .min(2, "Tell us where the opportunity is happening.")
      .required("Tell us where the opportunity is happening."),
    eventLink: optionalUrl,
    venueLink: optionalUrl,
    organizer: Yup.string().trim(),
    contact: Yup.string()
      .trim()
      .min(5, "Share a name plus an email or phone number.")
      .required("Share a name plus an email or phone number."),
  }),
  Yup.object({
    attendance: Yup.string().required("Choose the expected attendance."),
    audience: Yup.string()
      .trim()
      .min(10, "Describe who is expected in the room.")
      .required("Describe who is expected in the room."),
    eventStage: Yup.string().required("Choose the event stage."),
    moodboardUrl: optionalUrl,
  }),
  Yup.object({
    priority: Yup.string()
      .trim()
      .min(12, "Give us a little more context about the timing or opportunity.")
      .required("Tell us why this matters now."),
    opportunity: Yup.string()
      .trim()
      .min(12, "Describe the most useful relationship or outcome.")
      .required("Describe the outcome you want to create."),
  }),
];

const steps = ["The event", "The room", "The opportunity", "Review"];

function fieldError(error: unknown): FieldErrors {
  if (!(error instanceof Yup.ValidationError)) return {};
  return error.inner.reduce<FieldErrors>((errors, current) => {
    if (current.path && !errors[current.path as FieldName]) {
      errors[current.path as FieldName] = current.message;
    }
    return errors;
  }, {});
}

export default function KumbayaIntakeForm() {
  const [values, setValues] = useState<KumbayaFormData>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [venueAttachmentFile, setVenueAttachmentFile] = useState<File | null>(
    null,
  );
  const [venueAttachmentError, setVenueAttachmentError] = useState("");

  const updateValue = (field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateCurrentStep = async () => {
    const schema = stepSchemas[step];
    if (!schema) return true;

    try {
      await schema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      setErrors(fieldError(error));
      return false;
    }
  };

  const continueToNextStep = async () => {
    if (await validateCurrentStep()) setStep((current) => current + 1);
  };

  const submit = async () => {
    setSubmitError("");
    setVenueAttachmentError("");
    setSubmitting(true);
    try {
      let venueAttachment = values.venueAttachment;
      if (venueAttachmentFile) {
        const uploadData = new FormData();
        uploadData.set("file", venueAttachmentFile);
        const uploadResponse = await fetch("/api/kumbaya-intake/attachment", {
          body: uploadData,
          method: "POST",
        });
        const uploadResult = (await uploadResponse.json()) as {
          attachment?: VenueAttachment;
          error?: string;
          ok?: boolean;
        };

        if (
          !uploadResponse.ok ||
          !uploadResult.ok ||
          !uploadResult.attachment
        ) {
          const errorMessage =
            uploadResult.error || "We could not upload the venue image.";
          setVenueAttachmentError(errorMessage);
          throw new Error(errorMessage);
        }

        venueAttachment = uploadResult.attachment;
      }

      const response = await fetch("/api/kumbaya-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, venueAttachment }),
      });
      const result = (await response.json()) as {
        error?: string;
        ok?: boolean;
      };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "We could not send your brief.");
      }
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not send your brief. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="kumbaya-success" role="status">
        <span className="kumbaya-success-icon">
          <Check size={22} aria-hidden="true" />
        </span>
        <p className="kumbaya-kicker">Brief received</p>
        <h3 className="mt-4 font-display text-3xl font-bold text-[#07111f]">
          Thank you for sharing the room.
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#526278]">
          RampRate will review the details and respond directly about fit,
          timing, and the most useful next step.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (step === steps.length - 1) void submit();
      }}
    >
      <div
        className="kumbaya-progress"
        aria-label={`Step ${step + 1} of ${steps.length}`}
      >
        {steps.map((label, index) => (
          <div
            key={label}
            className={
              index === step ? "is-current" : index < step ? "is-complete" : ""
            }
          >
            <span>{index + 1}</span>
            <small>{label}</small>
          </div>
        ))}
      </div>

      {step === 0 ? (
        <fieldset className="kumbaya-fieldset">
          <legend>What are we walking into?</legend>
          <p>
            Give us the useful version: what is happening, where, and why this
            room might matter.
          </p>
          <div className="kumbaya-form-grid">
            <Field label="Company website" error={errors.companyWebsite}>
              <input
                value={values.companyWebsite}
                onChange={(event) =>
                  updateValue("companyWebsite", event.target.value)
                }
                inputMode="url"
                placeholder="https://"
              />
            </Field>
            <Field
              label="Event or opportunity name"
              required
              error={errors.event}
            >
              <input
                value={values.event}
                onChange={(event) => updateValue("event", event.target.value)}
                autoComplete="organization-title"
              />
            </Field>
            <Field
              label="Event details"
              hint="Optional"
              error={errors.eventDetails}
            >
              <textarea
                value={values.eventDetails}
                onChange={(event) =>
                  updateValue("eventDetails", event.target.value)
                }
                rows={2}
                placeholder="A short agenda, audience note, or useful context."
              />
            </Field>
            <Field label="Event date" required error={errors.date}>
              <input
                type="date"
                value={values.date}
                onChange={(event) => updateValue("date", event.target.value)}
              />
            </Field>
            <Field
              label="Decision deadline"
              hint="Optional"
              error={errors.deadline}
            >
              <input
                type="date"
                value={values.deadline}
                onChange={(event) =>
                  updateValue("deadline", event.target.value)
                }
              />
            </Field>
            <Field label="Where is it?" required error={errors.venue}>
              <input
                value={values.venue}
                onChange={(event) => updateValue("venue", event.target.value)}
                placeholder="City, venue, or virtual"
              />
            </Field>
            <Field label="Event link" hint="Optional" error={errors.eventLink}>
              <input
                value={values.eventLink}
                onChange={(event) =>
                  updateValue("eventLink", event.target.value)
                }
                inputMode="url"
                placeholder="https://"
              />
            </Field>
            <Field label="Venue link" hint="Optional" error={errors.venueLink}>
              <input
                value={values.venueLink}
                onChange={(event) =>
                  updateValue("venueLink", event.target.value)
                }
                inputMode="url"
                placeholder="https://"
              />
            </Field>
            <Field
              label="Organizer or organization"
              hint="Optional"
              error={errors.organizer}
            >
              <input
                value={values.organizer}
                onChange={(event) =>
                  updateValue("organizer", event.target.value)
                }
              />
            </Field>
            <Field
              label="Organizer name plus email or phone"
              required
              error={errors.contact}
            >
              <input
                value={values.contact}
                onChange={(event) => updateValue("contact", event.target.value)}
                autoComplete="email"
              />
            </Field>
          </div>
        </fieldset>
      ) : null}

      {step === 1 ? (
        <fieldset className="kumbaya-fieldset">
          <legend>Who is actually in the room?</legend>
          <p>
            Audience, atmosphere, and timing help us identify the kinds of
            relationships that could be useful.
          </p>
          <div className="kumbaya-form-grid">
            <Field
              label="Expected attendance"
              required
              error={errors.attendance}
            >
              <select
                value={values.attendance}
                onChange={(event) =>
                  updateValue("attendance", event.target.value)
                }
              >
                <option value="">Select one</option>
                <option>Under 50</option>
                <option>50–150</option>
                <option>150–500</option>
                <option>500–2,000</option>
                <option>2,000+</option>
              </select>
            </Field>
            <Field label="Event stage" required error={errors.eventStage}>
              <select
                value={values.eventStage}
                onChange={(event) =>
                  updateValue("eventStage", event.target.value)
                }
              >
                <option value="">Select one</option>
                <option>Future idea / early planning</option>
                <option>Dates being held</option>
                <option>Confirmed and building the room</option>
                <option>Open for sponsors and partners</option>
                <option>Past event with a future edition</option>
              </select>
            </Field>
          </div>
          <div className="mt-5 grid gap-5">
            <Field
              label="Who is expected in the room?"
              required
              error={errors.audience}
            >
              <textarea
                value={values.audience}
                onChange={(event) =>
                  updateValue("audience", event.target.value)
                }
                rows={4}
                placeholder="Investors, operators, government, founders, media, community, and other people who matter."
              />
            </Field>
            <Field
              label="Venue photo or moodboard link"
              hint="Optional"
              error={errors.moodboardUrl}
            >
              <input
                value={values.moodboardUrl}
                onChange={(event) =>
                  updateValue("moodboardUrl", event.target.value)
                }
                inputMode="url"
                placeholder="https://"
              />
            </Field>
            <Field
              label="Venue photo or moodboard image"
              hint="Optional · JPG, PNG, or WebP up to 8 MB"
              error={venueAttachmentError}
            >
              <input
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  setVenueAttachmentFile(event.target.files?.[0] ?? null);
                  setVenueAttachmentError("");
                }}
                type="file"
              />
            </Field>
            {venueAttachmentFile ? (
              <p className="kumbaya-file-note" aria-live="polite">
                Image ready to upload: {venueAttachmentFile.name}
              </p>
            ) : null}
          </div>
        </fieldset>
      ) : null}

      {step === 2 ? (
        <fieldset className="kumbaya-fieldset">
          <legend>What could move further because we were in it?</legend>
          <p>
            Bring the oddly perfect person, useful introduction, or shared
            opportunity that changes the shape of the room.
          </p>
          <div className="grid gap-5">
            <Field
              label="Why does this matter now?"
              required
              error={errors.priority}
            >
              <textarea
                value={values.priority}
                onChange={(event) =>
                  updateValue("priority", event.target.value)
                }
                rows={5}
                placeholder="What is the timing, urgency, or opportunity?"
              />
            </Field>
            <Field
              label="What outcome or relationship could be most useful?"
              required
              error={errors.opportunity}
            >
              <textarea
                value={values.opportunity}
                onChange={(event) =>
                  updateValue("opportunity", event.target.value)
                }
                rows={5}
                placeholder="A sponsor, a speaker, community support, a story, a channel, or an introduction."
              />
            </Field>
          </div>
        </fieldset>
      ) : null}

      {step === 3 ? (
        <section
          className="kumbaya-review"
          aria-labelledby="kumbaya-review-title"
        >
          <p className="kumbaya-kicker">Review before sending</p>
          <h3
            id="kumbaya-review-title"
            className="mt-3 font-display text-3xl font-bold text-[#07111f]"
          >
            {values.event}
          </h3>
          <dl>
            <div>
              <dt>Where</dt>
              <dd>{values.venue}</dd>
            </div>
            <div>
              <dt>When</dt>
              <dd>{values.date}</dd>
            </div>
            <div>
              <dt>Audience</dt>
              <dd>{values.audience}</dd>
            </div>
            <div>
              <dt>What matters</dt>
              <dd>{values.priority}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {submitError ? (
        <p className="kumbaya-form-error" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        {step > 0 ? (
          <button
            type="button"
            className="kumbaya-secondary-action"
            onClick={() => setStep((current) => current - 1)}
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back
          </button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 ? (
          <button
            type="button"
            className="kumbaya-primary-action"
            onClick={() => void continueToNextStep()}
          >
            Continue <ArrowRight size={16} aria-hidden="true" />
          </button>
        ) : (
          <button
            type="submit"
            className="kumbaya-primary-action"
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Check size={16} aria-hidden="true" />
            )}
            {submitting ? "Sending brief" : "Send brief"}
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="kumbaya-field">
      <span>
        {label}
        {required ? <b aria-hidden="true"> *</b> : null}
        {hint ? <small>{hint}</small> : null}
      </span>
      {children}
      {error ? <em role="alert">{error}</em> : null}
    </label>
  );
}
