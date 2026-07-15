import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Replace BG COLOR
content = content.replace(
"""               <div className="flex-1 border-l border-[#1e252e] pl-2 flex flex-col justify-center">
                 <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">BG COLOR</div>
                 <div className="flex gap-1 h-[21px]">
                   <button
                     className={`px-2 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.backgroundColor === 'transparent' || !blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.backgroundColor) ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                     onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('backgroundColor', 'transparent', blockId); }}
                   >OFF</button>
                   <label className="flex-1 relative flex items-center justify-center bg-[#080a0d] border border-[#1e252e] rounded overflow-hidden cursor-pointer hover:border-[#4e5d74]">
                     <div className="w-full h-full" style={{ backgroundColor: blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.backgroundColor || 'transparent' }} />
                     <input 
                       type="color" 
                       className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                       value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.backgroundColor || '#000000'}
                       onChange={(e) => { e.stopPropagation(); handleBlockStyleChange('backgroundColor', e.target.value, blockId); }}
                     />
                   </label>
                 </div>
              </div>""",
"""               <div className="flex-1 border-l border-[#1e252e] pl-2 flex flex-col justify-center">
                 <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">BG COLOR</div>
                 <div className="flex gap-1 h-[21px]">
                   <button
                     className={`px-2 text-[9px] font-bold rounded transition-all ${blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.isBgColorOff ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                     onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('isBgColorOff', !blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.isBgColorOff, blockId); }}
                   >OFF</button>
                   <label className={`flex-1 relative flex items-center justify-center bg-[#080a0d] border border-[#1e252e] rounded overflow-hidden cursor-pointer hover:border-[#4e5d74] ${blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.isBgColorOff ? 'opacity-30' : ''}`}>
                     <div className="w-full h-full" style={{ backgroundColor: blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.isBgColorOff ? 'transparent' : (blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.backgroundColor || 'transparent') }} />
                     <input 
                       type="color" 
                       className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                       value={blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.backgroundColor || '#000000'}
                       onChange={(e) => { 
                         e.stopPropagation(); 
                         handleBlockStyleChange('isBgColorOff', false, blockId);
                         setTimeout(() => handleBlockStyleChange('backgroundColor', e.target.value, blockId), 0);
                       }}
                     />
                   </label>
                 </div>
              </div>""".replace('f"{', '`${').replace('}"', '}`'))

# Replace BORDER COLOR
content = content.replace(
"""               <div className="flex-1 border-l border-[#1e252e] pl-2 flex flex-col justify-center">
                 <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">BORDER COLOR</div>
                 <div className="flex gap-1 h-[21px]">
                   <button
                     className={`px-2 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.borderColor === 'transparent' || !blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.borderColor) ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                     onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('borderColor', 'transparent', blockId); }}
                   >OFF</button>
                   <label className="flex-1 relative flex items-center justify-center bg-[#080a0d] border border-[#1e252e] rounded overflow-hidden cursor-pointer hover:border-[#4e5d74]">
                     <div className="w-full h-full" style={{ backgroundColor: blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.borderColor || 'transparent' }} />
                     <input 
                       type="color" 
                       className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                       value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.borderColor || '#ffffff'}
                       onChange={(e) => { e.stopPropagation(); handleBlockStyleChange('borderColor', e.target.value, blockId); }}
                     />
                   </label>
                 </div>
              </div>""",
"""               <div className="flex-1 border-l border-[#1e252e] pl-2 flex flex-col justify-center">
                 <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">BORDER COLOR</div>
                 <div className="flex gap-1 h-[21px]">
                   <button
                     className={`px-2 text-[9px] font-bold rounded transition-all ${blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.isBorderColorOff ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                     onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('isBorderColorOff', !blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.isBorderColorOff, blockId); }}
                   >OFF</button>
                   <label className={`flex-1 relative flex items-center justify-center bg-[#080a0d] border border-[#1e252e] rounded overflow-hidden cursor-pointer hover:border-[#4e5d74] ${blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.isBorderColorOff ? 'opacity-30' : ''}`}>
                     <div className="w-full h-full" style={{ backgroundColor: blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.isBorderColorOff ? 'transparent' : (blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.borderColor || 'transparent') }} />
                     <input 
                       type="color" 
                       className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                       value={blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.borderColor || '#ffffff'}
                       onChange={(e) => { 
                         e.stopPropagation(); 
                         handleBlockStyleChange('isBorderColorOff', false, blockId);
                         setTimeout(() => handleBlockStyleChange('borderColor', e.target.value, blockId), 0);
                       }}
                     />
                   </label>
                 </div>
              </div>""".replace('f"{', '`${').replace('}"', '}`'))

with open('App.tsx', 'w') as f:
    f.write(content)
