/**
 * Restores DATABASE_URL_ORIGINAL / DIRECT_URL_ORIGINAL when they were
 * corrupted after an IPv4 rewrite (hostname became a bare IP).
 *
 * Usage:
 *   node scripts/restore-neon-originals.mjs
 *
 * Reads password from the current DATABASE_URL, and hostnames from
 * NEON_POOLER_HOST / NEON_DIRECT_HOST env overrides or the defaults below.
 */
import { readFileSync, writeFileSync } from 'fs'

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

const current = get('DATABASE_URL')
if (!current) {
  throw new Error('DATABASE_URL missing')
}

const parsed = new URL(current)
const user = parsed.username
const password = decodeURIComponent(parsed.password)
const dbName = parsed.pathname || '/neondb'

const poolerHost =
  process.env.NEON_POOLER_HOST || 'ep-tiny-river-b4zu4fn7-pooler.c-6.us-east-2.aws.neon.tech'
const directHost =
  process.env.NEON_DIRECT_HOST || 'ep-tiny-river-b4zu4fn7.c-6.us-east-2.aws.neon.tech'

set(
  'DATABASE_URL_ORIGINAL',
  `postgresql://${user}:${password}@${poolerHost}${dbName}?sslmode=require`,
)
set(
  'DIRECT_URL_ORIGINAL',
  `postgresql://${user}:${password}@${directHost}${dbName}?sslmode=require`,
)

writeFileSync(envPath, raw)
console.log('Restored DATABASE_URL_ORIGINAL and DIRECT_URL_ORIGINAL hostnames')
