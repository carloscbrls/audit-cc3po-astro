# AGENTS.md — audit-cc3po-astro

## Project Overview
WCAG compliance scanner landing page for CC3PO. Businesses enter their URL, get a free accessibility score, then upsell to paid monitoring plans.

**Live URL:** https://audit.cc3po.com
**Backend:** https://scanner.cc3po.com (Cloudflare Worker)

## Critical Rules

### Mobile-First (HIGHEST PRIORITY)
- ALL CSS must be tested for mobile screens (375px viewport minimum)
- NEVER use `background-clip: text` with `-webkit-text-fill-color: transparent` — it's invisible on Safari
- ALWAYS include `-webkit-text-fill-color` alongside `color` for every text element
- Use `:global()` selectors for MDX/prose content — Astro scoped CSS does NOT match MDX elements
- Test every change at 375px, 768px, and 1024px viewports
- Use solid colors ONLY — no gradient text anywhere

### Accessibility Standards
- This site sells WCAG compliance — it must be WCAG 2.1 AA compliant itself
- Every image needs alt text
- Every form input needs a label
- Color contrast must meet 4.5:1 ratio
- Skip navigation link required
- Keyboard navigation must work for all interactive elements
- ARIA labels on all custom components

### Build & Deploy
- `npm run build` — Astro static build
- Deployed to Netlify via git push
- Environment: Node 18+

### File Structure
- `src/pages/` — Astro page components
- `src/components/` — Reusable UI components
- `src/layouts/` — Page layouts
- `src/styles/` — Global CSS
- `public/` — Static assets

### Do NOT
- Do not modify `dist/` — it's auto-generated
- Do not add gradient text effects
- Do not use scoped CSS selectors on MDX content without `:global()`
- Do not break the scan form submission (POST /api/scan to scanner.cc3po.com)