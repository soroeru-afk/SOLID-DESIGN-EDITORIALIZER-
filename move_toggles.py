import re

with open('App.tsx', 'r') as f:
    content = f.read()

theme_block = """                 {/* Theme Toggles */}
                 <div className="flex items-center gap-2 border-l border-[#1e252e] pl-6">
                    <span className="text-[9px] font-bold tracking-widest text-[#4e5d74] mr-2">{lang === 'jp' ? 'テーマ' : 'THEME'}</span>
                    <button 
                      onClick={() => setThemeMode(prev => prev === 'dark' ? 'mono' : (prev === 'mono' ? 'red' : 'dark'))} 
                      className="w-[60px] text-center py-1.5 bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold text-[#00ffff] uppercase hover:bg-[#2d3640] transition-colors"
                    >
                      {lang === 'jp' ? (themeMode === 'dark' ? 'ダーク' : themeMode === 'mono' ? 'モノ' : 'レッド') : themeMode}
                    </button>
                 </div>"""

lang_block = """                 {/* Language */}
                 <div className="flex items-center gap-2 border-l border-[#1e252e] pl-6">
                    <span className="text-[9px] font-bold tracking-widest text-[#4e5d74] mr-2">{lang === 'jp' ? '言語' : 'LANG'}</span>
                    <div className="flex bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold p-0.5">
                      <button onClick={() => setLang('en')} className={`px-3 py-1.5 rounded-sm transition-colors ${lang === 'en' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>EN</button>
                      <button onClick={() => setLang('jp')} className={`px-3 py-1.5 rounded-sm transition-colors ${lang === 'jp' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>JP</button>
                    </div>
                 </div>"""

# Remove Theme block from its current location
content = content.replace(theme_block + "\n", "")

# Replace Lang block with Theme block
content = content.replace(lang_block, theme_block)

# Add Lang block to Settings panel
settings_insert = """            <div className="p-5 flex-1 overflow-y-auto space-y-6">
              <div>
                <div className="text-[9px] font-bold tracking-widest text-[#4e5d74] mb-2 uppercase">{lang === 'jp' ? '言語' : 'Language'}</div>
                <div className="flex bg-[#111418] border border-[#1e252e] rounded text-[10px] font-bold p-1">
                  <button onClick={() => setLang('en')} className={`flex-1 py-2 rounded-sm transition-colors ${lang === 'en' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>ENGLISH</button>
                  <button onClick={() => setLang('jp')} className={`flex-1 py-2 rounded-sm transition-colors ${lang === 'jp' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>日本語</button>
                </div>
              </div>
              <div>
                <div className="text-[9px] font-bold tracking-widest text-[#4e5d74] mb-2 uppercase">{lang === 'jp' ? 'キャンバス背景色' : 'Canvas Background'}</div>"""

content = content.replace("""            <div className="p-5 flex-1 overflow-y-auto space-y-6">
              <div>
                <div className="text-[9px] font-bold tracking-widest text-[#4e5d74] mb-2 uppercase">{lang === 'jp' ? 'キャンバス背景色' : 'Canvas Background'}</div>""", settings_insert)

with open('App.tsx', 'w') as f:
    f.write(content)
