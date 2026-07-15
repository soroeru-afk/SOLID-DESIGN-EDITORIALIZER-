import re

with open('App.tsx', 'r') as f:
    content = f.read()

# 1. Update accent1
accent1_old = """            scale={blockStyles['accent1']?.scale ? blockStyles['accent1'].scale / 100 : 1}
            rotate={blockStyles['accent1']?.rotate || 0}
            width={blockStyles['accent1']?.width}
            height={blockStyles['accent1']?.height}
            style={{ 
              pointerEvents: isEditMode ? 'auto' : 'none', 
              backgroundColor: blockStyles['accent1']?.color || undefined, borderColor: blockStyles['accent1']?.color || undefined, color: blockStyles['accent1']?.color || undefined, 
              zIndex: blockStyles['accent1']?.zIndex !== undefined ? blockStyles['accent1'].zIndex : undefined,
              display: (blockStyles['accent1']?.color || isEditMode) ? 'block' : undefined
            }}"""

accent1_new = """            scale={blockStyles['accent1']?.scale ? blockStyles['accent1'].scale / 100 : 1}
            rotate={blockStyles['accent1']?.rotate || 0}
            width={blockStyles['accent1']?.width}
            height={blockStyles['accent1']?.height}
            centerOrigin={true}
            style={{ 
              pointerEvents: isEditMode ? 'auto' : 'none', 
              backgroundColor: blockStyles['accent1']?.backgroundColor || blockStyles['accent1']?.color || undefined, 
              borderColor: blockStyles['accent1']?.borderColor || blockStyles['accent1']?.color || undefined, 
              color: blockStyles['accent1']?.color || undefined, 
              borderWidth: blockStyles['accent1']?.borderWidth !== undefined ? `${blockStyles['accent1'].borderWidth}px` : undefined,
              opacity: blockStyles['accent1']?.opacity !== undefined ? blockStyles['accent1'].opacity / 100 : undefined,
              zIndex: blockStyles['accent1']?.zIndex !== undefined ? blockStyles['accent1'].zIndex : undefined,
              display: (blockStyles['accent1']?.backgroundColor || blockStyles['accent1']?.borderColor || blockStyles['accent1']?.color || isEditMode) ? 'block' : undefined
            }}"""

content = content.replace(accent1_old, accent1_new)

# 2. Update accent2
accent2_old = """            scale={blockStyles['accent2']?.scale ? blockStyles['accent2'].scale / 100 : 1}
            rotate={blockStyles['accent2']?.rotate || 0}
            width={blockStyles['accent2']?.width}
            height={blockStyles['accent2']?.height}
            style={{ 
              pointerEvents: isEditMode ? 'auto' : 'none', 
              backgroundColor: blockStyles['accent2']?.color || undefined, borderColor: blockStyles['accent2']?.color || undefined, color: blockStyles['accent2']?.color || undefined, 
              zIndex: blockStyles['accent2']?.zIndex !== undefined ? blockStyles['accent2'].zIndex : undefined,
              display: (blockStyles['accent2']?.color || isEditMode) ? 'block' : undefined
            }}"""

accent2_new = """            scale={blockStyles['accent2']?.scale ? blockStyles['accent2'].scale / 100 : 1}
            rotate={blockStyles['accent2']?.rotate || 0}
            width={blockStyles['accent2']?.width}
            height={blockStyles['accent2']?.height}
            centerOrigin={true}
            style={{ 
              pointerEvents: isEditMode ? 'auto' : 'none', 
              backgroundColor: blockStyles['accent2']?.backgroundColor || blockStyles['accent2']?.color || undefined, 
              borderColor: blockStyles['accent2']?.borderColor || blockStyles['accent2']?.color || undefined, 
              color: blockStyles['accent2']?.color || undefined, 
              borderWidth: blockStyles['accent2']?.borderWidth !== undefined ? `${blockStyles['accent2'].borderWidth}px` : undefined,
              opacity: blockStyles['accent2']?.opacity !== undefined ? blockStyles['accent2'].opacity / 100 : undefined,
              zIndex: blockStyles['accent2']?.zIndex !== undefined ? blockStyles['accent2'].zIndex : undefined,
              display: (blockStyles['accent2']?.backgroundColor || blockStyles['accent2']?.borderColor || blockStyles['accent2']?.color || isEditMode) ? 'block' : undefined
            }}"""

content = content.replace(accent2_old, accent2_new)

# 3. Hide COLOR for isImageBlock
color_section_old = """          <div className="flex flex-col gap-2 border-t border-[#1e252e] pt-3">
            <div className="w-full">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">COLOR</div>"""

color_section_new = """          <div className="flex flex-col gap-2 border-t border-[#1e252e] pt-3">
            {!isImageBlock && (
              <div className="w-full">
                <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">COLOR</div>"""

content = content.replace(color_section_old, color_section_new)

# Find the end of COLOR section to close the condition
# The structure is:
# <div className="w-full"> ... COLOR stuff ... </div>
# <div className="w-full pt-2"> ... TEXT ALIGN stuff ... </div>
color_end_old = """                  </label>
               </div>
            </div>
            
            <div className="w-full pt-2 border-t border-[#1e252e] flex items-center justify-between">"""

color_end_new = """                  </label>
               </div>
              </div>
            )}
            
            <div className="w-full pt-2 border-t border-[#1e252e] flex items-center justify-between">"""

content = content.replace(color_end_old, color_end_new)


with open('App.tsx', 'w') as f:
    f.write(content)
