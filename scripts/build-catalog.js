const fs = require('fs');
const path = require('path');

let customNames = {};
if (fs.existsSync('names.json')) {
  customNames = JSON.parse(fs.readFileSync('names.json', 'utf8'));
}

function nameFromFile(filename) {
  if (filename.includes('-')) {
    return filename
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }
  return filename
    .replace(/(\D)(\d+)$/, '$1 $2')
    .replace(/(?<=[a-z])(?=[A-Z])/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Scan svgs, svgs2, svgs3 ... svgs9 — whichever exist
const folders = ['svgs'];
for (let i = 2; i <= 9; i++) {
  folders.push(`svgs${i}`);
}

const catalog = [];

folders.forEach(folder => {
  if (!fs.existsSync(folder)) return;
  const files = fs.readdirSync(folder)
    .filter(f => f.endsWith('.svg'))
    .sort();
  files.forEach(f => {
    const key = path.basename(f, '.svg');
    const name = customNames[key] || nameFromFile(key);
    catalog.push({ name, file: `${folder}/${f}` });
  });
});

// Sort everything alphabetically by name across all folders
catalog.sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync('catalog.json', JSON.stringify(catalog, null, 2));
console.log(`Built catalog with ${catalog.length} items from: ${folders.filter(f => fs.existsSync(f)).join(', ')}`);
