import re

with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add FONT_OPTIONS at the top of App.tsx (after imports)
font_options_code = """
const FONT_OPTIONS = [
  { value: '', label: 'AUTO' },
  { value: 'Meiryo, sans-serif', label: 'MEIRYO (メイリオ)' },
  { value: '"Yu Gothic", "YuGothic", "Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif', label: 'STANDARD GOTHIC (ゴシック体)' },
  { value: '"M PLUS Rounded 1c", sans-serif', label: 'ROUNDED GOTHIC (丸ゴシック)' },
  { value: '"Zen Maru Gothic", sans-serif', label: 'ZEN MARU GOTHIC' },
  { value: '"Dela Gothic One", sans-serif', label: 'DELA GOTHIC' },
  { value: '"Train One", sans-serif', label: 'TRAIN ONE' },
  { value: '"Reggae One", sans-serif', label: 'REGGAE ONE' },
  { value: '"DotGothic16", sans-serif', label: 'DOT GOTHIC' },
  { value: '"M PLUS 1p", sans-serif', label: 'M PLUS 1P' },
  { value: '"Noto Sans JP", sans-serif', label: 'NOTO SANS' },
  { value: '"Noto Serif JP", serif', label: 'NOTO SERIF' },
  { value: '"Shippori Mincho", serif', label: 'SHIPPORI' },
  { value: '"Zen Dots", sans-serif', label: 'ZEN DOTS' }
];
"""
if "const FONT_OPTIONS" not in content:
    content = content.replace("const DEFAULT_KICKER", font_options_code + "\nconst DEFAULT_KICKER")

select_code = """                <select 
                  className="w-full bg-transparent text-white p-1 pr-6 appearance-none text-[9px] outline-none cursor-pointer"
                  value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.fontFamily || ''}
                  onChange={(e) => { e.stopPropagation(); handleBlockStyleChange('fontFamily', e.target.value, blockId); }}
                  style={{ fontFamily: blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.fontFamily || 'inherit' }}
                >
                   <option value="" style={{fontFamily: 'inherit', color: 'white', backgroundColor: 'black'}}>AUTO</option>
                   <option value='Meiryo, sans-serif' style={{fontFamily: 'Meiryo, sans-serif', color: 'white', backgroundColor: 'black'}}>MEIRYO &nbsp; (メイリオ)</option>
                   <option value='"Yu Gothic", "YuGothic", "Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif' style={{fontFamily: '"Yu Gothic", "YuGothic", "Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif', color: 'white', backgroundColor: 'black'}}>STANDARD GOTHIC &nbsp; (ゴシック体)</option>
                   <option value='"M PLUS Rounded 1c", sans-serif' style={{fontFamily: '"M PLUS Rounded 1c", sans-serif', color: 'white', backgroundColor: 'black'}}>ROUNDED GOTHIC &nbsp; (丸ゴシック)</option>
                   <option value='"Zen Maru Gothic", sans-serif' style={{fontFamily: '"Zen Maru Gothic", sans-serif', color: 'white', backgroundColor: 'black'}}>ZEN MARU GOTHIC</option>
                   <option value='"Dela Gothic One", sans-serif' style={{fontFamily: '"Dela Gothic One", sans-serif', color: 'white', backgroundColor: 'black'}}>DELA GOTHIC</option>
                   <option value='"Train One", sans-serif' style={{fontFamily: '"Train One", sans-serif', color: 'white', backgroundColor: 'black'}}>TRAIN ONE</option>
                   <option value='"Reggae One", sans-serif' style={{fontFamily: '"Reggae One", sans-serif', color: 'white', backgroundColor: 'black'}}>REGGAE ONE</option>
                   <option value='"DotGothic16", sans-serif' style={{fontFamily: '"DotGothic16", sans-serif', color: 'white', backgroundColor: 'black'}}>DOT GOTHIC</option>
                   <option value='"M PLUS 1p", sans-serif' style={{fontFamily: '"M PLUS 1p", sans-serif', color: 'white', backgroundColor: 'black'}}>M PLUS 1P</option>
                   <option value='"Noto Sans JP", sans-serif' style={{fontFamily: '"Noto Sans JP", sans-serif', color: 'white', backgroundColor: 'black'}}>NOTO SANS</option>
                   <option value='"Noto Serif JP", serif' style={{fontFamily: '"Noto Serif JP", serif', color: 'white', backgroundColor: 'black'}}>NOTO SERIF</option>
                   <option value='"Shippori Mincho", serif' style={{fontFamily: '"Shippori Mincho", serif', color: 'white', backgroundColor: 'black'}}>SHIPPORI</option>
                   <option value='"Zen Dots", sans-serif' style={{fontFamily: '"Zen Dots", sans-serif', color: 'white', backgroundColor: 'black'}}>ZEN DOTS</option>
                </select>
                <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none text-[#8a95a3]">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>"""

new_code = """                <div 
                  className="w-full bg-transparent text-white p-1 pr-6 text-[9px] cursor-pointer flex items-center justify-between"
                  onClick={(e) => { e.stopPropagation(); setIsFontDropdownOpen(!isFontDropdownOpen); }}
                  style={{ fontFamily: blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.fontFamily || 'inherit' }}
                >
                  <span className="truncate">{FONT_OPTIONS.find(f => f.value === (blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.fontFamily || ''))?.label || 'AUTO'}</span>
                  <svg className="w-3 h-3 text-[#8a95a3] shrink-0 absolute right-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                {isFontDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-[100]" onClick={(e) => { e.stopPropagation(); setIsFontDropdownOpen(false); }} />
                    <div className="absolute z-[101] w-[200px] right-0 mt-1 bg-[#111418] border border-[#1e252e] rounded shadow-xl max-h-[250px] overflow-y-auto">
                      {FONT_OPTIONS.map((f, i) => (
                        <div
                          key={i}
                          className="px-2 py-1.5 text-[9px] text-white hover:bg-[#2d3640] cursor-pointer"
                          style={{ fontFamily: f.value || 'inherit' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBlockStyleChange('fontFamily', f.value, blockId);
                            setIsFontDropdownOpen(false);
                          }}
                        >
                          {f.label}
                        </div>
                      ))}
                    </div>
                  </>
                )}"""

content = content.replace(select_code, new_code)

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
