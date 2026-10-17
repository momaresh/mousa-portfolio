import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/admin-auth'
import { parseStatInput } from '@/lib/admin-bilingual'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const stats = await prisma.stat.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(stats)
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const data = parseStatInput(await request.json())
    const stat = await prisma.stat.create({ data })
    return NextResponse.json(stat)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid stat' }, { status: 400 })
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
    const data = parseStatInput(raw)
    const stat = await prisma.stat.update({ where: { id }, data })
    return NextResponse.json(stat)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid stat' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  await prisma.stat.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
