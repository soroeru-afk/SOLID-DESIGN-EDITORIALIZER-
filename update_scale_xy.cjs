const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

const oldScaleBlock = `<div className="flex gap-2 pt-2 border-t border-[#1e252e]">
            <div className="flex-1">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">SCALE ({blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.scale || 100}%)</div>
              <input
                type="range"
                min="10" max="400" step="5"
                className="w-full accent-[#00ffff] mt-1"
                value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.scale || 100}
                onChange={(e) => handleBlockStyleChange('scale', Number(e.target.value), blockId)} />
            </div>
          </div>`;

const newScaleAndOffsetBlocks = `<div className="flex gap-2 pt-2 border-t border-[#1e252e]">
            <div className="flex-1">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between items-center">
                 <span>SCALE (%)</span>
                 <button onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('scale', 100, blockId); }} className="px-1 py-0.5 border border-[#1e252e] hover:bg-[#1e252e] text-[8px] transition-colors rounded-sm">RST</button>
               </div>
               <div className="flex items-center gap-2 mb-1">
                 <input type="range" min="10" max="400" step="5" className="w-full accent-[#00ffff]" value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.scale || 100} onChange={(e) => handleBlockStyleChange('scale', Number(e.target.value), blockId)} />
               </div>
               <input type="number" min="10" max="1000" step="1" className="w-full bg-[#0a0c10] border border-[#1e252e] px-2 py-1 text-[10px] text-[#00ffff] focus:outline-none focus:border-[#00ffff] rounded-sm transition-colors" value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.scale || 100} onChange={(e) => handleBlockStyleChange('scale', Number(e.target.value) || 100, blockId)} onKeyDown={(e) => { e.stopPropagation(); }} />
            </div>
          </div>
          <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
            <div className="flex-1">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between items-center">
                 <span>X POSITION</span>
                 <button onClick={(e) => { e.stopPropagation(); handleOffsetChange('x', 0, blockId); }} className="px-1 py-0.5 border border-[#1e252e] hover:bg-[#1e252e] text-[8px] transition-colors rounded-sm">RST</button>
               </div>
               <div className="flex items-center gap-2 mb-1">
                 <input type="range" min="-1000" max="1000" step="10" className="w-full accent-[#00ffff]" value={offsets[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.x || 0} onChange={(e) => handleOffsetChange('x', Number(e.target.value), blockId)} />
               </div>
               <input type="number" step="1" className="w-full bg-[#0a0c10] border border-[#1e252e] px-2 py-1 text-[10px] text-[#00ffff] focus:outline-none focus:border-[#00ffff] rounded-sm transition-colors" value={offsets[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.x || 0} onChange={(e) => handleOffsetChange('x', Number(e.target.value) || 0, blockId)} onKeyDown={(e) => { e.stopPropagation(); }} />
            </div>
            <div className="flex-1 border-l border-[#1e252e] pl-2">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between items-center">
                 <span>Y POSITION</span>
                 <button onClick={(e) => { e.stopPropagation(); handleOffsetChange('y', 0, blockId); }} className="px-1 py-0.5 border border-[#1e252e] hover:bg-[#1e252e] text-[8px] transition-colors rounded-sm">RST</button>
               </div>
               <div className="flex items-center gap-2 mb-1">
                 <input type="range" min="-1000" max="1000" step="10" className="w-full accent-[#00ffff]" value={offsets[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.y || 0} onChange={(e) => handleOffsetChange('y', Number(e.target.value), blockId)} />
               </div>
               <input type="number" step="1" className="w-full bg-[#0a0c10] border border-[#1e252e] px-2 py-1 text-[10px] text-[#00ffff] focus:outline-none focus:border-[#00ffff] rounded-sm transition-colors" value={offsets[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.y || 0} onChange={(e) => handleOffsetChange('y', Number(e.target.value) || 0, blockId)} onKeyDown={(e) => { e.stopPropagation(); }} />
            </div>
          </div>`;

if (content.includes(oldScaleBlock)) {
    content = content.replace(oldScaleBlock, newScaleAndOffsetBlocks);
    fs.writeFileSync('App.tsx', content);
    console.log("Replaced successfully!");
} else {
    console.log("Could not find the exact oldScaleBlock. Here's a regex attempt.");
    const re = /<div className="flex gap-2 pt-2 border-t border-\[#1e252e\]">\s*<div className="flex-1">\s*<div className="text-\[8px\] font-bold tracking-widest opacity-60 mb-1">SCALE \([\s\S]*?<\/div>\s*<\/div>/;
    if (re.test(content)) {
        content = content.replace(re, newScaleAndOffsetBlocks);
        fs.writeFileSync('App.tsx', content);
        console.log("Regex replace successful!");
    } else {
        console.log("Regex replace also failed.");
    }
}
