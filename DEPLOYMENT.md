# Deployment Guide — Mohammed Maresh Portfolio

## Table of Contents
1. [Server Provider Recommendations](#server-provider-recommendations)
2. [Option A: Deploy to Vercel (Recommended)](#option-a-deploy-to-vercel-recommended)
3. [Option B: Deploy to Netlify](#option-b-deploy-to-netlify)
4. [Option C: Deploy to a VPS (DigitalOcean/Hetzner)](#option-c-deploy-to-a-vps)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Environment Variables](#environment-variables)
7. [Database Considerations](#database-considerations)
8. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Server Provider Recommendations

### 🏆 1. Vercel (BEST for this project)
- **Price**: Free (Hobby plan) — perfect for portfolios
- **Why**: Built by the creators of Next.js, zero-config deployment
- **Features**: Auto SSL, CDN, preview deployments, serverless functions
- **Limits**: 100GB bandwidth/month, 1000 serverless function invocations/day (more than enough)
- **Control**: Full control via dashboard + CLI
- **URL**: https://vercel.com

### 2. Netlify
- **Price**: Free (Starter plan)
- **Why**: Easy deployment, good for static + serverless
- **Features**: Auto SSL, CDN, form handling, identity management
- **Limits**: 100GB bandwidth/month, 300 build minutes/month
- **URL**: https://netlify.com

### 3. Railway
- **Price**: $5/month (Hobby plan) with $5 free credits
- **Why**: Full server control, supports any framework
- **Features**: Auto SSL, databases, custom domains, environment variables
- **URL**: https://railway.app

### 4. DigitalOcean App Platform
- **Price**: $5/month (Basic plan)
- **Why**: More control, can scale up, supports databases
- **Features**: Auto SSL, CDN, managed databases, monitoring
- **URL**: https://digitalocean.com

### 5. Hetzner Cloud (VPS)
- **Price**: €3.79/month (CX22 — 2 vCPU, 4GB RAM)
- **Why**: Cheapest VPS, full root access, European data centers
- **Features**: Snapshots, firewalls, load balancers, volumes
- **URL**: https://hetzner.com/cloud

---

## Option A: Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account (push your code to a repo)
- Vercel account (sign up with GitHub)

### Step-by-Step

#### 1. Push Code to GitHub
```bash
cd maresh-portfolio
git init
git add .
git commit -m "Initial commit: Portfolio with admin dashboard"
git branch -M main
git remote add origin https://github.com/momaresh/maresh-portfolio.git
git push -u origin main
```

#### 2. Connect to Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `maresh-portfolio` repository
4. Vercel auto-detects Next.js — no configuration needed
5. Click **"Deploy"**

#### 3. Configure Build Settings (if needed)
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `npx prisma generate && next build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`

#### 4. Add Environment Variables
In Vercel dashboard → Settings → Environment Variables:
```
DATABASE_URL=file:./dev.db
```

#### 5. Database: Use Turso (SQLite in the cloud) ⚠️ REQUIRED

Since Vercel is serverless, local SQLite (`file:./dev.db`) **DOES NOT WORK**. Use **Turso** (free tier):

**Step 1: Install Turso CLI**
```bash
# Windows (PowerShell as Admin)
irm https://get.turso.tech/install.ps1 | iex

# Or using npm
npm install -g @turso/cli
```

**Step 2: Login & Create Database**
```bash
turso auth login
turso db create maresh-portfolio
```

**Step 3: Get Database URL & Token**
```bash
turso db show maresh-portfolio --url
# Output: libsql://maresh-portfolio-username.turso.io

turso db tokens create maresh-portfolio
# Output: your-auth-token
```

**Step 4: Set Environment Variables in Vercel**
Go to Vercel Dashboard → Project → Settings → Environment Variables:
```
DATABASE_URL=libsql://maresh-portfolio-username.turso.io?authToken=your-auth-token
```

**Step 5: Push Schema & Seed Data**
```bash
# Set local env temporarily
$env:DATABASE_URL="libsql://maresh-portfolio-username.turso.io?authToken=your-auth-token"

# Push schema
npx prisma db push

# Seed data
npx tsx prisma/seed.ts
```

**Step 6: Redeploy on Vercel**
```bash
vercel --prod
```

#### 6. Seed Database on Vercel
Add a postinstall script to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma db push && npx tsx prisma/seed.ts && next build"
  }
}
```

#### 7. Custom Domain
1. Go to Vercel dashboard → Settings → Domains
2. Add your domain (e.g., `maresh.dev`)
3. Update DNS records at your registrar:
   - Type: `CNAME`, Name: `@`, Value: `cname.vercel-dns.com`
   - Or Type: `A`, Name: `@`, Value: `76.76.21.21`

---

## Option B: Deploy to Netlify

### Step-by-Step

#### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
netlify login
```

#### 2. Configure Build
Create `netlify.toml` in project root:
```toml
[build]
  command = "npx prisma generate && npx prisma db push && npx tsx prisma/seed.ts && next build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### 3. Deploy
```bash
netlify init
netlify deploy --prod
```

---

## Option C: Deploy to a VPS

### Using Hetzner Cloud (€3.79/month) or DigitalOcean ($6/month)

#### 1. Create Server
- OS: Ubuntu 24.04
- Size: 2 vCPU, 4GB RAM minimum
- Location: Choose nearest to your audience

#### 2. SSH into Server
```bash
ssh root@your-server-ip
```

#### 3. Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx

# Install Certbot (SSL)
apt install -y certbot python3-certbot-nginx
```

#### 4. Clone and Build
```bash
# Clone your repo
cd /var/www
git clone https://github.com/momaresh/maresh-portfolio.git
cd maresh-portfolio

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema and seed
npx prisma db push
npx tsx prisma/seed.ts

# Build
npm run build
```

#### 5. Configure PM2
```bash
# Start with PM2
pm2 start npm --name "portfolio" -- start

# Auto-restart on server reboot
pm2 startup
pm2 save
```

#### 6. Configure Nginx
```bash
nano /etc/nginx/sites-available/portfolio
```

Add:
```nginx
server {
    listen 80;
    server_name maresh.dev www.maresh.dev;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable:
```bash
ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 7. SSL Certificate
```bash
certbot --nginx -d maresh.dev -d www.maresh.dev
```

#### 8. Auto-deploy with Git (Optional)
Create a deploy script at `/var/www/deploy.sh`:
```bash
#!/bin/bash
cd /var/www/maresh-portfolio
git pull origin main
npm install
npx prisma generate
npm run build
pm2 restart portfolio
```

---

## Custom Domain Setup

### Recommended Domain Registrars
1. **Namecheap** — cheap (.dev domains ~$12/year)
2. **Cloudflare Registrar** — at-cost pricing, free DNS & CDN
3. **Google Domains** → now Squarespace Domains

### DNS Configuration
For Vercel:
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

For VPS:
```
Type    Name    Value
A       @       your-server-ip
CNAME   www     @
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database path | `file:./dev.db` |
| `NODE_ENV` | Environment | `production` |

---

## Database Considerations

### For Vercel/Serverless
The SQLite database (`prisma/dev.db`) is bundled with the deployment. This works for a portfolio because:
- Read-heavy (public visitors only read data)
- Write operations (admin) are infrequent
- The database is small (~100KB)

**If you need persistent writes** (e.g., contact form messages), consider:
1. **Turso** (free) — SQLite-compatible cloud database
2. **PlanetScale** (free) — MySQL-compatible serverless
3. **Supabase** (free) — PostgreSQL with REST API

### For VPS
SQLite works perfectly on a VPS since you have persistent file storage.

---

## Post-Deployment Checklist

- [ ] Site loads at your domain
- [ ] SSL certificate active (https://)
- [ ] Admin login works at `/admin`
- [ ] Contact form submits successfully
- [ ] All project details and highlights display
- [ ] Mobile responsive design works
- [ ] Page load speed < 3 seconds
- [ ] Social media links work
- [ ] Meta tags and SEO correct (check with https://metatags.io)
- [ ] Test with Google Lighthouse (aim for 90+ on all scores)

---

## Quick Deploy Commands (Vercel)

```bash
# One-time setup
npm i -g vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod

# Set environment variable
vercel env add DATABASE_URL
```

---

## Updating Content

After deployment, you can update content via:
1. **Admin Dashboard** at `/admin` — edit profile, skills, projects, experiences, services
2. **Re-seed** — update `prisma/seed.ts` and run `npx tsx prisma/seed.ts`
3. **Direct API** — use the admin API endpoints

For VPS, run the deploy script after changes. For Vercel, just push to GitHub and it auto-deploys.
