import type {Metadata} from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | RampRate',
  description: 'How RampRate handles your data. Privacy policy for ramprate.com.',
}

const sections = [
  {
    title: '1. Information We Collect',
    body: 'When you use our website or contact us, we may collect: your name, email address, company name, job title, phone number, and any message content you provide through our contact forms. We also collect standard web analytics data (page views, referral sources, device type) through privacy-respecting analytics.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use the information we collect to: respond to your inquiries, provide advisory services, send relevant updates about our practices (only with your consent), improve our website experience, and comply with legal obligations. We do not sell your personal information to third parties.',
  },
  {
    title: '3. Data Storage & Security',
    body: 'Your data is stored on secure, encrypted servers. We implement industry-standard security measures including SSL/TLS encryption, access controls, and regular security audits. Contact form submissions are stored in our secure database and accessible only to authorized RampRate principals.',
  },
  {
    title: '4. Cookies',
    body: 'We use essential cookies to ensure our website functions properly and analytics cookies to understand how visitors interact with our site. You can control cookie preferences through your browser settings. We do not use advertising or tracking cookies.',
  },
  {
    title: '5. Third-Party Services',
    body: 'We may use third-party services for analytics, form processing, and email communications. These services have their own privacy policies and we ensure they meet our data protection standards. We do not share your personal information with third parties for marketing purposes.',
  },
  {
    title: '6. Your Rights',
    body: 'You have the right to: access the personal data we hold about you, request correction of inaccurate data, request deletion of your data, opt out of communications, and lodge a complaint with a supervisory authority. To exercise these rights, contact us at privacy@ramprate.com.',
  },
  {
    title: '7. Data Retention',
    body: 'We retain your personal information only as long as necessary to fulfill the purposes for which it was collected, or as required by law. Contact form data is retained for up to 3 years unless you request earlier deletion.',
  },
  {
    title: '8. Changes to This Policy',
    body: 'We may update this privacy policy from time to time. We will notify you of any material changes by posting the updated policy on this page with a revised "Last Updated" date.',
  },
  {
    title: '9. Contact',
    body: null,
    contact: true,
  },
]

export default function PrivacyPage() {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden"
        style={{background: 'linear-gradient(135deg, oklch(0.14 0.01 250) 0%, oklch(0.18 0.02 260) 50%, oklch(0.14 0.01 250) 100%)'}}
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none" style={{background: 'oklch(0.55 0.22 260)', filter: 'blur(80px)'}} />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full opacity-10 pointer-events-none" style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-6">
            <span
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5"
              style={{fontFamily: 'var(--font-body)'}}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{background: 'oklch(0.55 0.22 260)'}} />
              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/50">Legal</span>
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white max-w-3xl"
            style={{fontFamily: 'var(--font-display)'}}
          >
            Privacy Policy
          </h1>
          <p
            className="mt-6 text-base sm:text-lg text-white/50 leading-relaxed max-w-2xl"
            style={{fontFamily: 'var(--font-body)'}}
          >
            How we handle your data
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20" style={{background: '#0d1117'}}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-10">
          <p
            className="text-sm text-white/40 uppercase tracking-widest"
            style={{fontFamily: 'var(--font-mono)'}}
          >
            Last Updated: April 2026
          </p>

          {sections.map((s) => (
            <div key={s.title}>
              <h2
                className="text-2xl font-bold text-white mb-4"
                style={{fontFamily: 'var(--font-display)'}}
              >
                {s.title}
              </h2>
              {s.contact ? (
                <p className="text-white/70 text-base leading-relaxed" style={{fontFamily: 'var(--font-body)'}}>
                  For questions about this privacy policy or our data practices, contact us at:{' '}
                  <a
                    href="mailto:privacy@ramprate.com"
                    className="text-[oklch(0.82_0.15_75)] hover:underline"
                  >
                    privacy@ramprate.com
                  </a>
                </p>
              ) : (
                <p className="text-white/70 text-base leading-relaxed" style={{fontFamily: 'var(--font-body)'}}>
                  {s.body}
                </p>
              )}
            </div>
          ))}

          <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-white/30 text-sm" style={{fontFamily: 'var(--font-body)'}}>
              RampRate, Inc. · Los Angeles, CA · Certified B Corporation
            </p>
            <Link
              href="/contact"
              className="text-sm font-semibold text-[oklch(0.82_0.15_75)] hover:underline"
              style={{fontFamily: 'var(--font-body)'}}
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
