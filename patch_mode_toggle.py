import re

with open('App.tsx', 'r') as f:
    content = f.read()

toggle_html = """                 {/* Mode Toggle */}
                 <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold tracking-widest text-[#4e5d74] mr-2">{lang === 'jp' ? 'モード' : 'MODE'}</span>
                    <div className="flex bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold p-0.5">
                      <button onClick={() => setIsEditMode(true)} className={`px-3 py-1.5 rounded-sm transition-colors ${isEditMode ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '編集' : 'EDIT'}</button>
                      <button onClick={() => setIsEditMode(false)} className={`px-3 py-1.5 rounded-sm transition-colors ${!isEditMode ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? 'プレビュー' : 'PREVIEW'}</button>
                    </div>
                 </div>
                 {/* Theme Toggles */}
                 <div className="flex items-center gap-2 border-l border-[#1e252e] pl-6">"""

content = content.replace(
    '                 {/* Theme Toggles */}\n                 <div className="flex items-center gap-2">',
    toggle_html
)

with open('App.tsx', 'w') as f:
    f.write(content)
