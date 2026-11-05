import { useEffect } from 'react'
import { useDocumentMeta } from '@/lib/hooks'
import { scrollToSection, useRouter } from '@/lib/router'
import { Hero } from '@/components/home/Hero'
import { Marquee } from '@/components/home/Marquee'
import { Work } from '@/components/home/Work'
import { Services } from '@/components/home/Services'
import { About } from '@/components/home/About'
import { Process } from '@/components/home/Process'
import { Contact } from '@/components/home/Contact'
import { Footer } from '@/components/layout/Footer'

export function HomePage() {
  const { pendingSection } = useRouter()
  useDocumentMeta()
  useEffect(() => {
    const id = pendingSection.current
    if (!id) return
    pendingSection.current = null
    const t = setTimeout(() => scrollToSection(id, false), 60)
    return () => clearTimeout(t)
  }, [pendingSection])
  return (
    <>
      <Hero />
      <Marquee />
      <Work />
      <Services />
      <About />
      <Process />
      <Contact />
      <Footer />
    </>
  )
}
