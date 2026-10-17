# Mousa Marsh Portfolio

CV / portfolio for **Mousa Abdulhafiz Qaid Marsh** (محاسب والعمليات المالية).

Stack: Next.js 16 · Prisma · Neon · bilingual AR/EN · admin panel.

## Root causes (Windows / this machine)

1. **Tailwind resolve from `Desktop`** — a parent `package.json` under the user home makes Turbopack pick the wrong workspace root. Fixed in `next.config.ts` via `turbopack.root` + `outputFileTracingRoot` pointing at this project.
2. **Hung compile / Google Fonts** — `next/font/google` was fetching fonts at compile time and timing out. Fonts are now local CSS stacks in `globals.css` (no network).
3. **Prisma P1001** — Neon often fails over IPv6 on Windows. Wake the Neon project, then run `npm run db:fix-ipv4` if needed.

## Setup

```bash
cd C:\Users\Mo_Maresh\Desktop\mousa-portfolio
npm install
# ensure Neon is Active, then:
npm run db:fix-ipv4   # only if P1001 / IPv6 issues
npx prisma db push
npm run db:seed
npm run dev
```

## Checks

```bash
npm run typecheck
npm run lint
```

## Admin

- `/admin/login`
- `admin@mousamarsh.com` / `admin123` (change after first use)

## Sections

Hero · About · Stats · Experience · Education · Skills · Services · Systems · Contact · printable `/cv`

Default UI language: **Arabic**.
