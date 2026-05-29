# UI/UX ProMax - Premium Digital Engineering Studio

A modern, full-stack web application built with Next.js 15, featuring portfolio management, blog system, lead generation with Telegram notifications, and a comprehensive admin dashboard.

![Tech Stack](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql)

---

## ✨ Features

### Public Features
- 🎨 **Modern Glassmorphism UI** - Cyber-themed design with animations
- 📱 **Fully Responsive** - Works on all devices
- 🖼️ **Dynamic Portfolio** - Showcase projects with filtering
- 📝 **Blog System** - Markdown support with syntax highlighting
- 💰 **Pricing Plans** - Flexible pricing tiers
- 📞 **Contact Form** - With rate limiting and Telegram notifications
- 🔍 **SEO Optimized** - Dynamic sitemap, meta tags, Open Graph
- ⚡ **Fast Performance** - Optimized images, ISR caching

### Admin Dashboard
- 🔐 **Secure Authentication** - NextAuth v5 with JWT
- 📊 **Analytics Dashboard** - Real-time statistics
- 🎯 **Project Management** - CRUD with image uploads
- ✍️ **Blog Management** - Markdown editor with preview
- 💵 **Pricing Management** - Dynamic pricing plans
- 🛠️ **Services Management** - Manage service offerings
- 📧 **Lead Management** - Track and respond to inquiries
- 💬 **Testimonials** - Drag & drop reordering
- ⚙️ **Site Settings** - Contact info, SEO, maintenance mode

---

## 🛠️ Tech Stack

### Core
- **Framework:** Next.js 15 (App Router + Turbopack)
- **Language:** TypeScript 5
- **UI:** React 19
- **Styling:** Tailwind CSS + Glassmorphism
- **Animations:** Framer Motion

### Backend
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma 5
- **Auth:** NextAuth v5 (beta)
- **Validation:** Zod

### Features
- **Forms:** React Hook Form + Zod resolvers
- **Drag & Drop:** @dnd-kit
- **Markdown:** @uiw/react-md-editor + react-markdown
- **Notifications:** Sonner (toasts) + Telegram Bot
- **Icons:** Lucide React

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon account)
- pnpm/npm/yarn

### 1. Clone & Install

```bash
git clone <repository-url>
cd ui_ux_promax
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="your-32-char-secret"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="securepassword"
TELEGRAM_BOT_TOKEN="optional"
TELEGRAM_CHAT_ID="optional"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Seed database
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Access Admin Dashboard

- URL: http://localhost:3000/login
- Email: (from .env `ADMIN_EMAIL`)
- Password: (from .env `ADMIN_PASSWORD`)

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── (public)/          # Public routes
│   ├── dashboard/         # Admin routes
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # SEO robots.txt
├── components/
│   ├── admin/             # Admin-only components
│   ├── common/            # Shared components
│   ├── layout/            # Layout components
│   └── sections/          # Homepage sections
├── lib/
│   ├── actions/           # Server actions
│   ├── validations/       # Zod schemas
│   ├── auth.ts            # Auth utilities
│   ├── db.ts              # Prisma client
│   ├── rate-limit.ts      # Rate limiting
│   └── telegram.ts        # Telegram bot
├── types/                 # TypeScript types
└── data/                  # Static data (fallbacks)
prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Seed script
```

---

## 🔒 Security Features

- ✅ **Rate Limiting** - 5 contact submissions / 15 min
- ✅ **CSRF Protection** - NextAuth built-in
- ✅ **Security Headers** - HSTS, X-Frame-Options, CSP
- ✅ **Input Validation** - Zod schemas on all forms
- ✅ **SQL Injection Prevention** - Prisma ORM
- ✅ **XSS Protection** - React automatic escaping
- ✅ **Authentication** - JWT tokens, bcrypt passwords

---

## 📊 Database Schema

8 main models:
- **User** - Admin users
- **Project** - Portfolio projects
- **Post** - Blog posts
- **Service** - Service offerings
- **PricingPlan** - Pricing tiers
- **Testimonial** - Client testimonials
- **Lead** - Contact form submissions
- **SiteSettings** - Global site configuration

See [prisma/schema.prisma](prisma/schema.prisma) for full schema.

---

## 🎨 Customization

### Update Site Information
1. Go to `/dashboard/settings`
2. Edit contact info, social links, SEO settings
3. Enable/disable maintenance mode

### Add Content
- **Projects:** `/dashboard/projects`
- **Blog Posts:** `/dashboard/blog`
- **Services:** `/dashboard/services`
- **Pricing:** `/dashboard/pricing`
- **Testimonials:** `/dashboard/testimonials`

### Styling
- **Colors:** Edit `tailwind.config.ts`
- **Fonts:** Update `src/app/layout.tsx`
- **Theme:** Modify `src/app/globals.css`

---

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment Variables Required:**
- `DATABASE_URL` (production database)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your domain)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- Optional: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

---

## 📝 Scripts

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (DB GUI)
npx prisma db seed   # Reseed database
```

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test connection
npx prisma db pull

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Build Errors
```bash
# Clear cache
rm -rf .next
npm run build
```

### Authentication Issues
- Ensure `NEXTAUTH_SECRET` is set (min 32 characters)
- Check `NEXTAUTH_URL` matches your domain
- Verify admin credentials in `.env`

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes with clear messages
4. Submit a pull request

---

## 📧 Support

- **Email:** support@atthawat.studio
- **Documentation:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues:** GitHub Issues

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [Prisma](https://prisma.io/)
- [NextAuth](https://authjs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

**Built with ❤️ by Atthawat Studio**
