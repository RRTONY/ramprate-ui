'use client'

import {useState} from 'react'

interface ContactFormSectionProps {
  heading?: string
  description?: string
}

export default function ContactFormSection({heading, description}: ContactFormSectionProps) {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600">We&apos;ll get back to you shortly.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {heading && (
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">{heading}</h2>
        )}
        {description && (
          <p className="text-center text-gray-600 mb-8">{description}</p>
        )}
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={() => setSubmitted(true)}
          className="space-y-6"
        >
          <input type="hidden" name="form-name" value="contact" />
          <p className="hidden">
            <label>
              Don&apos;t fill this out: <input name="bot-field" />
            </label>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="jobFunction" className="block text-sm font-medium text-gray-700 mb-1">
              Job Function
            </label>
            <select
              id="jobFunction"
              name="jobFunction"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="executive">Executive</option>
              <option value="it">IT</option>
              <option value="procurement">Procurement</option>
              <option value="finance">Finance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
