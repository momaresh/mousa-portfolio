import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/admin-auth'

function educationPayload(data: Record<string, unknown>) {
  return {
    degree: String(data.degree ?? ''),
    degreeAr: data.degreeAr ? String(data.degreeAr) : null,
    institution: String(data.institution ?? ''),
    institutionAr: data.institutionAr ? String(data.institutionAr) : null,
    description: data.description ? String(data.description) : null,
    descriptionAr: data.descriptionAr ? String(data.descriptionAr) : null,
    startDate: String(data.startDate ?? ''),
    endDate: data.endDate ? String(data.endDate) : null,
    isCurrent: Boolean(data.isCurrent),
    location: data.location ? String(data.location) : null,
    sortOrder: Number(data.sortOrder ?? 0),
  }
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const educations = await prisma.education.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(educations)
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await request.json()
  const education = await prisma.education.create({ data: educationPayload(data) })
  return NextResponse.json(education)
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id, ...data } = await request.json()
  const education = await prisma.education.update({
    where: { id },
    data: educationPayload(data),
  })
  return NextResponse.json(education)
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await request.json()
  await prisma.education.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
