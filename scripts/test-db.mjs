import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'

function loadEnv() {
  const raw = readFileSync('.env', 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (!m) continue
    let v = m[2].trim()
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1)
    }
    process.env[m[1]] = v
  }
}

function stripChannelBinding(url) {
  if (!url) return url
  return url
    .replace(/([&?])channel_binding=require&?/g, '$1')
    .replace(/[?&]$/, '')
}

loadEnv()

const databaseUrl = stripChannelBinding(process.env.DATABASE_URL)
const directUrl = stripChannelBinding(process.env.DIRECT_URL || databaseUrl)

process.env.DATABASE_URL = databaseUrl
process.env.DIRECT_URL = directUrl

console.log('host=', new URL(databaseUrl).host)

const prisma = new PrismaClient()

try {
  await prisma.$connect()
  const rows = await prisma.$queryRawUnsafe('select 1 as ok')
  console.log('CONNECT_OK', rows)
} catch (e) {
  console.error('CONNECT_FAIL', e.code || '', String(e.message).slice(0, 400))
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
