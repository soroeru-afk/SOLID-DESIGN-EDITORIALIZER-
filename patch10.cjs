const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

// 1. Settings button toggle
content = content.replace(
  /onClick=\{\(\) => setIsGlobalSettingsOpen\(true\)\}\s*title="Global Settings"/,
  'onClick={() => setIsGlobalSettingsOpen(prev => !prev)}\n                      title="Global Settings"'
);

// 2. Main sidebar header replacement
content = content.replace(
  /<div className="p-6 pb-5 border-b border-\[\#1e252e\] shrink-0 bg-\[\#0a0c10\] flex flex-col justify-between">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  `<div className="h-[88px] px-6 border-b border-[#1e252e] shrink-0 bg-[#0a0c10] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="border border-[#4e5d74] p-2 rounded-md shrink-0 bg-[#111418]">
                <LayoutTemplate size={24} className="text-[#e2e8f0]" />
              </div>
              <div className="flex flex-col justify-center gap-1.5 mt-0.5">
                <h1 className="text-white font-extrabold tracking-wider text-[15px] leading-none" style={{ fontFamily: '"Inter", sans-serif' }}>
                  SOLID DESIGN<br />EDITORIZER
                </h1>
                <p className="text-[8px] text-[#4e5d74] tracking-[0.1em] font-bold" style={{ fontFamily: '"Share Tech Mono", monospace' }}>GENERATIVE WEB BUILDER</p>
              </div>
            </div>
          </div>`
);

// 3. Settings panel header replacement
content = content.replace(
  /<div className="flex items-center justify-between border-b border-\[\#1e252e\] p-5 shrink-0 bg-\[\#0a0c10\]">/,
  '<div className="h-[88px] px-6 flex items-center justify-between border-b border-[#1e252e] shrink-0 bg-[#0a0c10]">'
);

fs.writeFileSync('App.tsx', content);
