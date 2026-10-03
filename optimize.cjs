const fs = require('fs');
let content = fs.readFileSync('src/components/Gallery.astro', 'utf8');

// add imports
content = content.replace('---', `---
import { Image } from 'astro:assets';
import imgBoundary from '../assets/field-evidence/Boundary fixing in DGPS Instrument.jpeg';
import imgBuilding from '../assets/field-evidence/Building As-Build survey.jpeg';
import imgConstruction from '../assets/field-evidence/Construction marking.jpeg';
import imgRoad from '../assets/field-evidence/Road survey.jpeg';
import imgTopo from '../assets/field-evidence/Topo Graphical survey.jpeg';`);

content = content.replace('<img src="/img/field-evidence/Boundary fixing in DGPS Instrument.jpeg" alt="Boundary fixing in DGPS Instrument" loading="lazy" />', '<Image src={imgBoundary} alt="Boundary fixing in DGPS Instrument" width={800} format="webp" />');
content = content.replace('<img src="/img/field-evidence/Building As-Build survey.jpeg" alt="Building As-Build survey" loading="lazy" />', '<Image src={imgBuilding} alt="Building As-Build survey" width={1000} format="webp" />');
content = content.replace('<img src="/img/field-evidence/Construction marking.jpeg" alt="Construction marking" loading="lazy" />', '<Image src={imgConstruction} alt="Construction marking" width={600} format="webp" />');
content = content.replace('<img src="/img/field-evidence/Road survey.jpeg" alt="Road survey" loading="lazy" />', '<Image src={imgRoad} alt="Road survey" width={600} format="webp" />');
content = content.replace('<img src="/img/field-evidence/Topo Graphical survey.jpeg" alt="Topo Graphical survey" loading="lazy" />', '<Image src={imgTopo} alt="Topo Graphical survey" width={600} format="webp" />');

fs.writeFileSync('src/components/Gallery.astro', content);
console.log("Done");
