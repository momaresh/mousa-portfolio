import pg from 'pg'
import { readFileSync } from 'fs'
import dns from 'dns/promises'

const raw = readFileSync('.env', 'utf8')
const get = (k) => {
  const m = raw.match(new RegExp(`^${k}="([^"]*)"`, 'm'))
  return m?.[1]
}

const original =
  get('DATABASE_URL_ORIGINAL') ||
  get('DATABASE_URL')

const u = new URL(original.includes('ep-') ? original : get('DATABASE_URL_ORIGINAL'))
// Prefer canonical hostname forms
let host = u.hostname
if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
  // restore from original comment if needed
  host = 'ep-raspy-grass-aq9lfcar-pooler.c-8.us-east-1.aws.neon.tech'
}

const ipv4 = (await dns.lookup(host, { all: true })).find((r) => r.family === 4)?.address
const endpointId = host.match(/^(ep-[a-z0-9-]+?)(?:-pooler)?\./i)?.[1]
console.log({ host, ipv4, endpointId, user: u.username })

const configs = [
  {
    name: 'hostname-default',
    connectionString: `postgresql://${u.username}:${decodeURIComponent(u.password)}@${host}:5432${u.pathname}?sslmode=require`,
  },
  {
    name: 'ipv4-hostaddr',
    connectionString: `postgresql://${u.username}:${decodeURIComponent(u.password)}@${host}:5432${u.pathname}?sslmode=require&hostaddr=${ipv4}`,
  },
  {
    name: 'ipv4-as-host+endpoint',
    connectionString: `postgresql://${u.username}:${decodeURIComponent(u.password)}@${ipv4}:5432${u.pathname}?sslmode=require&options=endpoint%3D${endpointId}`,
  },
]

for (const cfg of configs) {
  const client = new pg.Client({
    connectionString: cfg.connectionString,
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false },
  })
  try {
    await client.connect()
    const r = await client.query('select 1 as ok')
    console.log(cfg.name, 'OK', r.rows)
    await client.end()
    break
  } catch (e) {
    console.log(cfg.name, 'FAIL', e.code || '', e.message.slice(0, 200))
    try {
      await client.end()
    } catch {
      /* ignore */
    }
  }
}
