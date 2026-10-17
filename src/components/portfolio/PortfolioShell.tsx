'use client'

import type { PortfolioData } from '@/lib/portfolio/types'
import { Navbar } from './Navbar'
import { Hero } from './Hero'
import { About } from './About'
import { StatsBar } from './StatsBar'
import { Experience } from './Experience'
import { Education } from './Education'
import { Skills } from './Skills'
import { Services } from './Services'
import { Integrations } from './Integrations'
import { Contact } from './Contact'
import { Footer } from './Footer'

export default function PortfolioShell(data: PortfolioData) {
  return (
    <>
      <Navbar />
      <main>
        <Hero profile={data.profile} />
        <About profile={data.profile} />
        <StatsBar stats={data.stats} />
        <Experience experiences={data.experiences} />
        <Education educations={data.educations} />
        <Skills skills={data.skills} />
        <Services services={data.services} />
        <Integrations integrations={data.integrations} />
        <Contact profile={data.profile} />
      </main>
      <Footer profile={data.profile} />
    </>
  )
}
