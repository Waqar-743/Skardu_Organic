# Homepage ingredient video — 2026-10-26

The owner selected the apricot-and-almond still life from the Google Flow comparison. It now fills the homepage hero with silent inline autoplay, a 7.5-second loop, and no player controls or pause/stop buttons. The official logo, headline and collection links remain in place. A directional shade keeps text readable; the mobile crop keeps both ingredients in view.

The matching poster stays visible until playback starts and when autoplay or media loading fails. Reduced-motion visitors receive the still without requesting the movie. Playback rests while the hero is offscreen or the tab is hidden.

Validation:

- TypeScript and production builds passed, including `VITE_BASE=/Skardu_Organic/`.
- Four new browser tests passed: desktop and mobile playback/looping without controls; reduced motion and live preference changes; failed-media fallback. Desktop also verifies offscreen suspension and return to playback.
- All three existing storefront tests passed: catalog/cart/draft flow; reversible scrolling, image loading and accessibility; mobile navigation, keyboard focus, direct routes and invalid saved-cart handling.
- Production preview under `/Skardu_Organic/` loaded the movie, poster and official logo, followed the collection link, and displayed all five sample products. No page exceptions or failed HTTP responses were recorded.
- Desktop (1440 × 1000) and mobile (390 × 844) screenshots were visually reviewed. Updated homepage captures are `desktop-home.png` and `mobile-home.png`.

Browser verification used installed Chrome. Browser or device autoplay restrictions can still select the poster automatically. The footage is an AI-generated concept scene; it does not document an actual supplier orchard.
