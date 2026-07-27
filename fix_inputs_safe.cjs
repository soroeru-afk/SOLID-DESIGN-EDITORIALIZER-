const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

// We will remove currentBlockSize logic and use a safer approach for the inputs
const stateTargetRegex = /const \[currentBlockSize, setCurrentBlockSize\] = useState[^;]+;\s*useEffect\(\(\) => \{[\s\S]*?\}, \[selectedBlockId, stylePattern, orientation\]\);/;
content = content.replace(stateTargetRegex, '');

const inputRegex = /<div className="flex-1">\s*<div className="text-\[8px\] font-bold tracking-widest opacity-60 mb-1 flex justify-between items-center">\s*<span>WIDTH \(px\)<\/span>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const safeInputs = `<div className="flex-1">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between items-center">
                 <span>WIDTH (px)</span>
                 <div className="flex items-center gap-2">
                   <span className="text-[#00ffff]">{blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.width || 'AUTO'}</span>
                   <button onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('width', undefined, blockId); }} className="px-1 py-0.5 border border-[#1e252e] hover:bg-[#1e252e] text-[8px] transition-colors rounded-sm">RST</button>
                 </div>
               </div>
               <div className="flex items-center gap-1 mt-1">
                 <input
                  type="number" min="10" max="4000" step="10"
                  placeholder="AUTO"
                  className="w-full bg-[#0a0c10] border border-[#1e252e] px-2 py-1 text-[10px] text-[#00ffff] focus:outline-none focus:border-[#00ffff] rounded-sm transition-colors"
                  value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.width || ''}
                  onChange={(e) => handleBlockStyleChange('width', e.target.value ? Number(e.target.value) : undefined, blockId)} />
               </div>
            </div>
            <div className="flex-1 border-l border-[#1e252e] pl-2">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between items-center">
                 <span>HEIGHT (px)</span>
                 <div className="flex items-center gap-2">
                   <span className="text-[#00ffff]">{blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.height || 'AUTO'}</span>
                   <button onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('height', undefined, blockId); }} className="px-1 py-0.5 border border-[#1e252e] hover:bg-[#1e252e] text-[8px] transition-colors rounded-sm">RST</button>
                 </div>
               </div>
               <div className="flex items-center gap-1 mt-1">
                 <input
                  type="number" min="10" max="4000" step="10"
                  placeholder="AUTO"
                  className="w-full bg-[#0a0c10] border border-[#1e252e] px-2 py-1 text-[10px] text-[#00ffff] focus:outline-none focus:border-[#00ffff] rounded-sm transition-colors"
                  value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.height || ''}
                  onChange={(e) => handleBlockStyleChange('height', e.target.value ? Number(e.target.value) : undefined, blockId)} />
               </div>
            </div>
          </div>`;

content = content.replace(inputRegex, safeInputs);
fs.writeFileSync('App.tsx', content);
