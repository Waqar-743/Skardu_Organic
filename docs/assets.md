# Asset manifest and review

Active image outputs live in `public/images/`, with the hero movie in `public/videos/`. `asset-dimensions.json` records the original image sizes, dimensions and alpha status; the selected video and its poster are documented below. Original repository files remain untouched.

| Output | Source | Placement | Review / rights status |
|---|---|---|---|
| mountains.webp | Built-in imagegen, `exec-56548e1e-56b9-4d51-9aac-feaec8793780.png` | Closing landscape | Visually inspected: clear mountain layers, river and usable composition. Generated illustration; not a verified Skardu photograph. Owner launch review pending. |
| videos/hero-apricot-almond.mp4 | Google Flow, ingredient still life, generated 2026-10-26 | Homepage hero background | Selected by owner from the video comparison. AI-generated apricots and almonds in an orchard setting, not documentation of a supplier or actual packaging. 1280 × 720, 24 fps, 7.5 s, 1,426,983 bytes; silent H.264 with fast-start metadata and a short loop crossfade. |
| hero-apricot-almond.webp | First frame of the selected Flow clip | Hero poster and reduced-motion fallback | 1280 × 720, 102,184 bytes. Same composition as the video to avoid a visual jump. |
| orchard.webp | Built-in imagegen, `exec-e0d03d6d-04c0-4d43-b78c-ef045aba60f2.png` | Origin/About/Journal | Visually inspected: coherent apricots, leaves and terrace; no people. Labelled illustrative, not a supplier orchard. |
| apricot-oil.webp | Built-in imagegen, `exec-ad8523e7-1a13-4bd7-a10b-62972b5f12dd.png` | Product card, details and motion sequence | Visually inspected: legible label, believable glass, correct concept size. Alpha verified. Concept packaging only; actual package approval pending. |
| apricots.webp | Repository `public/img/Dried-Apricot-500g.png` | Catalog/detail/cart | Visually inspected original. Stylized green bowl, not verified packaging. Copyright provenance not supplied; owner must clear reuse. |
| almonds.webp | Repository `public/img/Almonds-500g.png` | Catalog/detail/cart | Retained sample imagery; owner rights and accuracy review required. |
| shilajit.webp | Repository `public/img/Organic-Shilajit-20g.png` | Catalog/detail/cart | Retained sample imagery. Label is part of illustration, not certification evidence. Owner rights and accuracy review required. |
| shilajit-small.webp | Repository `public/img/Shilajit-10g.png` | 10 g option | Retained sample imagery. Owner rights and accuracy review required. |

New artwork was generated in the built-in tool under the user's request. No separate stock-license or documentary authenticity claim is made. No fake farmer photography or harvesting portraits were created. Craft photography, additional packaging angles and other categories await actual approved inventory rather than invented assets.

The selected hero video was generated separately in [Google Flow](https://flow.google.com/project/d284c799-57b8-4ab1-944f-305ff82d38cb/edit/e1dfc5ad-094a-4f67-a705-0dfbe68ccb8b). The original eight-second download is retained locally by the owner. Website preparation removes audio, makes a half-second wrap crossfade, and places MP4 metadata before media data for streaming. It does not add product labels or replace the official website logo.

## Generation prompts
### Landscape
Use case: photorealistic-natural. Asset: wide 16:9 cinematic website landscape hero for Skardu Organic. Create an editorial photographic illustration inspired by the Skardu valley of Baltistan, Pakistan: vast arid rugged Karakoram mountains in layers, sparse snow on distant high ridges, broad winding pale turquoise Indus river on sandy valley floor, small green irrigated apricot orchards at lower right, late afternoon golden sunlight, slightly hazy olive grey sky. Realistic dry high-altitude mountain environment, not Swiss Alps or tropical forest. Wide panoramic composition, subdued shadowed left half for ivory headline overlay, mountains across entire horizon, fine film texture, refined natural muted sage and stone palette, photographic detail. No text, no logo, no watermark, no people, no buildings with invented cultural details. This is an openly labelled illustrative landscape, not documentation of a specific farm.

### Product
Use case: product-mockup. Asset: single transparent product cutout for premium Skardu Organic ecommerce concept, portrait 2:3. One exquisite cylindrical clear amber glass bottle filled with golden apricot kernel oil, black ribbed screw cap, warm cream paper label, dark forest green crisp elegant serif label text exactly 'SKARDU' on first line, 'ORGANIC' small underneath, fine line-drawing of mountains, 'APRICOT' then 'KERNEL OIL' then '120 ml'. Bottle viewed straight-on with a slight 8 degree angle revealing glass depth, realistic studio highlights from upper left, premium commercial photographic render, restrained simple accurate typography, no unsupported health/certification claims, no other objects, no surface or background, no watermark. Entire bottle and cap visible with generous margin. Actual transparent alpha background. This is concept packaging.

### Orchard
Use case photorealistic-natural. Asset: portrait 4:5 editorial image for Skardu Organic orchard story. A close view of ripe small orange apricots on a mature apricot tree branch in a traditional irrigated orchard inspired by Baltistan, slender rough trunk, real textured leaves, light stone terrace wall and arid distant mountains softly out of focus in background. Dappled warm late-summer sunlight, deep natural forest-green foliage contrasting muted golden orange fruit, cinematic fine grain, premium food editorial photography, tactile and understated. No people, no buildings, no text, no watermark, no packaging. Explicitly illustrative concept scene, not a real supplier photograph.

Optimization uses Sharp for resizing/compression only; no generated-image content editing was performed with code. Original generated PNGs remain in the user's generated-images folder; the website is self-contained with workspace WebP outputs.

## Owner-requested revision

The owner explicitly rejected the replacement logo and the initial pinned animation. Final implementation restores the exact official logo downloaded from the two original Google Drive image IDs in the previous App.tsx. These originals are now local files in `public/brand/`. The original apricot, almond and both shilajit illustrations already display this identity.

The oil render was edited with the built-in imagegen tool using the official logo and previous bottle as references. Final output: `public/images/apricot-oil-official.webp`, from `exec-337cdeda-cd47-47d4-bf46-61da9252c27c.png`. Inspected after generation and inside product, mobile and story layouts. Prompt: replace the invented serif wordmark and mountain sketch with the supplied green/gold mountain-and-sun logo, preserving the amber bottle, cap, realistic highlights and alpha background; retain APRICOT KERNEL OIL and 120 ml below. Concept packaging remains disclosed. The superseded render and invented favicon were removed from the working project.

The official logo's original rights remain with the owner; reuse is expressly requested by the owner. Sources: `https://drive.google.com/thumbnail?id=1KnVtcKPdwHrQgf0WPO58b3fH4oOPT64D&sz=w1000` and `https://drive.google.com/thumbnail?id=1zFw7cJFW6y-q2yNRhieFKenrXdUDTuN0&sz=w1000`.

Typography: DM Sans Latin variable WOFF2 is hosted locally; Google Fonts source `https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4.woff2`. SIL Open Font License retained in `public/fonts/OFL.txt`. No external font request at runtime.
