import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/admin-auth'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const profile = await prisma.profile.findFirst()
  return NextResponse.json(profile)
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await request.json()
  const profile = await prisma.profile.findFirst()
  if (!profile) {
    const created = await prisma.profile.create({ data })
    return NextResponse.json(created)
  }
  const updated = await prisma.profile.update({ where: { id: profile.id }, data })
  return NextResponse.json(updated)
}
