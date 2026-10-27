import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const root=dirname(fileURLToPath(import.meta.url));
const sites=process.argv[2]?[process.argv[2]]:['creative','software'];
for(const site of sites){
 if(!['creative','software'].includes(site))throw Error('Unknown site');
 const dir=resolve(root,site),html=await readFile(resolve(dir,'index.html'),'utf8');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)throw Error('Duplicate IDs in '+site);
 if((html.match(/<h1[ >]/g)||[]).length!==1)throw Error('Expected one h1');
 let assets=0;
 const verify=async p=>{if(/^(https?:|mailto:|data:)/.test(p))return;if(p.startsWith('#')){if(!ids.includes(p.slice(1)))throw Error('Missing anchor '+p);return;}const path=resolve(dir,p.split('?')[0]);if(!path.startsWith(dir+'/'))throw Error('Asset outside site');await access(path);assets++;};
 for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g))await verify(match[1]);
 const css=await readFile(resolve(dir,'style.css'),'utf8');
 for(const match of css.matchAll(/url\(([^)]+)\)/g))await verify(match[1]);
 if(site==='creative')for(const name of ['creade-commercial-2026.mp4','form-motion.mp4','volt-motion.mp4','type-motion.mp4','orbit-motion.mp4'])await verify('assets/'+name);
 if(site==='software'){
  const context={window:{}};vm.createContext(context);vm.runInContext(await readFile(resolve(dir,'projects.js'),'utf8'),context);const projects=context.window.portfolioProjects;
  if(projects.length!==16||new Set(projects.map(p=>p.id)).size!==16)throw Error('Expected 16 unique project entries');
  for(const p of projects){for(const field of ['name','category','kind','summary','detail','engineering','boundary'])if(!p[field])throw Error('Missing '+field);if(p.image)await verify('assets/'+p.image);for(const url of [p.live,p.source].filter(Boolean))if(new URL(url).protocol!=='https:')throw Error('Invalid project URL');}
 }
 console.log(`${site}: HTML structure, anchors, ${assets} local assets and project/media references verified.`);
}
