const fs = require('fs');
const path = require('path');

const baseDir = 'd:\\Web Application\\ui_ux_promax';
const dirs = [
  'src/app/portfolio/[slug]',
  'src/app/services',
  'src/app/pricing',
  'src/app/contact',
  'src/app/about',
  'src/app/blog',
  'src/app/faq',
  'src/lib',
  'src/types',
  'src/data',
  'src/components/layout',
  'src/components/sections',
  'src/components/ui',
  'public/images'
];

dirs.forEach(dir => {
  const fullPath = path.join(baseDir, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log('Created: ' + dir);
});

console.log('\nAll directories created successfully!');
