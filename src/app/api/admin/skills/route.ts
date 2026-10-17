import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/admin-auth'
import { parseSkillInput } from '@/lib/admin-bilingual'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const skills = await prisma.skill.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(skills)
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const data = parseSkillInput(await request.json())
    const skill = await prisma.skill.create({ data })
    return NextResponse.json(skill)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid skill' }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const { id, ...raw } = body
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }
    const data = parseSkillInput(raw)
    const skill = await prisma.skill.update({ where: { id }, data })
    return NextResponse.json(skill)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid skill' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  await prisma.skill.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
