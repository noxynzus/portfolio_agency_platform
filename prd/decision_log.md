# Decision Log — UI/UX ProMax Project

**Date:** May 10, 2026  
**Document Type:** Decision Record

---

## Overview

เอกสารนี้บันทึกการตัดสินใจสำคัญทั้งหมดในโปรเจค รวมถึงคำถามที่ถาม คำตอบที่ได้ และเหตุผลในการเลือก

---

## Decision 1: Development Approach

### Question
คุณต้องการให้แผนการพัฒนานี้ครอบคลุมถึงขั้นตอนไหน?

### Options
- **A. MVP Phase** — เน้นระบบหลักที่จำเป็นที่สุด
- **B. Full Featured** — พัฒนาทุกอย่างตาม PRD
- **C. Phase by Phase** — แบ่งเป็น Phase 1, 2, 3

### Answer
**C - Phase by Phase**

### Rationale
- ทำให้เห็นภาพรวมทั้งหมด
- มีรายละเอียดของ Phase 1 เพื่อเริ่มงานได้ทันที
- Phase 2-3 เป็น preview เพื่อวางแผนอนาคต
- เหมาะกับการพัฒนาแบบ iterative
- ลดความเสี่ยงจาก scope creep

---

## Decision 2: Database & Backend Stack

### Question
คุณต้องการเริ่มต้นด้วย database แบบไหน?

### Options
- **A. Local First (SQLite + Simple Auth)** — ใช้ SQLite, ง่าย, เหมาะเรียนรู้
- **B. Production Ready (PostgreSQL + NextAuth)** — PostgreSQL + OAuth จากเริ่มต้น
- **C. Hybrid** — SQLite dev, PostgreSQL prod

### Answer
**B - Production Ready + Neon**
- **Database:** PostgreSQL (hosted on Neon)
- **ORM:** Prisma
- **Auth:** NextAuth.js v5

### Rationale
- ไม่ต้องมา migrate database ภายหลัง
- PostgreSQL มี features ครบถ้วน (JSON, full-text search)
- Neon มี free tier ดี, auto-scaling, branch database
- NextAuth v5 stable และ production-ready
- OAuth support สำหรับอนาคต

### Trade-offs
- ✅ Production-ready จากวันแรก
- ✅ Scalable
- ✅ Feature-rich
- ⚠️ Learning curve สูงกว่า SQLite เล็กน้อย
- ⚠️ ต้อง internet connection ตอน develop

---

## Decision 3: Admin Dashboard Structure

### Question
คุณต้องการให้ Admin Dashboard อยู่ในรูปแบบไหน?

### Options
- **A. Separate Route + Protected** — `/dashboard` หรือ `/admin`, ต้อง login
- **B. Subdomain** — `admin.yourdomain.com`
- **C. In-place Editing** — แก้ไขบนหน้าจริง (inline editing)

### Answer
**A - Separate Route + Protected** (`/dashboard`)

### Rationale
- แยกชัดเจนระหว่าง public และ admin
- ใช้ middleware protect ได้ง่าย
- ไม่ต้อง setup subdomain (ซับซ้อนกว่า)
- UX ดีกว่า inline editing สำหรับ complex content
- Standard pattern ที่คนใช้คุ้นเคย

### Implementation Details
- Route: `/dashboard/*`
- Protection: Middleware + NextAuth
- Role required: ADMIN
- Layout: Sidebar navigation

---

## Decision 4: Lead Management & Notifications

### Question
เมื่อลูกค้ากรอก Contact Form คุณต้องการให้ระบบทำอะไรบ้าง?

### Options
- **A. Database Only** — เก็บใน DB, ดูใน admin เท่านั้น
- **B. Email Notification** — DB + ส่งอีเมล์
- **C. Multi-channel Alert** — DB + Email + Discord/Slack/Telegram

### Answer
**Database + Telegram Notification**

### Rationale
- มีการใช้งาน Telegram อยู่แล้ว
- Real-time notification
- ไม่ต้อง setup email server (ประหยัดเวลา Phase 1)
- Telegram Bot API ง่าย, ฟรี, reliable
- สามารถเพิ่ม email notification ใน Phase 2

### Implementation
- Save lead to database
- Send formatted message ไป Telegram
- Link กลับไป admin dashboard ในข้อความ
- Error handling: notification failure ไม่ควรทำให้ lead submission fail

---

## Decision 5: Media & File Management

### Question
คุณต้องการจัดการไฟล์และรูปภาพยังไง?

### Options
- **A. Local Storage** — `/public/uploads` บน server
- **B. Cloud Storage (Cloudinary)** — Image optimization, CDN
- **C. Cloud Storage (AWS S3/Vercel Blob)** — Full control

### Answer
**A - Local Storage** (Phase 1) → **Cloudinary** (Phase 2)

### Rationale - Phase 1
- เริ่มแบบง่ายที่สุด
- ไม่ต้อง setup cloud service
- ไม่มีค่าใช้จ่ายเพิ่ม
- เหมาะกับการเรียนรู้
- เพียงพอสำหรับ prototype และ initial launch

### Migration Plan - Phase 2
- Migrate ไป Cloudinary เมื่อ:
  - มีรูปภาพเยอะ (>1GB)
  - ต้องการ image optimization
  - ต้องการ CDN เพื่อ performance
  - ต้องการ image transformation

### Implementation
- Folder: `/public/uploads/{projects,blog,testimonials,temp}`
- Validation: File type, size (5MB max)
- Security: Unique filenames, sanitization
- Cleanup: Daily cron job สำหรับ /temp

---

## Decision 6: Implementation Strategy

### Question
คุณต้องการแนวทางการพัฒนาแบบไหน?

### Options
- **A. Bottom-Up (Infrastructure First)** — Setup ทุกอย่างก่อน, แล้วสร้าง features
- **B. Feature-by-Feature (Vertical Slice)** — ทำแต่ละ feature ให้สมบูรณ์ทีละตัว
- **C. Hybrid (Quick Start + Iterative)** — เริ่มง่ายๆ แล้วค่อยปรับปรุง

### Answer
**B - Feature-by-Feature (Vertical Slice)**

### Rationale
- **เหมาะกับผู้เริ่มต้นที่สุด**
- เห็นผลลัพธ์ชัดเจนทุก epic
- เรียนรู้ได้ทีละขั้นตอน (ไม่ overwhelming)
- สามารถใช้งานได้ทันทีที่ feature เสร็จ
- ได้ feedback เร็ว → ปรับปรุงได้ไว
- Pattern ที่เรียนรู้จาก feature แรกใช้ได้กับ feature ถัดไป

### Implementation Pattern
แต่ละ feature จะพัฒนา end-to-end:
1. Database schema + types
2. Server Actions (CRUD)
3. Admin UI (forms, tables)
4. Public display
5. Testing

**ตัวอย่าง Epic 1: Portfolio**
- Task 1.1: Data layer (DB + Actions)
- Task 1.2: Admin list
- Task 1.3: Admin form
- Task 1.4: Public list page
- Task 1.5: Public detail page

**ข้อดี:**
- ✅ ความก้าวหน้าชัดเจน
- ✅ Motivation สูง (เห็นผลเร็ว)
- ✅ ใช้งานได้ทันที
- ✅ Easy to demo
- ✅ Learn by doing

**ข้อเสีย:**
- ⚠️ อาจต้อง refactor patterns เล็กน้อย (แต่ไม่มาก)

---

## Technical Decisions Summary

### Frontend
| Decision | Choice | Alternative Considered |
|----------|--------|----------------------|
| Framework | Next.js 15 (App Router) | Remix, Astro |
| Language | TypeScript (strict) | JavaScript |
| Styling | Tailwind CSS | CSS Modules, Styled Components |
| UI Library | shadcn/ui | Material UI, Chakra UI |
| Animation | Framer Motion | GSAP, React Spring |
| Forms | React Hook Form + Zod | Formik, uncontrolled forms |

### Backend
| Decision | Choice | Alternative Considered |
|----------|--------|----------------------|
| API Pattern | Server Actions | API Routes, tRPC |
| Database | PostgreSQL (Neon) | MySQL, MongoDB, Supabase |
| ORM | Prisma | Drizzle, TypeORM, Kysely |
| Auth | NextAuth.js v5 | Clerk, Auth0, Custom |
| Validation | Zod | Yup, Joi, Ajv |

### Infrastructure
| Decision | Choice | Alternative Considered |
|----------|--------|----------------------|
| Hosting | Vercel | Netlify, AWS, Railway |
| Database Host | Neon | Supabase, PlanetScale, Railway |
| File Storage | Local (Phase 1) | Cloudinary, S3, Vercel Blob |
| Notifications | Telegram | Email (Resend), Discord, Slack |

---

## Design Patterns Chosen

### 1. Server Components First
- ใช้ Server Components เป็นหลัก
- Client Components เฉพาะที่จำเป็น (forms, interactivity)
- Rationale: Better performance, SEO, reduced JS bundle

### 2. Server Actions for Mutations
- ไม่ใช้ API routes เว้นแต่จำเป็น (webhooks, external API)
- Server Actions ให้ type safety ดีกว่า
- Rationale: Simpler, type-safe, co-located with components

### 3. Zod for Validation
- Validate ทั้ง client และ server
- Share schemas ระหว่าง frontend/backend
- Rationale: Type inference, reusable, runtime safety

### 4. Prisma Client Singleton
- สร้าง singleton เพื่อป้องกัน connection leaks
- Rationale: Best practice for Next.js + Prisma

### 5. Protected Server Actions
- ทุก mutation ต้องเช็ค auth ก่อน
- ใช้ `requireAuth()` และ `requireAdmin()`
- Rationale: Security first, consistent pattern

---

## Evolution & Future Decisions

### Phase 2 Planned Changes
- [ ] Migrate file storage → Cloudinary
- [ ] Add email notifications (Resend)
- [ ] Add CRM integration (HubSpot/Pipedrive)
- [ ] Add analytics (Google Analytics, Plausible)
- [ ] Add booking system (Calendly integration)

### Phase 3 Planned Changes
- [ ] Multi-language support (next-intl)
- [ ] Client portal
- [ ] Payment integration (Stripe)
- [ ] AI features (proposal generator, chatbot)

### Technical Debt to Address
- [ ] Add comprehensive testing (Vitest + Playwright)
- [ ] Add Storybook for component documentation
- [ ] Implement proper logging (Pino or Winston)
- [ ] Add error tracking (Sentry)
- [ ] Add monitoring (Vercel Analytics)

---

## Lessons Learned (To be updated during development)

_This section will be filled as we progress through development_

### Epic 0: Setup
- [x] ✅ Neon + Prisma setup ราบรื่น
- [x] ✅ NextAuth v5 ใช้งานได้ดี

### Epic 1: Portfolio
- [x] ✅ Drag & drop ด้วย @dnd-kit ทำงานได้ดี
- [x] ✅ Image upload + preview pattern reusable

### Epic 2: Leads
- [x] ✅ Telegram notification reliable และรวดเร็ว
- [x] ✅ Server Actions + revalidatePath ช่วยให้ UX ดี

### Epic 3: Blog System
- [x] ✅ Markdown editor (@uiw/react-md-editor) ทำงานได้ดีมาก
- [x] ✅ Slug auto-generation จาก title ช่วยให้ UX ดี
- [x] ✅ Image upload สำหรับ featured image ใช้ pattern เดียวกับ portfolio
- [x] ✅ Server-side markdown parsing (react-markdown + remark-gfm) รวดเร็ว

### Epic 4: Services & Pricing
- [x] ✅ Icon selector pattern reusable
- [x] ✅ Drag & drop table ต้องระวัง HTML structure (DndContext ห่อนอก table)
- [x] ✅ Admin layout refactor ทำให้ navigation consistency ดีขึ้นมาก
- [x] ✅ Feature toggle pattern (highlight, recommended) ใช้งานง่าย

### Epic 5: Admin Dashboard Core
- [x] ✅ Site Settings form กับ Zod schema ทำงานได้ดี
- [x] ✅ Maintenance Mode toggle ต้องใช้ watch() แทน useState เพื่อ real-time
- [x] ✅ Middleware เหมาะสำหรับ auth เท่านั้น ไม่ควรทำ database query
- [x] ✅ Client-side maintenance check ด้วย useSession + API route ทำงานได้ดี
- [x] ✅ Testimonials drag & drop reorder ใช้ transaction สำหรับ bulk update

### Epic 6: Polish & Optimization
- [x] ✅ Error boundaries ใน Next.js 15 ใช้งานง่าย (error.tsx)
- [x] ✅ Loading states ด้วย loading.tsx เป็น pattern ที่ดี
- [x] ✅ Rate limiting in-memory เพียงพอสำหรับ Phase 1
- [x] ✅ Dynamic sitemap.ts ต้อง handle database errors gracefully
- [x] ✅ Security headers ใน next.config.ts ต้อง return array ของ objects
- [x] ✅ Documentation ครบถ้วนช่วยให้ deploy ได้ง่าย

### Key Insights
- ✅ **Server Actions + revalidatePath** = Real-time UX without complex state management
- ✅ **Prisma + TypeScript** = Excellent type safety และ DX
- ✅ **Drag & Drop** = @dnd-kit มี learning curve แต่ powerful มาก
- ✅ **Zod Validation** = Share schemas ระหว่าง client/server ลด code duplication
- ✅ **Next.js 15 App Router** = ต้องเข้าใจ Server/Client Components แยกชัด
- ✅ **Rate Limiting** = In-memory เพียงพอสำหรับ small-medium traffic
- ✅ **Error Handling** = Centralized utilities ทำให้ consistent และ maintainable
- ✅ **Documentation** = README + DEPLOYMENT guide ประหยัดเวลาตอน deploy

---

## Phase 1 Completion Summary

### 🎉 All EPICs Completed (May 13, 2026)

**Timeline:** Started May 10, 2026 → Completed May 13, 2026 (4 days actual)

**What Was Built:**
- ✅ 6 EPICs (EPIC 0-6)
- ✅ 40+ React Components
- ✅ 8 Database Models (User, Project, Post, Service, PricingPlan, Testimonial, Lead, SiteSettings)
- ✅ 7 Admin Pages (Dashboard, Projects, Blog, Services, Pricing, Testimonials, Settings, Leads)
- ✅ 10+ Public Pages (Home, About, Services, Portfolio, Pricing, Blog, Contact, FAQ, Maintenance)
- ✅ 20+ Server Actions (CRUD operations with validation)
- ✅ Authentication System (NextAuth v5 with JWT)
- ✅ Drag & Drop Features (Projects, Services, Pricing, Testimonials reordering)
- ✅ Markdown Blog System (Editor + Reader with syntax highlighting)
- ✅ Telegram Integration (Real-time lead notifications)
- ✅ Rate Limiting (Contact form, Login protection)
- ✅ SEO Optimization (Dynamic sitemap, robots.txt, meta tags)
- ✅ Security Hardening (Headers, rate limiting, validation)
- ✅ Complete Documentation (README.md, DEPLOYMENT.md, .env.example)

**Technologies Mastered:**
- Next.js 15 App Router + Turbopack
- React 19 + TypeScript 5
- Prisma ORM + PostgreSQL (Neon)
- NextAuth v5 (beta)
- Tailwind CSS + Glassmorphism
- Framer Motion
- React Hook Form + Zod
- @dnd-kit (Drag & Drop)
- Markdown editing & rendering

**Achievements:**
- 🚀 Production-ready application
- 📊 Full-featured admin dashboard
- 🎨 Modern glassmorphism UI with animations
- 🔒 Security hardened (rate limiting, CSRF, XSS protection)
- 📈 SEO optimized (sitemap, robots.txt, Open Graph)
- 📝 Well documented (setup, deployment, troubleshooting)
- 🛠️ Ready for Vercel/Railway deployment
- ⚡ Performance optimized (Image optimization, ISR caching)
- ✅ 0 TypeScript errors
- ✅ 0 console errors

**Ready for:**
- Immediate deployment to production
- Phase 2: CMS Enhancement
- Client handoff

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-05-10 | Initial decisions | Project kickoff |
| 2026-05-12 | Epic 4 completed + Admin layout redesign | Services/Pricing management + consistent navigation |
| 2026-05-13 | **Phase 1 Complete** (All EPICs 0-6) | Blog system, Admin dashboard, Testimonials, Site settings, Error handling, SEO, Security, Documentation - Full production-ready application |
