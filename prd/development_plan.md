# Implementation Plan — UI/UX ProMax Portfolio & Agency Platform

**Version:** 1.0  
**Date:** May 10, 2026  
**Approach:** Feature-by-Feature (Vertical Slice)  
**Phase:** Phase 1 - Foundation

---

## 📋 Document Structure

เอกสารนี้แบ่งออกเป็นหลายไฟล์เพื่อความชัดเจนและจัดการง่าย:

1. **[development_plan.md](./development_plan.md)** (ไฟล์นี้)
   - Overview และสารบัญหลัก
   - Tech Stack Summary
   - Architecture Design
   - Database Schema
   - ข้อมูลพื้นฐานทั้งหมด

2. **[decision_log.md](./decision_log.md)**
   - บันทึกคำถามและคำตอบทั้งหมด
   - เหตุผลในการตัดสินใจเลือก tech stack
   - Decision rationale

3. **[phase1_detailed.md](./phase1_detailed.md)**
   - Epic 0-6 แบบละเอียดทุก task
   - กระบวนการ: วิเคราะห์ → วางแผน → พัฒนา → รีวิว → ทดสอบ
   - Code examples และ checklists

4. **[phase2_preview.md](./phase2_preview.md)**
   - Epic 7-10 (CMS Enhancement & Advanced Features)
   - High-level overview

5. **[phase3_preview.md](./phase3_preview.md)**
   - Epic 11-14 (Enterprise Features)
   - Future roadmap

6. **[workflow_guide.md](./workflow_guide.md)**
   - Development workflow & best practices
   - Git workflow
   - Code quality standards
   - Testing strategy
   - Deployment guide

---

## Table of Contents (This File)

1. [Project Overview](#project-overview)
2. [Tech Stack Summary](#tech-stack-summary)
3. [Architecture Design](#architecture-design)
4. [Database Schema](#database-schema)
5. [Authentication & Authorization](#authentication--authorization)
6. [File Upload & Telegram Integration](#file-upload--telegram-integration)
7. [Environment Variables](#environment-variables)
8. [Timeline & Success Criteria](#timeline--success-criteria)

---

## Project Overview

### Project Goal
สร้างเว็บไซต์ Portfolio และ Digital Agency Platform ที่มีภาพลักษณ์ "Modern / Futuristic / High-Tech" พร้อมระบบ CMS ที่ใช้งานง่ายสำหรับจัดการเนื้อหา รับ leads และเพิ่ม conversion

### Current State
โปรเจคมีพื้นฐานที่ดีอยู่แล้ว:
- ✅ Next.js 15 App Router setup
- ✅ Tailwind CSS + Framer Motion
- ✅ Design system (glassmorphism, neon effects)
- ✅ Landing page sections (Hero, Services, Projects, Pricing, Testimonials, CTA)
- ✅ Static routing structure (about, blog, contact, faq, portfolio, pricing, services)
- ✅ Portfolio detail pages (dynamic routing)
- ✅ Contact form UI (ยังไม่ connect backend)

### What Needs to be Built
- Database & Backend (Prisma, PostgreSQL, Server Actions)
- Authentication System (NextAuth.js)
- Admin Dashboard (CRUD interfaces)
- Lead Management System (with Telegram notifications)
- Blog System (full CRUD + markdown support)
- Dynamic Content Management (Portfolio, Services, Pricing, Testimonials)
- SEO Optimization
- Security & Performance

📝 **ดูรายละเอียดการตัดสินใจทั้งหมดใน [decision_log.md](./decision_log.md)**

---

## Tech Stack Summary

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod

### Backend
- **API:** Next.js Server Actions (primary)
- **ORM:** Prisma
- **Database:** PostgreSQL (Neon)
- **Authentication:** NextAuth.js v5 (Auth.js)
- **Validation:** Zod

### Infrastructure
- **Database Hosting:** Neon (PostgreSQL)
- **File Storage:** Local (`/public/uploads`) → Cloudinary (Phase 2)
- **Notifications:** Telegram Bot API
- **Deployment:** Vercel
- **Version Control:** Git + GitHub

### Development Tools
- **Linting:** ESLint
- **Formatting:** Prettier (recommended)
- **Type Checking:** TypeScript strict mode
- **Testing:** Vitest (Phase 2), Playwright (Phase 2)

---

## Architecture Design

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Public Site (/)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Marketing Pages                                       │  │
│  │ - Homepage (sections: Hero, Services, Projects, etc.)│  │
│  │ - About, Services, Pricing                           │  │
│  │ - Portfolio (dynamic from DB)                        │  │
│  │ - Blog (dynamic from DB)                             │  │
│  │ - Contact (form → DB + Telegram)                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Admin Dashboard (/dashboard)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Protected by NextAuth + Middleware                   │  │
│  │                                                        │  │
│  │ Modules:                                              │  │
│  │ - Dashboard (analytics overview)                     │  │
│  │ - Projects Management (CRUD)                         │  │
│  │ - Services Management (CRUD)                         │  │
│  │ - Pricing Management (CRUD)                          │  │
│  │ - Blog Management (CRUD + markdown editor)           │  │
│  │ - Lead Management (view, update status, notes)       │  │
│  │ - Testimonials (CRUD)                                │  │
│  │ - Settings (site config, SEO, social links)          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Server Actions (lib/actions/*.ts)                    │  │
│  │ - projects.ts (CRUD operations)                      │  │
│  │ - services.ts (CRUD operations)                      │  │
│  │ - pricing.ts (CRUD operations)                       │  │
│  │ - posts.ts (CRUD operations)                         │  │
│  │ - leads.ts (CRUD + Telegram notification)           │  │
│  │ - testimonials.ts (CRUD operations)                  │  │
│  │ - settings.ts (read/update)                          │  │
│  │                                                        │  │
│  │ Middleware: Auth, Validation, Rate Limiting          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   Data & External Services                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ PostgreSQL (Neon)                                    │  │
│  │ - User, Session, Account (NextAuth)                 │  │
│  │ - Project, Service, PricingPlan                      │  │
│  │ - Post (Blog)                                         │  │
│  │ - Lead, Testimonial                                   │  │
│  │ - SiteSettings                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Telegram Bot API                                     │  │
│  │ - sendMessage (lead notifications)                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ File System (/public/uploads)                        │  │
│  │ - projects/, blog/, testimonials/                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Security Principles

1. **Authentication & Authorization**
   - Role-based access control (USER, ADMIN)
   - Protected routes via middleware
   - Session management by NextAuth

2. **Input Validation**
   - Server-side validation with Zod on every request
   - Client-side validation for better UX
   - SQL injection prevention (Prisma parameterized queries)

3. **CSRF Protection**
   - NextAuth built-in CSRF tokens
   - Same-site cookies

4. **Rate Limiting**
   - Contact form submissions
   - Login attempts
   - API endpoints

5. **File Upload Security**
   - Type validation (only images)
   - Size limits (5MB)
   - Unique filenames (prevent overwrites)

6. **Data Sanitization**
   - XSS prevention
   - HTML sanitization for user inputs

---

## Database Schema

### Core Models

```prisma
// ============================================
// Authentication & User Management
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?   // Hashed with bcrypt, optional for OAuth
  role          Role      @default(USER)
  image         String?
  emailVerified DateTime?
  
  // Relations
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([email])
}

enum Role {
  USER
  ADMIN
}

// NextAuth.js required models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ============================================
// Portfolio Management
// ============================================

model Project {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String   @db.Text
  category    String
  featured    Boolean  @default(false)
  published   Boolean  @default(false)
  
  // Content sections
  challenge   String?  @db.Text
  solution    String?  @db.Text
  results     String?  @db.Text
  
  // Media
  thumbnail   String?
  images      String[] // Array of image paths
  videoUrl    String?
  demoUrl     String?
  githubUrl   String?
  
  // Metadata
  tech        String[] // Tech stack array
  metrics     Json?    // { label: string, value: string }[]
  gradient    String?  // Tailwind gradient class
  accentColor String?  // Hex color
  
  // Organization
  order       Int      @default(0)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([category])
  @@index([slug])
  @@index([published])
  @@index([featured])
}

// ============================================
// Services
// ============================================

model Service {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String   @db.Text
  iconName    String   // Lucide icon name
  variant     String   // Color variant (cyan, purple, teal, etc.)
  features    String[] // Feature list
  order       Int      @default(0)
  published   Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([slug])
  @@index([published])
}

// ============================================
// Pricing Plans
// ============================================

model PricingPlan {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  price       String   // e.g., "฿50,000" or "Custom"
  period      String   // e.g., "month", "project", "one-time"
  features    String[] // Feature list
  recommended Boolean  @default(false)
  order       Int      @default(0)
  published   Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([slug])
  @@index([published])
}

// ============================================
// Testimonials
// ============================================

model Testimonial {
  id        String   @id @default(cuid())
  name      String
  role      String
  company   String
  content   String   @db.Text
  avatar    String?
  rating    Int      @default(5)
  order     Int      @default(0)
  published Boolean  @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([published])
}

// ============================================
// Blog System
// ============================================

model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  excerpt     String?
  content     String    @db.Text
  coverImage  String?
  
  published   Boolean   @default(false)
  publishedAt DateTime?
  
  // SEO
  metaTitle       String?
  metaDescription String?
  
  // Organization
  category    String?
  tags        String[]
  
  // Stats
  views       Int       @default(0)
  
  // Author
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([slug])
  @@index([category])
  @@index([published])
  @@index([authorId])
}

// ============================================
// Lead Management
// ============================================

model Lead {
  id        String     @id @default(cuid())
  name      String
  email     String
  company   String?
  phone     String?
  budget    String?
  service   String?
  message   String     @db.Text
  
  status    LeadStatus @default(NEW)
  notes     String?    @db.Text
  
  // Tracking
  source    String?    // UTM parameters, referrer
  notified  Boolean    @default(false)
  
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  
  @@index([status])
  @@index([createdAt])
  @@index([email])
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  PROPOSAL
  WON
  LOST
}

// ============================================
// Site Settings (Single Row)
// ============================================

model SiteSettings {
  id    String @id @default("site-settings")
  
  // Contact Information
  email   String
  phone   String?
  address String?
  
  // Social Media Links
  github    String?
  linkedin  String?
  twitter   String?
  facebook  String?
  instagram String?
  
  // SEO Defaults
  siteName        String
  siteDescription String
  siteUrl         String
  ogImage         String?
  
  // Features
  maintenanceMode Boolean @default(false)
  
  updatedAt DateTime @updatedAt
}
```

### Database Design Decisions

1. **CUID vs UUID:** ใช้ CUID เพราะ sortable และ URL-friendly
2. **Soft Delete:** ไม่ใช้ในตอนแรก, delete แบบ hard delete (ง่ายกว่าสำหรับผู้เริ่มต้น)
3. **JSON Fields:** ใช้สำหรับ dynamic data (metrics) และ arrays ง่ายๆ (tech, features)
4. **Indexes:** เพิ่มบน fields ที่ query บ่อย (slug, category, status, published)
5. **Published Flag:** ทุก content model มี published เพื่อควบคุม visibility
6. **Order Field:** สำหรับ manual sorting ใน admin (drag & drop)
7. **Relations:** One-to-many (User → Posts), cascade delete where appropriate

---

## Authentication & Authorization

### NextAuth.js v5 Configuration

```typescript
// auth.config.ts
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
    error: "/login"
  },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      authorize: async (credentials) => {
        // 1. Validate input
        const validated = loginSchema.safeParse(credentials)
        if (!validated.success) return null
        
        // 2. Check user in database
        const user = await db.user.findUnique({
          where: { email: validated.data.email }
        })
        if (!user || !user.password) return null
        
        // 3. Verify password
        const isValid = await bcrypt.compare(
          validated.data.password,
          user.password
        )
        if (!isValid) return null
        
        // 4. Return user object
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    })
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
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  }
})
```

### Middleware Protection

```typescript
// middleware.ts
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === "ADMIN"
  
  // Protect admin routes
  if (pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
  
  // Redirect logged-in admins away from login page
  if (pathname === '/login' && isLoggedIn && isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*', '/login']
}
```

### Authorization Utilities

```typescript
// lib/auth.ts
import { auth } from "@/auth"

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized: Please login')
  }
  return session.user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required')
  }
  return user
}

// Usage in Server Actions
export async function updateProject(id: string, data: FormData) {
  await requireAdmin() // Throws if not admin
  // ... proceed with update
}
```

### Initial Admin Setup

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-me-123'
  
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
  
  console.log('✅ Admin user created:', admin.email)
  
  // 2. Create default site settings
  await prisma.siteSettings.upsert({
    where: { id: 'site-settings' },
    update: {},
    create: {
      id: 'site-settings',
      email: 'hello@example.com',
      siteName: 'TechForge',
      siteDescription: 'Modern Digital Engineering Studio',
      siteUrl: 'https://example.com'
    }
  })
  
  console.log('✅ Site settings created')
  
  // 3. Seed sample data (projects, services, etc.)
  // ... (migrate from src/data/*.ts)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

---

## File Upload & Telegram Integration

### File Upload System

```typescript
// lib/upload.ts
import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function uploadFile(
  file: File,
  folder: 'projects' | 'blog' | 'testimonials'
): Promise<string> {
  // 1. Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only images allowed.')
  }
  
  // 2. Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large. Maximum size is 5MB.')
  }
  
  // 3. Generate unique filename
  const ext = file.name.split('.').pop()
  const filename = `${Date.now()}-${randomUUID()}.${ext}`
  
  // 4. Ensure directory exists
  const folderPath = path.join(UPLOAD_DIR, folder)
  await fs.mkdir(folderPath, { recursive: true })
  
  // 5. Save file to disk
  const filepath = path.join(folderPath, filename)
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(filepath, buffer)
  
  // 6. Return public URL
  return `/uploads/${folder}/${filename}`
}

export async function deleteFile(filepath: string): Promise<void> {
  try {
    const fullPath = path.join(process.cwd(), 'public', filepath)
    await fs.unlink(fullPath)
  } catch (error) {
    console.error('Failed to delete file:', error)
  }
}
```

### Folder Structure

```
/public/uploads/
  ├── projects/       # Portfolio images
  ├── blog/           # Blog cover images
  ├── testimonials/   # Avatar images
  └── temp/           # Temporary uploads (cleanup daily)
```

### Telegram Notification System

```typescript
// lib/telegram.ts
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function sendTelegramNotification(message: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('⚠️ Telegram not configured. Skipping notification.')
    return
  }
  
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      }
    )
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.description || 'Telegram API error')
    }
    
    console.log('✅ Telegram notification sent')
  } catch (error) {
    console.error('❌ Telegram error:', error)
    // Don't throw - notification failure shouldn't break the main flow
  }
}

// Lead notification template
export function formatLeadNotification(lead: {
  name: string
  email: string
  company?: string
  phone?: string
  budget?: string
  service?: string
  message: string
}): string {
  return `
🔔 <b>New Lead Received!</b>

👤 <b>Name:</b> ${lead.name}
📧 <b>Email:</b> ${lead.email}
${lead.company ? `🏢 <b>Company:</b> ${lead.company}\n` : ''}${lead.phone ? `📱 <b>Phone:</b> ${lead.phone}\n` : ''}${lead.budget ? `💰 <b>Budget:</b> ${lead.budget}\n` : ''}${lead.service ? `🛠 <b>Service:</b> ${lead.service}\n` : ''}
💬 <b>Message:</b>
${lead.message}

⏰ <b>Received:</b> ${new Date().toLocaleString('th-TH', { 
  timeZone: 'Asia/Bangkok',
  dateStyle: 'medium',
  timeStyle: 'short'
})}

🔗 <a href="https://yourdomain.com/dashboard/leads">View in Dashboard</a>
`.trim()
}
```

### Telegram Setup Instructions

1. **Create Bot:**
   - Open Telegram และค้นหา `@BotFather`
   - ส่ง `/newbot` และตั้งชื่อบอท
   - คัดลอก Bot Token

2. **Get Chat ID:**
   ```bash
   # Add bot เข้า channel/group หรือ chat ส่วนตัว
   # ส่งข้อความใดก็ได้ให้บอท
   # เปิด URL นี้ใน browser (แทน YOUR_BOT_TOKEN)
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   
   # หา "chat":{"id":123456789} และคัดลอก id
   ```

3. **Add to Environment:**
   ```env
   TELEGRAM_BOT_TOKEN="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
   TELEGRAM_CHAT_ID="123456789"
   ```

---

## Timeline & Success Criteria

### Phase 1 Timeline

**Total Duration:** 4-6 weeks (full-time) หรือ 8-12 weeks (part-time)

**Epic Breakdown:**
- EPIC 0 (Setup): 3-5 days
- EPIC 1 (Portfolio): 5-7 days  
- EPIC 2 (Leads): 4-5 days
- EPIC 3 (Blog): 5-7 days
- EPIC 4 (Services/Pricing): 3-4 days
- EPIC 5 (Admin Core): 4-5 days
- EPIC 6 (Polish): 5-7 days

### Success Criteria

**Functional:**
- [ ] ผู้ดูแลระบบสามารถ login เข้า /dashboard
- [ ] CRUD projects, blog posts, services, pricing สำเร็จ
- [ ] Lead generation form ทำงาน + Telegram notification
- [ ] Public pages แสดงข้อมูลจาก database
- [ ] Mobile responsive ทุกหน้า

**Technical:**
- [ ] No TypeScript errors
- [ ] No console errors ใน production
- [ ] Build สำเร็จ
- [ ] Database migrations ทำงาน
- [ ] Authentication secure

**Business:**
- [ ] Lead response time < 5 นาที (Telegram)
- [ ] Page load time < 2 วินาที
- [ ] Lighthouse score > 90
- [ ] SEO tags ครบถ้วน

---

## Phase Roadmap

### Phase 1: Core CMS (This Phase)

**Focus:** Database, Authentication, Admin CRUD, Lead Generation  
**Duration:** 4-6 weeks  
**Status:** Ready to start

**Detailed Plan:** 📄 [phase1_detailed.md](./phase1_detailed.md)

**Epic Summary:**
- EPIC 0: Project Setup & Infrastructure (3-5 days)
- EPIC 1: Portfolio Management System (5-7 days)
- EPIC 2: Lead Generation System (4-5 days)
- EPIC 3: Blog System (5-7 days)
- EPIC 4: Services & Pricing Management (3-4 days)
- EPIC 5: Admin Dashboard Core (4-5 days)
- EPIC 6: Polish & Optimization (5-7 days)

---

### Phase 2: Enhanced Features

**Focus:** CMS Enhancement, Advanced Lead System, Analytics, Booking  
**Duration:** 3-4 weeks  
**Status:** Planning

**Preview:** 📄 [phase2_preview.md](./phase2_preview.md)

**Epic Summary:**
- EPIC 7: Enhanced Content Management (Cloudinary, versioning, bulk operations)
- EPIC 8: Advanced Lead System (scoring, email automation, CRM)
- EPIC 9: Analytics & Insights (GA4, dashboard, heat maps)
- EPIC 10: Booking & Consultation System (calendar integration)

---

### Phase 3: Enterprise Features

**Focus:** Multi-language, Client Portal, Payments, AI Features  
**Duration:** 6-8 weeks  
**Status:** Future planning

**Preview:** 📄 [phase3_preview.md](./phase3_preview.md)

**Epic Summary:**
- EPIC 11: Multi-language Support (i18n, translations)
- EPIC 12: Client Portal (project dashboard, file sharing)
- EPIC 13: Payment & Invoicing (Stripe, invoice generation)
- EPIC 14: AI Features (proposal generator, chatbot, content suggestions)

---

## Development Resources

### Core Documentation
- 📋 **[Decision Log](./decision_log.md)** - All key decisions with rationale
- 📖 **[Workflow Guide](./workflow_guide.md)** - Git workflow, coding standards, deployment
- 📦 **[PRD](./prd.md)** - Original Product Requirements Document

### Getting Started

**Step 1:** อ่าน overview ใน development_plan.md นี้ (คุณอยู่ที่นี่)  
**Step 2:** อ่าน [decision_log.md](./decision_log.md) เพื่อเข้าใจ context และ trade-offs  
**Step 3:** เริ่มทำตาม [phase1_detailed.md](./phase1_detailed.md) จาก EPIC 0  
**Step 4:** ใช้ [workflow_guide.md](./workflow_guide.md) เป็นคู่มือระหว่างพัฒนา

---

## Maintenance & Updates

**Document Version:** 1.0  
**Last Updated:** 2024-01-xx  
**Maintained By:** Development Team

**Change Log:**
- 2024-01-xx: Initial creation, separated into multiple files for better organization

---

**Ready to start? 👉 Begin with [Phase 1 Detailed Plan](./phase1_detailed.md)**


