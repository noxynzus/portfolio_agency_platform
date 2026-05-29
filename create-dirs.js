const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const dirs = [
  'src/app',
  'src/app/portfolio',
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
  'src/components',
  'src/components/layout',
  'src/components/sections',
  'src/components/ui',
  'public/images'
];

console.log('Creating directories and .gitkeep files in: ' + baseDir);
dirs.forEach(dir => {
  const fullPath = path.join(baseDir, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  
  // Create .gitkeep file in each directory
  const gitkeepPath = path.join(fullPath, '.gitkeep');
  if (!fs.existsSync(gitkeepPath)) {
    fs.writeFileSync(gitkeepPath, '');
  }
  
  console.log('✓ Created: ' + dir + '/.gitkeep');
});

console.log('\n✅ All directories and .gitkeep files created successfully!');
