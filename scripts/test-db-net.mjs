import net from 'net'
import tls from 'tls'
import dns from 'dns/promises'

const host = 'ep-raspy-grass-aq9lfcar-pooler.c-8.us-east-1.aws.neon.tech'
const port = 5432

const records = await dns.lookup(host, { all: true })
console.log('dns.lookup all=', records)

for (const rec of records) {
  const label = `${rec.family === 6 ? 'IPv6' : 'IPv4'} ${rec.address}`
  await new Promise((resolve) => {
    const socket = net.connect({ host: rec.address, port, family: rec.family }, () => {
      console.log(label, 'TCP_OK')
      socket.end()
      resolve()
    })
    socket.setTimeout(5000)
    socket.on('timeout', () => {
      console.log(label, 'TCP_TIMEOUT')
      socket.destroy()
      resolve()
    })
    socket.on('error', (err) => {
      console.log(label, 'TCP_FAIL', err.message)
      resolve()
    })
  })
}

// Prefer IPv4 for TLS probe
const ipv4 = records.find((r) => r.family === 4)
if (ipv4) {
  await new Promise((resolve) => {
    const socket = tls.connect(
      {
        host: ipv4.address,
        port,
        servername: host,
        rejectUnauthorized: false,
      },
      () => {
        console.log('TLS_IPv4_OK')
        socket.end()
        resolve()
      },
    )
    socket.setTimeout(8000)
    socket.on('timeout', () => {
      console.log('TLS_IPv4_TIMEOUT')
      socket.destroy()
      resolve()
    })
    socket.on('error', (err) => {
      console.log('TLS_IPv4_FAIL', err.message)
      resolve()
    })
  })
}
