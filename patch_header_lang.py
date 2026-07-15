import re

with open('App.tsx', 'r') as f:
    content = f.read()

header_regex = re.compile(
    r'\{\/\* Theme Toggles \*\/\}[\s\S]*?\{\/\* Settings Button \*\/\}'
)

header_replacement = """{/* Theme Toggles */}
                 <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold tracking-widest text-[#4e5d74] mr-2">{lang === 'jp' ? 'テーマ' : 'THEME'}</span>
                    <button 
                      onClick={() => setThemeMode(prev => prev === 'dark' ? 'mono' : (prev === 'mono' ? 'red' : 'dark'))} 
                      className="w-[60px] text-center py-1.5 bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold text-[#00ffff] uppercase hover:bg-[#2d3640] transition-colors"
                    >
                      {lang === 'jp' ? (themeMode === 'dark' ? 'ダーク' : themeMode === 'mono' ? 'モノ' : 'レッド') : themeMode}
                    </button>
                 </div>

                 {/* Artboard Scale */}
                 <div className="flex items-center gap-3 border-l border-[#1e252e] pl-6">
                    <span className="text-[9px] font-bold tracking-widest text-[#4e5d74] mr-1">{lang === 'jp' ? 'ズーム' : 'SCALE'}</span>
                    <input 
                      type="range" 
                      min="10" 
                      max="300" 
                      value={artboardScaleParam}
                      onChange={(e) => setArtboardScaleParam(Number(e.target.value))}
                      className="w-[100px] accent-[#00ffff] h-1 bg-[#1e252e] rounded-lg "
                    />
                    <span className="text-[9px] font-bold text-[#00ffff] w-[30px] text-right">{Math.round(artboardScaleParam)}%</span>
                 </div>

                 {/* Sidebar Position */}
                 <div className="flex items-center gap-2 border-l border-[#1e252e] pl-6">
                    <span className="text-[9px] font-bold tracking-widest text-[#4e5d74] mr-2">{lang === 'jp' ? 'サイドバー' : 'SIDEBAR'}</span>
                    <div className="flex bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold p-0.5">
                      <button onClick={() => setSidebarPosition('left')} className={`px-4 py-1.5 rounded-sm transition-colors ${sidebarPosition === 'left' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '左' : 'LEFT'}</button>
                      <button onClick={() => setSidebarPosition('right')} className={`px-4 py-1.5 rounded-sm transition-colors ${sidebarPosition === 'right' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '右' : 'RIGHT'}</button>
                    </div>
                 </div>

                 {/* Language */}
                 <div className="flex items-center gap-2 border-l border-[#1e252e] pl-6">
                    <span className="text-[9px] font-bold tracking-widest text-[#4e5d74] mr-2">{lang === 'jp' ? '言語' : 'LANG'}</span>
                    <div className="flex bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold p-0.5">
                      <button onClick={() => setLang('en')} className={`px-3 py-1.5 rounded-sm transition-colors ${lang === 'en' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>EN</button>
                      <button onClick={() => setLang('jp')} className={`px-3 py-1.5 rounded-sm transition-colors ${lang === 'jp' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>JP</button>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 border-l border-[#1e252e] pl-6">
                    {/* Settings Button */}"""

content = header_regex.sub(header_replacement, content)

with open('App.tsx', 'w') as f:
    f.write(content)
