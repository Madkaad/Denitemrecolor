const fs = require('fs');
const path = require('path');

let customNames = {};
if (fs.existsSync('names.json')) {
  customNames = JSON.parse(fs.readFileSync('names.json', 'utf8'));
}

function nameFromFile(filename) {
  return filename
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

const files = fs.readdirSync('svgs')
  .filter(f => f.endsWith('.svg'))
  .sort();

const catalog = files.map(f => {
  const key = path.basename(f, '.svg');
  const name = customNames[key] || nameFromFile(key);
  return { name, file: `svgs/${f}` };
});

fs.writeFileSync('catalog.json', JSON.stringify(catalog, null, 2));
console.log(`Built catalog with ${catalog.length} items.`);
