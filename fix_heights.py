import re

with open('App.tsx', 'r') as f:
    content = f.read()

# 1. DESIGN MODE badge
old_badge = """                          <div className="px-3 py-1.5 text-[9px] font-bold tracking-widest flex items-center gap-2 rounded-full bg-[#111418] border border-[#2d3640] text-[#00ffff] shadow-sm">"""
new_badge = """                          <div className="h-[28px] px-3 text-[9px] font-bold tracking-widest flex items-center gap-2 rounded-full bg-[#111418] border border-[#2d3640] text-[#00ffff] shadow-sm">"""
content = content.replace(old_badge, new_badge)

# 2. Mode toggle
old_mode = """                    <div className="flex bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold p-0.5">
                      <button onClick={() => setIsEditMode(true)} className={`px-3 py-1.5 rounded-sm transition-colors ${isEditMode ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '編集' : 'EDIT'}</button>
                      <button onClick={() => { setIsEditMode(false); setSelectedBlockId(null); }} className={`px-3 py-1.5 rounded-sm transition-colors ${!isEditMode ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? 'プレビュー' : 'PREVIEW'}</button>
                    </div>"""
new_mode = """                    <div className="flex bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold p-0.5 h-[28px]">
                      <button onClick={() => setIsEditMode(true)} className={`px-3 h-full flex items-center justify-center rounded-sm transition-colors ${isEditMode ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '編集' : 'EDIT'}</button>
                      <button onClick={() => { setIsEditMode(false); setSelectedBlockId(null); }} className={`px-3 h-full flex items-center justify-center rounded-sm transition-colors ${!isEditMode ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? 'プレビュー' : 'PREVIEW'}</button>
                    </div>"""
content = content.replace(old_mode, new_mode)

# 3. Sidebar position
old_sidebar = """                    <div className="flex bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold p-0.5">
                      <button onClick={() => setSidebarPosition('left')} className={`px-4 py-1.5 rounded-sm transition-colors ${sidebarPosition === 'left' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '左' : 'LEFT'}</button>
                      <button onClick={() => setSidebarPosition('right')} className={`px-4 py-1.5 rounded-sm transition-colors ${sidebarPosition === 'right' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '右' : 'RIGHT'}</button>
                    </div>"""
new_sidebar = """                    <div className="flex bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold p-0.5 h-[28px]">
                      <button onClick={() => setSidebarPosition('left')} className={`px-4 h-full flex items-center justify-center rounded-sm transition-colors ${sidebarPosition === 'left' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '左' : 'LEFT'}</button>
                      <button onClick={() => setSidebarPosition('right')} className={`px-4 h-full flex items-center justify-center rounded-sm transition-colors ${sidebarPosition === 'right' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '右' : 'RIGHT'}</button>
                    </div>"""
content = content.replace(old_sidebar, new_sidebar)

# 4. Theme button
old_theme = """                      className="flex items-center gap-2 px-3 py-1.5 bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold text-[#8a95a3] hover:text-[#e2e8f0] hover:bg-[#2d3640] transition-colors uppercase"
                    >
                      <Palette size={12} className="text-[#4e5d74]" />"""
new_theme = """                      className="flex items-center gap-2 px-3 h-[28px] bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold text-[#8a95a3] hover:text-[#e2e8f0] hover:bg-[#2d3640] transition-colors uppercase"
                    >
                      <Palette size={14} className="text-[#4e5d74]" />"""
content = content.replace(old_theme, new_theme)


# 5. Icon buttons at the end
old_icons = """                 <div className="flex items-center gap-3 border-l border-[#1e252e] pl-6">
                    {/* Settings Button */}
                    <button 
                      className="p-1.5 text-[#8a95a3] hover:text-[#e2e8f0] bg-[#111418] hover:bg-[#2d3640] border border-[#1e252e] rounded-md transition-colors"
                      onClick={() => setIsGlobalSettingsOpen(prev => !prev)}
                      title="Global Settings"
                    >
                      <Settings size={16} />
                    </button>
                    
                    {/* Fullscreen Button */}
                    <button 
                      className="p-1.5 text-[#8a95a3] hover:text-[#e2e8f0] bg-[#111418] hover:bg-[#2d3640] border border-[#1e252e] rounded-md transition-colors"
                      onClick={() => {
                        if (!document.fullscreenElement) {
                          document.documentElement.requestFullscreen();
                        } else {
                          document.exitFullscreen();
                        }
                      }}
                      title="Toggle Fullscreen"
                    >
                      <Maximize size={16} />
                    </button>

                    {/* Hide UI Button */}
                    <button 
                      className="p-1.5 text-[#8a95a3] hover:text-[#e2e8f0] bg-[#111418] hover:bg-[#2d3640] border border-[#1e252e] rounded-md transition-colors"
                      onClick={() => setIsUIHidden(true)}
                      title="Hide UI"
                    >
                      <ChevronUp size={16} />
                    </button>
                 </div>"""
new_icons = """                 <div className="flex items-center gap-3 border-l border-[#1e252e] pl-6">
                    {/* Settings Button */}
                    <button 
                      className="h-[28px] w-[28px] flex items-center justify-center text-[#8a95a3] hover:text-[#e2e8f0] bg-[#111418] hover:bg-[#2d3640] border border-[#1e252e] rounded-md transition-colors"
                      onClick={() => setIsGlobalSettingsOpen(prev => !prev)}
                      title="Global Settings"
                    >
                      <Settings size={14} />
                    </button>
                    
                    {/* Fullscreen Button */}
                    <button 
                      className="h-[28px] w-[28px] flex items-center justify-center text-[#8a95a3] hover:text-[#e2e8f0] bg-[#111418] hover:bg-[#2d3640] border border-[#1e252e] rounded-md transition-colors"
                      onClick={() => {
                        if (!document.fullscreenElement) {
                          document.documentElement.requestFullscreen();
                        } else {
                          document.exitFullscreen();
                        }
                      }}
                      title="Toggle Fullscreen"
                    >
                      <Maximize size={14} />
                    </button>

                    {/* Hide UI Button */}
                    <button 
                      className="h-[28px] w-[28px] flex items-center justify-center text-[#8a95a3] hover:text-[#e2e8f0] bg-[#111418] hover:bg-[#2d3640] border border-[#1e252e] rounded-md transition-colors"
                      onClick={() => setIsUIHidden(true)}
                      title="Hide UI"
                    >
                      <ChevronUp size={16} />
                    </button>
                 </div>"""
content = content.replace(old_icons, new_icons)

with open('App.tsx', 'w') as f:
    f.write(content)
