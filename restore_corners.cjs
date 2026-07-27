const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

// OPTIONS & GRID box
content = content.replace(
  /<div className="flex bg-\[\#080a0d\] p-1\.5\s+border border-\[\#1e252e\] gap-1\.5 flex-wrap">/g,
  '<div className="flex bg-[#080a0d] p-1.5 rounded-lg border border-[#1e252e] gap-1.5 flex-wrap">'
);

// SAVE SLOTS boxes
content = content.replace(
  /<div key=\{slot\} className="flex flex-col bg-\[\#1a1f26\] border border-\[\#1e252e\]\s+overflow-hidden relative group h-\[60px\]">/g,
  '<div key={slot} className="flex flex-col bg-[#1a1f26] border border-[#1e252e] rounded-md overflow-hidden relative group h-[60px]">'
);

// Global settings panel
content = content.replace(
  /<div className="bg-\[\#111418\] border border-\[\#1e252e\]\s+p-4 mb-4 text-center shadow-inner">/g,
  '<div className="bg-[#111418] border border-[#1e252e] rounded-lg p-4 mb-4 text-center shadow-inner">'
);

// Global settings close bar
content = content.replace(
  /<div className="bg-\[\#111418\] border border-\[\#1e252e\]\s+p-4 mb-4 text-center shadow-inner cursor-pointer hover:bg-\[\#1e252e\]\/50 transition-colors"/g,
  '<div className="bg-[#111418] border border-[#1e252e] rounded-lg p-4 mb-4 text-center shadow-inner cursor-pointer hover:bg-[#1e252e]/50 transition-colors"'
);

// details panel
content = content.replace(
  /<details open className="mb-4 group bg-\[\#111418\] border border-\[\#1e252e\]\s+"/g,
  '<details open className="mb-4 group bg-[#111418] border border-[#1e252e] rounded-lg"'
);
content = content.replace(
  /<details open className="mb-4 group bg-\[\#111418\] border border-\[\#1e252e\]"/g,
  '<details open className="mb-4 group bg-[#111418] border border-[#1e252e] rounded-lg"'
);


// Dropdown menu (absolute z-101)
content = content.replace(
  /<div className="absolute z-\[101\] w-\[200px\] right-0 mt-1 bg-\[\#111418\] border border-\[\#1e252e\]\s+shadow-xl max-h-\[250px\] overflow-y-auto">/g,
  '<div className="absolute z-[101] w-[200px] right-0 mt-1 bg-[#111418] border border-[#1e252e] rounded-md shadow-xl max-h-[250px] overflow-y-auto">'
);

fs.writeFileSync('App.tsx', content);
