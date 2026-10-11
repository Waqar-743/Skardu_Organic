import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
const source = 'C:/Users/dell/.codex/generated_images/01a12896-0261-70d1-90d1-a724f82d9094/';
await mkdir('public/images', { recursive: true });
const jobs = [
 ['mountains', source+'exec-56548e1e-56b9-4d51-9aac-feaec8793780.png', 1920],
 ['orchard', source+'exec-e0d03d6d-04c0-4d43-b78c-ef045aba60f2.png', 1000],
 ['apricot-oil-official', source+'exec-337cdeda-cd47-47d4-bf46-61da9252c27c.png', 700],
 ['apricots', 'public/img/Dried-Apricot-500g.png', 700],
 ['almonds', 'public/img/Almonds-500g.png', 700],
 ['shilajit', 'public/img/Organic-Shilajit-20g.png', 700],
 ['shilajit-small', 'public/img/Shilajit-10g.png', 700],
];
const manifest=[];
for(const [name,input,width] of jobs){
 const meta=await sharp(input).metadata();
 const info=await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:82}).toFile(`public/images/${name}.webp`);
 manifest.push({name,source:input,alpha:meta.hasAlpha,...info});
}
await sharp(jobs[0][1]).resize(900).webp({quality:78}).toFile('public/images/mountains-mobile.webp');
await writeFile('docs/asset-dimensions.json',JSON.stringify(manifest,null,2));
console.log(manifest);
