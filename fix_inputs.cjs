const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

const targetOld = `          <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
            <div className="flex-1">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                 <span>WIDTH / W-px</span>
                 <span className="text-[#00ffff]">{blockStyles[\`\${ stylePattern}-\${ orientation}\`]?.[blockId]?.width || 'AUTO'}</span>
               </div>
               <input
                type="range" min="0" max="2000" step="10"
                className="w-full accent-[#00ffff] mt-1"
                value={blockStyles[\`\${ stylePattern}-\${ orientation}\`]?.[blockId]?.width || 0}
                onChange={(e) => handleBlockStyleChange('width', Number(e.target.value) || undefined, blockId)} />
            </div>
            <div className="flex-1 border-l border-[#1e252e] pl-2">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                 <span>HEIGHT / H-px</span>
                 <span className="text-[#00ffff]">{blockStyles[\`\${ stylePattern}-\${ orientation}\`]?.[blockId]?.height || 'AUTO'}</span>
               </div>
               <input
                type="range" min="0" max="2000" step="10"
                className="w-full accent-[#00ffff] mt-1"
                value={blockStyles[\`\${ stylePattern}-\${ orientation}\`]?.[blockId]?.height || 0}
                onChange={(e) => handleBlockStyleChange('height', Number(e.target.value) || undefined, blockId)} />
            </div>
          </div>`;

const replaceNew = `          <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
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
                 <button onClick={() => handleBlockStyleChange('width', undefined, blockId)} className="text-[8px] border border-[#1e252e] px-1 py-0.5 hover:bg-[#1e252e] text-[#8a95a3]">RST</button>
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
                 <button onClick={() => handleBlockStyleChange('height', undefined, blockId)} className="text-[8px] border border-[#1e252e] px-1 py-0.5 hover:bg-[#1e252e] text-[#8a95a3]">RST</button>
               </div>
            </div>
          </div>`;

content = content.replace(targetOld, replaceNew);
fs.writeFileSync('App.tsx', content);
