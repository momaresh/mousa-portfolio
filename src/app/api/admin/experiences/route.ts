import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/admin-auth'

function experiencePayload(data: Record<string, unknown>) {
  return {
    company: String(data.company ?? ''),
    companyAr: data.companyAr ? String(data.companyAr) : null,
    position: String(data.position ?? ''),
    positionAr: data.positionAr ? String(data.positionAr) : null,
    description: String(data.description ?? ''),
    descriptionAr: data.descriptionAr ? String(data.descriptionAr) : null,
    startDate: String(data.startDate ?? ''),
    endDate: data.endDate ? String(data.endDate) : null,
    isCurrent: Boolean(data.isCurrent),
    location: data.location ? String(data.location) : null,
    type: String(data.type ?? 'fulltime'),
    logoUrl: data.logoUrl ? String(data.logoUrl) : null,
    websiteUrl: data.websiteUrl ? String(data.websiteUrl) : null,
    sortOrder: Number(data.sortOrder ?? 0),
  }
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const experiences = await prisma.experience.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(experiences)
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await request.json()
  const experience = await prisma.experience.create({ data: experiencePayload(data) })
  return NextResponse.json(experience)
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...data } = await request.json()
  const experience = await prisma.experience.update({
    where: { id },
    data: experiencePayload(data),
  })
  return NextResponse.json(experience)
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  await prisma.experience.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
