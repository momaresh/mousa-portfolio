import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const src =
  process.argv[2] ||
  path.join(process.env.USERPROFILE || '', 'Downloads', '35749a91-e854-4951-979b-d5c0dae798ab.jpeg')

const outPublic = path.join(root, 'public', 'images')
const outApp = path.join(root, 'src', 'app')
fs.mkdirSync(outPublic, { recursive: true })
fs.mkdirSync(outApp, { recursive: true })

const meta = await sharp(src).rotate().metadata()
const w = meta.width
const h = meta.height

// Tight head-and-shoulders 4:5 crop — cut keyboard / lower desk clutter
const cropW = Math.round(w * 0.78)
const cropH = Math.round(cropW / (4 / 5))
const left = Math.max(0, Math.floor(w * 0.18))
const top = Math.max(0, Math.floor(h * 0.02))
const extract = {
  left,
  top,
  width: Math.min(cropW, w - left),
  height: Math.min(cropH, h - top),
}

await sharp(src)
  .rotate()
  .extract(extract)
  .modulate({ brightness: 1.05, saturation: 1.04 })
  .sharpen({ sigma: 0.9 })
  .resize(960, 1200, { fit: 'cover', position: 'top' })
  .jpeg({ quality: 92 })
  .toFile(path.join(outPublic, 'avatar.jpg'))

// Square for favicons / CV
const sqSize = Math.min(extract.width, Math.round(extract.height * 0.85))
const sqLeft = extract.left + Math.floor((extract.width - sqSize) / 2)
const sqTop = extract.top

await sharp(src)
  .rotate()
  .extract({ left: sqLeft, top: sqTop, width: sqSize, height: sqSize })
  .modulate({ brightness: 1.05, saturation: 1.04 })
  .sharpen({ sigma: 0.9 })
  .resize(1024, 1024)
  .jpeg({ quality: 92 })
  .toFile(path.join(outPublic, 'avatar-square.jpg'))

const squareBuf = await sharp(path.join(outPublic, 'avatar-square.jpg'))
  .resize(512, 512)
  .png()
  .toBuffer()

await sharp(squareBuf).toFile(path.join(outApp, 'icon.png'))
await sharp(squareBuf).resize(180, 180).png().toFile(path.join(outApp, 'apple-icon.png'))
await sharp(squareBuf).resize(32, 32).png().toFile(path.join(root, 'public', 'favicon-32.png'))
await sharp(squareBuf).resize(180, 180).png().toFile(path.join(root, 'public', 'apple-touch-icon.png'))
await sharp(squareBuf).resize(512, 512).png().toFile(path.join(root, 'public', 'icon-512.png'))

const portraitSmall = await sharp(path.join(outPublic, 'avatar.jpg')).resize(420, 525).png().toBuffer()

const svg = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0c0f0e"/>
        <stop offset="100%" stop-color="#1a2420"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    <text x="560" y="240" font-family="Georgia, serif" font-size="48" fill="#f2efe8">Mousa Marsh</text>
    <text x="560" y="300" font-family="Arial, sans-serif" font-size="26" fill="#a8b5ae">Accountant &amp; Financial Operations</text>
    <text x="560" y="360" font-family="Arial, sans-serif" font-size="20" fill="#7a8a82">Accounting · Reporting · Branch Operations</text>
    <text x="560" y="420" font-family="Arial, sans-serif" font-size="18" fill="#5f6f68">Mutakamil Plus · Onyx Pro</text>
  </svg>
`)

await sharp(svg)
  .composite([{ input: portraitSmall, left: 72, top: 52 }])
  .jpeg({ quality: 88 })
  .toFile(path.join(outApp, 'opengraph-image.jpg'))

await sharp(path.join(outApp, 'opengraph-image.jpg')).toFile(path.join(outApp, 'twitter-image.jpg'))
fs.copyFileSync(path.join(outApp, 'opengraph-image.jpg'), path.join(outPublic, 'og.jpg'))

console.log('Avatar + SEO assets ready', extract)
