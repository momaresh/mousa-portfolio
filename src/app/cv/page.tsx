import { prisma } from '@/lib/prisma'
import CVDocument from './CVDocument'
import DbErrorPage from '@/components/DbErrorPage'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'CV — Mousa Marsh',
  description: 'Curriculum Vitae of Mousa Marsh, Accountant & Financial Operations.',
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ ats?: string }>
}

export default async function CVPage({ searchParams }: Props) {
  const params = await searchParams
  const ats = params?.ats === '1' || params?.ats === 'true'

  const result = await Promise.all([
    prisma.profile.findFirst(),
    prisma.skill.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.experience.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.education.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.service.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.stat.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])
    .then(([profile, skills, experiences, educations, services, stats]) => ({
      ok: true as const,
      profile,
      skills,
      experiences,
      educations,
      services,
      stats,
    }))
    .catch((error: unknown) => ({ ok: false as const, error }))

  if (!result.ok) {
    console.error('[CV] Database error:', result.error)
    return (
      <DbErrorPage
        error={result.error instanceof Error ? result.error.message : 'Unknown error'}
      />
    )
  }

  if (!result.profile) {
    return (
      <DbErrorPage error="Profile not found. Please seed the database first." />
    )
  }

  return (
    <CVDocument
      profile={result.profile}
      skills={result.skills}
      experiences={result.experiences}
      educations={result.educations}
      services={result.services}
      stats={result.stats}
      atsMode={ats}
    />
  )
}
