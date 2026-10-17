import PortfolioShell from '@/components/portfolio/PortfolioShell'
import DbErrorPage from '@/components/DbErrorPage'
import { getPortfolioData } from '@/lib/portfolio/get-portfolio'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const result = await getPortfolioData()
    .then((data) => ({ ok: true as const, data }))
    .catch((error: unknown) => ({ ok: false as const, error }))

  if (!result.ok) {
    console.error('[Home] Database error:', result.error)
    return (
      <DbErrorPage
        error={result.error instanceof Error ? result.error.message : 'Unknown error'}
      />
    )
  }

  return <PortfolioShell {...result.data} />
}
