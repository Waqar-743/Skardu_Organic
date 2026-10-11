import {readFile,writeFile,unlink} from 'node:fs/promises';
let p=await readFile('components/InfoPage.tsx','utf8');p=p.replace('Google Fonts may receive normal connection information, including your IP address, when fonts load.','Fonts and images are hosted with the website; no external font service is contacted.');await writeFile('components/InfoPage.tsx',p);
await writeFile('mockData.ts',`// Compatibility export: sample catalog without fabricated reviews or claims.\nexport { catalog as MOCK_PRODUCTS } from './data/catalog';\n`);
await writeFile('constants.ts',`// The homepage now reads its editorial content from components/HomePage.tsx.\n// No fabricated testimonials or countdown promotions are exported.\nexport const TESTIMONIALS = [];\n`);
let prep=await readFile('scripts/prepare-assets.mjs','utf8');prep=prep.replace("['apricot-oil', source+'exec-ad8523e7-1a13-4bd7-a10b-62972b5f12dd.png', 700]","['apricot-oil-official', source+'exec-337cdeda-cd47-47d4-bf46-61da9252c27c.png', 700]");await writeFile('scripts/prepare-assets.mjs',prep);
// Remove only obsolete files created by this implementation, within this checkout.
for(const file of ['public/favicon.svg','public/images/apricot-oil.webp','scripts/refine-brand.mjs'])await unlink(file);
let css=await readFile('styles.css','utf8');const a=css.indexOf('.product-story{');const b=css.indexOf('.origin{',a);if(a!==-1&&b>a)css=css.slice(0,a)+css.slice(b);await writeFile('styles.css',css);
