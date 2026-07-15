import re

with open('App.tsx', 'r') as f:
    content = f.read()

title_regex = re.compile(
    r'<div className="h-\[100px\] px-6 border-b border-\[\#1e252e\] shrink-0 bg-\[\#0a0c10\] flex flex-col justify-center gap-2\.5">[\s\S]*?<div className="flex items-center gap-3">[\s\S]*?<div className="border border-\[\#4e5d74\] p-1\.5 rounded-md shrink-0 bg-\[\#111418\]">[\s\S]*?<LayoutTemplate size=\{24\} className="text-\[\#e2e8f0\]" \/>[\s\S]*?<\/div>[\s\S]*?<h1 className="text-white font-extrabold tracking-wider text-\[17px\] leading-\[1\.1\]" style={{ fontFamily: \'"Inter", sans-serif\' }}>[\s\S]*?SOLID DESIGN<br \/>EDITORIZER[\s\S]*?<\/h1>[\s\S]*?<\/div>[\s\S]*?<p className="text-\[9px\] text-\[\#4e5d74\] tracking-\[0\.1em\] font-bold leading-none" style={{ fontFamily: \'"Share Tech Mono", monospace\' }}>GENERATIVE WEB BUILDER<\/p>[\s\S]*?<\/div>'
)

title_replacement = """<div className="h-[100px] px-6 border-b border-[#1e252e] shrink-0 bg-[#0a0c10] flex flex-col justify-center gap-1.5">
            <div className="flex items-center gap-3">
              <div className="border border-[#4e5d74] p-1.5 rounded-md shrink-0 bg-[#111418]">
                <LayoutTemplate size={32} className="text-[#e2e8f0]" />
              </div>
              <h1 className="text-white font-extrabold tracking-wider text-[22px] leading-[1]" style={{ fontFamily: '"Inter", sans-serif' }}>
                SOLID DESIGN<br />EDITORIZER
              </h1>
            </div>
            <p className="text-[9px] text-[#4e5d74] tracking-[0.1em] font-bold leading-none pl-1" style={{ fontFamily: '"Share Tech Mono", monospace' }}>GENERATIVE WEB BUILDER</p>
          </div>"""

content = title_regex.sub(title_replacement, content)

with open('App.tsx', 'w') as f:
    f.write(content)
