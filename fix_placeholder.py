import re

with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """            ) : (
              <div className="w-full h-full border border-dashed border-gray-500/50 flex items-center justify-center bg-gray-500/10 min-w-[100px] min-h-[100px]">
                <span className="text-gray-500 text-[10px] font-bold font-mono">IMAGE 2 AREA</span>
              </div>
            )}"""

replacement = """            ) : (
              isEditMode ? (
                <div className="w-full h-full border border-dashed border-gray-500/50 flex items-center justify-center bg-gray-500/10 min-w-[100px] min-h-[100px]">
                  <span className="text-gray-500 text-[10px] font-bold font-mono">IMAGE 2 AREA</span>
                </div>
              ) : (
                <div className="w-full h-full min-w-[10px] min-h-[10px]" />
              )
            )}"""

content = content.replace(target, replacement)

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated placeholder")
