# HASON INDUSTRIES — FULL-STACK BUILD PROMPT
# PART 2 OF 2: ADMIN SYSTEM, AUTH, API, IMPLEMENTATION ORDER
# (Continue from Part 1 — full context assumed)

---
## AUTH: NextAuth v5 (Auth.js)
- next-auth@5 with @auth/prisma-adapter
- Provider: Credentials only (email + bcryptjs password)
- Session strategy: JWT
- Middleware: protect all /admin/* routes, redirect unauthenticated → /admin/login
- /setup bypass: only if User count === 0, checked in server component AND middleware
  If user exists: redirect /setup → /admin/login immediately. No exceptions.
- lib/auth.ts exports authOptions and auth()

---
## /setup PAGE — One-Time Admin Creation
Route: /setup | SSR, never cached
Guard (server component):
  const count = await prisma.user.count()
  if (count > 0) redirect('/admin/login')
Form: Name, Email, Password, Confirm Password
Server Action: Zod validate → bcrypt hash → prisma.user.create → redirect /admin/login
UI: industrial theme, stripped — dark bg, amber accent, DM Mono font, centered card
After first user creation: /setup is permanently inaccessible.

---
## MIDDLEWARE (middleware.ts)
import { auth } from '@/lib/auth'
export default auth((req) => {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!req.auth) return Response.redirect(new URL('/admin/login', req.url))
  }
})
export const config = { matcher: ['/admin/:path*'] }

---
## ADMIN PAGES (all SSR, live data)
/admin                    → redirect → /admin/dashboard
/admin/login              → Credentials login form
/admin/dashboard          → counts: products, gallery images, unread contact submissions
/admin/products           → DataTable of all products
/admin/products/new       → ProductForm (create)
/admin/products/[id]      → ProductForm (edit, pre-populated)
/admin/gallery            → GalleryGrid with order + delete
/admin/gallery/upload     → GalleryUploader (R2 presign → PUT → DB record)
/admin/contact            → ContactTable (list, read/unread, delete)

AdminLayout: sidebar nav + topbar with session user display + signout button
AdminSidebar links: Dashboard | Products | Gallery | Contact Submissions

---
## API ROUTE HANDLERS (app/api/admin/)
All handlers must:
1. Call auth() — reject with 401 if no session
2. Return { success: boolean, data?, error? }
3. Zod validate all input before DB operation
4. Never expose raw Prisma errors

### PRODUCTS
GET    /api/admin/products              list all; ?category= ?featured= filters
POST   /api/admin/products              create: { name, slug, category, description, specs, imageKeys[], featured }
GET    /api/admin/products/[id]         get single by id
PUT    /api/admin/products/[id]         full update
PATCH  /api/admin/products/[id]         partial update (e.g. toggle featured)
DELETE /api/admin/products/[id]         delete product + optionally purge R2 keys

### GALLERY
GET    /api/admin/gallery               list all ordered by `order` asc
POST   /api/admin/gallery               create record: { key, caption?, order? }
PATCH  /api/admin/gallery/[id]          update caption or order
DELETE /api/admin/gallery/[id]          delete record + DeleteObjectCommand from R2
POST   /api/admin/gallery/reorder       bulk update: body [{ id, order }]

### R2 UPLOAD — Presigned URL Flow (never proxy file through Next.js)
POST   /api/admin/upload/presign
  body: { filename, contentType, folder: 'products' | 'gallery' }
  generates PutObject presigned URL (expires 300s)
  returns { uploadUrl, key }
  client PUT file directly to R2 uploadUrl
  client then calls POST /api/admin/gallery or includes key in product form

### CONTACT SUBMISSIONS
GET    /api/admin/contact               list all; ?read=true|false; ?page= ?limit=
GET    /api/admin/contact/[id]          get single
PATCH  /api/admin/contact/[id]          update { read: boolean }
DELETE /api/admin/contact/[id]          delete

### AUTH
NextAuth built-in: /api/auth/[...nextauth]/route.ts
No custom auth handlers beyond NextAuth config.

---
## ADMIN UI COMPONENTS (no external UI library)
AdminLayout           sidebar nav + topbar + signout
DataTable             reusable, sortable columns, pagination
ProductForm           controlled form:
                        dynamic key-value spec editor (add/remove rows)
                        image key list display (after R2 upload)
                        R2 presign upload trigger button + progress
GalleryUploader       file input → presign → PUT to R2 → POST /api/admin/gallery
                      shows upload progress per file, handles multiple sequentially
GalleryGrid (admin)   image grid, delete button per image, drag handles for reorder
                      on reorder: POST /api/admin/gallery/reorder
ContactTable          table of submissions, read/unread badge (amber/grey),
                      expandable message row, delete button

---
## PROJECT STRUCTURE (complete)
app/
  layout.tsx                        root layout, fonts, grain overlay, Motion wrapper
  page.tsx                          / home
  about/page.tsx
  products/page.tsx
  products/[slug]/page.tsx
  gallery/page.tsx
  contact/page.tsx
  setup/page.tsx                    one-time admin creation guard
  admin/
    layout.tsx                      AdminLayout wrapper
    login/page.tsx
    dashboard/page.tsx
    products/page.tsx
    products/new/page.tsx
    products/[id]/page.tsx
    gallery/page.tsx
    gallery/upload/page.tsx
    contact/page.tsx
  actions/
    contact.ts                      Server Action: validate → DB → email
    setup.ts                        Server Action: validate → bcrypt → create user
  api/
    auth/[...nextauth]/route.ts
    admin/
      products/route.ts
      products/[id]/route.ts
      gallery/route.ts
      gallery/[id]/route.ts
      gallery/reorder/route.ts
      contact/route.ts
      contact/[id]/route.ts
      upload/presign/route.ts
components/
  ui/                               Button, Badge, Card, Modal (custom)
  layout/                           Navbar, Footer
  home/                             HeroSection, StatCounter, ProductCategoryGrid, FacilityHighlights
  products/                         ProductCard, ProductGrid, ProductFilter, SpecTable
  gallery/                          GalleryGrid, Lightbox
  contact/                          ContactForm, ContactInfo, MapEmbed
  admin/                            AdminLayout, AdminSidebar, DataTable, ProductForm,
                                    GalleryUploader, GalleryGrid, ContactTable
  seo/                              JsonLd (typed JSON-LD component)
lib/
  db.ts                             Prisma singleton with pg adapter
  r2.ts                             S3Client for R2
  mailer.ts                         Nodemailer transport
  auth.ts                           NextAuth config + auth() export
  validations/
    contact.ts
    product.ts
    gallery.ts
    setup.ts
middleware.ts
prisma/schema.prisma
next.config.ts
tailwind.config.ts

---
## IMPLEMENTATION ORDER
1.  Init Next.js 15, TypeScript strict, Tailwind v4, ESLint
2.  Add User model, configure NextAuth v5 + @auth/prisma-adapter, push schema
3.  Build /setup page + Server Action (user count guard + bcrypt + create)
4.  Build /admin/login page (Credentials form)
5.  Configure Prisma 7 with pg adapter, push full schema (all models)
6.  Configure R2 client (lib/r2.ts), test connection
7.  Configure Nodemailer (lib/mailer.ts)
8.  Build middleware.ts (auth guard for /admin/*)
9.  Build AdminLayout, AdminSidebar
10. Build all /api/admin/* route handlers with auth() guard + Zod validation
11. Build admin pages: dashboard → products CRUD → gallery upload+reorder → contact list
12. Build root layout: grain overlay CSS, Motion AnimatePresence, next/font
13. Build Navbar + Footer
14. Build / page bottom-up: Hero → StatCounter → ProductCategoryGrid → FacilityHighlights → CTA
15. Build /about
16. Build /products (SSR, filter sidebar, product cards) + /products/[slug]
17. Build /gallery (SSR+ISR, masonry, lightbox)
18. Build /contact (Server Action, Nodemailer, DB save, toast, rate limit)
19. Add JsonLd component, wire all JSON-LD per page
20. Add generateMetadata() to every page
21. Configure next-sitemap, robots.txt
22. Audit: CWV, SEO completeness, mobile responsiveness, GSAP cleanup, R2 presign expiry

---
## ZOD SCHEMAS (define in lib/validations/)
contact.ts:    name, email, phone(optional), subject, message
product.ts:    name, slug, category, description, specs(record<string,string>), imageKeys[], featured
gallery.ts:    key, caption(optional), order(optional int)
setup.ts:      name, email, password(min 8), confirmPassword + refine match check
contact-update.ts: { read: boolean }

---
## SECURITY REQUIREMENTS
- bcryptjs rounds: 12
- NEXTAUTH_SECRET: minimum 32-char random string
- R2 presign: server-side only, 300s expiry, validate contentType whitelist (image/jpeg, image/png, image/webp)
- All admin API routes: auth() session check before any logic
- Contact rate limit: in-memory Map<ip, timestamp[]>, max 1 per 10 min per IP
- Zod parse (not safeParse) in Server Actions — let errors surface to client as structured messages
- Never log full error objects to client responses

---
## END OF PROMPT
Both parts together constitute the complete specification.
Begin implementation now starting from step 1 of the Implementation Order.
