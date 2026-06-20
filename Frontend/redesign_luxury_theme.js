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

  // 1. Primary Indigo (#4F46E5) -> Deep Forest Green (#1F6F5B)
  content = content.replace(/#4F46E5/gi, '#1F6F5B');

  // 2. Purple Hover/Secondary (#7C3AED) -> Dark Forest Green (#174F43)
  content = content.replace(/#7C3AED/gi, '#174F43');

  // 3. Light Indigo Accent (#C7D2FE) -> Luxury Border Color (#EFE7DD)
  content = content.replace(/#C7D2FE/gi, '#EFE7DD');

  // 4. Electric Cyan (#06B6D4) -> Soft Gold / Sand (#D4A373)
  content = content.replace(/#06B6D4/gi, '#D4A373');

  // 5. Light text and borders
  content = content.replace(/bg-indigo-50\/50/g, 'bg-[#EDE0D4]/30');
  content = content.replace(/bg-indigo-100/g, 'bg-[#EDE0D4]');
  content = content.replace(/border-indigo-100/g, 'border-[#EFE7DD]');
  content = content.replace(/text-indigo-600/g, 'text-[#1F6F5B]');
  content = content.replace(/text-indigo-500/g, 'text-[#1F6F5B]');
  content = content.replace(/text-indigo-800/g, 'text-[#174F43]');
  content = content.replace(/shadow-indigo-100/g, 'shadow-[#EDE0D4]/40');
  
  // Extra mapping cleanups
  content = content.replace(/shadow-emerald-100/g, 'shadow-[#EDE0D4]/40');
  content = content.replace(/bg-[#EEF2FF]/gi, 'bg-[#F6F1EB]');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    replacedCount++;
    console.log(`Luxury redesigned: ${path.relative(srcDir, file)}`);
  }
});

console.log(`Luxury redesign script completed successfully. Migrated ${replacedCount} files.`);
