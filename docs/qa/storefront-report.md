# Storefront redesign — 2026-10-26

The homepage now prioritises shopping: a compact apricot-and-almond video hero, four product families with prices and add-to-bag buttons, linked collections, and a short link to the brand story. The original green-and-gold identity remains on the header and products.

The former homepage's narrative is retained on Our Story: the original headline, mountain/seasonal statement, orchard-to-oil process, regional heritage, product-family links, shopping steps and closing content. The page scrolls normally. Global GSAP smoothing, pinned shelves and hide-on-scroll navigation have been removed.

The header has a solid background and remains visible while scrolling. Desktop search, mobile search, category navigation and the mobile menu work with the collection's URL filters. Category, price and sort controls keep their state and update the selected header category. Mobile product galleries and details stack at full usable width. Product images contain the complete branded artwork; cart notifications fit small screens and can be dismissed.

Validation:

- Production TypeScript/Vite build passed, including the GitHub Pages `/Skardu_Organic/` base path. Production preview loaded the video, official logo, collection and migrated story, with zero page errors or failed HTTP responses.
- Final full browser suite: **9/9 passed in 49.3 seconds** using installed Chrome.
- Responsive matrix: 320 × 740, 360 × 740, 390 × 844, 768 × 1024, 844 × 390, 1024 × 768, 1440 × 900 and 1920 × 1080. Home, collection, product and story routes were checked for horizontal overflow and visible sticky navigation.
- Search, direct category links, active navigation, filter preservation, product sizes, image zoom, home quick-add, cart persistence, quantity limits, local draft saving/deletion, mobile menu/Escape/focus and direct informational routes passed.
- Automated WCAG checks on home and product page returned zero violations. A low-contrast collection caption was darkened during review.
- Hero video playback, real looping, muted inline playback, absence of player controls, reduced-motion changes and failed-media fallback passed.
- Desktop, tablet and phone views were visually reviewed, including complete oil-bottle labels and the full-width mobile product gallery.

No payment method or live order submission was added. Existing sample catalog/specification disclosures and draft-only ordering remain clear at the relevant shopping steps.
