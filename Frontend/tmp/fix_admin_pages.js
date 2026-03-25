const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'src', 'app', '(admin)', 'admin');
const files = [
  'audit-logs/page.tsx',
  'deals/edit/[id]/page.tsx',
  'deals/new/page.tsx',
  'deals/page.tsx',
  'deleted-deals/page.tsx',
  'settings/page.tsx',
  'submissions/page.tsx',
  'taxonomy/page.tsx',
  'vendors/page.tsx'
];

files.forEach(f => {
  const p = path.join(baseDir, f);
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('force-dynamic')) {
      // Add after "use client";
      if (c.includes('"use client";')) {
        c = c.replace('"use client";', '"use client";\nexport const dynamic = "force-dynamic";');
      } else if (c.includes("'use client';")) {
        c = c.replace("'use client';", "'use client';\nexport const dynamic = 'force-dynamic';");
      } else {
        // Just prepend if no use client (though admin pages should have it)
        c = 'export const dynamic = "force-dynamic";\n' + c;
      }
      fs.writeFileSync(p, c);
      console.log('Updated ' + p);
    }
  } else {
    console.log('File not found: ' + p);
  }
});
