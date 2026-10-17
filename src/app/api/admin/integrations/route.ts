import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/admin-auth'
import { parseIntegrationInput } from '@/lib/admin-bilingual'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const integrations = await prisma.integration.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(integrations)
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const data = parseIntegrationInput(await request.json())
    const integration = await prisma.integration.create({ data })
    return NextResponse.json(integration)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid integration' }, { status: 400 })
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
    const data = parseIntegrationInput(raw)
    const integration = await prisma.integration.update({ where: { id }, data })
    return NextResponse.json(integration)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid integration' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  await prisma.integration.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
