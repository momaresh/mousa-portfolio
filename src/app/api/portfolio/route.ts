import { NextResponse } from 'next/server'
import { getPortfolioData } from '@/lib/portfolio/get-portfolio'

export async function GET() {
  try {
    const data = await getPortfolioData()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
