# Techfamz — Engineering the Future of African Technology

A premium, animated landing page for **Techfamz Limited** — a structured technology ecosystem designed to unify developers, engineers, and forward-thinking companies across Africa and beyond.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + Custom CSS design system
- **Font:** Inter (Google Fonts)
- **Animations:** CSS keyframes + Intersection Observer scroll reveals

## ✨ Features

- **Hero Section** — Animated SVG network lines, pulsating background glows, staggered fade-in
- **Glassmorphism Cards** — Subtle blur, 1px glass borders, lift-on-hover micro-interactions
- **TID Badge** — Premium glowing developer identity badge (`TID-DEV-0001`) with pulse animation
- **Network Graph** — SVG-based animated company-to-developer connection visualization
- **Scroll Animations** — Smooth, physics-based reveals using `cubic-bezier(0.16, 1, 0.3, 1)`
- **Light Beam Effect** — Sweeping light animation in the final CTA section
- **Navbar Blur** — Backdrop blur activates on scroll
- **Reduced Motion** — Full `prefers-reduced-motion` support
- **SEO Ready** — Sitemap, robots.txt, Open Graph, Twitter Cards, JSON-LD structured data, web manifest

## 📁 Project Structure

```
app/
├── components/
│   ├── Navbar.tsx          # Fixed navbar with blur-on-scroll
│   ├── HeroSection.tsx     # Hero with animated background
│   ├── ShiftSection.tsx    # "The Shift" — staggered card grid
│   ├── MissionSection.tsx  # Two-column mission layout
│   ├── TIDSection.tsx      # Premium TID badge feature block
│   ├── PartnersSection.tsx # Split layout + SVG network
│   ├── LegalSection.tsx    # Legal foundation pillar cards
│   ├── VisionSection.tsx   # Vision with featured quote
│   ├── CTASection.tsx      # Final CTA with light beam
│   └── Footer.tsx          # Branded footer
├── hooks/
│   └── useScrollReveal.ts  # Intersection Observer hook
├── globals.css             # Design system & animations
├── layout.tsx              # Root layout, metadata, JSON-LD
├── page.tsx                # Main landing page
├── sitemap.ts              # Auto-generated sitemap.xml
├── robots.ts               # Auto-generated robots.txt
└── manifest.ts             # Web app manifest
```

## 🛠 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 🎨 Design System

| Token      | Value                                    |
| ---------- | ---------------------------------------- |
| Background | `#060B18` → `#0C1A3A` gradient           |
| Accent     | `#3B82F6` / `#60A5FA` (electric blue)    |
| CTA        | `#F5C542` → `#FFDA6A` (warm yellow)      |
| Cards      | Glassmorphism — `blur(12px)`, 1px border |
| Radius     | 12–16px                                  |
| Easing     | `cubic-bezier(0.16, 1, 0.3, 1)`          |

## 📄 License

© 2024 Techfamz Limited. All rights reserved.
