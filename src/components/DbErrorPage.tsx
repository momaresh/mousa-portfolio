'use client'

interface Props {
  error?: string
}

export default function DbErrorPage({ error }: Props) {
  const isConnError =
    error?.includes('P1001') ||
    error?.includes("Can't reach") ||
    error?.includes('PrismaClientInitializationError')

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-5 text-ink">
      <div className="w-full max-w-md border border-line bg-surface p-8">
        <p className="section-label">Error</p>
        <h1 className="font-display mt-3 text-3xl">Database unavailable</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {isConnError
            ? 'Cannot reach the database. Wake Neon, check your connection string, or disable VPN if Postgres port 5432 is blocked.'
            : 'Failed to load portfolio data.'}
        </p>
        {error && (
          <pre className="mt-5 overflow-x-auto border border-line bg-bg p-3 text-left text-[11px] text-muted">
            {error.slice(0, 280)}
          </pre>
        )}
        <button type="button" onClick={() => window.location.reload()} className="btn-solid mt-6">
          Retry
        </button>
      </div>
    </div>
  )
}
