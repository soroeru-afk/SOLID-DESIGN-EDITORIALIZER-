const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

content = content.replace(/className="flex-1 py-2 text-\[10px\] font-bold border border-\[\#1e252e\] text-\[\#8a95a3\] hover:text-\[\#e2e8f0\] hover:border-\[\#4e5d74\] transition-colors"/g, 
  'className="flex-1 py-2 text-[10px] font-bold border border-[#1e252e] text-[#8a95a3] hover:text-[#e2e8f0] hover:border-[#4e5d74] rounded-md transition-colors"');

content = content.replace(/className="flex-1 py-2 text-\[10px\] font-bold bg-\[\#d94a38\] hover:bg-\[\#ff5544\] text-white transition-colors"/g,
  'className="flex-1 py-2 text-[10px] font-bold bg-[#d94a38] hover:bg-[#ff5544] text-white rounded-md transition-colors"');

fs.writeFileSync('App.tsx', content);
