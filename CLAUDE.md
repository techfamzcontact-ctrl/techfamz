# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Techfamz (www.techfamz.com) is the public site and admin CMS for an African developer ecosystem. It has four products: the marketing site, a blog, a job board, and **TID** (Techfamz Identity), which gives developers a verifiable ID such as `TF4K9XMR2` with a public card page at `/tid/[tid]`.

Stack: Next.js 16 (App Router), React 19, TypeScript (strict), Prisma 7 on Neon Postgres (via the `@prisma/adapter-neon` driver adapter), NextAuth v4 (Credentials provider, JWT sessions), Tailwind CSS v4 with shadcn/ui (`radix-nova` style), Tiptap v3, Cloudinary, Resend, Google Gemini.

## Ground rules (from the project owner)

1. **Keep the SEO setup exactly as it is.** No change, including UI redesigns, may remove or alter it without explicit approval. See "SEO setup" below for what that covers.
2. **Use clean, normal design that never hurts SEO.** No animation or UI-effects libraries, and no generic or templated "AI slop" UI. See "UI design rules" below.

## Commands

```bash
npm run dev          # dev server on http://localhost:3000
npm run build        # prisma generate && next build
npm run start        # serve the production build
npm run lint         # eslint (flat config; ignores generated/**)
npx tsc --noEmit     # type-check (no npm script for this)
npx prisma generate  # regenerate the client into generated/client (also runs on postinstall)
```

There is no test suite and no test runner. To verify a change, type-check, lint, and run the app.

There is no `prisma/migrations` directory, even though `prisma.config.ts` points to one, so the schema has not been managed with `prisma migrate`. Ask before running any command that changes the database, such as `prisma db push` or `prisma migrate`. `DATABASE_URL` points at the live Neon database.

Environment variables (`.env`; `.env.example` lists most of them): `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NEXT_PUBLIC_GA_ID`, and `GEMINI_API_KEY` (missing from `.env.example`).

## Architecture

### Routing

- `app/(site)/`: public pages. Its `layout.tsx` adds Navbar, Footer, the WhatsApp popup, and `ScrollRevealInit`, which adds an `in-view` class to `.reveal`, `.stagger-item`, and `.divider` elements as they scroll into view.
- `app/admin/login`: the login page, with no admin shell.
- `app/admin/(shell)/`: the authenticated admin app. Its `layout.tsx` calls `getServerSession` and redirects to the login page when there is no session.
- `app/api/`: route handlers (described below).
- `proxy.ts` is Next 16's replacement for `middleware.ts`. It redirects unauthenticated requests for `/admin/*` pages. **Its matcher does not cover `/api/*`**, so every API route must check auth itself.

### Auth layers

- `lib/auth.ts` holds `authOptions`: a Credentials provider that checks bcrypt hashes against the `User` table, with JWT sessions and `session.user.id` set from `token.sub`.
- Every server action in `app/admin/actions.ts` starts with its own `getServerSession(authOptions)` check. Keep that pattern for new actions.
- API routes that need an admin use `getToken` from `next-auth/jwt` (see `app/api/upload`).
- `POST /api/setup-admin` creates the first admin, and only works while the `User` table is empty.

### Data and server logic

- Schema: `prisma/schema.prisma`. Models are `User` (admins), `Post`, `Comment` (cascades when its post is deleted), `Job`, and `Developer` (TID holders, with a `skills: String[]` field).
- Prisma generates its client into `generated/client`. Import it only through `lib/prisma.ts`, which sets up the Neon adapter and reuses one client across hot reloads in development.
- All admin create, update, and delete logic lives in `app/admin/actions.ts`. These actions call `revalidatePath` for both the admin and public routes they affect.
- Public reads are written as server components that query Prisma directly. Listing pages use `export const dynamic = "force-dynamic"` and wrap data loading in `<Suspense>` with skeleton fallbacks from `components/blog` and `components/jobs`.
- API routes are for interactions from public client components: `tid` (create an identity), `tid/[tid]` (look one up), `comments`, and `views`. They are also used for admin features that need a plain endpoint: `upload` (Cloudinary) and `generate-summary` (Gemini).

### Rich-text pipeline

The admin editors (`app/admin/(shell)/editor/[id]` for posts and `jobs/editor/[id]` for jobs) use Tiptap. They store `editor.getHTML()` in `Post.content` or `Job.description`. The public detail pages pass that HTML through **`sanitize-html` with an allowlist** before rendering it with `dangerouslySetInnerHTML`.

The allowlist only permits the `text-align` style, so text colours from the `Color` extension and the inline styles of `components/editor/CustomButtonExtension.ts` are removed on the public pages. When you add an editor feature, update the allowlist in `app/(site)/blog/[slug]/page.tsx` (and in `jobs/[slug]` if it applies) to match.

### TID flow

1. `app/(site)/identity/claim` (client form) sends `POST /api/tid`.
2. The route validates the input (roles must be in `VALID_ROLES`, skills are limited to 5), applies a per-IP rate limit held in memory, and generates an ID with `lib/tid.ts`: `TF` plus 7 characters from a charset with no ambiguous characters, retrying if the ID is already taken.
3. It creates the `Developer` record and sends `components/emails/TIDWelcomeEmail.tsx` through Resend without waiting for the result.
4. The browser is redirected to `/tid/[tid]?new=true`. That page shows `TIDCard` with a QR code, a PNG download via html2canvas, and share buttons.

Admins can also create developers with `createDeveloperAdmin`, which repeats the ID-generation and email logic.

### Theming

- Tailwind v4 is configured in CSS, not JS: `app/globals.css` holds `@theme` blocks and colour tokens for light (`:root`) and dark (`.dark`) modes. Examples are `--bg-primary`, `--text-primary`, `--accent-blue-light`, `--border-glass`, `--gradient-hero`, and `--surface-glass`, which surface as utilities such as `bg-bg-primary` and `text-text-secondary`.
- `next-themes` uses the `class` attribute, and dark mode is the default.
- shadcn primitives live in `components/ui`. Landing-page sections live in `components/sections`.

## SEO setup (do not change without approval)

- **Root metadata** (`app/layout.tsx`): `metadataBase`, the title template `%s | Techfamz`, description, keywords, Open Graph and Twitter cards (`/og-image.png`), robots and googleBot directives, the Google Search Console `verification.google` token, the Organization JSON-LD, the GA4 `gtag` scripts (`NEXT_PUBLIC_GA_ID`), and the `theme-color` and icon links.
- **Per-page metadata**: the `metadata` exports and `generateMetadata` functions in `app/(site)/**` pages and layouts, including `alternates.canonical`. Blog posts and job listings build their titles, descriptions, Open Graph/Twitter tags, and canonical URLs from database fields. `/tid/[tid]` builds profile metadata.
- **Structured data**: `BlogPosting` JSON-LD in `blog/[slug]` and `JobPosting` JSON-LD in `jobs/[slug]`.
- **Generated files**: `app/sitemap.ts` (static routes plus published posts and jobs, read from the database), `app/robots.ts` (disallows `/admin`), `app/manifest.ts`, and `app/not-found.tsx` (`noindex`).
- **Static files** in `public/`: `og-image.png`, `logo.png`, `favicon.ico`, and `app-ads.txt`.
- **URLs**: the canonical host is `https://www.techfamz.com`, written directly into several files. Keep URL paths and slugs stable: `/blog/[slug]`, `/jobs/[slug]`, `/tid/[tid]`, `/identity`, `/identity/claim`, `/about`, and `/partners`.

When you change UI:
- Keep pages server-rendered, so content and metadata stay in the initial HTML.
- Keep exactly one `<h1>` per page.
- Keep the breadcrumb `<nav aria-label="Breadcrumb">`, `<time dateTime>`, image `alt` text, and the use of `next/image`.
- Don't convert a page that exports `metadata` into a `"use client"` component. Move the interactive parts into child components instead.

## UI design rules (SEO first)

The owner's direction: **clean, normal, content-first design, where nothing may hurt SEO.** Do not use any animation or UI-effects library (Animata and React Bits Pro were evaluated and rejected). The site should look distinctive because of its typography, spacing, consistent Techfamz colours, and real content, not because of effects. Avoid generic template patterns and decoration that has no purpose.

- **All text is server-rendered.** Headings, body copy, and links must be in the initial HTML. Never generate visible text with client-side JavaScript.
- **Nothing above the fold animates in.** Content in the first screen is visible on first paint, with no fade-in or slide-in and no `opacity-0` start state. The old entrance animations (`fadeInUp`, `slideUp`, glow and pulse keyframes) have been removed from `globals.css`.
- **No pop-up may open by itself.** The WhatsApp pop-up opens only when the visitor clicks its button, because Google treats a self-opening overlay on mobile as an intrusive interstitial.
- **Motion only on hover and focus.** Use short CSS transitions on `transform`, `opacity`, `color`, and `box-shadow` only, never properties that change layout. Every interactive element needs a visible `:focus-visible` style. The global `prefers-reduced-motion` rule in `app/globals.css` must keep turning motion off.
- **Add no new dependencies for visual effects.** Use Tailwind, the existing shadcn primitives in `components/ui`, `lucide-react`, and CSS.
- **Images go through `next/image`** with `alt` text and either explicit dimensions or `fill` plus `sizes`. Use `priority` only on the single image that is the Largest Contentful Paint element. Nothing should shift the layout while loading.
- **Use the design tokens.** Take colours, surfaces, and gradients from the tokens in `app/globals.css` (`bg-bg-primary`, `text-text-secondary`, `accent-blue`, `cta-yellow`, `--gradient-*`), not one-off hex values. Every change must work in both light and dark mode.
- **Keep the page structure that SEO depends on.** Follow the SEO setup section above: same URLs, one `<h1>` with the same wording per page, the same metadata and JSON-LD, and pages that stay server components.
- `components/ui/button.tsx` has a custom `cta` variant that the site depends on, so keep it when restyling.
- The TID card PNG download runs html2canvas on `#tid-card`. html2canvas cannot parse the `lab()`, `oklab()`, or `color-mix()` colours that Tailwind v4 generates for opacity modifiers (`text-white/50`), `/` colour shades, and gradients. That is why `components/tid/TIDCard.tsx` uses only plain hex and `rgba()` values. Keep it that way, and confirm the download still produces a PNG after any change to the card.

### The design system (public site, October 2026)

- **Colours:**
  - **Page and surfaces.** Dark mode (the default): page `#0b0f17`, alternate sections `#10141d` (`bg-bg-secondary`), cards `#131824` (`bg-bg-card`), body text `#d1d5db`, headings `#f9fafb`, small text `#9ca3af`. Light mode: page white, body text `#374151`, headings `#111827`.
  - **Brand bands.** `bg-bg-brand` is logo navy `#0f1a31` in dark mode and `#eff5ff` in light mode. Use it only for page hero bands, the homepage CTA band, and the TID card.
  - **Accents.** Blue (`accent-blue`, with `text-accent-blue-light` for text) is for links, highlighted heading words, and focus. Primary buttons use "bulb gold" `#f0b429` (`bg-cta-yellow`) with logo-navy text (`text-on-cta`). These values are sampled from `public/logo.png`.
- **Patterns:**
  - **Section labels:** `<span className="eyebrow">`, not pill badges.
  - **Highlighted words in headings:** a `<span className="text-accent-blue-light">`, never gradient text.
  - **Content width:** `max-w-[1140px] mx-auto px-5 md:px-8`, with the padding on the inner container so all sections line up.
  - **Feature lists:** grids of items with a top border (`border-t border-border-glass pt-6`) rather than floating cards.
  - **Hover:** cards and rows change only border or background colour.
- **Article style:**
  - `className="prose article"`, defined in `globals.css`, is used by blog posts, job descriptions, the admin editors, and the editor preview. Never add `dark:prose-invert`, because the article colours already follow the theme tokens.
  - Blog articles sit in a 720px column. Their reading time is calculated from the content.
- **Loading skeletons** (`components/blog/PostCardSkeleton.tsx`, `components/jobs/JobCardSkeleton.tsx`) mirror the real layouts so content doesn't jump when it streams in. Update them whenever a layout changes.
- **Admin dashboard:** it has no SEO impact, so the owner allows any components or libraries there.

## Known gotchas

- In production builds, Next.js replaces the message of an `Error` thrown inside a server action with a generic one. Client code that shows `err.message` or matches on it (for example, the slug-clash check in the post editor) only works in development. Return error values instead when the user needs to see the message.
- API routes that serve admin data or spend paid quota check the admin session with `getToken`: `GET /api/comments?admin=1`, `POST /api/generate-summary`, and `POST /api/upload`. Any new route of that kind needs the same check, because `proxy.ts` does not cover `/api/*`.- Public URLs in `/tid/[tid]` and in the welcome email are built from `NEXTAUTH_URL`.
- `generated/` is listed in `.gitignore` but its files are already committed. `lint_output*.txt` files are stale output from an old lint run. The README describes an older folder layout.
- Lists that are duplicated in several files and must be kept in sync: post categories (`app/admin/actions.ts` and the post editor) and TID roles (`app/api/tid/route.ts` and the claim page).
- `components/sections/{TIDSection,PartnersSection,LegalSection,VisionSection}.tsx` are not imported anywhere, and they still use effect classes that have since been removed.
- `POST /api/views` increments `Post.views`, which also updates `updatedAt`, which feeds `dateModified` in the JSON-LD and `lastmod` in the sitemap. Every real visit therefore changes a post's "last modified" date. When testing in a browser against the real database, block `/api/views` so test visits are not counted and the post's date does not change.
- Copy must describe what the system actually does. TIDs are random IDs, not hashes; nothing is encrypted or "cryptographically" verified; skills are self-reported. What is true: the public `/tid/[tid]` page and its QR code let anyone confirm that a TID exists.
