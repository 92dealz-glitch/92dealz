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

  // 1. Primary Forest Green (#1F6F5B) -> Avocado Green (#708238)
  content = content.replace(/#1F6F5B/gi, '#708238');

  // 2. Dark Forest Green (#174F43) -> Darker Avocado Green (#5E6E2F)
  content = content.replace(/#174F43/gi, '#5E6E2F');

  // 3. Old border (#EFE7DD) -> Luxury Border Color (#E9E0D4)
  content = content.replace(/#EFE7DD/gi, '#E9E0D4');

  // 4. Old gold (#D4A373) -> Soft Caramel Gold (#C7A27C)
  content = content.replace(/#D4A373/gi, '#C7A27C');

  // 5. Old background beige (#F6F1EB) -> Soft Luxury Cream background (#F8F4EE)
  content = content.replace(/#F6F1EB/gi, '#F8F4EE');

  // 6. Old sand / highlights (#EDE0D4) -> Warm White card background (#FFFDF9) or border (#E9E0D4)
  // Let's do selective replacement to maintain visual correctness
  content = content.replace(/bg-\[#EDE0D4\]\/30/gi, 'bg-[#FFFDF9]/30');
  content = content.replace(/bg-\[#EDE0D4\]/gi, 'bg-[#FFFDF9]');
  content = content.replace(/border-\[#EDE0D4\]/gi, 'border-[#E9E0D4]');
  content = content.replace(/shadow-\[#EDE0D4\]\/40/gi, 'shadow-[#E9E0D4]/30');
  
  // 7. General named variables alignment
  content = content.replace(/text-green-600/g, 'text-[#708238]');
  content = content.replace(/text-indigo-600/g, 'text-[#708238]');
  content = content.replace(/text-[#1C1C1C]/g, 'text-[#1E1E1E]');
  content = content.replace(/hover:text-[#1C1C1C]/g, 'hover:text-[#1E1E1E]');
  content = content.replace(/hover:text-[#1F6F5B]/g, 'hover:text-[#708238]');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    replacedCount++;
    console.log(`Earthy redesigned: ${path.relative(srcDir, file)}`);
  }
});

console.log(`Earthy redesign script completed successfully. Migrated ${replacedCount} files.`);
