'use client'

import {useState} from 'react'

const roleOptions = [
  'Founder or operator',
  'Executive or enterprise leader',
  'Investor or family office',
  'Advisor or connector',
  'Institution or NGO',
  'Independent professional or individual',
  'Other / not sure',
]

const themeOptions = [
  'Growth & market entry',
  'Capital & financing',
  'Technology & AI',
  'Partnerships & strategic access',
  'Buying, selling & transactions',
  'Operations & execution',
  'Impact & mission',
  'Something else / not sure',
]

const intentOptions = [
  {value: 'Buying something large', label: 'Buying something large. Cannot get it wrong.'},
  {value: 'Selling something', label: 'Selling something. Need the right doors.'},
  {value: 'Want a partner', label: 'Want a partner, not a transaction.'},
  {value: 'Something is wrong', label: 'Something is wrong. Need honest eyes.'},
  {value: 'Have an opportunity', label: 'Have an opportunity worth exploring.'},
]

const pillClass =
  'inline-block px-4.5 py-2.5 rounded-full border text-[13.5px] font-medium cursor-pointer transition-all border-black/10 bg-white text-ink peer-checked:bg-dark peer-checked:border-dark peer-checked:text-gold peer-disabled:opacity-40 peer-disabled:cursor-not-allowed'
const fieldLabelClass = 'font-body block text-sm font-semibold text-ink mb-1.5'
const inputClass =
  'font-body w-full px-3.5 py-3 rounded-[10px] border text-[14.5px] bg-white transition-colors border-black/10 focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/15'

export default function EngagementIntakeForm({initialQ1 = ''}: {initialQ1?: string}) {
  const [roles, setRoles] = useState<string[]>([])
  const [themes, setThemes] = useState<string[]>([])
  const [intent, setIntent] = useState('')
  const [intentError, setIntentError] = useState(false)
  const [nameInvalid, setNameInvalid] = useState(false)
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value))
    } else if (list.length < 3) {
      setList([...list, value])
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(false)

    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const isNameInvalid = !name
    const isEmailInvalid = !emailValid
    const isIntentInvalid = !intent

    setNameInvalid(isNameInvalid)
    setEmailInvalid(isEmailInvalid)
    setIntentError(isIntentInvalid)

    if (isNameInvalid || isEmailInvalid || isIntentInvalid) return

    setSubmitting(true)

    const payload = {
      name,
      email,
      organization: (form.elements.namedItem('organization') as HTMLInputElement).value.trim(),
      website: (form.elements.namedItem('website') as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value.trim(),
      intent,
      theme: themes.join(', '),
      role: roles.join(', '),
      q1: (form.elements.namedItem('q1') as HTMLTextAreaElement).value.trim(),
      q2: (form.elements.namedItem('q2') as HTMLTextAreaElement).value.trim(),
      q3: (form.elements.namedItem('q3') as HTMLTextAreaElement).value.trim(),
      page_url: window.location.href,
    }

    try {
      const res = await fetch('/api/engagement-intake', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('failed')
      setSubmitted(true)
    } catch {
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-dark rounded-2xl p-11 text-center">
        <div className="w-13 h-13 mx-auto mb-4.5 rounded-full flex items-center justify-center bg-gold text-dark text-2xl font-extrabold">
          &#10003;
        </div>
        <h2 className="font-display text-2xl font-semibold text-white mb-2.5">Got it.</h2>
        <p className="font-body text-sm leading-relaxed text-white/70 max-w-md mx-auto">
          Someone from RampRate reads every submission personally. You&apos;ll hear from us within five business days — including if the answer is no.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-9">
      {/* What best describes you */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <span className="font-mono text-xs font-bold tracking-[0.15em] uppercase text-gold">
            What best describes you?
          </span>
          <span className="font-mono text-[11px] tracking-wider uppercase text-ink-mid/60">
            {roles.length} of 3
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {roleOptions.map((opt) => (
            <label key={opt} className="relative">
              <input
                type="checkbox"
                className="peer absolute opacity-0 w-0 h-0"
                checked={roles.includes(opt)}
                disabled={!roles.includes(opt) && roles.length >= 3}
                onChange={() => toggle(roles, setRoles, opt)}
              />
              <span className={pillClass}>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* What are you optimizing */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <span className="font-mono text-xs font-bold tracking-[0.15em] uppercase text-gold">
            What are you optimizing?
          </span>
          <span className="font-mono text-[11px] tracking-wider uppercase text-ink-mid/60">
            {themes.length} of 3
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {themeOptions.map((opt) => (
            <label key={opt} className="relative">
              <input
                type="checkbox"
                className="peer absolute opacity-0 w-0 h-0"
                checked={themes.includes(opt)}
                disabled={!themes.includes(opt) && themes.length >= 3}
                onChange={() => toggle(themes, setThemes, opt)}
              />
              <span className={pillClass}>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* What brings you */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <span className="font-mono text-xs font-bold tracking-[0.15em] uppercase text-gold">
            What brings you
          </span>
          <span className="font-mono text-[11px] tracking-wider uppercase text-ink-mid/60">Pick one</span>
        </div>
        <div className="flex flex-col gap-3">
          {intentOptions.map((opt) => (
            <label key={opt.value} className="relative block">
              <input
                type="radio"
                name="intent"
                className="peer absolute opacity-0 w-0 h-0"
                checked={intent === opt.value}
                onChange={() => {
                  setIntent(opt.value)
                  setIntentError(false)
                }}
              />
              <span className="flex items-center gap-3 bg-white border border-black/10 rounded-[14px] px-4.5 py-4 text-[15px] font-medium text-ink cursor-pointer transition-all peer-checked:bg-dark peer-checked:border-dark peer-checked:text-white">
                <span className="w-4 h-4 shrink-0 rounded-full border border-black/20 peer-checked:border-gold peer-checked:bg-gold" />
                {opt.label}
              </span>
            </label>
          ))}
        </div>
        {intentError && (
          <p className="font-body text-[12.5px] text-red-700 mt-1.5">
            Pick the option closest to why you&apos;re here.
          </p>
        )}
      </div>

      {/* Where to reach you */}
      <div>
        <span className="font-mono text-xs font-bold tracking-[0.15em] uppercase text-gold block mb-4">
          Where to reach you
        </span>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="ei-name" className={fieldLabelClass}>
              Name<span className="text-gold ml-0.5">*</span>
            </label>
            <input
              type="text"
              id="ei-name"
              name="name"
              placeholder="Your name"
              className={`${inputClass} ${nameInvalid ? 'border-red-700' : ''}`}
            />
            {nameInvalid && <p className="font-body text-[12.5px] text-red-700 mt-1.5">Please tell us your name.</p>}
          </div>
          <div>
            <label htmlFor="ei-email" className={fieldLabelClass}>
              Email you actually check<span className="text-gold ml-0.5">*</span>
            </label>
            <input
              type="email"
              id="ei-email"
              name="email"
              placeholder="you@company.com"
              className={`${inputClass} ${emailInvalid ? 'border-red-700' : ''}`}
            />
            {emailInvalid && (
              <p className="font-body text-[12.5px] text-red-700 mt-1.5">Please enter a valid email address.</p>
            )}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="ei-org" className={fieldLabelClass}>Organization</label>
            <input type="text" id="ei-org" name="organization" placeholder="Your organization, if any" className={inputClass} />
          </div>
          <div>
            <label htmlFor="ei-site" className={fieldLabelClass}>Site or LinkedIn</label>
            <input type="url" id="ei-site" name="website" placeholder="https://" className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="ei-phone" className={fieldLabelClass}>Phone, only if you&apos;d rather talk</label>
          <input type="tel" id="ei-phone" name="phone" placeholder="Your phone number" className={inputClass} />
        </div>
      </div>

      {/* Three short answers */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <span className="font-mono text-xs font-bold tracking-[0.15em] uppercase text-gold">
            Three short answers
          </span>
          <span className="font-mono text-[11px] tracking-wider uppercase text-ink-mid/60">
            As long or short as you like
          </span>
        </div>
        <div className="space-y-5">
          <div>
            <label htmlFor="ei-q1" className={fieldLabelClass}>What brought you here?</label>
            <p className="font-body text-[12.5px] text-ink-mid mb-2">
              An article, an idea, a referral — tell us what caught your attention.
            </p>
            <textarea id="ei-q1" name="q1" rows={2} defaultValue={initialQ1} className={inputClass} />
          </div>
          <div>
            <label htmlFor="ei-q2" className={fieldLabelClass}>
              If you had a magic genie giving you three wishes, what would you wish for?
            </label>
            <p className="font-body text-[12.5px] text-ink-mid mb-2">
              Don&apos;t overthink it. Think big — there are no wrong answers.
            </p>
            <textarea id="ei-q2" name="q2" rows={2} className={inputClass} />
          </div>
          <div>
            <label htmlFor="ei-q3" className={fieldLabelClass}>Why does this matter now?</label>
            <p className="font-body text-[12.5px] text-ink-mid mb-2">One line is enough.</p>
            <textarea id="ei-q3" name="q3" rows={2} className={inputClass} />
          </div>
        </div>
      </div>

      <p className="font-body text-[13px] leading-relaxed text-ink-mid">
        Everything here gets checked before a call. Not because we assume you are lying. Because we have seen what happens when nobody checks.
      </p>

      <div className="flex items-center gap-4.5 flex-wrap">
        <button
          type="submit"
          disabled={submitting}
          className="font-body bg-dark text-gold px-7 py-3.5 rounded-xl text-[15px] font-bold shadow-lg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? 'Sending...' : "Show us what you're seeing"}
        </button>
        <span className="font-body text-[12.5px] text-ink-mid">
          We&apos;ll review what you&apos;ve shared and reply within five business days — including the no.
        </span>
      </div>
      <p className="font-body text-[11.5px] text-ink-mid/70">
        Your information stays private. We&apos;ll only use it to understand how we can help.
      </p>
      {submitError && (
        <p className="font-body text-[13px] text-red-700">
          Something went wrong sending your info. Please try again in a moment.
        </p>
      )}
    </form>
  )
}
