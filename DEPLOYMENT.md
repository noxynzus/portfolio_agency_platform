# 🚀 Deployment Guide - UI/UX ProMax

Complete guide to deploying UI/UX ProMax to production.

---

## 📋 Pre-Deployment Checklist

### Required
- [ ] Production database (PostgreSQL) ready
- [ ] Domain name purchased (optional but recommended)
- [ ] Environment variables prepared
- [ ] Admin credentials set
- [ ] Build test passed locally

### Optional
- [ ] Telegram bot configured (for lead notifications)
- [ ] Custom domain SSL certificate
- [ ] Error tracking service (e.g., Sentry)
- [ ] Analytics (e.g., Google Analytics, Plausible)

---

## 🎯 Recommended Platforms

### 1. **Vercel** (Recommended - Zero Config)
- ✅ Official Next.js platform
- ✅ Automatic deployments from Git
- ✅ Built-in CDN
- ✅ Free SSL certificates
- ✅ Preview deployments

### 2. **Railway**
- ✅ Simple PostgreSQL hosting
- ✅ Good for full-stack apps
- ✅ Auto-scaling

### 3. **DigitalOcean / AWS**
- ✅ Full control
- ⚠️ Requires Docker/server management

---

## 📦 Deployment Option 1: Vercel + Neon

**Best for:** Most users, fastest setup

### Step 1: Database Setup (Neon)

1. Go to [neon.tech](https://neon.tech)
2. Create account (free tier available)
3. Create new project
4. Copy **Connection String**
   ```
   postgresql://user:password@ep-xxx.neon.tech/dbname
   ```

### Step 2: Deploy to Vercel

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repo
   - Click "Import"

3. **Set Environment Variables**
   
   In Vercel dashboard → Settings → Environment Variables:

   ```env
   DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname
   NEXTAUTH_SECRET=<generate-32-char-random-string>
   NEXTAUTH_URL=https://yourdomain.vercel.app
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=<your-secure-password>
   NEXT_PUBLIC_SITE_URL=https://yourdomain.vercel.app
   NEXT_PUBLIC_SITE_NAME=Atthawat Studio
   
   # Optional
   TELEGRAM_BOT_TOKEN=<your-bot-token>
   TELEGRAM_CHAT_ID=<your-chat-id>
   ```

   **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build (2-3 minutes)
   - Your site is live! 🎉

### Step 3: Database Migration

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Link project**
   ```bash
   vercel link
   ```

3. **Run migrations**
   ```bash
   vercel env pull .env.local
   npx prisma db push
   npx prisma db seed
   ```

4. **Verify**
   - Visit your domain
   - Go to `/login`
   - Login with admin credentials
   - Create first project/post

---

## 📦 Deployment Option 2: Railway (Database + App)

**Best for:** All-in-one deployment

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Deploy PostgreSQL

1. Click "New Project"
2. Select "PostgreSQL"
3. Note the connection string

### Step 3: Deploy App

1. Click "New" → "GitHub Repo"
2. Select your repository
3. Add environment variables (same as Vercel)
4. Click "Deploy"

### Step 4: Run Migrations

```bash
railway login
railway link
railway run npx prisma db push
railway run npx prisma db seed
```

---

## 📦 Deployment Option 3: Docker (Self-Hosted)

**Best for:** VPS, DigitalOcean, AWS

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Build app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_USER=postgres
      - POSTGRES_DB=ui_ux_promax
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Deploy

```bash
# Build and run
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma db push
docker-compose exec app npx prisma db seed
```

---

## 🔒 Post-Deployment Security

### 1. Update Site Settings
- Go to `/dashboard/settings`
- Update contact information
- Configure SEO metadata
- Set correct site URL

### 2. Test Rate Limiting
- Try submitting contact form 6 times
- Should block after 5 attempts

### 3. Enable HTTPS
- Vercel/Railway: Automatic
- Self-hosted: Use Let's Encrypt

### 4. Backup Database
```bash
# Neon: Automatic backups
# Self-hosted:
pg_dump -h localhost -U postgres ui_ux_promax > backup.sql
```

---

## 🎨 Custom Domain Setup

### Vercel
1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records as shown
5. Wait for SSL (5-10 minutes)

### Railway
1. Project settings → "Custom Domain"
2. Add domain
3. Update DNS CNAME record
4. SSL auto-configured

---

## 📊 Monitoring & Analytics

### Error Tracking (Optional)

**Sentry Integration:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Analytics (Optional)

**Google Analytics:**
- Add tracking ID to environment variables
- Update `src/app/layout.tsx` with script

**Plausible (Privacy-friendly):**
```html
<!-- In layout.tsx -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Common issues:
1. TypeScript errors → npm run lint
2. Missing env vars → check Vercel/Railway dashboard
3. Prisma client → npx prisma generate
```

### Database Connection Errors
```bash
# Test connection
npx prisma db pull

# Check DATABASE_URL format
# Should be: postgresql://user:pass@host:5432/db
```

### Authentication Not Working
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain (including https://)
- Clear cookies and try again

### Images Not Loading
- Check `next.config.ts` → remotePatterns
- Verify public folder permissions

---

## 🔄 Continuous Deployment

### Auto-deploy on Git Push

**Vercel:** Automatic (on every push to main)

**Manual trigger:**
```bash
vercel --prod
```

### Preview Deployments
- Every pull request gets a preview URL
- Test before merging to production

---

## 📈 Performance Optimization

### After Deployment

1. **Test Lighthouse Score**
   - Open Chrome DevTools
   - Run Lighthouse audit
   - Target: Performance > 90

2. **Enable ISR Caching**
   - Already configured for portfolio/blog pages
   - Check `revalidate` values in pages

3. **Image Optimization**
   - All images use Next.js `<Image>` component
   - Automatic WebP conversion

4. **Database Indexes**
   - Already configured in Prisma schema
   - Check slow queries in production

---

## 🎉 Launch Checklist

- [ ] Production database live
- [ ] Environment variables set
- [ ] Build successful
- [ ] Database seeded
- [ ] Admin login works
- [ ] All pages accessible
- [ ] Contact form sends emails
- [ ] Telegram notifications work (if configured)
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Rate limiting tested
- [ ] Lighthouse score > 90
- [ ] Sitemap accessible (/sitemap.xml)
- [ ] Robots.txt accessible (/robots.txt)

---

## 🚨 Emergency Rollback

### Vercel
1. Go to deployments
2. Click previous deployment
3. Click "Promote to Production"

### Railway
1. Go to deployments
2. Select previous build
3. Click "Redeploy"

### Manual
```bash
git revert HEAD
git push origin main
```

---

## 📞 Support

If you encounter issues:
1. Check error logs (Vercel/Railway dashboard)
2. Review environment variables
3. Test database connection
4. Contact support@atthawat.studio

---

**Good luck with your deployment! 🚀**
