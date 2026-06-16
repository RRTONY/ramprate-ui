import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Our Process — How RampRate Delivers',
  description:
    "RampRate's advisory process aligns the right roles, removes friction, and turns strategy into execution — from ideation to orchestration and measurable results.",
  alternates: {canonical: '/process'},
  openGraph: {
    title: 'Our Process — How RampRate Delivers | RampRate',
    description:
      'How RampRate aligns roles, removes friction, and turns strategy into execution.',
    url: 'https://ramprate.com/process',
  },
}

export default function ProcessLayout({children}: {children: React.ReactNode}) {
  return children
}
