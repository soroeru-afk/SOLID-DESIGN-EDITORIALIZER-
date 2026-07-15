const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
  /className="p-1\.5 text-white\/70 hover:text-white bg-white\/10 hover:bg-white\/20 border border-white\/20 rounded-md transition-colors shadow-lg backdrop-blur-sm"/g,
  'className="p-1.5 text-[#8a95a3] hover:text-[#e2e8f0] bg-[#111418] hover:bg-[#2d3640] border border-[#1e252e] rounded-md transition-colors shadow-lg"'
);

fs.writeFileSync('App.tsx', content);
