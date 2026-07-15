const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const missingCode = `
          <div className="flex border-b border-[#1e252e] bg-[#080a0d] px-5 py-3 shrink-0">
            <div className="flex items-center gap-1 bg-[#111418] border border-[#1e252e] rounded p-1 w-full">
              <button 
                className={\`flex-1 py-1.5 text-[10px] font-bold tracking-widest rounded transition-all \${orientation === 'horizontal' ? 'bg-[#2d3640] text-[#00ffff] shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}\`}
                onClick={() => setOrientation('horizontal')}
                title="横組レギュラー"
              >
                ☰ REGULAR
              </button>
              <button 
                className={\`flex-1 py-1.5 text-[10px] font-bold tracking-widest rounded transition-all \${orientation === 'vertical' ? 'bg-[#2d3640] text-[#00ffff] shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}\`}
                onClick={() => setOrientation('vertical')}
                title="縦組リール"
              >
                || REELS
              </button>
            </div>
          </div>
          
          <div className="flex border-b border-[#1e252e] bg-[#080a0d] px-5 py-2 shrink-0">
            <div className="flex gap-4 w-full">
              <button 
                className={\`flex-1 py-2 text-[10px] font-bold tracking-widest rounded-md transition-all \${activeTab === 'design' ? 'bg-[#1a1f26] text-white shadow-sm border border-[#2d3640]' : 'text-[#8a95a3] hover:text-[#e2e8f0] border border-transparent'}\`}
                onClick={() => setActiveTab('design')}
              >
                DESIGN
              </button>
              <button 
                className={\`flex-1 py-2 text-[10px] font-bold tracking-widest rounded-md transition-all \${activeTab === 'image' ? 'bg-[#1a1f26] text-white shadow-sm border border-[#2d3640]' : 'text-[#8a95a3] hover:text-[#e2e8f0] border border-transparent'}\`}
                onClick={() => setActiveTab('image')}
              >
                IMAGE
              </button>
              <button 
                className={\`flex-1 py-2 text-[10px] font-bold tracking-widest rounded-md transition-all \${activeTab === 'text' ? 'bg-[#1a1f26] text-white shadow-sm border border-[#2d3640]' : 'text-[#8a95a3] hover:text-[#e2e8f0] border border-transparent'}\`}
                onClick={() => setActiveTab('text')}
              >
                TEXT
              </button>
            </div>
          </div>`;

content = content.replace(
  /GENERATIVE WEB BUILDER<\/p>\s*<\/div>\s*<\/div>\s*<\/div>/,
  'GENERATIVE WEB BUILDER</p>\n              </div>\n            </div>\n          </div>' + missingCode
);

fs.writeFileSync('App.tsx', content);
