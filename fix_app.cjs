const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf-8');

const startIndex = content.indexOf("const renderSharedSettings = (tabType: 'image' | 'text') => {");
const endIndex = content.indexOf("return (\n    <div className={`w-full h-screen");

if (startIndex === -1 || endIndex === -1) {
    console.log("Could not find boundaries");
    process.exit(1);
}

const before = content.slice(0, startIndex);
const after = content.slice(endIndex);

const newRenderSharedSettings = `const renderSharedSettings = (tabType: 'image' | 'text') => {
    const blockId = selectedBlockId;
    const isImageBlock = ['bgWrapper', 'bgWrapper2', 'accent1', 'accent2'].includes(blockId || '');

    if (tabType === 'image' && !isImageBlock || tabType === 'text' && isImageBlock) {
      return null;
    }

    if (!blockId) return null;

    return (
      <details open className="group border-b border-[#1e252e]">
        <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-[#1a1f26] transition-colors">
          <span className="text-[10px] font-bold tracking-[0.2em]">{blockNames[blockId]} STYLES</span>
          <svg className="w-3 h-3 transition-transform group-open:rotate-90 text-[#8a95a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </summary>
        
        <div className="px-6 pb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold tracking-widest opacity-60">Z-INDEX (LAYER)</span>
            </div>
            <div className="flex gap-1">
              {[{id: 0, label: 'BACK'}, {id: 10, label: 'MID'}, {id: 20, label: 'FRONT'}, {id: 30, label: 'TOP'}].map(z => {
                const currentStyles = blockStyles[\`\${stylePattern}-\${orientation}\`] || {};
                const currentZ = currentStyles[blockId]?.zIndex;
                const isActive = currentZ !== undefined ? currentZ === z.id : blockId === 'bgWrapper' ? z.id === 0 : false;
                return (
                  <button key={z.id} className={\`flex-1 py-1 text-[9px] font-bold transition-all \${isActive ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}\`} onClick={(e) => {e.stopPropagation();handleBlockStyleChange('zIndex', z.id, blockId);}}>
                    {z.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
            <div className="flex-1">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">SCALE ({blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.scale || 100}%)</div>
              <input
                type="range"
                min="10" max="400" step="5"
                className="w-full accent-[#00ffff] mt-1"
                value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.scale || 100}
                onChange={(e) => handleBlockStyleChange('scale', Number(e.target.value), blockId)} />
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
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
          </div>

          <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
            <div className="flex-[1.5]">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                <span>ROTATE ({blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.rotate || 0}°)</span>
                <span className="text-[#00ffff] cursor-pointer" onClick={(e) => {e.stopPropagation();handleBlockStyleChange('rotate', 0, blockId);}}>RESET</span>
              </div>
              <input
                type="range" min="-180" max="180" step="1"
                className="w-full accent-[#00ffff] mt-1"
                value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.rotate || 0}
                onChange={(e) => handleBlockStyleChange('rotate', Number(e.target.value), blockId)} />
            </div>
            <div className="flex-1 border-l border-[#1e252e] pl-2">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">OPACITY</div>
              <input
                type="range" min="0" max="100" step="5"
                className="w-full accent-[#00ffff] mt-1"
                value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.opacity !== undefined ? blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.opacity : 100}
                onChange={(e) => handleBlockStyleChange('opacity', Number(e.target.value), blockId)} />
            </div>
          </div>

          {['kicker', 'titleContainer', 'bodyContainer', 'body2Container', 'meta1', 'meta2'].includes(blockId) &&
          <>
              <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
                <div className="flex-1">
                  <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">{lang === 'jp' ? '文字の向き' : 'TEXT DIRECTION'}</div>
                  <div className="flex gap-1">
                    <button className={\`flex-1 py-1 text-[9px] font-bold transition-all \${(blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.writingMode || '') === '' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}\`} onClick={(e) => {e.stopPropagation();handleBlockStyleChange('writingMode', '', blockId);}}>HORIZ</button>
                    <button className={\`flex-1 py-1 text-[9px] font-bold transition-all \${(blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.writingMode || '') === 'vertical-rl' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}\`} onClick={(e) => {e.stopPropagation();handleBlockStyleChange('writingMode', 'vertical-rl', blockId);}}>VERT</button>
                  </div>
                </div>
                <div className="flex-1 border-l border-[#1e252e] pl-2">
                  <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">COLOR</div>
                  <div className="flex gap-1">
                     {['white', 'black', 'red', '#00ffff'].map(c => {
                       const isColorActive = blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.color === c;
                       return <button key={c} className={\`w-6 h-6 rounded-full border-2 \${isColorActive ? 'border-[#00ffff] scale-110' : 'border-transparent'}\`} style={{backgroundColor: c}} onClick={(e) => {e.stopPropagation();handleBlockStyleChange('color', c, blockId);}} />
                     })}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
                <div className="flex-1">
                  <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                     <span>LINE HEIGHT</span>
                     <span className="text-[#00ffff]">{blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.lineHeight || 'AUTO'}</span>
                  </div>
                  <input
                    type="range" min="0.5" max="3" step="0.1"
                    className="w-full accent-[#00ffff] mt-1"
                    value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.lineHeight || 1.5}
                    onChange={(e) => handleBlockStyleChange('lineHeight', Number(e.target.value), blockId)} />
                </div>
                <div className="flex-1 border-l border-[#1e252e] pl-2">
                   <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                     <span>LETTER SPACING</span>
                     <span className="text-[#00ffff]">{blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.letterSpacing || 'AUTO'}</span>
                  </div>
                  <input
                    type="range" min="-0.2" max="1" step="0.05"
                    className="w-full accent-[#00ffff] mt-1"
                    value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.letterSpacing || 0}
                    onChange={(e) => handleBlockStyleChange('letterSpacing', Number(e.target.value), blockId)} />
                </div>
              </div>
          </>
          }

          {['bgWrapper', 'bgWrapper2', 'accent1', 'accent2'].includes(blockId) &&
            <>
              <div className="flex flex-col gap-2 pt-2 border-t border-[#1e252e]">
                <div className="w-full">
                  <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">BORDER SETTINGS</div>
                  <div className="flex gap-2 mb-2 items-center">
                    <span className="text-[9px] text-[#8a95a3]">COLOR:</span>
                    <div className="flex gap-1">
                      <button className={\`w-5 h-5 rounded border \${blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.isBorderColorOff ? 'border-[#00ffff]' : 'border-transparent'}\`} onClick={(e) => {e.stopPropagation();handleBlockStyleChange('isBorderColorOff', true, blockId);}}>
                        <div className="w-full h-full border border-red-500 relative"><div className="absolute inset-0 bg-red-500 w-[1px] rotate-45 left-1/2 -translate-x-1/2"></div></div>
                      </button>
                      {['white', 'black', 'red', '#00ffff'].map(c => {
                       const isColorActive = blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.borderColor === c && !blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.isBorderColorOff;
                       return <button key={c} className={\`w-5 h-5 rounded border \${isColorActive ? 'border-[#00ffff] scale-110' : 'border-transparent'}\`} style={{backgroundColor: c}} onClick={(e) => {e.stopPropagation();handleBlockStyleChange('isBorderColorOff', false, blockId); handleBlockStyleChange('borderColor', c, blockId);}} />
                     })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="text-[8px] flex justify-between"><span>WIDTH</span><span className="text-[#00ffff]">{blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.borderWidth || 0}px</span></div>
                      <input
                      type="range" min="0" max="40" step="1"
                      className="w-full accent-[#00ffff]"
                      value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.borderWidth || 0}
                      onChange={(e) => handleBlockStyleChange('borderWidth', Number(e.target.value), blockId)} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[8px] flex justify-between"><span>RADIUS</span><span className="text-[#00ffff]">{blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.borderRadius || 0}px</span></div>
                      <input
                      type="range" min="0" max="200" step="2"
                      className="w-full accent-[#00ffff]"
                      value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.borderRadius || 0}
                      onChange={(e) => handleBlockStyleChange('borderRadius', Number(e.target.value), blockId)} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2 border-t border-[#1e252e]">
                <div className="w-full flex items-center justify-between mb-1">
                  <div className="text-[8px] font-bold tracking-widest opacity-60">BACKGROUND COLOR</div>
                  <div className="flex gap-1 items-center">
                    <span className="text-[8px]">OFF</span>
                    <input type="checkbox" className="accent-[#00ffff]" checked={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.isBgColorOff || false} onChange={(e) => {e.stopPropagation();handleBlockStyleChange('isBgColorOff', e.target.checked, blockId)}} />
                  </div>
                </div>
                {!blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.isBgColorOff &&
                <div className="flex gap-1">
                    {['transparent', 'white', 'black', '#111', '#eee', 'red', '#00ffff'].map(c => {
                       const isColorActive = blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.backgroundColor === c;
                       return <button key={c} className={\`w-5 h-5 rounded border \${isColorActive ? 'border-[#00ffff] scale-110' : 'border-transparent'}\`} style={{backgroundColor: c === 'transparent' ? '#333' : c}} onClick={(e) => {e.stopPropagation();handleBlockStyleChange('backgroundColor', c, blockId);}}>
                         {c === 'transparent' && <div className="w-full h-full border border-gray-500 relative opacity-50"><div className="absolute inset-0 bg-gray-500 w-[1px] rotate-45 left-1/2 -translate-x-1/2"></div></div>}
                       </button>
                     })}
                </div>
                }
              </div>
              
              <div className="flex flex-col gap-2 pt-2 border-t border-[#1e252e]">
                <div className="w-full flex items-center justify-between mb-1">
                  <div className="text-[8px] font-bold tracking-widest opacity-60">DROP SHADOW</div>
                  <div className="flex gap-1 items-center">
                    <span className="text-[8px]">ON</span>
                    <input type="checkbox" className="accent-[#00ffff]" checked={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.isDropShadowOn || false} onChange={(e) => {e.stopPropagation();handleBlockStyleChange('isDropShadowOn', e.target.checked, blockId)}} />
                  </div>
                </div>
                {blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.isDropShadowOn &&
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="text-[8px] flex justify-between"><span>BLUR</span><span className="text-[#00ffff]">{blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.dropShadowBlur !== undefined ? blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.dropShadowBlur : 20}px</span></div>
                      <input
                      type="range" min="0" max="100" step="1"
                      className="w-full accent-[#00ffff]"
                      value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.dropShadowBlur !== undefined ? blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.dropShadowBlur : 20}
                      onChange={(e) => handleBlockStyleChange('dropShadowBlur', Number(e.target.value), blockId)} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[8px] flex justify-between"><span>Y-OFFSET</span><span className="text-[#00ffff]">{blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.dropShadowY !== undefined ? blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.dropShadowY : 10}px</span></div>
                      <input
                      type="range" min="-40" max="40" step="1"
                      className="w-full accent-[#00ffff]"
                      value={blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.dropShadowY !== undefined ? blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.dropShadowY : 10}
                      onChange={(e) => handleBlockStyleChange('dropShadowY', Number(e.target.value), blockId)} />
                    </div>
                  </div>
                }
              </div>
            </>
          }
          <div className="flex flex-col gap-2 pt-2 border-t border-[#1e252e]">
            <div className="w-full">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">BG BLUR</div>
              <div className="flex gap-1 overflow-x-auto">
                 {['', 'light', 'dark'].map((blur) => {
                  const isActive = (blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.bgBlur || '') === blur;
                  return (
                    <button key={blur} className={\`flex-1 py-1 text-[9px] font-bold transition-all flex items-center justify-center min-w-[32px] \${isActive ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}\`} onClick={(e) => {e.stopPropagation();handleBlockStyleChange('bgBlur', blur, blockId);}}>
                       {blur === '' ? 'OFF' : blur.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </details>
    );
  };
`;

fs.writeFileSync('App.tsx', before + newRenderSharedSettings + after);
