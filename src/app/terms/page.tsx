import type {Metadata} from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | RampRate',
  description: 'Terms governing use of the RampRate website.',
}

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing and using this website (ramprate.com), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use this website.',
  },
  {
    title: '2. Description of Services',
    body: 'RampRate, Inc. provides enterprise advisory services including IT sourcing intelligence, growth strategy, Web3 advisory, and impact consulting. This website provides information about our services, thought leadership content, and contact mechanisms. The content on this site is for informational purposes and does not constitute professional advice.',
  },
  {
    title: '3. Intellectual Property',
    body: 'All content on this website — including text, graphics, logos, images, data compilations, and software — is the property of RampRate, Inc. or its content suppliers and is protected by intellectual property laws. The RampRate name, logo, SPY Index, Flow Circuit, and related marks are trademarks of RampRate, Inc.',
  },
  {
    title: '4. Use of Content',
    body: 'You may view, download, and print content from this website for personal, non-commercial use only. You may not reproduce, distribute, modify, or create derivative works from any content without prior written consent from RampRate, Inc. Blog articles may be shared with proper attribution and a link to the original post.',
  },
  {
    title: '5. User Submissions',
    body: 'When you submit information through our contact forms, you grant RampRate the right to use that information to respond to your inquiry and provide relevant services. We will handle your information in accordance with our Privacy Policy.',
  },
  {
    title: '6. Disclaimer of Warranties',
    body: 'This website and its content are provided "as is" without warranties of any kind, either express or implied. RampRate does not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components. Past performance data and case studies referenced on this site do not guarantee future results.',
  },
  {
    title: '7. Limitation of Liability',
    body: 'RampRate, Inc. shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of this website or reliance on any information provided herein.',
  },
  {
    title: '8. External Links',
    body: 'This website may contain links to third-party websites. RampRate is not responsible for the content or privacy practices of those sites. Links are provided for convenience and do not imply endorsement.',
  },
  {
    title: '9. Governing Law',
    body: 'These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.',
  },
  {
    title: '10. Contact',
    body: null,
    contact: true,
  },
]

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p
            className="mt-6 text-base sm:text-lg text-white/50 leading-relaxed max-w-2xl"
            style={{fontFamily: 'var(--font-body)'}}
          >
            Terms governing use of this website
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
            Last Updated: February 2026
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
                  For questions about these terms, contact us at:{' '}
                  <a
                    href="mailto:legal@ramprate.com"
                    className="text-[oklch(0.82_0.15_75)] hover:underline"
                  >
                    legal@ramprate.com
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
              href="/privacy"
              className="text-sm font-semibold text-[oklch(0.82_0.15_75)] hover:underline"
              style={{fontFamily: 'var(--font-body)'}}
            >
              Privacy Policy →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
