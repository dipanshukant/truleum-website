# Truleum Loft Specialist — Astro Website

Static site built with [Astro](https://astro.build). Deployed at **https://truleumloftspecialist.com**

---

## Quick Start

```bash
npm install       # install dependencies
npm run dev       # dev server → http://localhost:4321
npm run build     # production build → /dist
npm run preview   # preview the /dist build locally
```

---

## Tech Stack

| Thing | Detail |
|---|---|
| Framework | Astro 4.x — static output (`output: 'static'`) |
| Styling | Plain CSS — per-page inline `<style>` blocks + external CSS files in `/public` |
| JS | Vanilla JS only — inline `<script is:inline>` in each page |
| Trailing slash | Always on (`trailingSlash: 'always'`) — every page URL ends with `/` |
| Site URL | `https://truleumloftspecialist.com` (set in `astro.config.mjs`) |

---

## Project Structure

```
truleum-astro/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro        ← shared HTML shell (head, meta, OG tags)
│   ├── components/
│   │   ├── Header.astro            ← nav with desktop + mobile menus
│   │   └── Footer.astro            ← footer links, social icons
│   └── pages/                      ← one folder per URL route
│       ├── index.astro             ← homepage /
│       ├── about-us/               ← /about-us/
│       ├── contact/                ← /contact/
│       ├── gallery/                ← /gallery/
│       ├── blog/                   ← /blog/ (blog index)
│       ├── services/
│       │   ├── index.astro         ← /services/
│       │   ├── loft-conversion-cambridge-service/
│       │   └── house-extension-cambridge/
│       ├── loft-conversion-cambridge/     ← Cambridge area hub page
│       ├── loft-conversion-ely/
│       ├── loft-conversion-huntingdon/
│       ├── loft-conversion-peterborough/
│       ├── loft-conversion-st-ives-cambridgeshire/
│       ├── loft-conversion-st-neots/
│       ├── loft-conversion-march-cambridgeshire/
│       ├── loft-conversion-wisbech/
│       ├── loft-conversion-soham/
│       ├── loft-conversion-cost-cambridge/
│       ├── loft-conversion-glossary/
│       ├── loft-conversion-cambridge-guide/
│       ├── loft-conversion-cambridge-guide-for-homeowners/
│       ├── loft-conversion-in-cambridge-mistakes/
│       ├── loft-conversion-in-cambridge-worth-it/
│       ├── loft-conversion-company-in-cambridge/
│       ├── cambridge-loft-conversions/
│       ├── designs-for-cambridge-loft-conversions/
│       ├── privacy-policy/
│       ├── thank-you/
│       ├── sitemap/                   ← /sitemap/ (HTML sitemap page for visitors)
│       ├── loft-conversion-cambridge-calculator/ ← /loft-conversion-cambridge-calculator/
│       └── loft-room-configurator.astro          ← /loft-room-configurator/
└── public/
    └── wp-content/
        ├── uploads/                ← all images (kept in original WP structure)
        │   ├── 2025/09/            ← general site images
        │   ├── Loft-Conversion/    ← loft gallery images
        │   ├── House-Extension/
        │   ├── Bathroom-Renovation/
        │   └── ...
        └── themes/truleum-theme/
            └── assets/
                ├── css/            ← all page-specific CSS files
                └── js/             ← all page-specific JS files
```

---

## How Pages Work

Every page follows the same pattern:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Page Title | Truleum Loft Specialist"
  description="Meta description here."
  canonical="https://truleumloftspecialist.com/page-slug/"
>
  <link slot="head" rel="stylesheet" href="/wp-content/themes/truleum-theme/assets/css/page.css" />

  <!-- page HTML here -->

  <script is:inline src="/wp-content/themes/truleum-theme/assets/js/page.js"></script>
</BaseLayout>
```

- `title`, `description`, `canonical` → passed to `<head>` via `BaseLayout`
- `slot="head"` → injects page CSS into `<head>` without polluting other pages
- CSS files live in `/public/...css` — edit there, no build step needed for CSS changes
- JS files same — live in `/public/...js`

---

## BaseLayout Props

| Prop | Required | Default | Purpose |
|---|---|---|---|
| `title` | Yes | — | `<title>` tag |
| `description` | No | Generic Truleum description | Meta description |
| `canonical` | No | Auto-generated from URL | Canonical URL |
| `ogImage` | No | Truleum logo | Open Graph image |
| `robots` | No | `follow, index, ...` | Robots meta |
| `ogType` | No | `website` | OG type |

---

## Adding a New Page

1. Create folder: `src/pages/your-page-slug/`
2. Create `index.astro` inside it
3. Copy this template:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Your Page | Truleum Loft Specialist"
  description="Your meta description."
  canonical="https://truleumloftspecialist.com/your-page-slug/"
>
  <link slot="head" rel="stylesheet" href="/wp-content/themes/truleum-theme/assets/css/combined.css" />

  <section>
    <h1>Your Heading</h1>
  </section>
</BaseLayout>
```

4. Run `npm run build` — page is auto-discovered, no config needed.

---

## Adding a New Area Page

Area pages (e.g. `/loft-conversion-ely/`) follow a consistent structure:

- Hero section with area-specific heading and price
- "Why Choose Truleum" section
- Coverage zones grid — links to neighbouring area pages
- FAQ section with `FAQPage` JSON-LD schema
- CTA bar linking to `/contact/`

Copy an existing area page (e.g. `loft-conversion-ely/index.astro`) and:

1. Replace all mentions of the old area name with the new one
2. Update the hero image path
3. Update the price (`From £XX,000`)
4. Update the zones grid links to geographical neighbours
5. Update the JSON-LD schema FAQs
6. Update `title`, `description`, `canonical` props
7. Add the new area to the AREAS dropdown in `src/components/Header.astro`

**CSS scoping:** Each area page uses a unique wrapper class (e.g. `.area-ely-page`) so styles don't bleed between pages.

---

## Navigation (Header)

File: `src/components/Header.astro`

### Adding to SERVICES dropdown

Find `.nav-services-submenu` and add:
```html
<a href="/services/your-service/">Your Service</a>
```

### Adding to AREAS dropdown

Find `.nav-areas-submenu` and add:
```html
<a href="/loft-conversion-your-area/">Your Area</a>
```

Also add to the mobile menu — search for `mobile-areas-submenu` in the same file.

---

## Images

All images live in `public/wp-content/uploads/`. Reference them with an absolute path:

```html
<img src="/wp-content/uploads/Loft-Conversion/loft-conversion-cambridge.webp" alt="..." />
```

**Loft conversion gallery images** (7 available):
```
/wp-content/uploads/Loft-Conversion/
  loft-conversion-cambridge.webp
  loft-company-around-cambridge.webp
  cambridge-area-loft-conversion.webp
  loft-building-cambridgeshire.webp
  loft-service-cambridgeshire.webp
  loft-services-london.webp
  best-company-loft-conversion.webp
```

**Before/After slider images** (homepage):
```
/wp-content/uploads/Loft-Conversion/
  loft-conversion-before-empty-attic-cambridge.png
  loft-conversion-after-completed-room-cambridge.png
```

---

## Homepage Interactive Features

### Before/After Slider (`#baSlider`)

- Located in `src/pages/index.astro` after the Google Reviews section
- Drag handle reveals before/after images
- Animates on page load (sweeps from 25% → 50%)
- To swap images: change the two `src` attributes in the `.ba-before img` and `.ba-after img` tags

### Quote Calculator

- Located in `src/pages/index.astro` after the slider
- Pure client-side JS — no server, no API
- Price table lives in the `<script is:inline>` block inside the section:
  ```js
  var prices = {
    velux:    { small: [18000,24000], medium: [22000,28000], large: [26000,34000] },
    dormer:   { small: [28000,38000], medium: [34000,46000], large: [42000,58000] },
    hipgable: { small: [34000,46000], medium: [40000,54000], large: [50000,68000] },
    mansard:  { small: [42000,58000], medium: [52000,70000], large: [65000,85000] },
    lshaped:  { small: [38000,52000], medium: [46000,62000], large: [58000,78000] }
  };
  var finishMult = { standard: 1, premium: 1.15, luxury: 1.35 };
  ```
- Calculator shows **starting price only** (low end of range) — client decision, no max price shown
- To update prices: edit the numbers above and rebuild
- Same calculator exists on `/loft-conversion-cambridge-calculator/` — keep both in sync if prices change

---

## CSS Architecture

No CSS preprocessor — plain CSS only.

| File | Scope |
|---|---|
| `combined.css` | Global base styles used by most pages |
| `header-new.css` | Header nav styles |
| `footer.css` | Footer styles |
| `hero.css` | Hero section (homepage slideshow) |
| `google-reviews.css` | Reviews section |
| `why-truleum.css` | Why choose us section |
| `who-we-are.css` | About section |
| `where-we-operate.css` | Location cards |
| `dont-delay.css` | Bottom CTA band |
| `scroll-to-top.css` | Scroll-to-top button |
| `entrance-animations.css` | Scroll-triggered fade-in animations |
| `gallery.css` / `gallery-filters.css` | Gallery page |
| `contact.css` | Contact page form |
| `blog.css` / `single-post.css` | Blog pages |

**Inline `<style>` blocks** are used directly in area pages and homepage interactive sections (slider, calculator, reviews). These are scoped to that page only.

**Cache busting:** `BaseLayout.astro` appends `?v={buildTimestamp}` to all external CSS links automatically. Every new build generates a fresh timestamp, forcing browsers to fetch updated CSS. No manual version bumping needed.

---

## SEO Notes

- Every page sets unique `title`, `description`, `canonical`
- Area pages include `FAQPage` JSON-LD schema in a `<script type="application/ld+json">` block
- `trailingSlash: 'always'` — all URLs must end with `/` or they redirect
- `robots.txt` lives in `/public/robots.txt`
- Sitemap: if `@astrojs/sitemap` is active, it auto-generates at `/sitemap-index.xml` on build

---

## Brand Colours

| Name | Value | Usage |
|---|---|---|
| Navy (primary) | `#0a1a4a` | Backgrounds, headings, buttons |
| Navy (mid) | `#1f3a8a` | Hover states, gradients |
| Navy (dark) | `#060f32` | Hero/page hero backgrounds |
| **Gold (gradient)** | `linear-gradient(135deg, #ffe89f 0%, #75561d 100%)` | **All buttons, CTAs, active states, highlights** |
| Gold (solid text) | `#c9902e` | Text accents, borders, icons — use when gradient not applicable |
| Off-white bg | `#f8f9fb` | Page section backgrounds |
| Light grey bg | `#f0f4f8` | Card area backgrounds |

> **Important for devs:** The old amber/orange `#f59e0b` / `#d4af37` / `#fbbf24` are retired. Do **not** use them for new work. Always use the gold gradient for buttons and `#c9902e` for text/borders/icons.

### Gold gradient quick reference

```css
/* Buttons, CTAs, active cards, highlights */
background: linear-gradient(135deg, #ffe89f 0%, #75561d 100%);

/* Text colour, icon colour, border colour */
color: #c9902e;
border-color: #c9902e;

/* Box shadow (use when button needs shadow) */
box-shadow: 0 4px 20px rgba(117, 86, 29, 0.4);
```

---

## Common Tasks

**Change phone number / contact details** — search `Header.astro` and `Footer.astro`

**Update Google Reviews link** — search `share.google` in `index.astro`

**Add a blog post** — add a new folder under `src/pages/` matching the post slug, create `index.astro`

**Change a page's meta title/description** — edit the `title` and `description` props at the top of that page's `index.astro`

**Edit navigation links** — `src/components/Header.astro` (desktop) and the mobile menu in the same file
