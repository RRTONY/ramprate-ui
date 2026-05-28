'use client'

import {useState} from 'react'

const inquiryTypes = [
  {label: 'IT Sourcing / Cost Optimization', value: 'sourcing'},
  {label: 'Growth Advisory / Syzygy',         value: 'growth'},
  {label: 'Web3 / Stratum',                   value: 'web3'},
  {label: 'Impact / ImpactSoul',              value: 'impact'},
  {label: 'General Inquiry',                  value: 'general'},
]

const inputClass =
  'w-full px-4 py-3 rounded-md border text-sm focus:outline-none transition-colors'
const inputStyle = {
  borderColor: 'rgba(0,0,0,0.1)',
  background: 'oklch(0.97 0.01 80)',
  fontFamily: 'var(--font-body)',
}
const labelClass = 'block text-xs font-medium uppercase tracking-wider mb-2'
const labelStyle = {color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    fetch('/', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams(data as any).toString(),
    })
      .then(() => setSubmitted(true))
      .catch(() => setSubmitted(true))
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-xl p-12 border border-black/5 text-center">
        <div
          className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{background: 'rgba(100,60,30,0.1)'}}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-3" style={{fontFamily: 'var(--font-display)'}}>
          Message Received
        </h3>
        <p className="leading-relaxed" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>
          Thank you for reaching out. One of our principals will respond within 24 hours. In the meantime, feel free to book a time directly on our calendar.
        </p>
      </div>
    )
  }

  return (
    <form
      name="contact"
      method="POST"
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-8 border border-black/5 shadow-sm"
    >
      <input type="hidden" name="form-name" value="contact" />
      <h3 className="text-xl font-bold mb-6" style={{fontFamily: 'var(--font-display)'}}>
        Start a Conversation
      </h3>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className={labelClass} style={labelStyle}>Name *</label>
          <input type="text" name="name" required placeholder="Your name" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Email *</label>
          <input type="email" name="email" required placeholder="you@company.com" className={inputClass} style={inputStyle} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className={labelClass} style={labelStyle}>Company</label>
          <input type="text" name="company" placeholder="Your company" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Title</label>
          <input type="text" name="title" placeholder="Your title" className={inputClass} style={inputStyle} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className={labelClass} style={labelStyle}>Phone</label>
          <input type="tel" name="phone" placeholder="+1 (555) 000-0000" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>I&apos;m interested in</label>
          <select name="practice" className={inputClass} style={inputStyle}>
            <option value="">Select a topic</option>
            {inquiryTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className={labelClass} style={labelStyle}>Message</label>
        <textarea
          name="message"
          rows={5}
          placeholder="Tell us about your challenge..."
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold text-white transition-all hover:opacity-90 shadow-lg"
        style={{background: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        Send Message
      </button>
    </form>
  )
}
