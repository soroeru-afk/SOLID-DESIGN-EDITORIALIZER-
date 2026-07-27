const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

// 1. Revert WIDTH and HEIGHT to range
const widthHeightOld = `<div className="flex gap-2 pt-2 border-t border-[#1e252e]">
            <div className="flex-1">
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

const widthHeightNew = `<div className="flex gap-2 pt-2 border-t border-[#1e252e]">
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

content = content.replace(widthHeightOld, widthHeightNew);

// 2. Revert Text Color to color picker
const textColorOld = `<div className="flex gap-1">
                     {['white', 'black', 'red', '#00ffff'].map(c => {
                       const isColorActive = blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.color === c;
                       return <button key={c} className={\`w-6 h-6 rounded-full border-2 \${isColorActive ? 'border-[#00ffff] scale-110' : 'border-transparent'}\`} style={{backgroundColor: c}} onClick={(e) => {e.stopPropagation();handleBlockStyleChange('color', c, blockId);}} />
                     })}
                  </div>`;

const textColorNew = `<div className="flex gap-1 items-center">
                    <input type="color" className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" 
                      value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.color || '#ffffff'} 
                      onChange={(e) => {e.stopPropagation();handleBlockStyleChange('color', e.target.value, blockId);}} />
                    <span className="text-[10px] text-[#00ffff] font-mono">{blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.color || '#ffffff'}</span>
                  </div>`;

content = content.replace(textColorOld, textColorNew);

// 3. Revert Border Color to color picker
const borderColorOld = `<div className="flex gap-1">
                      <button className={\`w-5 h-5 rounded border \${blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.isBorderColorOff ? 'border-[#00ffff]' : 'border-transparent'}\`} onClick={(e) => {e.stopPropagation();handleBlockStyleChange('isBorderColorOff', true, blockId);}}>
                        <div className="w-full h-full border border-red-500 relative"><div className="absolute inset-0 bg-red-500 w-[1px] rotate-45 left-1/2 -translate-x-1/2"></div></div>
                      </button>
                      {['white', 'black', 'red', '#00ffff'].map(c => {
                       const isColorActive = blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.borderColor === c && !blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.isBorderColorOff;
                       return <button key={c} className={\`w-5 h-5 rounded border \${isColorActive ? 'border-[#00ffff] scale-110' : 'border-transparent'}\`} style={{backgroundColor: c}} onClick={(e) => {e.stopPropagation();handleBlockStyleChange('isBorderColorOff', false, blockId); handleBlockStyleChange('borderColor', c, blockId);}} />
                     })}
                    </div>`;

const borderColorNew = `<div className="flex gap-2 items-center">
                      <button className={\`w-6 h-6 rounded border \${blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.isBorderColorOff ? 'border-[#00ffff]' : 'border-[#1e252e]'}\`} onClick={(e) => {e.stopPropagation();handleBlockStyleChange('isBorderColorOff', true, blockId);}}>
                        <div className="w-full h-full border border-red-500 relative"><div className="absolute inset-0 bg-red-500 w-[1px] rotate-45 left-1/2 -translate-x-1/2"></div></div>
                      </button>
                      <input type="color" className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" 
                        value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.borderColor || '#ffffff'} 
                        onChange={(e) => {e.stopPropagation();handleBlockStyleChange('isBorderColorOff', false, blockId);handleBlockStyleChange('borderColor', e.target.value, blockId);}} />
                    </div>`;

content = content.replace(borderColorOld, borderColorNew);

// 4. Revert Background Color to color picker
const bgColorOld = `<div className="flex gap-1">
                    {['transparent', 'white', 'black', '#111', '#eee', 'red', '#00ffff'].map(c => {
                       const isColorActive = blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.backgroundColor === c;
                       return <button key={c} className={\`w-5 h-5 rounded border \${isColorActive ? 'border-[#00ffff] scale-110' : 'border-transparent'}\`} style={{backgroundColor: c === 'transparent' ? '#333' : c}} onClick={(e) => {e.stopPropagation();handleBlockStyleChange('backgroundColor', c, blockId);}}>
                         {c === 'transparent' && <div className="w-full h-full border border-gray-500 relative opacity-50"><div className="absolute inset-0 bg-gray-500 w-[1px] rotate-45 left-1/2 -translate-x-1/2"></div></div>}
                       </button>
                     })}
                </div>`;

const bgColorNew = `<div className="flex gap-2 items-center">
                    <input type="color" className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" 
                      value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.backgroundColor || '#000000'} 
                      onChange={(e) => {e.stopPropagation();handleBlockStyleChange('backgroundColor', e.target.value, blockId);}} />
                    <span className="text-[10px] text-[#00ffff] font-mono">{blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.backgroundColor || '#000000'}</span>
                </div>`;

content = content.replace(bgColorOld, bgColorNew);


fs.writeFileSync('App.tsx', content);
