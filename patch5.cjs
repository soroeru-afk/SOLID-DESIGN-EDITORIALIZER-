const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
  /bg-\[\#080a0d\] border border-white\/10 text-white\/60 hover:text-\[\#e2e8f0\] hover:bg-\[\#2d3640\]/g,
  'bg-[#080a0d] border border-[#1e252e] text-[#8a95a3] hover:text-[#e2e8f0] hover:bg-[#1a1f26]'
);

// Also modify Open Header button
content = content.replace(
  /className="p\.1\.5 text-\[\#8a95a3\] hover:text-\[\#e2e8f0\] bg-\[\#111418\] hover:bg-\[\#2d3640\] border border-\[\#1e252e\] rounded-md transition-colors shadow-lg"/g,
  'className="p-1.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-colors shadow-lg backdrop-blur-sm"'
);

fs.writeFileSync('App.tsx', content);
