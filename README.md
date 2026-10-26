# Skardu Organic

A React + TypeScript storefront inspired by Baltistan, retaining the owner's official green-and-gold logo. Built on the existing Vite project.

## Run locally

Requires Node.js 22.12+ (or Node 24).

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:3000/. Production checks:

```powershell
npm run build
npm run preview
npx playwright install chromium
npm test
```

Browser tests expect the dev server on port 3000. Tests cover search, categories, price/sort controls, direct product URLs, size selection, zoom, cart persistence and stock caps, draft saving/deletion, mobile navigation, reduced motion, backward scrolling, image loading, and automated accessibility checks. See `docs/qa` for review artifacts.

## Implemented

- Original supplied logo stored locally in `public/brand`; original branded product assets reused, with corrected apricot-oil concept packaging.
- Editorial homepage, collection, product pages, About, Journal, Contact, Shipping/Returns, Privacy and Terms.
- Owner-selected apricot-and-almond hero video: silent, looping inline playback with no visible player controls. A matching still remains for reduced motion or failed autoplay; playback rests while the hero is offscreen or the tab is hidden.
- Native scrolling, a sticky product display with reversible GSAP transforms, short entrance animation, and mobile/reduced-motion alternatives. No forced scrolling or long pinned timeline.
- Search/category/price filters, sorting, size links, image detail view, related products and keyboard-accessible cart dialog.
- Device-local, validated persistent cart. Prices are taken from catalog data, not from stored cart objects.
- Checkout saves a clearly identified local order draft. **No payment methods, payment processing, live order submission or fake order confirmation.** This follows the owner's request.
- Optimized local WebP imagery, local licensed DM Sans font, lazy route chunks and GitHub Pages base-path support.

## Content and launch status

`data/catalog.ts` holds five sample SKUs from the existing store. Prices and stock are samples; supplier provenance, inventory, packaging and specifications must be verified. No invented reviews, organic certifications, laboratory results or health claims are shown. The supplied brand name does not establish certification.

Contact details and policies have not been verified. Draft customer details stay in localStorage and can be deleted from Privacy. No secrets or backend credentials are required. The earlier Supabase/email files are inactive legacy integration scaffolding, not a working order backend.

Because the store uses sample inventory, `noindex` metadata and robots blocking are intentional. Before a commercial launch, confirm all business content, add a real order backend and approved policies, replace/approve concept imagery, and revisit indexability, canonical metadata, sitemap and server rendering/prerendering. Current hash routes preserve existing links but are not server-rendered product pages.

## Deploy

The existing `.github/workflows/main.yml` builds and deploys `main` to GitHub Pages. It derives the asset base path from the Pages configuration, supporting both project paths and custom domains. No new hosting account or payment setup is needed for the preview.

For Vercel or a root-domain static host: `npm run build`, publish `dist/`, leave `VITE_BASE=/`.
For a manual project Pages build: set `VITE_BASE=/Skardu_Organic/` before building. See `.env.example`.

## Structure

- `App.tsx`: shared navigation, routing and layout
- `components/HomePage.tsx`: editorial sections and motion lifecycle
- `components/ShopPages.tsx`: catalog, product and draft checkout
- `components/StoreUI.tsx`: official logo, product cards, quantity and cart UI
- `components/InfoPage.tsx`: informational pages and source links
- `lib/cart.tsx`: normalized cart state and local persistence
- `data/catalog.ts`: editable sample product data
- `styles.css`, `brand-refinement.css`: responsive design tokens and layouts
- `tests/store.spec.ts`: end-to-end and accessibility tests
- `scripts/prepare-assets.mjs`: optional authoring helper requiring original local generated images; never run during deployment
- `scripts/measure.mjs`: synthetic performance probe against production preview on port 4173

## Documentation

- [Research](docs/research.md)
- [Creative direction](docs/brand-story.md)
- [Asset sources and generation prompts](docs/assets.md)
- [Implementation checklist](docs/checklist.md)
- [Handoff report](docs/final-report.md)
