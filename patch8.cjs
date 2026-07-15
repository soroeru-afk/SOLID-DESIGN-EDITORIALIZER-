const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
  /className="p-1\.5 text-\[\#8a95a3\] hover:text-\[\#e2e8f0\] bg-\[\#111418\] hover:bg-\[\#2d3640\] border border-\[\#1e252e\] rounded-md transition-colors shadow-lg"/g,
  'className="p-1.5 bg-white/90 text-gray-700 hover:text-gray-900 border border-gray-300 hover:bg-white rounded-md transition-colors shadow-sm backdrop-blur-sm"'
);

// Update Shrink import
content = content.replace(
  /Minimize/g,
  'Shrink'
);

// Make Export and Import text clearer
content = content.replace(
  /className="flex-1 py-2 text-\[10px\] font-bold tracking-widest rounded-md transition-all bg-\[\#080a0d\] border border-\[\#1e252e\] text-\[\#8a95a3\] hover:text-\[\#e2e8f0\] hover:bg-\[\#1a1f26\] flex justify-center items-center gap-1 cursor-pointer"/g,
  'className="flex-1 py-2 text-[10px] font-bold tracking-widest rounded-md transition-all bg-[#111418] border border-[#2d3640] text-white hover:bg-[#1e252e] flex justify-center items-center gap-1 cursor-pointer"'
);

content = content.replace(
  /className="flex-1 py-2 text-\[10px\] font-bold tracking-widest rounded-md transition-all bg-\[\#080a0d\] border border-\[\#1e252e\] text-\[\#8a95a3\] hover:text-\[\#e2e8f0\] hover:bg-\[\#1a1f26\] flex justify-center items-center gap-1"/g,
  'className="flex-1 py-2 text-[10px] font-bold tracking-widest rounded-md transition-all bg-[#111418] border border-[#2d3640] text-white hover:bg-[#1e252e] flex justify-center items-center gap-1"'
);

content = content.replace(
  /className="col-span-1 py-1\.5 text-\[10px\] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1\.5 border border-\[\#1e252e\] bg-\[\#080a0d\] hover:bg-\[\#1e252e\] text-\[\#8a95a3\]"/g,
  'className="col-span-1 py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 border border-[#2d3640] bg-[#111418] hover:bg-[#1e252e] text-white"'
);

fs.writeFileSync('App.tsx', content);
