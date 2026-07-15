#!/bin/bash
cat << 'INNER_EOF' > append.txt
                      <button onClick={() => setStatusTheme('dark')} className={`flex-1 py-2 text-[10px] font-bold border rounded ${statusTheme === 'dark' ? 'bg-[#2d3640] text-[#00ffff] border-[#4e5d74]' : 'bg-[#0a0c10] text-[#8a95a3] border-[#1e252e] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? 'ダーク' : 'DARK'}</button>
                      <button onClick={() => setStatusTheme('light')} className={`flex-1 py-2 text-[10px] font-bold border rounded ${statusTheme === 'light' ? 'bg-[#2d3640] text-[#00ffff] border-[#4e5d74]' : 'bg-[#0a0c10] text-[#8a95a3] border-[#1e252e] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? 'ライト' : 'LIGHT'}</button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-[9px] font-bold tracking-widest text-[#4e5d74] mb-2 uppercase">{lang === 'jp' ? 'サイドバー位置' : 'Sidebar Position'}</div>
                <div className="flex gap-2">
                  <button onClick={() => setSidebarPosition('left')} className={`flex-1 py-2 text-[10px] font-bold border rounded ${sidebarPosition === 'left' ? 'bg-[#2d3640] text-[#00ffff] border-[#4e5d74]' : 'bg-[#0a0c10] text-[#8a95a3] border-[#1e252e] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '左' : 'LEFT'}</button>
                  <button onClick={() => setSidebarPosition('right')} className={`flex-1 py-2 text-[10px] font-bold border rounded ${sidebarPosition === 'right' ? 'bg-[#2d3640] text-[#00ffff] border-[#4e5d74]' : 'bg-[#0a0c10] text-[#8a95a3] border-[#1e252e] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '右' : 'RIGHT'}</button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
INNER_EOF
sed -i '2088r append.txt' App.tsx
