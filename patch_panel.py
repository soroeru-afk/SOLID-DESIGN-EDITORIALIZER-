import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Replace Theme Button width
theme_regex = re.compile(
    r'<button\s*onClick=\{\(\) => setThemeMode\(prev => prev === \'dark\' \? \'mono\' : \(prev === \'mono\' \? \'red\' : \'dark\'\)\)\}\s*className="px-4 py-1\.5 bg-\[\#111418\] border border-\[\#1e252e\] rounded text-\[9px\] font-bold text-\[\#00ffff\] uppercase hover:bg-\[\#2d3640\] transition-colors"\s*>'
)
theme_replacement = """<button 
                      onClick={() => setThemeMode(prev => prev === 'dark' ? 'mono' : (prev === 'mono' ? 'red' : 'dark'))} 
                      className="w-[60px] text-center py-1.5 bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold text-[#00ffff] uppercase hover:bg-[#2d3640] transition-colors"
                    >"""
content = theme_regex.sub(theme_replacement, content)

# Replace Information Panel position
panel_regex = re.compile(r'top: \'30px\',\s*right: \'80px\'')
panel_replacement = """top: '30px',
            left: '30px'"""
content = panel_regex.sub(panel_replacement, content)

with open('App.tsx', 'w') as f:
    f.write(content)
