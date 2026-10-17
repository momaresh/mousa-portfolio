import { prisma } from '@/lib/prisma'
import type { PortfolioData } from './types'

export async function getPortfolioData(): Promise<PortfolioData> {
  const [profile, skills, experiences, educations, services, stats, integrations] =
    await Promise.all([
      prisma.profile.findFirst(),
      prisma.skill.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.experience.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.education.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.service.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.stat.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.integration.findMany({ orderBy: { sortOrder: 'asc' } }),
    ])

  const testimonials = await prisma.testimonial
    .findMany({ orderBy: { sortOrder: 'asc' } })
    .catch(() => [])

  return {
    profile,
    skills,
    experiences,
    educations,
    services,
    testimonials,
    stats,
    integrations,
  }
}
