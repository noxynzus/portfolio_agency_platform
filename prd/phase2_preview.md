# Phase 2: CMS Enhancement & Advanced Features

**Duration:** 3-4 สัปดาห์  
**Status:** Preview / Planning  
**Prerequisites:** Phase 1 Complete

---

## Overview

Phase 2 เน้นเพิ่มความสามารถของ CMS และ features ที่ช่วยเพิ่ม conversion และปรับปรุง workflow

---

## EPIC 7: Enhanced Content Management

**Duration:** 5-7 วัน

### Goals
- ปรับปรุง media management
- เพิ่ม bulk operations
- Content versioning

### Features
- **Rich Media Library**
  - Upload multiple files พร้อมกัน
  - Image preview & management
  - Search & filter media
  - Usage tracking (ใช้ที่ไหนบ้าง)

- **Cloudinary Migration**
  - Migrate จาก local storage
  - Automatic image optimization
  - CDN delivery
  - Image transformations (resize, crop, format)

- **Bulk Operations**
  - Bulk publish/unpublish
  - Bulk delete
  - Bulk category change
  - Import/Export (CSV, JSON)

- **Content Versioning**
  - Draft autosave
  - Revision history
  - Restore previous versions
  - Schedule publishing

### Technical Stack
- Cloudinary SDK
- React Dropzone (multiple uploads)
- Scheduled jobs (Vercel Cron or similar)

---

## EPIC 8: Advanced Lead System

**Duration:** 5-7 วัน

### Goals
- ปรับปรุง lead management
- เพิ่ม automation
- CRM integration

### Features
- **Lead Scoring & Qualification**
  - Auto-score based on criteria (budget, urgency, fit)
  - Lead segments (hot, warm, cold)
  - Priority queue

- **Email Automation**
  - Welcome email หลัง lead submit
  - Follow-up sequence
  - Email templates
  - Integration: Resend หรือ SendGrid

- **CRM Integration**
  - HubSpot integration
  - Pipedrive integration
  - Auto-sync leads
  - Two-way sync (optional)

- **Lead Assignment Workflow**
  - Assign leads to team members
  - Notifications
  - SLA tracking

- **Custom Forms**
  - Form builder (drag & drop)
  - Conditional fields
  - Multi-step forms
  - Custom fields

### Technical Stack
- Resend (email)
- HubSpot API / Pipedrive API
- Form builder library (formbuilder.js หรือ custom)

---

## EPIC 9: Analytics & Insights

**Duration:** 4-5 วัน

### Goals
- Track performance
- Understand user behavior
- Data-driven decisions

### Features
- **Google Analytics Integration**
  - GA4 setup
  - Custom events (lead submit, project view, etc.)
  - Conversion tracking
  - Goal tracking

- **Custom Analytics Dashboard**
  - Page views per page
  - Lead conversion funnel
  - Popular projects
  - Traffic sources
  - Time on site

- **Heat Maps (Optional)**
  - Hotjar or Microsoft Clarity
  - Click tracking
  - Scroll depth
  - Session recordings

- **A/B Testing Framework**
  - Test different CTAs
  - Test pricing display
  - Test forms
  - Integration: Vercel Edge Config หรือ custom

### Technical Stack
- Google Analytics 4
- Microsoft Clarity (free, easy)
- Chart libraries (Recharts, Chart.js)

---

## EPIC 10: Booking & Consultation System

**Duration:** 5-7 วัน

### Goals
- ให้ลูกค้า book consultation ได้ง่าย
- ลด friction ในการติดต่อ

### Features
- **Calendar Integration**
  - Google Calendar sync
  - Calendly integration (easiest)
  - Cal.com (open source alternative)

- **Booking Widget**
  - Embed on website
  - Available time slots
  - Timezone handling
  - Confirmation email

- **Availability Management**
  - Set working hours
  - Block off dates
  - Buffer times
  - Meeting types (30min, 60min)

- **Reminders**
  - Email reminder (1 day before)
  - SMS reminder (optional - Twilio)
  - Telegram reminder

- **Meeting Notes**
  - Pre-meeting questionnaire
  - Meeting notes (admin-only)
  - Follow-up actions

### Technical Stack
- Calendly (simplest - embed)
- Cal.com (self-hosted option)
- Google Calendar API (full control)
- Twilio (SMS, optional)

---

## Recommended Order

1. **Start with EPIC 8 (Lead System)** - ส่งผลต่อ business ทันที
2. **Then EPIC 9 (Analytics)** - เข้าใจ user behavior
3. **Then EPIC 10 (Booking)** - เพิ่ม conversion
4. **Finally EPIC 7 (CMS)** - Quality of life improvements

---

## Success Criteria

### Business Goals
- [ ] Lead response time < 1 hour (automation)
- [ ] Booking conversion rate > 10%
- [ ] Email open rate > 30%
- [ ] Lead qualification accuracy > 80%

### Technical Goals
- [ ] Email delivery rate > 99%
- [ ] Calendar sync reliable
- [ ] Analytics accurate
- [ ] CDN serving images < 200ms

### UX Goals
- [ ] Booking process < 2 min
- [ ] Zero-downtime migrations
- [ ] Mobile booking works perfectly

---

## Estimated Timeline

```
Week 1: EPIC 8 (Lead System Enhancement)
Week 2: EPIC 9 (Analytics) + Start EPIC 10
Week 3: EPIC 10 (Booking System)
Week 4: EPIC 7 (CMS Enhancement) + Testing
```

**Total: 3-4 weeks**

---

## Dependencies

### External Services Needed
- Cloudinary account (free tier available)
- Resend account (email - free tier)
- Google Analytics account (free)
- Calendly/Cal.com account
- HubSpot/Pipedrive (if using CRM)

### Costs Estimate (Monthly)
- Cloudinary: $0 (free tier) - $99/mo (paid)
- Resend: $0 (free tier) - $20/mo
- Google Analytics: Free
- Calendly: $10/mo - $16/mo
- HubSpot: Free tier available
- **Total: $10-135/mo** depending on tier

---

## Migration Notes

### Cloudinary Migration
```typescript
// Migration script
async function migrateToCloudinary() {
  const projects = await db.project.findMany()
  
  for (const project of projects) {
    if (project.images) {
      const newImages = await Promise.all(
        project.images.map(async (localPath) => {
          const result = await cloudinary.uploader.upload(localPath)
          return result.secure_url
        })
      )
      
      await db.project.update({
        where: { id: project.id },
        data: { images: newImages }
      })
    }
  }
}
```

### Email Template Structure
```
templates/
  ├── lead-confirmation.html
  ├── welcome.html
  ├── follow-up-day1.html
  ├── follow-up-day3.html
  ├── follow-up-day7.html
  └── booking-confirmation.html
```

---

## Next: Phase 3

📖 See [phase3_preview.md](./phase3_preview.md) for enterprise features
