import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const src = process.argv[2]
const outPublic = path.join(root, 'public', 'images')
const outApp = path.join(root, 'src', 'app')

fs.mkdirSync(outPublic, { recursive: true })
fs.mkdirSync(outApp, { recursive: true })

const meta = await sharp(src).metadata()
const size = Math.min(meta.width, meta.height)
const left = Math.floor((meta.width - size) / 2)
const top = Math.floor((meta.height - size) / 2)

await sharp(src)
  .extract({ left, top, width: size, height: size })
  .resize(1024, 1024)
  .jpeg({ quality: 90 })
  .toFile(path.join(outPublic, 'avatar.jpg'))

await sharp(src)
  .extract({ left, top, width: size, height: size })
  .resize(512, 512)
  .png()
  .toFile(path.join(outApp, 'icon.png'))

await sharp(src)
  .extract({ left, top, width: size, height: size })
  .resize(180, 180)
  .png()
  .toFile(path.join(outApp, 'apple-icon.png'))

await sharp(src)
  .extract({ left, top, width: size, height: size })
  .resize(32, 32)
  .png()
  .toFile(path.join(root, 'public', 'favicon-32.png'))

const portrait = await sharp(src)
  .extract({ left, top, width: size, height: size })
  .resize(520, 520)
  .png()
  .toBuffer()

const svg = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0c0f0e"/>
        <stop offset="100%" stop-color="#1a2420"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    <text x="640" y="250" font-family="Georgia, serif" font-size="52" fill="#f2efe8">Mousa Marsh</text>
    <text x="640" y="310" font-family="Arial, sans-serif" font-size="26" fill="#a8b5ae">Accountant &amp; Financial Operations</text>
    <text x="640" y="370" font-family="Arial, sans-serif" font-size="20" fill="#7a8a82">Accounting · Reporting · Branch Operations</text>
    <text x="640" y="430" font-family="Arial, sans-serif" font-size="18" fill="#5f6f68">Mutakamil Plus · Onyx Pro</text>
  </svg>
`)

await sharp(svg)
  .composite([{ input: portrait, left: 80, top: 55 }])
  .jpeg({ quality: 88 })
  .toFile(path.join(outApp, 'opengraph-image.jpg'))

await sharp(path.join(outApp, 'opengraph-image.jpg')).toFile(
  path.join(outApp, 'twitter-image.jpg'),
)

fs.copyFileSync(path.join(outApp, 'opengraph-image.jpg'), path.join(outPublic, 'og.jpg'))

console.log('SEO assets generated from', src)
