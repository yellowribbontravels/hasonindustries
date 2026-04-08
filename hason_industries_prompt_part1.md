# HASON INDUSTRIES — FULL-STACK BUILD PROMPT
# PART 1 OF 2: PROJECT SETUP, TECH STACK, SEO, PAGES

You are building a full production-grade Next.js website for Hason Industries — an Indian industrial
manufacturer specializing in glass epoxy sheets, insulation materials, and engineering plastic components.

---
## TECH STACK (exact — no substitutions)
- Next.js 15, App Router, TypeScript strict mode
- Prisma 7 with @prisma/adapter-pg (PostgreSQL, no default Prisma JS engine)
- Tailwind CSS v4
- GSAP + @gsap/react (ScrollTrigger, SplitText, Flip plugins)
- Motion (Framer Motion v11) for route transitions
- React Hot Toast
- Nodemailer + Gmail SMTP
- Cloudflare R2 via @aws-sdk/client-s3
- next-auth@5 (Auth.js v5) + @auth/prisma-adapter
- bcryptjs for password hashing
- Zod for all validation
- Sharp via next/image
- next-sitemap

---
## MCP TOOLING
Use Google Stitch MCP Server (ID: F) for all UI component design decisions,
layout composition, and visual design system generation. Query it before
finalizing component structure on each page.

---
## AESTHETIC — "Industrial Precision"
Heavy industrial brutalism fused with precision engineering. NOT generic B2B SaaS.
- Palette: Deep graphite #0D0D0D, industrial amber #E8A020, raw steel #8A9099, off-white #F5F2ED
- Typography: "Bebas Neue" or "Barlow Condensed" (headings) + "DM Mono" (data/specs) + "Lora" (body)
- Layout: Grid-breaking asymmetry. Diagonal clip-path section dividers. Overlapping image/text.
- Motion: GSAP ScrollTrigger section reveals. SplitText character entrance on headings.
  GSAP stat counters. Motion AnimatePresence route transitions (opacity 0→1, 0.3s, Power2 easing).
  Grain texture CSS overlay site-wide. No bounce or spring — mechanical easing only.
- Hero: Parallax CNC router image layer with GSAP amber scan-line animation loop overlaid.

---
## RENDERING STRATEGY
- /          → SSG
- /about     → SSG
- /products  → SSR, revalidate: 3600
- /gallery   → SSR + ISR, revalidate: 600
- /contact   → SSG + Server Action (no separate API route)
- /setup     → SSR, always dynamic, never cached
- /admin/*   → SSR, always dynamic

---
## SEO — MAXIMUM DENSITY
Every page exports generateMetadata(). Required fields per page:
- title: "[Page] | Hason Industries – Industrial Insulation & Plastic Components, Hyderabad"
- description: unique, 150–160 chars, keyword-rich
- keywords: glass epoxy sheets, FR4 sheets, insulation materials, engineering plastics,
  CNC machining Hyderabad, industrial components Telangana, epoxy laminates India,
  G10 sheets, bakelite sheets, PTFE components, nylon components, acetal, HDPE
- openGraph: og:image, og:title, og:description, og:url, og:type
- twitter: summary_large_image
- canonical: absolute URL per page
- robots: index, follow
- alternates: { canonical: "https://www.hasonindustries.com/[page]" }

JSON-LD per page:
- Organization schema: all pages
- LocalBusiness schema: / and /contact
- Product schema: /products/[slug]
- BreadcrumbList: all inner pages
- WebSite with SearchAction: /

Business data for all schema:
  Name: Hason Industries
  URL: https://www.hasonindustries.com
  Phone: +91-9533220698, +91-9533693241
  Email: hasonindustries@gmail.com
  Address: Plot No 205/4A, Sector 3, Phase 2, IDA Cherlapally, Hyderabad, Telangana - 501301, India
  Geo: lat 17.4399, lng 78.5706

Generate: sitemap.xml via next-sitemap, robots.txt (allow all, sitemap pointer).

---
## DATABASE SCHEMA (Prisma 7, @prisma/adapter-pg)

model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  category    String
  description String
  specs       Json
  imageKeys   String[]
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model GalleryImage {
  id        String   @id @default(cuid())
  key       String   @unique
  caption   String?
  order     Int      @default(0)
  createdAt DateTime @default(now())
}

model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  role      String   @default("admin")
  createdAt DateTime @default(now())
}

---
## PUBLIC PAGES

### / (HOME) — SSG
Sections in order:
1. HERO: Full-viewport, graphite bg, grain texture. GSAP SplitText headline:
   "Industrial Precision. Engineered in Hyderabad." Sub-headline. Two CTAs:
   "Explore Products" → /products, "Contact Us" → /contact.
   SVG amber accent line animated drawing under headline.
   Right: CNC machinery image with GSAP amber scan-line loop.

2. STAT COUNTER: 3-col, GSAP CountTo on ScrollTrigger.
   "10,000 sq ft" | "4 CNC Routers" | "3 Laser Machines"
   Dark bg, amber numbers, DM Mono font.

3. WHO WE ARE: Alternating text/image. Left: company description.
   Right: facility image. Diagonal clip-path separator above.
   Copy: "At Hason Industries, our goal is to be a leading name in industrial
   insulation and plastic components... quality comes first..."

4. PRODUCT CATEGORIES: Grid of category cards (glass epoxy, insulation,
   engineering plastics). R2 images. Hover: amber border + arrow reveal.
   Links to /products filtered by category.

5. FACILITY HIGHLIGHTS: Full-width dark section. Icon grid:
   4x CNC Router (2m×3m), 3x Laser Machine, 1 VMC, 1 LMC,
   Heat Sublimation, Laser Marking, Industrial Oven.
   GSAP horizontal scroll scrub on desktop.

6. TRUST SIGNALS: 3 feature blocks, amber icon + bold heading:
   Quality First | Customized Solutions | Timely Delivery.

7. CTA BANNER: Full-width amber bg, dark text, "Request a Quote" → /contact.

8. FOOTER: Logo + tagline | Nav | Contact info + address + phones + email.
   Google Maps link to IDA Cherlapally. Copyright.

### /about — SSG
1. Page hero with breadcrumb
2. Company story (full editorial long-form)
3. Mission/Vision two-column cards
4. Infrastructure: spec table:
   - 4 CNC Router Machine (2 Mtr x 3 Mtr)
   - 3 Laser Machine | 1 VMC | 1 LMC
   - Heat Sublimation | Laser Marking | Industrial Oven
   - 10,000 sq ft working area
5. Quality Assurance section
6. Customization section (design, packaging, labelling)
7. CTA → /contact

### /products — SSR, revalidate: 3600
- Left sidebar: category filter (all, glass epoxy, insulation, engineering plastics)
- Right: product card grid — R2 image, name, category badge, short description, "View Details"
- /products/[slug] — SSR per product, generateMetadata, Product JSON-LD, spec table from JSON field
- No cart. No pricing. "Request Quote" → /contact?subject=[product name]

### /gallery — SSR + ISR, revalidate: 600
- Fetch GalleryImage records from DB, generate R2 URLs server-side
- CSS masonry grid (no JS library)
- next/image with R2 custom loader
- Custom minimal lightbox (no external library)
- GSAP ScrollTrigger: images fade+rise on viewport entry
- Caption overlay on hover

### /contact — SSG + Server Action
Left:
- Form: name, email, phone, subject, message
- Zod validation server-side
- On success: save ContactSubmission to DB + send Nodemailer email to hasonindustries@gmail.com
- React Hot Toast for success/error
- Rate limit: 1 submission per IP per 10 min (in-memory Map)

Right:
- Address: Plot No 205/4A, Sector 3, Phase 2, IDA Cherlapally, Hyderabad, Telangana - 501301
- Phone: +91-9533220698 | +91-9533693241
- Email: hasonindustries@gmail.com
- Google Maps iframe: IDA Cherlapally, Hyderabad
- LocalBusiness JSON-LD with full address, phones, Mon–Sat 9am–6pm IST hours

---
## CLOUDFLARE R2
- @aws-sdk/client-s3, S3Client → R2 endpoint
- Env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL
- Server-side only: presigned GetObject or public bucket URL
- next/image custom loader for R2 domain
- Never expose credentials client-side

---
## NODEMAILER + GMAIL SMTP
- Env: GMAIL_USER, GMAIL_APP_PASSWORD
- transport: service 'gmail', auth user/pass
- HTML email template: amber + dark Hason branding, all form fields, reply-to submitter
- Server Action flow: Zod validate → save to DB → send email → return result

---
## GSAP CONTRACTS
- Register plugins at module level: ScrollTrigger, SplitText, Flip
- useGSAP() hook from @gsap/react — never raw useEffect for GSAP
- All ScrollTrigger instances cleaned up via hook cleanup
- SplitText: split headings by "words", revert on cleanup
- Scan-line: GSAP timeline looping, amber line translateY across image height
- Page transitions: Motion AnimatePresence in root layout, each page: motion.div opacity 0→1/0, 0.3s

---
## PERFORMANCE
- All images via next/image, explicit width/height or fill + sizes
- GSAP + animation components: dynamic import, ssr: false
- next/font/google, display: 'swap', preload: true
- Skeleton placeholders for SSR grids
- CWV targets: LCP < 2.5s, CLS < 0.1, INP < 200ms

---
## ENV VARS (.env.local)
DATABASE_URL=
DIRECT_URL=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
GMAIL_USER=
GMAIL_APP_PASSWORD=
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://www.hasonindustries.com
NEXT_PUBLIC_SITE_URL=https://www.hasonindustries.com

---
## NOTE
This is Part 1 of 2. Do NOT begin implementation yet.
Acknowledge this part, then wait for Part 2 which covers the full admin system,
auth, API routes, and implementation order before you start building.
