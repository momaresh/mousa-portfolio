import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/admin-auth'
import { parseServiceInput } from '@/lib/admin-bilingual'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const services = await prisma.service.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(services)
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const data = parseServiceInput(await request.json())
    const service = await prisma.service.create({ data })
    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid service' }, { status: 400 })
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
    const data = parseServiceInput(raw)
    const service = await prisma.service.update({ where: { id }, data })
    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid service' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  await prisma.service.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
