import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Fix 1: gridMode
content = content.replace(
"""              {gridMode !== 'none' && (
                  <div className="w-full h-full" style={{ backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: 0.8 }} />
                  {/* Safe area guides */}
                  <div className="absolute inset-[80px] border opacity-80" style={{ borderColor: gridColor }} />
                  <div className="absolute inset-0 flex justify-center"><div className="w-[1px] h-full opacity-80" style={{ backgroundColor: gridColor }} /></div>
                  <div className="absolute inset-0 flex flex-col justify-center"><div className="w-full h-[1px] opacity-80" style={{ backgroundColor: gridColor }} /></div>""",
"""              {gridMode !== 'none' && (
                <>
                  <div className="w-full h-full" style={{ backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: 0.8 }} />
                  {/* Safe area guides */}
                  <div className="absolute inset-[80px] border opacity-80" style={{ borderColor: gridColor }} />
                  <div className="absolute inset-0 flex justify-center"><div className="w-[1px] h-full opacity-80" style={{ backgroundColor: gridColor }} /></div>
                  <div className="absolute inset-0 flex flex-col justify-center"><div className="w-full h-[1px] opacity-80" style={{ backgroundColor: gridColor }} /></div>
                </>
              )}"""
)

# Fix 2: font dropdown
content = content.replace(
"""                {isFontDropdownOpen && (
                    <div className="fixed inset-0 z-[100]" onClick={(e) => { e.stopPropagation(); setIsFontDropdownOpen(false); }} />
                    <div className="absolute z-[101] w-[200px] right-0 mt-1 bg-[#111418] border border-[#1e252e] rounded shadow-xl max-h-[250px] overflow-y-auto">""",
"""                {isFontDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-[100]" onClick={(e) => { e.stopPropagation(); setIsFontDropdownOpen(false); }} />
                    <div className="absolute z-[101] w-[200px] right-0 mt-1 bg-[#111418] border border-[#1e252e] rounded shadow-xl max-h-[250px] overflow-y-auto">"""
)

content = content.replace(
"""                      ))}
                    </div>
                </div>
              </div>""",
"""                      ))}
                    </div>
                  </>
                )}
                </div>
              </div>"""
)

# Fix 3: textStroke
content = content.replace(
"""                  {(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke) ? (
                      <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                        <span>STROKE WIDTH</span>
                        <span className="text-[#00ffff]">{blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStrokeWidth || (blockId === 'titleContainer' ? 2 : blockId === 'kicker' ? 1 : 0.5)}px</span>
                      </div>
                      <input 
                        type="range" min="0.1" max="10" step="0.1" 
                        className="w-full accent-[#00ffff]"
                        value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStrokeWidth || (blockId === 'titleContainer' ? 2 : blockId === 'kicker' ? 1 : 0.5)}
                        onChange={(e) => handleBlockStyleChange('textStrokeWidth', Number(e.target.value), blockId)} 
                      />""",
"""                  {(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke) ? (
                    <>
                      <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                        <span>STROKE WIDTH</span>
                        <span className="text-[#00ffff]">{blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStrokeWidth || (blockId === 'titleContainer' ? 2 : blockId === 'kicker' ? 1 : 0.5)}px</span>
                      </div>
                      <input 
                        type="range" min="0.1" max="10" step="0.1" 
                        className="w-full accent-[#00ffff]"
                        value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStrokeWidth || (blockId === 'titleContainer' ? 2 : blockId === 'kicker' ? 1 : 0.5)}
                        onChange={(e) => handleBlockStyleChange('textStrokeWidth', Number(e.target.value), blockId)} 
                      />
                    </>"""
)

with open('App.tsx', 'w') as f:
    f.write(content)
