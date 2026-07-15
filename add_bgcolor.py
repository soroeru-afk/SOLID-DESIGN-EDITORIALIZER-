import re

with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

bg_color_picker = """
               <div className="flex-1 border-l border-[#1e252e] pl-2 flex flex-col justify-center">
                 <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">BG COLOR</div>
                 <div className="flex gap-1 h-[21px]">
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
              </div>
"""

border_color_html = """               <div className="flex-1 border-l border-[#1e252e] pl-2 flex flex-col justify-center">
                 <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">BORDER COLOR</div>"""

if bg_color_picker not in content:
    content = content.replace(border_color_html, bg_color_picker + border_color_html)

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully")
