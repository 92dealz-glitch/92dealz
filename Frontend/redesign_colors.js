const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (/\.(tsx|ts|js|jsx)$/.test(filePath)) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walk(srcDir);
console.log(`Found ${files.length} source files to check.`);

let replacedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Primary Green hex (#0F9D58) -> Deep Indigo (#4F46E5)
  content = content.replace(/#0F9D58/gi, '#4F46E5');

  // 2. Hover/Dark Green (#0b8047) -> Royal Purple (#7C3AED)
  content = content.replace(/#0b8047/gi, '#7C3AED');
  content = content.replace(/#0b8043/gi, '#7C3AED');

  // 3. Light Green Accent (#8fe8b1) -> Light Indigo (#E0E7FF) or Cyan (#06B6D4) depending on background usage
  // Note: Most light green backgrounds are text highlights or light backgrounds, E0E7FF is perfect.
  content = content.replace(/#8fe8b1/gi, '#C7D2FE');

  // 4. Other specific green values mapping to clean Indigo/Purple/Cyan shades
  content = content.replace(/#15803d/gi, '#4F46E5');
  content = content.replace(/#096339/gi, '#312E81');
  content = content.replace(/#096e3c/gi, '#3730A3');
  content = content.replace(/#1e9c5a/gi, '#6366F1');
  content = content.replace(/#1eb775/gi, '#6366F1');
  content = content.replace(/#2ddf62/gi, '#06B6D4'); // Dynamic bright green -> Electric Cyan
  content = content.replace(/#e7f5ed/gi, '#EEF2FF');
  content = content.replace(/#c2ead3/gi, '#E0E7FF');
  content = content.replace(/#8ae0b4/gi, '#A5B4FC');
  content = content.replace(/#4bd091/gi, '#818CF8');
  content = content.replace(/#032415/gi, '#1E1B4B');
  content = content.replace(/#064026/gi, '#312E81');
  content = content.replace(/#084f2e/gi, '#3730A3');
  content = content.replace(/#05331d/gi, '#1E1B4B');
  
  // 5. Emerald verified icon -> Electric Cyan
  content = content.replace(/#10b981/gi, '#06B6D4');
  content = content.replace(/#34A853/gi, '#06B6D4');

  // 6. Named Tailwind emerald/green replacements to modern equivalents
  content = content.replace(/shadow-emerald-100/g, 'shadow-indigo-100');
  content = content.replace(/bg-emerald-50/g, 'bg-indigo-50/50');
  content = content.replace(/bg-emerald-100/g, 'bg-indigo-100');
  content = content.replace(/border-green-100/g, 'border-indigo-100');
  content = content.replace(/text-green-600/g, 'text-indigo-600');
  content = content.replace(/text-emerald-500/g, 'text-indigo-500');
  content = content.replace(/text-emerald-800/g, 'text-indigo-800');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    replacedCount++;
    console.log(`Redesigned: ${path.relative(srcDir, file)}`);
  }
});

console.log(`Redesign script completed successfully. Migrated ${replacedCount} files.`);
