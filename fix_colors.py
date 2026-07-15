import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Replace BG COLOR section
content = content.replace(
"""                 <div className="flex gap-1 h-[21px]">
                   <label className="flex-1 relative flex items-center justify-center bg-[#080a0d] border border-[#1e252e] rounded overflow-hidden cursor-pointer hover:border-[#4e5d74]">
                     <div className="w-full h-full" style={{ backgroundColor: blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.backgroundColor || 'transparent' }} />
                     <input
                        type="color"
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                       value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.backgroundColor || '#000000'}
                       onChange={(e) => { e.stopPropagation(); handleBlockStyleChange('backgroundColor', e.target.value, blockId); }}
                     />
                   </label>
                 </div>""",
"""                 <div className="flex gap-1 h-[21px]">
                   <button
                     className={`px-2 text-[9px] font-bold rounded transition-all ${(blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.backgroundColor === 'transparent' || !blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.backgroundColor) ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                     onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('backgroundColor', 'transparent', blockId); }}
                   >OFF</button>
                   <label className="flex-1 relative flex items-center justify-center bg-[#080a0d] border border-[#1e252e] rounded overflow-hidden cursor-pointer hover:border-[#4e5d74]">
                     <div className="w-full h-full" style={{ backgroundColor: blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.backgroundColor || 'transparent' }} />
                     <input
                        type="color"
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                       value={blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.backgroundColor || '#000000'}
                       onChange={(e) => { e.stopPropagation(); handleBlockStyleChange('backgroundColor', e.target.value, blockId); }}
                     />
                   </label>
                 </div>""".replace('f"{', '`${').replace('}"', '}`'))

# Replace BORDER COLOR section
content = content.replace(
"""                 <div className="flex gap-1 h-[21px]">
                   <label className="flex-1 relative flex items-center justify-center bg-[#080a0d] border border-[#1e252e] rounded overflow-hidden cursor-pointer hover:border-[#4e5d74]">
                     <div className="w-full h-full" style={{ backgroundColor: blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.borderColor || '#ffffff' }} />
                     <input
                        type="color"
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                       value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.borderColor || '#ffffff'}
                       onChange={(e) => { e.stopPropagation(); handleBlockStyleChange('borderColor', e.target.value, blockId); }}
                     />
                   </label>
                 </div>""",
"""                 <div className="flex gap-1 h-[21px]">
                   <button
                     className={`px-2 text-[9px] font-bold rounded transition-all ${(blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.borderColor === 'transparent' || !blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.borderColor) ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                     onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('borderColor', 'transparent', blockId); }}
                   >OFF</button>
                   <label className="flex-1 relative flex items-center justify-center bg-[#080a0d] border border-[#1e252e] rounded overflow-hidden cursor-pointer hover:border-[#4e5d74]">
                     <div className="w-full h-full" style={{ backgroundColor: blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.borderColor || '#ffffff' }} />
                     <input
                        type="color"
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                       value={blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.borderColor || '#ffffff'}
                       onChange={(e) => { e.stopPropagation(); handleBlockStyleChange('borderColor', e.target.value, blockId); }}
                     />
                   </label>
                 </div>""".replace('f"{', '`${').replace('}"', '}`'))

# Replace COLOR section
content = content.replace(
"""              <div className="flex gap-1 overflow-x-auto">
                 {[
                   { id: '', label: 'AUTO' },
                   { id: '#ffffff', label: 'W' },
                   { id: '#000000', label: 'B' },
                   { id: '#d94a38', label: 'R' },
                   { id: '#00ffff', label: 'C' }
                 ].map(c => {
                   const isActive = (blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.color || '') === c.id;
                   return (
                     <button 
                       key={c.id}
                       className={`flex-1 min-w-[20px] py-1 text-[9px] font-bold rounded transition-all ${isActive ? 'bg-[#2d3640] text-white shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0] bg-[#080a0d] border border-[#1e252e]'}`}
                       onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('color', c.id, blockId); }}
                     >
                       {c.label}
                     </button>
                   );
                 })}
                 <label className="flex-1 min-w-[20px] relative py-1 flex items-center justify-center rounded transition-all cursor-pointer border border-[#1e252e] hover:border-[#4d5e7a] bg-[#080a0d]">
                   <span className="text-[9px] font-bold text-[#8a95a3]">+</span>
                   <input 
                     type="color" 
                     className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                     value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.color || '#ffffff'}
                     onChange={(e) => { e.stopPropagation(); handleBlockStyleChange('color', e.target.value, blockId); }}
                   />
                 </label>
              </div>""",
"""              <div className="flex gap-1 overflow-x-auto h-[21px]">
                 <button 
                   className={`px-3 text-[9px] font-bold rounded transition-all ${(blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.color || '') === '' ? 'bg-[#00ffff] text-black shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0] bg-[#080a0d] border border-[#1e252e]'}`}
                   onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('color', '', blockId); }}
                 >
                   AUTO
                 </button>
                 <label className="flex-[2] relative flex items-center justify-center rounded transition-all cursor-pointer border border-[#1e252e] hover:border-[#4d5e7a] bg-[#080a0d]">
                   <div className="w-full h-full" style={{ backgroundColor: blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.color || 'transparent' }} />
                   <input 
                     type="color" 
                     className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                     value={blockStyles[f"{stylePattern}-{orientation}"]?.[blockId]?.color || '#ffffff'}
                     onChange={(e) => { e.stopPropagation(); handleBlockStyleChange('color', e.target.value, blockId); }}
                   />
                 </label>
              </div>""".replace('f"{', '`${').replace('}"', '}`'))

with open('App.tsx', 'w') as f:
    f.write(content)
