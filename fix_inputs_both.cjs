const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

const widthHeightOld = `<div className="flex gap-2 pt-2 border-t border-[#1e252e]">
            <div className="flex-1">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between items-center">
                 <span>WIDTH (px)</span>
                 <div className="flex items-center gap-2">
                   <span className="text-[#00ffff]">{blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.width || 'AUTO'}</span>
                   <button onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('width', undefined, blockId); }} className="px-1 py-0.5 border border-[#1e252e] hover:bg-[#1e252e] text-[8px] transition-colors rounded-sm">RST</button>
                 </div>
               </div>
               <input
                type="range" min="0" max="2000" step="10"
                className="w-full accent-[#00ffff] mt-1"
                value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.width || 0}
                onChange={(e) => handleBlockStyleChange('width', Number(e.target.value) || undefined, blockId)} />
            </div>
            <div className="flex-1 border-l border-[#1e252e] pl-2">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between items-center">
                 <span>HEIGHT (px)</span>
                 <div className="flex items-center gap-2">
                   <span className="text-[#00ffff]">{blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.height || 'AUTO'}</span>
                   <button onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('height', undefined, blockId); }} className="px-1 py-0.5 border border-[#1e252e] hover:bg-[#1e252e] text-[8px] transition-colors rounded-sm">RST</button>
                 </div>
               </div>
               <input
                type="range" min="0" max="2000" step="10"
                className="w-full accent-[#00ffff] mt-1"
                value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.height || 0}
                onChange={(e) => handleBlockStyleChange('height', Number(e.target.value) || undefined, blockId)} />
            </div>
          </div>`;

const widthHeightNew = `<div className="flex gap-2 pt-2 border-t border-[#1e252e]">
            <div className="flex-1">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between items-center">
                 <span>WIDTH (px)</span>
                 <button onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('width', undefined, blockId); }} className="px-1 py-0.5 border border-[#1e252e] hover:bg-[#1e252e] text-[8px] transition-colors rounded-sm">RST</button>
               </div>
               <div className="flex items-center gap-2 mb-1">
                 <input type="range" min="0" max="2000" step="10" className="w-full accent-[#00ffff]" value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.width || 0} onChange={(e) => handleBlockStyleChange('width', Number(e.target.value) || undefined, blockId)} />
               </div>
               <input type="number" min="0" max="4000" step="1" placeholder="AUTO" className="w-full bg-[#0a0c10] border border-[#1e252e] px-2 py-1 text-[10px] text-[#00ffff] focus:outline-none focus:border-[#00ffff] rounded-sm transition-colors" value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.width || ''} onChange={(e) => handleBlockStyleChange('width', e.target.value ? Number(e.target.value) : undefined, blockId)} onKeyDown={(e) => { e.stopPropagation(); }} />
            </div>
            <div className="flex-1 border-l border-[#1e252e] pl-2">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between items-center">
                 <span>HEIGHT (px)</span>
                 <button onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('height', undefined, blockId); }} className="px-1 py-0.5 border border-[#1e252e] hover:bg-[#1e252e] text-[8px] transition-colors rounded-sm">RST</button>
               </div>
               <div className="flex items-center gap-2 mb-1">
                 <input type="range" min="0" max="2000" step="10" className="w-full accent-[#00ffff]" value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.height || 0} onChange={(e) => handleBlockStyleChange('height', Number(e.target.value) || undefined, blockId)} />
               </div>
               <input type="number" min="0" max="4000" step="1" placeholder="AUTO" className="w-full bg-[#0a0c10] border border-[#1e252e] px-2 py-1 text-[10px] text-[#00ffff] focus:outline-none focus:border-[#00ffff] rounded-sm transition-colors" value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.height || ''} onChange={(e) => handleBlockStyleChange('height', e.target.value ? Number(e.target.value) : undefined, blockId)} onKeyDown={(e) => { e.stopPropagation(); }} />
            </div>
          </div>`;

if (content.includes(widthHeightOld)) {
    content = content.replace(widthHeightOld, widthHeightNew);
    fs.writeFileSync('App.tsx', content);
    console.log("Success");
} else {
    console.log("Failed to find exact block. Here is a fuzzy replace try.");
    const re = /<div className="flex gap-2 pt-2 border-t border-\[#1e252e\]">[\s\S]*?HEIGHT \(px\)[\s\S]*?<\/div>\s*<\/div>/;
    content = content.replace(re, widthHeightNew);
    fs.writeFileSync('App.tsx', content);
    console.log("Fuzzy match replaced.");
}
