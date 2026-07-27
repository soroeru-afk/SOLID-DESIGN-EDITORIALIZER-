const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

// 1. Add currentBlockSize state and useEffect
const stateTarget = `  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);`;
const stateNew = `  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [currentBlockSize, setCurrentBlockSize] = useState({ width: 500, height: 500 });

  useEffect(() => {
    if (selectedBlockId) {
      setTimeout(() => {
        const el = document.getElementById(selectedBlockId);
        if (el) {
          setCurrentBlockSize({
            width: el.offsetWidth || 500,
            height: el.offsetHeight || 500
          });
        }
      }, 100);
    }
  }, [selectedBlockId, stylePattern, orientation]);`;
content = content.replace(stateTarget, stateNew);


// 2. Replace the inputs block
const inputsOld = `          <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
            <div className="flex-1">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                 <span>WIDTH (px)</span>
                 <span className="text-[#00ffff]">{blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.width || 'AUTO'}</span>
               </div>
               <div className="flex items-center gap-1 mt-1">
                 <input
                  type="number" min="0" max="4000" step="10"
                  placeholder="AUTO"
                  className="w-full bg-[#0a0c10] border border-[#1e252e] px-1 py-0.5 text-[10px] text-[#00ffff] focus:outline-none focus:border-[#00ffff]"
                  value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.width || ''}
                  onChange={(e) => handleBlockStyleChange('width', e.target.value ? Number(e.target.value) : undefined, blockId)} />
                 <button onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('width', undefined, blockId); }} className="text-[8px] border border-[#1e252e] px-1 py-0.5 hover:bg-[#1e252e] text-[#8a95a3]">RST</button>
               </div>
            </div>
            <div className="flex-1 border-l border-[#1e252e] pl-2">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                 <span>HEIGHT (px)</span>
                 <span className="text-[#00ffff]">{blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.height || 'AUTO'}</span>
               </div>
               <div className="flex items-center gap-1 mt-1">
                 <input
                  type="number" min="0" max="4000" step="10"
                  placeholder="AUTO"
                  className="w-full bg-[#0a0c10] border border-[#1e252e] px-1 py-0.5 text-[10px] text-[#00ffff] focus:outline-none focus:border-[#00ffff]"
                  value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.height || ''}
                  onChange={(e) => handleBlockStyleChange('height', e.target.value ? Number(e.target.value) : undefined, blockId)} />
                 <button onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('height', undefined, blockId); }} className="text-[8px] border border-[#1e252e] px-1 py-0.5 hover:bg-[#1e252e] text-[#8a95a3]">RST</button>
               </div>
            </div>
          </div>`;

const inputsNew = `          <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
            <div className="flex-1">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between items-center">
                 <span>WIDTH (px)</span>
                 <div className="flex items-center gap-2">
                   <span className="text-[#00ffff]">{blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.width || 'AUTO'}</span>
                   <button onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('width', undefined, blockId); }} className="px-1 py-0.5 border border-[#1e252e] hover:bg-[#1e252e] text-[8px]">RST</button>
                 </div>
               </div>
               <input
                type="range" min="10" max="2000" step="10"
                className="w-full accent-[#00ffff] mt-1"
                value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.width ?? currentBlockSize.width}
                onChange={(e) => handleBlockStyleChange('width', Number(e.target.value), blockId)} />
            </div>
            <div className="flex-1 border-l border-[#1e252e] pl-2">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between items-center">
                 <span>HEIGHT (px)</span>
                 <div className="flex items-center gap-2">
                   <span className="text-[#00ffff]">{blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.height || 'AUTO'}</span>
                   <button onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('height', undefined, blockId); }} className="px-1 py-0.5 border border-[#1e252e] hover:bg-[#1e252e] text-[8px]">RST</button>
                 </div>
               </div>
               <input
                type="range" min="10" max="2000" step="10"
                className="w-full accent-[#00ffff] mt-1"
                value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.height ?? currentBlockSize.height}
                onChange={(e) => handleBlockStyleChange('height', Number(e.target.value), blockId)} />
            </div>
          </div>`;

content = content.replace(inputsOld, inputsNew);
fs.writeFileSync('App.tsx', content);
