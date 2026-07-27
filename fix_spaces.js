const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

// Fix missing space before ${
content = content.replace(/border\$\{/g, 'border ${');
content = content.replace(/text-left\$\{/g, 'text-left ${');
content = content.replace(/gap-1\.5\$\{/g, 'gap-1.5 ${');
content = content.replace(/h-\[28px\]\$\{/g, 'h-[28px] ${');
content = content.replace(/border-r-0'\}/g, 'border-r-0\' }');

fs.writeFileSync('App.tsx', content);
