import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  // Parent package.json under the user home confuses Turbopack's workspace root
  // and breaks resolving `tailwindcss` from Desktop.
  turbopack: {
    root,
  },
  outputFileTracingRoot: root,
}

export default nextConfig
