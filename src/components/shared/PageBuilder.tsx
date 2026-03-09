import Hero from '@/components/sections/Hero'
import ServicePillars from '@/components/sections/ServicePillars'
import LogoBar from '@/components/sections/LogoBar'
import TextSection from '@/components/sections/TextSection'
import CtaSection from '@/components/sections/CtaSection'
import TeamGrid from '@/components/sections/TeamGrid'
import BlogLatest from '@/components/sections/BlogLatest'
import ImpactSection from '@/components/sections/ImpactSection'
import ContactFormSection from '@/components/sections/ContactFormSection'

const componentMap: Record<string, React.ComponentType<Record<string, unknown>>> = {
  hero: Hero as React.ComponentType<Record<string, unknown>>,
  servicePillars: ServicePillars as React.ComponentType<Record<string, unknown>>,
  logoBar: LogoBar as React.ComponentType<Record<string, unknown>>,
  textSection: TextSection as React.ComponentType<Record<string, unknown>>,
  ctaSection: CtaSection as React.ComponentType<Record<string, unknown>>,
  teamGrid: TeamGrid as React.ComponentType<Record<string, unknown>>,
  blogLatest: BlogLatest as React.ComponentType<Record<string, unknown>>,
  impactSection: ImpactSection as React.ComponentType<Record<string, unknown>>,
  contactForm: ContactFormSection as React.ComponentType<Record<string, unknown>>,
}

interface Section {
  _type: string
  _key: string
  [key: string]: unknown
}

export default function PageBuilder({sections}: {sections?: Section[]}) {
  if (!sections) return null

  return (
    <>
      {sections.map((section) => {
        const Component = componentMap[section._type]
        if (!Component) {
          console.warn(`Unknown section type: ${section._type}`)
          return null
        }
        return <Component key={section._key} {...section} />
      })}
    </>
  )
}
