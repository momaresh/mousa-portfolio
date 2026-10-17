/**
 * Neon on some Windows networks: IPv6 resolves first and times out → Prisma P1001.
 * Rewrite URLs to connect via IPv4 address + Neon endpoint option.
 */
import { readFileSync, writeFileSync } from 'fs'
import dns from 'dns/promises'

const envPath = '.env'
let raw = readFileSync(envPath, 'utf8')

function get(key) {
  const m = raw.match(new RegExp(`^${key}="([^"]*)"`, 'm'))
  return m?.[1] || null
}

function set(key, value) {
  const line = `${key}="${value}"`
  if (new RegExp(`^${key}=`, 'm').test(raw)) {
    raw = raw.replace(new RegExp(`^${key}=.*$`, 'm'), line)
  } else {
    raw += `\n${line}\n`
  }
}

function neonEndpointId(hostname) {
  const m = hostname.match(/^(ep-[a-z0-9-]+?)(?:-pooler)?(?:\.|$)/i)
  return m?.[1] || null
}

async function forceIpv4FromHostname(hostname, user, password, pathname) {
  const endpointId = neonEndpointId(hostname)
  if (!endpointId) {
    throw new Error(`Cannot parse Neon endpoint id from ${hostname}`)
  }

  const looked = await dns.lookup(hostname, { all: true })
  const ipv4 = looked.find((r) => r.family === 4)?.address
  if (!ipv4) {
    throw new Error(`No IPv4 for ${hostname}`)
  }

  const u = new URL(`postgresql://${user}:${password}@${ipv4}${pathname}`)
  u.searchParams.set('sslmode', 'require')
  u.searchParams.set('connect_timeout', '30')
  u.searchParams.set('connection_limit', '5')
  u.searchParams.set('pool_timeout', '30')
  u.searchParams.set('options', `endpoint=${endpointId}`)
  // Neon pooler hostnames need pgbouncer mode for short-lived serverless/dev clients
  if (hostname.includes('-pooler')) {
    u.searchParams.set('pgbouncer', 'true')
  }

  console.log(`${hostname} -> ${ipv4} (endpoint=${endpointId})`)
  return u.toString()
}

function isNeonHostnameUrl(value) {
  try {
    const host = new URL(value).hostname
    return host.includes('neon.tech') || host.startsWith('ep-')
  } catch {
    return false
  }
}

function sourceUrl(primaryKey, originalKey) {
  const original = get(originalKey)
  const current = get(primaryKey)
  if (original && isNeonHostnameUrl(original)) return original
  if (current && isNeonHostnameUrl(current)) return current
  throw new Error(
    `No Neon hostname URL for ${primaryKey}. Run: node scripts/restore-neon-originals.mjs`,
  )
}

const dbSource = sourceUrl('DATABASE_URL', 'DATABASE_URL_ORIGINAL')
const directSource = sourceUrl('DIRECT_URL', 'DIRECT_URL_ORIGINAL')

const db = new URL(dbSource)
const direct = new URL(directSource)

if (!get('DATABASE_URL_ORIGINAL') || !isNeonHostnameUrl(get('DATABASE_URL_ORIGINAL'))) {
  set('DATABASE_URL_ORIGINAL', `postgresql://${db.username}:${decodeURIComponent(db.password)}@${db.hostname}${db.pathname}?sslmode=require`)
}
if (!get('DIRECT_URL_ORIGINAL') || !isNeonHostnameUrl(get('DIRECT_URL_ORIGINAL'))) {
  set(
    'DIRECT_URL_ORIGINAL',
    `postgresql://${direct.username}:${decodeURIComponent(direct.password)}@${direct.hostname}${direct.pathname}?sslmode=require`,
  )
}

set(
  'DATABASE_URL',
  await forceIpv4FromHostname(db.hostname, db.username, decodeURIComponent(db.password), db.pathname),
)
set(
  'DIRECT_URL',
  await forceIpv4FromHostname(
    direct.hostname,
    direct.username,
    decodeURIComponent(direct.password),
    direct.pathname,
  ),
)

writeFileSync(envPath, raw)
console.log('Updated .env to IPv4 + options=endpoint=... (pooler suffix stripped)')
