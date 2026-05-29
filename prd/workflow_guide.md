# Development Workflow & Best Practices

**Document Type:** Developer Guide  
**Audience:** Developers working on this project

---

## Table of Contents

1. [Git Workflow](#git-workflow)
2. [Coding Standards](#coding-standards)
3. [File Organization](#file-organization)
4. [Development Process](#development-process)
5. [Testing Strategy](#testing-strategy)
6. [Deployment Guide](#deployment-guide)
7. [Troubleshooting](#troubleshooting)

---

## Git Workflow

### Branch Naming Convention

```
feature/epic-{n}-{description}
bugfix/{description}
hotfix/{description}
chore/{description}
```

**Examples:**
```
feature/epic-1-portfolio-management
feature/epic-2-lead-system
bugfix/telegram-notification-error
hotfix/auth-session-expiry
chore/update-dependencies
```

### Commit Message Format

Follow **Conventional Commits**:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks
- `style`: Formatting, missing semicolons, etc.
- `perf`: Performance improvements

**Examples:**
```
feat(portfolio): add CRUD operations for projects
fix(telegram): handle notification errors gracefully
docs(readme): update setup instructions
refactor(auth): simplify session handling
test(projects): add unit tests for project creation
chore(deps): update next to 15.0.5
```

### Workflow Steps

1. **Create Feature Branch**
```bash
git checkout main
git pull origin main
git checkout -b feature/epic-1-portfolio
```

2. **Work & Commit Frequently**
```bash
# Make changes
git add .
git commit -m "feat(portfolio): add project schema"

# Continue work
git add .
git commit -m "feat(portfolio): implement getProjects action"
```

3. **Push to Remote**
```bash
git push origin feature/epic-1-portfolio
```

4. **Create Pull Request** (if working in team)
   - Write clear description
   - Link related issues
   - Request review

5. **Merge to Main**
```bash
git checkout main
git merge feature/epic-1-portfolio
git push origin main
```

6. **Delete Feature Branch**
```bash
git branch -d feature/epic-1-portfolio
git push origin --delete feature/epic-1-portfolio
```

### Git Best Practices

- ✅ Commit often (after each meaningful change)
- ✅ Write clear commit messages
- ✅ Pull before you push
- ✅ Test before committing
- ❌ Don't commit broken code
- ❌ Don't commit secrets (.env)
- ❌ Don't commit node_modules, .next, etc.

---

## Coding Standards

### TypeScript Best Practices

**✅ DO:**
```typescript
// Use strict types
interface CreateProjectInput {
  title: string
  slug: string
  description: string
}

function createProject(data: CreateProjectInput): Promise<Project> {
  // ...
}

// Use const for immutable values
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Use descriptive names
const isPublished = true
const hasPermission = checkPermission(user)
```

**❌ DON'T:**
```typescript
// Avoid any
function createProject(data: any) { }

// Avoid var
var x = 10

// Avoid unclear names
const flag = true
const temp = getData()
```

### Next.js Patterns

**Server Components (Default):**
```typescript
// app/portfolio/page.tsx
import { getProjects } from '@/lib/actions/projects'

export default async function PortfolioPage() {
  const result = await getProjects({ published: true })
  const projects = result.success ? result.data : []
  
  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

**Client Components (When Needed):**
```typescript
'use client' // Only when you need interactivity

import { useState } from 'react'

export function ProjectsTable({ projects }: Props) {
  const [search, setSearch] = useState('')
  // ... interactive logic
}
```

### Server Actions Pattern

**✅ Good:**
```typescript
'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
  try {
    // 1. Auth check
    await requireAdmin()
    
    // 2. Validate input
    const validated = projectSchema.parse({
      title: formData.get('title'),
      // ...
    })
    
    // 3. Perform action
    const project = await db.project.create({
      data: validated
    })
    
    // 4. Revalidate cache
    revalidatePath('/dashboard/projects')
    revalidatePath('/portfolio')
    
    // 5. Return result
    return { success: true, data: project }
    
  } catch (error: any) {
    // 6. Handle errors
    if (error.name === 'ZodError') {
      return { success: false, error: 'Validation error', details: error.errors }
    }
    return { success: false, error: error.message || 'Failed to create project' }
  }
}
```

### Error Handling Pattern

**Consistent Error Response:**
```typescript
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; details?: any }

// Usage
const result = await createProject(formData)

if (result.success) {
  toast.success('Project created!')
  console.log(result.data)
} else {
  toast.error(result.error)
  if (result.details) {
    console.error(result.details)
  }
}
```

---

## File Organization

### Recommended Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                # Public routes (optional grouping)
│   │   ├── page.tsx             # Homepage
│   │   ├── about/
│   │   ├── portfolio/
│   │   ├── blog/
│   │   └── contact/
│   ├── dashboard/               # Admin routes (protected)
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Dashboard home
│   │   ├── projects/
│   │   ├── blog/
│   │   ├── leads/
│   │   └── settings/
│   ├── login/                   # Auth pages
│   ├── api/                     # API routes (minimal)
│   │   └── auth/[...nextauth]/
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── admin/                   # Admin-specific
│   │   ├── ProjectsTable.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── sections/                # Homepage sections
│   │   ├── Hero.tsx
│   │   ├── FeaturedProjects.tsx
│   │   └── ...
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── shared/                  # Shared components
│       ├── LoadingSkeleton.tsx
│       └── ErrorBoundary.tsx
│
├── lib/
│   ├── actions/                 # Server Actions (grouped by domain)
│   │   ├── projects.ts
│   │   ├── services.ts
│   │   ├── pricing.ts
│   │   ├── posts.ts
│   │   ├── leads.ts
│   │   └── settings.ts
│   ├── validations/             # Zod schemas
│   │   ├── project.ts
│   │   ├── post.ts
│   │   ├── lead.ts
│   │   └── service.ts
│   ├── db.ts                    # Prisma client
│   ├── auth.ts                  # Auth utilities
│   ├── telegram.ts              # Telegram integration
│   ├── upload.ts                # File upload utilities
│   └── utils.ts                 # General utilities
│
├── types/
│   ├── index.ts                 # Shared types
│   └── next-auth.d.ts           # NextAuth types extension
│
├── hooks/                       # Custom React hooks
│   ├── useDebounce.ts
│   └── useMediaQuery.ts
│
├── config/                      # Configuration
│   └── site.ts                  # Site config
│
└── prisma/
    ├── schema.prisma
    └── seed.ts
```

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `ProjectCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Pages: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

**Variables:**
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_FILE_SIZE`)
- Functions: `camelCase` (e.g., `getProjects`)
- React Components: `PascalCase` (e.g., `ProjectCard`)
- Interfaces/Types: `PascalCase` (e.g., `ProjectInput`)

---

## Development Process

### For Each Task

**1. วิเคราะห์ (Analyze)**
- อ่าน requirements ให้เข้าใจ
- ระบุ dependencies
- Identify edge cases

**2. วางแผน (Plan)**
- List files to create/modify
- Design data structures
- Outline logic flow
- Create subtasks if needed

**3. พัฒนา (Develop)**
- Follow the plan
- Write code incrementally
- Test as you go
- Comment complex logic

**4. รีวิว (Review)**
Self-review checklist:
- [ ] TypeScript types defined
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Mobile responsive
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] No console errors
- [ ] No hardcoded values
- [ ] Code formatted (Prettier)
- [ ] No unused imports/variables

**5. ทดสอบ (Test)**
- Happy path (normal use)
- Error scenarios
- Edge cases
- Mobile/tablet view
- Different browsers (Chrome, Safari, Firefox)

### Daily Workflow

**Morning:**
```bash
# 1. Pull latest changes
git checkout main
git pull origin main

# 2. Start dev server
npm run dev

# 3. Pick next task from plan
# 4. Create feature branch if needed
git checkout -b feature/task-name
```

**During Development:**
- Focus on one task at a time
- Commit after each meaningful change
- Take breaks every 1-2 hours
- Ask for help when stuck > 30 min

**Evening:**
```bash
# 1. Review your changes
git status
git diff

# 2. Test everything works
npm run build  # Check for build errors

# 3. Commit and push
git add .
git commit -m "feat: description"
git push origin feature-branch

# 4. Update task status in plan
```

---

## Testing Strategy

### Manual Testing Checklist

**For Every Feature:**
- [ ] Feature works as expected
- [ ] Form validation works
- [ ] Error messages are clear
- [ ] Loading states visible
- [ ] Success feedback shown
- [ ] Mobile responsive (test on phone)
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Data persists after refresh

**Browser Testing:**
- [ ] Chrome (primary)
- [ ] Safari (Mac/iOS)
- [ ] Firefox
- [ ] Edge

**Device Testing:**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1440x900)
- [ ] Tablet (768px)
- [ ] Mobile (375px, 414px)

### Automated Testing (Phase 2)

**Unit Tests (Vitest):**
```typescript
// __tests__/lib/actions/projects.test.ts
import { describe, it, expect, vi } from 'vitest'
import { createProject } from '@/lib/actions/projects'

describe('createProject', () => {
  it('should create a project successfully', async () => {
    const formData = new FormData()
    formData.append('title', 'Test Project')
    formData.append('slug', 'test-project')
    // ...
    
    const result = await createProject(formData)
    
    expect(result.success).toBe(true)
    expect(result.data.title).toBe('Test Project')
  })
  
  it('should handle validation errors', async () => {
    const formData = new FormData()
    // Missing required fields
    
    const result = await createProject(formData)
    
    expect(result.success).toBe(false)
    expect(result.error).toBe('Validation error')
  })
})
```

**E2E Tests (Playwright):**
```typescript
// e2e/portfolio.spec.ts
import { test, expect } from '@playwright/test'

test('admin can create a project', async ({ page }) => {
  // Login
  await page.goto('/login')
  await page.fill('[name="email"]', 'admin@example.com')
  await page.fill('[name="password"]', 'password')
  await page.click('button[type="submit"]')
  
  // Navigate to projects
  await page.goto('/dashboard/projects')
  await page.click('text=New Project')
  
  // Fill form
  await page.fill('[name="title"]', 'Test Project')
  await page.fill('[name="slug"]', 'test-project')
  await page.fill('[name="description"]', 'Test description')
  
  // Submit
  await page.click('button[type="submit"]')
  
  // Verify success
  await expect(page.locator('text=Project created')).toBeVisible()
})
```

---

## Deployment Guide

### Vercel Deployment

**First-time Setup:**

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Link Project**
```bash
vercel link
```

3. **Configure Environment Variables in Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Select project → Settings → Environment Variables
   - Add all variables from `.env.local`:
     - `DATABASE_URL`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL`
     - `TELEGRAM_BOT_TOKEN`
     - `TELEGRAM_CHAT_ID`
     - OAuth credentials (if using)

4. **Deploy**
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

**Automated Deployment:**
- Push to `main` branch → Auto-deploy to production
- Push to other branches → Auto-create preview deployment

### Database Migration

**Production Migration:**
```bash
# Set production database URL
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# Seed production (first time only)
DATABASE_URL="postgresql://..." npx prisma db seed
```

### Pre-deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Database migrated
- [ ] Admin user created (seed)
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] No console errors in production mode
- [ ] Test all critical paths
- [ ] Telegram bot configured
- [ ] Custom domain connected (optional)

### Post-deployment Verification

- [ ] Homepage loads
- [ ] Login works
- [ ] Admin dashboard accessible
- [ ] Dynamic pages load (portfolio, blog)
- [ ] Forms work (contact, lead generation)
- [ ] Images load correctly
- [ ] Telegram notifications work
- [ ] SEO tags present (view source)
- [ ] Lighthouse score > 90

---

## Troubleshooting

### Common Issues

**1. "Module not found" Error**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. Prisma Client Out of Sync**
```bash
npx prisma generate
```

**3. Database Connection Error**
- Check `DATABASE_URL` in `.env`
- Verify Neon database is running
- Check network connection

**4. NextAuth Session Not Persisting**
- Check `NEXTAUTH_SECRET` is set
- Clear browser cookies
- Check `NEXTAUTH_URL` matches your domain

**5. Build Fails in Production**
```bash
# Test build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for ESLint errors
npm run lint
```

**6. Images Not Loading**
- Check file paths (relative vs absolute)
- Verify `/public/uploads` folder exists
- Check file permissions

**7. Telegram Notifications Not Working**
- Verify `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
- Test bot with `https://api.telegram.org/bot<TOKEN>/getMe`
- Check network connectivity

### Debug Tips

**Enable Verbose Logging:**
```typescript
// lib/db.ts
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
})
```

**Check Server Action Errors:**
```typescript
// Open browser console
// Look for Server Action errors
// Check Network tab for failed requests
```

**Database Query Debugging:**
```bash
# Open Prisma Studio
npx prisma studio

# Check database records
# Verify data structure
```

---

## Performance Optimization

### Images
- Use `next/image` component
- Optimize image sizes before upload
- Use WebP format
- Lazy load images

### Code Splitting
- Use dynamic imports for heavy components
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSkeleton />,
  ssr: false
})
```

### Database
- Add indexes on frequently queried fields
- Use `select` to fetch only needed fields
- Implement pagination
- Use caching (Redis in Phase 2)

### Caching
```typescript
// Revalidate every hour
export const revalidate = 3600

// Or on-demand
revalidatePath('/portfolio')
revalidateTag('projects')
```

---

## Security Checklist

- [ ] Environment variables not committed
- [ ] All Server Actions check auth
- [ ] Input validation on client and server
- [ ] File upload type/size validation
- [ ] Rate limiting on forms
- [ ] HTTPS enabled (Vercel default)
- [ ] Security headers configured
- [ ] No sensitive data in logs
- [ ] Database credentials secure
- [ ] Regular dependency updates

---

## Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://prisma.io/docs)
- [NextAuth Docs](https://authjs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

### Communities
- [Next.js Discord](https://nextjs.org/discord)
- [Prisma Discord](https://pris.ly/discord)
- [Vercel Community](https://vercel.com/community)

### Tools
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Neon Console](https://console.neon.tech)
- [Prisma Studio](https://www.prisma.io/studio)
- [Telegram BotFather](https://t.me/botfather)

---

## Need Help?

1. Check this guide first
2. Search documentation
3. Check GitHub issues
4. Ask in Discord communities
5. Google the error message
6. Ask ChatGPT / Claude

Remember: **Everyone gets stuck. Asking for help is part of learning!**
