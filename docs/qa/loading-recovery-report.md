# Blank-page investigation and recovery — 2026-10-29

The repository connection and latest GitHub Pages deployment were healthy. Fresh visits to the homepage and collection worked during investigation, so the user's original blank page could not be reproduced directly and its exact trigger remains unconfirmed.

The application previously had an empty HTML root before JavaScript loaded and no error boundaries. A failed entry download could leave an empty page; a rejected lazy route import could remove the whole application. Startup also assumed newer media-query and dialog methods existed.

Changes:

- Branded HTML loading screen with a native reload link, independent of the application bundle. A short independent handler requests a fresh URL while retaining the current route and removing the old version query. JavaScript-disabled browsers receive a useful message.
- Root and route error boundaries. A failed route keeps the header/footer available and offers reload or home navigation. Reload does not clear the saved bag.
- Standard native scroll behaviour, support for older media-query listeners, optional intersection observation, and an accessible cart fallback when native dialog methods are missing.

Validation:

- TypeScript and Vite production build passed.
- **12/12 browser tests passed**, including all existing shopping, responsive, accessibility and hero-video checks.
- A deliberately blocked initial application download retained the loading/reload screen. Restoring the download and using Reload store opened the original shop route.
- A deliberately blocked route module displayed the recovery screen while preserving navigation; home and a fresh shop load recovered.
- Simulated missing dialog, media-query event and intersection-observer APIs still allowed the homepage and cart to open, with Escape closing the cart and returning focus.

These changes address concrete failure paths without asserting that one of them was the original user's cause. Network/provider outages or a browser that cannot reach GitHub Pages still require a successful connection to load the HTML itself.
