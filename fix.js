const fs = require('fs');

const replacement = `
          <button 
            className={\`flex-1 py-3 text-xs font-bold tracking-widest transition-all \${activeTab === 'editor' ? 'text-white border-b-2 border-white' : 'text-[#4e5d74] hover:text-[#8a95a3]'}\`}
            onClick={() => setActiveTab('editor')}
          >
            DATA EDITOR
          </button>
          <button 
            className={\`flex-1 py-3 text-xs font-bold tracking-widest transition-all \${activeTab === 'design' ? 'text-white border-b-2 border-white' : 'text-[#4e5d74] hover:text-[#8a95a3]'}\`}
            onClick={() => setActiveTab('design')}
          >
            DESIGN SETTINGS
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 custom-scrollbar">
          {activeTab === 'editor' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="ss-label"><ImageIcon size={14}/><span>MAIN VISUAL</span></div>
                <div className="text-[9px] mb-1.5 font-bold tracking-widest opacity-60">IMAGE URL</div>
                <input type="text" className="ss-input rounded-md" value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} placeholder="https://..." />
              </div>
              
              <div className="space-y-4 pt-6 border-t border-[#1e252e]">
                <div className="ss-label"><Type size={14}/><span>TYPOGRAPHY DATA</span></div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[9px] mb-1.5 font-bold tracking-widest opacity-60">KICKER TAG</div>
                    <input type="text" className="ss-input rounded-md" value={kicker} onChange={(e)=>setKicker(e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <div className="text-[9px] mb-1.5 font-bold tracking-widest opacity-60">HEADLINE</div>
                    <textarea className="ss-input h-16 resize-none rounded-md" value={heading} onChange={(e)=>setHeading(e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <div className="text-[9px] mb-1.5 font-bold tracking-widest opacity-60">BODY TEXT (PARAGRAPHS = NEW LINE)</div>
                    <textarea className="ss-input h-32 resize-none rounded-md leading-relaxed text-[11px]" value={body} onChange={(e)=>setBody(e.target.value)} />
                  </div>
                  <div>
                    <div className="text-[9px] mb-1.5 font-bold tracking-widest opacity-60">META 1</div>
                    <input type="text" className="ss-input rounded-md" value={meta1} onChange={(e)=>setMeta1(e.target.value)} />
                  </div>
                  <div>
                    <div className="text-[9px] mb-1.5 font-bold tracking-widest opacity-60">META 2</div>
                    <input type="text" className="ss-input rounded-md" value={meta2} onChange={(e)=>setMeta2(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="ss-label"><Layout size={14}/><span>ORIENTATION</span></div>
                <div className="flex gap-2">
                  <button 
                    className={\`flex-1 py-2.5 text-[11px] font-bold tracking-widest rounded-md transition-all \${orientation === 'horizontal' ? 'bg-[#2d3640] text-white shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}\`}
                    onClick={() => setOrientation('horizontal')}
                  >
                    横組みレギュラー
                  </button>
                  <button 
                    className={\`flex-1 py-2.5 text-[11px] font-bold tracking-widest rounded-md transition-all \${orientation === 'vertical' ? 'bg-[#2d3640] text-white shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}\`}
                    onClick={() => setOrientation('vertical')}
                  >
                    縦組みエモーショナル
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="ss-label mb-0"><Grid size={14}/><span>FORMATION GRID</span></div>
                  <button 
                    className={\`px-1.5 py-1 text-[9px] font-bold tracking-widest rounded transition-all flex items-center justify-center gap-1 border \${isMonotone ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border-[#1e252e]'}\`}
                    onClick={() => setIsMonotone(!isMonotone)}
                  >
                    <ImageIcon size={10}/> \${isMonotone ? 'MONOTONE: ON' : 'MONOTONE: OFF'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'impact', label: 'IMPACT', desc: 'ダイナミック' },
                    { id: 'story', label: 'STORY', desc: 'エディトリアル' },
                    { id: 'gallery', label: 'GALLERY', desc: 'アートギャラリー' },
                    { id: 'magazine', label: 'MAGAZINE', desc: 'マガジン表紙風' },
                    { id: 'split', label: 'SPLIT', desc: '2分割コントラスト' }
                  ].map(f => (
                    <button 
                      key={f.id}
                      onClick={() => setStylePattern(f.id)}
                      className={\`flex flex-col p-2.5 border rounded-lg transition-all text-left \${
                        stylePattern === f.id 
                          ? 'border-[#8a95a3] bg-[#1a1f26]' 
                          : 'border-[#1e252e] bg-[#080a0d] hover:border-[#2d3a4d]'
                      }\`}
                    >
                      <span className={\`text-[11px] font-black tracking-widest \${stylePattern === f.id ? 'text-white' : 'text-[#8a95a3]'}\`}>{f.label}</span>
                      <span className="text-[9px] opacity-60 mt-0.5">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#1e252e]">
                <div className="ss-label flex justify-between items-center">
                  <span className="flex items-center gap-1"><Settings2 size={14}/><span>OPTIONS & GRID</span></span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => {
                        setIsEditMode(!isEditMode);
                        if (isEditMode) setSelectedBlockId(null);
                      }}>
                      <div className={\`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors \${isEditMode ? 'bg-[#00ffff]' : 'bg-[#1e252e]'}\`}>
                        <div className={\`w-3 h-3 rounded-full bg-white transition-transform \${isEditMode ? 'translate-x-4' : 'translate-x-0'}\`}/>
                      </div>
                      <span className="text-[9px] font-bold tracking-widest group-hover:text-white transition-colors">EDIT MODE</span>
                    </div>
                  </div>
                </div>

                <div className="flex bg-[#080a0d] p-1.5 rounded-lg border border-[#1e252e] gap-1.5 flex-wrap">
                  <button 
                    className={\`flex-1 min-w-[80px] py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 \${gridMode === 'none' ? 'bg-[#2d3640] text-white shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}\`}
                    onClick={() => setGridMode('none')}
                  >
                    <LayoutGrid size={12}/> NO GRID
                  </button>
                  <button 
                    className={\`flex-1 min-w-[70px] py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 \${gridMode === 'cyan' ? 'bg-[#2d3640] text-[#00ffff] shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}\`}
                    onClick={() => setGridMode('cyan')}
                  >
                    CYAN
                  </button>
                  <button 
                    className={\`flex-1 min-w-[70px] py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 \${gridMode === 'dark' ? 'bg-[#2d3640] text-[#a0aec0] shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}\`}
                    onClick={() => setGridMode('dark')}
                  >
                    DARK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-[#1e252e] bg-[#0a0c10] space-y-2">
`;

let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
  /<div className="flex border-b border-\[#1e252e\] bg-\[#0a0c10\]">[\s\S]*?<div className="grid grid-cols-2 gap-1\.5">/,
  '<div className="flex border-b border-[#1e252e] bg-[#0a0c10]">' + replacement + '<div className="grid grid-cols-2 gap-1.5">'
);

fs.writeFileSync('App.tsx', content);
