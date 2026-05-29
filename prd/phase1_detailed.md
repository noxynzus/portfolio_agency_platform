# Phase 1: Foundation — Detailed Implementation Plan

**Duration:** 4-6 สัปดาห์  
**Approach:** Feature-by-Feature (Vertical Slice)  
**Goal:** สร้างระบบพื้นฐานครบถ้วนพร้อมใช้งานจริง

---

## Overview

Phase 1 จะพัฒนา features หลักทั้งหมดแบบ end-to-end ทีละ feature:
- Database → API → Admin UI → Public Display

**ทุก Task มีกระบวนการ 5 ขั้นตอน:**
1. **วิเคราะห์ (Analyze)** - ทำความเข้าใจ requirements
2. **วางแผน (Plan)** - ออกแบบ structure และ approach
3. **พัฒนา (Develop)** - เขียนโค้ด
4. **รีวิว (Review)** - ตรวจสอบคุณภาพ
5. **ทดสอบ (Test)** - ทดสอบทุก scenarios

---

## Epic Overview

| Epic | Duration | Features |
|------|----------|----------|
| **EPIC 0** | 3-5 วัน | Project Setup, Database, Auth, Seed Data |
| **EPIC 1** | 5-7 วัน | Portfolio Management (CRUD + UI) |
| **EPIC 2** | 4-5 วัน | Lead Generation + Telegram |
| **EPIC 3** | 5-7 วัน | Blog System |
| **EPIC 4** | 3-4 วัน | Services & Pricing Management |
| **EPIC 5** | 4-5 วัน | Admin Dashboard Core |
| **EPIC 6** | 3-4 วัน | Polish & Optimization |

**Total:** 27-37 วัน (ประมาณ 4-6 สัปดาห์)

---

## EPIC 0: Project Setup & Infrastructure

**Duration:** 3-5 วัน  
**Goal:** ติดตั้งและตั้งค่าโครงสร้างพื้นฐานทั้งหมด

### Task 0.1: Environment Setup ⚙️

<details>
<summary><strong>ขยายเพื่อดูรายละเอียด</strong></summary>

#### วิเคราะห์
- ติดตั้ง dependencies ที่จำเป็นทั้งหมด
- สร้างโครงสร้าง folder เพิ่มเติม

#### วางแผน
**Packages ที่ต้องติดตั้ง:**
- Database: `prisma`, `@prisma/client`
- Auth: `next-auth@beta`, `@auth/prisma-adapter`, `bcryptjs`
- Validation & Forms: `zod`, `react-hook-form`, `@hookform/resolvers`
- UI: `sonner` (toast)
- Markdown: `react-markdown`, `remark-gfm`, `rehype-highlight`

**Folders:**
```
src/lib/actions/
src/lib/validations/
src/components/admin/
public/uploads/{projects,blog,testimonials,temp}/
prisma/
```

#### พัฒนา

```bash
# 1. Install dependencies
npm install prisma @prisma/client
npm install next-auth@beta @auth/prisma-adapter bcryptjs
npm install zod react-hook-form @hookform/resolvers
npm install sonner
npm install react-markdown remark-gfm rehype-highlight

# Dev dependencies
npm install --save-dev @types/bcryptjs ts-node

# 2. Create folders
mkdir -p src/lib/actions src/lib/validations src/components/admin
mkdir -p public/uploads/projects public/uploads/blog public/uploads/testimonials public/uploads/temp
mkdir -p prisma

# 3. Create utility files
touch src/lib/db.ts src/lib/auth.ts src/lib/upload.ts src/lib/telegram.ts
```

#### รีวิว
- [ ] `package.json` มี dependencies ครบ
- [ ] โครงสร้าง folders ครบถ้วน
- [ ] `npm run dev` รันได้ปกติ

#### ทดสอบ
```bash
npm run dev
# ต้องไม่มี error
```

</details>

---

### Task 0.2: Database Setup (Prisma + Neon) 🗄️

<details>
<summary><strong>ขยายเพื่อดูรายละเอียด</strong></summary>

#### วิเคราะห์
- Setup PostgreSQL database บน Neon
- สร้าง Prisma schema
- Run migration

#### วางแผน
1. สมัคร Neon → สร้าง project → copy connection string
2. Initialize Prisma
3. สร้าง schema (ตามที่ออกแบบไว้ใน development_plan.md)
4. Run migration
5. สร้าง Prisma Client singleton

#### พัฒนา

**Step 1: Neon Setup**
- ไปที่ https://neon.tech → สมัคร/Login
- Create Project: `ui-ux-promax`
- Region: Singapore
- Copy connection string

**Step 2: Prisma Init**
```bash
npx prisma init
```

**Step 3: Update `.env`**
```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

**Step 4: Create `prisma/schema.prisma`**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Models: User, Account, Session, VerificationToken
// Project, Service, PricingPlan, Testimonial
// Post, Lead, SiteSettings
// (ดู full schema ใน development_plan.md)
```

**Step 5: Migrate**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

**Step 6: Create Singleton**
```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
```

#### รีวิว
- [ ] Schema ครบถ้วน
- [ ] Migration สำเร็จ
- [ ] Tables สร้างใน Neon

#### ทดสอบ
```bash
npx prisma studio
# ตรวจสอบ tables ทั้งหมดถูกสร้าง
```

</details>

---

### Task 0.3: NextAuth Configuration 🔐

<details>
<summary><strong>ขยายเพื่อดูรายละเอียด</strong></summary>

#### วิเคราะห์
- Setup NextAuth.js v5
- Support Credentials (email/password)
- Optional OAuth (Google, GitHub)
- Middleware protection

#### พัฒนา

**1. Create `auth.ts`** (root level)
```typescript
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const validated = loginSchema.safeParse(credentials)
        if (!validated.success) return null
        
        const user = await db.user.findUnique({
          where: { email: validated.data.email }
        })
        if (!user?.password) return null
        
        const isValid = await bcrypt.compare(
          validated.data.password,
          user.password
        )
        if (!isValid) return null
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    }),
    // Optional OAuth
    ...(process.env.GOOGLE_CLIENT_ID ? [Google({...})] : []),
    ...(process.env.GITHUB_CLIENT_ID ? [GitHub({...})] : [])
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    }
  }
})
```

**2. Auth Utilities** (`src/lib/auth.ts`)
```typescript
import { auth } from "@/auth"

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== 'ADMIN') throw new Error('Forbidden')
  return user
}
```

**3. Middleware** (`middleware.ts`)
```typescript
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === "ADMIN"
  
  if (pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*', '/login']
}
```

**4. API Routes**
```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

**5. Login Page** (`app/login/page.tsx`)
```typescript
'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false
    })
    
    if (result?.error) {
      setError('Invalid credentials')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 neon-text">Admin Login</h1>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" name="email" required className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" name="password" required className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none" />
          </div>
          <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold hover:opacity-90">Login</button>
        </div>
      </form>
    </div>
  )
}
```

**6. Environment Variables**
```env
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Optional OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

#### ทดสอบ
- [ ] `/dashboard` → redirect to `/login`
- [ ] Login with wrong credentials → error
- [ ] Login with correct credentials → redirect to `/dashboard`
- [ ] Session persists after refresh

</details>

---

### Task 0.4: Seed Initial Data 🌱

<details>
<summary><strong>ขยายเพื่อดูรายละเอียด</strong></summary>

#### วิเคราะห์
- สร้าง admin user
- Migrate hardcoded data → database
- Create default site settings

#### พัฒนา

**1. Seed Script** (`prisma/seed.ts`)
```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding...')
  
  // 1. Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date()
    }
  })
  console.log('✅ Admin:', admin.email)
  
  // 2. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'site-settings' },
    update: {},
    create: {
      id: 'site-settings',
      email: 'hello@techforge.dev',
      siteName: 'TechForge',
      siteDescription: 'Modern Digital Engineering Studio',
      siteUrl: 'https://techforge.dev'
    }
  })
  console.log('✅ Site Settings')
  
  // 3. Import & seed projects, services, pricing, testimonials
  // จาก src/data/*.ts (ใช้ upsert เพื่อป้องกัน duplicate)
  
  console.log('🎉 Seed completed!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

**2. Update `package.json`**
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

**3. Environment Variables**
```env
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="YourSecurePassword123"
```

**4. Run Seed**
```bash
npx prisma db seed
```

#### ทดสอบ
```bash
npx prisma studio
# Verify: User, Project, Service, PricingPlan, Testimonial, SiteSettings มีข้อมูล
```

</details>

---

**EPIC 0 Complete! ✅**

พร้อมเริ่ม EPIC 1

---

## EPIC 1: Portfolio Management System 📁

**Duration:** 5-7 วัน  
**Goal:** CRUD portfolio แบบสมบูรณ์ (Admin + Public)

### Tasks Overview

| Task | Description | Duration |
|------|-------------|----------|
| 1.1 | Portfolio Data Layer (Actions + Validation) | 1 วัน |
| 1.2 | Admin - Portfolio List UI | 1 วัน |
| 1.3 | Admin - Project Form (Create/Edit) | 2 วัน |
| 1.4 | Public - Portfolio Page (Dynamic) | 1 วัน |
| 1.5 | Public - Project Detail Page | 1 วัน |

### Task 1.1: Portfolio Data Layer

**พัฒนา:**

**1. Validation Schema** (`src/lib/validations/project.ts`)
```typescript
import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  category: z.string(),
  tech: z.array(z.string()).min(1),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  results: z.string().optional(),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  demoUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  gradient: z.string().optional(),
  accentColor: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  order: z.number().int().default(0)
})
```

**2. Server Actions** (`src/lib/actions/projects.ts`)
```typescript
'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { projectSchema } from '@/lib/validations/project'
import { revalidatePath } from 'next/cache'

export async function getProjects(filters?: {
  category?: string
  published?: boolean
  featured?: boolean
}) {
  try {
    const where = {
      ...(filters?.category && { category: filters.category }),
      ...(filters?.published !== undefined && { published: filters.published }),
      ...(filters?.featured !== undefined && { featured: filters.featured })
    }
    
    const projects = await db.project.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    })
    
    return { success: true, data: projects }
  } catch (error) {
    return { success: false, error: 'Failed to fetch projects' }
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const project = await db.project.findUnique({ where: { slug } })
    if (!project) return { success: false, error: 'Not found' }
    return { success: true, data: project }
  } catch (error) {
    return { success: false, error: 'Failed to fetch project' }
  }
}

export async function createProject(formData: FormData) {
  try {
    await requireAdmin()
    
    const data = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      category: formData.get('category'),
      tech: JSON.parse(formData.get('tech') || '[]'),
      // ... parse other fields
    }
    
    const validated = projectSchema.parse(data)
    const project = await db.project.create({ data: validated })
    
    revalidatePath('/dashboard/projects')
    revalidatePath('/portfolio')
    revalidatePath('/')
    
    return { success: true, data: project }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, error: 'Validation error', details: error.errors }
    }
    if (error.code === 'P2002') {
      return { success: false, error: 'Slug already exists' }
    }
    return { success: false, error: error.message || 'Failed to create project' }
  }
}

export async function updateProject(id: string, formData: FormData) {
  // Similar to createProject
}

export async function deleteProject(id: string) {
  try {
    await requireAdmin()
    await db.project.delete({ where: { id } })
    revalidatePath('/dashboard/projects')
    revalidatePath('/portfolio')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: 'Failed to delete' }
  }
}

export async function toggleProjectPublished(id: string) {
  try {
    await requireAdmin()
    const project = await db.project.findUnique({ where: { id } })
    if (!project) return { success: false, error: 'Not found' }
    
    const updated = await db.project.update({
      where: { id },
      data: { published: !project.published }
    })
    
    revalidatePath('/dashboard/projects')
    revalidatePath('/portfolio')
    return { success: true, data: updated }
  } catch (error) {
    return { success: false, error: 'Failed to toggle' }
  }
}
```

**ทดสอบ:**
- [ ] CRUD operations ทำงานได้
- [ ] Validation catches errors
- [ ] revalidatePath ทำงาน

---

### Task 1.2-1.5: Summary

เนื่องจากเอกสารยาว ผมจะสรุปส่วนที่เหลือของ EPIC 1-6:

**Task 1.2:** Admin Portfolio List  
- สร้าง `/dashboard/projects` page
- Data table พร้อม search, filter, actions

**Task 1.3:** Admin Project Form  
- สร้าง `/dashboard/projects/new` และ `/dashboard/projects/[id]/edit`
- Form component with React Hook Form + Zod
- Image upload support

**Task 1.4:** Public Portfolio Page  
- Update `/app/portfolio/page.tsx` ให้ดึงจาก database
- Filter by category
- Maintain existing design

**Task 1.5:** Public Project Detail  
- Update `/app/portfolio/[slug]/page.tsx`
- Dynamic metadata สำหรับ SEO
- 404 handling

---

## EPIC 2: Lead Generation System 📬

**Duration:** 4-5 วัน

### Tasks
- **2.1:** Lead Data Layer + Telegram Integration
- **2.2:** Connect Contact Form
- **2.3:** Admin Lead Management
- **2.4:** Basic Analytics

### Key Features
- Save leads to database
- Send Telegram notification ทันที
- Admin dashboard สำหรับดู leads
- Update status & notes
- Filter by status

---

## EPIC 3: Blog System ✍️

**Duration:** 5-7 วัน

### Tasks
- **3.1:** Blog Data Layer (CRUD operations)
- **3.2:** Admin Blog List & Form
- **3.3:** Markdown Editor Integration
- **3.4:** Public Blog List Page
- **3.5:** Public Blog Detail Page

### Key Features
- Markdown support
- SEO metadata per post
- Categories & tags
- View counter
- Published/Draft status

---

## EPIC 4: Services & Pricing Management ⚙️

**Duration:** 3-4 วัน

### Tasks
- **4.1:** Services & Pricing Data Layer
- **4.2:** Admin Services Management
- **4.3:** Admin Pricing Management
- **4.4:** Update Public Pages

### Key Features
- Dynamic services management
- Dynamic pricing plans
- Drag & drop ordering
- Icon selector
- Connect to homepage sections

---

## EPIC 5: Admin Dashboard Core 🎛️

**Duration:** 4-5 วัน

### Tasks
- **5.1:** Admin Layout & Navigation
- **5.2:** Dashboard Home (Analytics)
- **5.3:** Site Settings Management
- **5.4:** Testimonials Management (Optional)

### Key Features
- Sidebar navigation
- Stats overview
- Quick actions
- Global settings (contact, social, SEO)

---

## EPIC 6: Polish & Optimization ✨

**Duration:** 3-4 วัน

### Tasks
- **6.1:** Error Handling & Loading States
- **6.2:** Form Validation & UX Improvements
- **6.3:** SEO Optimization (Sitemap, Metadata)
- **6.4:** Security Hardening (Rate Limiting)
- **6.5:** Performance Optimization
- **6.6:** Documentation & Deployment

### Key Features
- Consistent error handling
- Toast notifications
- Loading skeletons
- Dynamic sitemap
- Rate limiting on forms
- Lighthouse score > 90
- Deploy to Vercel

---

## Success Criteria - Phase 1 Complete

### Functional ✅
- [ ] Admin can login securely
- [ ] Admin can CRUD: projects, services, pricing, blog, testimonials
- [ ] Admin can view and manage leads
- [ ] Public pages show dynamic content from database
- [ ] Lead submissions work + Telegram notification
- [ ] All pages responsive
- [ ] SEO optimized

### Technical ✅
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse SEO > 95
- [ ] Lighthouse Accessibility > 90
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Database indexed properly
- [ ] Authentication secure
- [ ] Rate limiting active

### Business ✅
- [ ] Website can receive leads
- [ ] Portfolio showcases projects
- [ ] Content manageable without code
- [ ] Can scale to 1000+ visitors/day

---

## Next Steps

เมื่อ Phase 1 เสร็จสมบูรณ์:

1. **Deploy to Production** (Vercel)
2. **Monitor & Gather Feedback**
3. **Plan Phase 2** (CMS Enhancement)

📖 See [phase2_preview.md](./phase2_preview.md) for next steps

---

## Notes

**คำแนะนำสำหรับผู้เริ่มต้น:**
- ทำทีละ Task, อย่าข้าม
- ทดสอบทุก Task ก่อนไป Task ถัดไป
- Commit code บ่อยๆ (ทุก Task)
- ถามคำถามเมื่อสงสัย
- ใช้เวลา 4-6 ชม./วัน
- พักเมื่อติดปัญหานาน

**Learning Resources:**
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://prisma.io/docs
- NextAuth Docs: https://authjs.dev
- shadcn/ui: https://ui.shadcn.com
