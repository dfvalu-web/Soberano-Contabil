const fs = require('fs');

const cats = JSON.parse(fs.readFileSync('scripts/core-and-advanced-categories.json', 'utf8'));
const seen = new Set();
cats.forEach(c => {
  c.items = c.items.filter(i => {
    if (seen.has(i.file)) return false;
    seen.add(i.file);
    return true;
  });
});

let total = 0;
cats.forEach(c => total += c.items.length);
console.log('Unique total modules:', total);
fs.writeFileSync('scripts/core-and-advanced-categories.json', JSON.stringify(cats, null, 2), 'utf8');
