import re

with open('index.css', 'r', encoding='utf-8') as f:
    css = f.read()

protection_css = """
/* ARTBOARD PROTECTION */
.theme-mono .artboard-protection .bg-\[\#0a0c10\] { background-color: #0a0c10 !important; }
.theme-mono .artboard-protection .bg-\[\#111418\] { background-color: #111418 !important; }
.theme-mono .artboard-protection .bg-\[\#080a0d\] { background-color: #080a0d !important; }
.theme-mono .artboard-protection .bg-\[\#1a1f26\] { background-color: #1a1f26 !important; }
.theme-mono .artboard-protection .bg-\[\#1e252e\] { background-color: #1e252e !important; }
.theme-mono .artboard-protection .bg-\[\#2d3640\] { background-color: #2d3640 !important; }
.theme-mono .artboard-protection .border-\[\#1e252e\] { border-color: #1e252e !important; }
.theme-mono .artboard-protection .border-\[\#2d3640\] { border-color: #2d3640 !important; }
.theme-mono .artboard-protection .border-\[\#4e5d74\] { border-color: #4e5d74 !important; }
.theme-mono .artboard-protection .border-\[\#00ffff\] { border-color: #00ffff !important; }
.theme-mono .artboard-protection .border-\[\#00ffff\]\\/50 { border-color: rgba(0, 255, 255, 0.5) !important; }
.theme-mono .artboard-protection .text-\[\#8a95a3\] { color: #8a95a3 !important; }
.theme-mono .artboard-protection .text-\[\#e2e8f0\] { color: #e2e8f0 !important; }
.theme-mono .artboard-protection .text-\[\#4e5d74\] { color: #4e5d74 !important; }
.theme-mono .artboard-protection .text-\[\#00ffff\] { color: #00ffff !important; }
.theme-mono .artboard-protection .text-white { color: #ffffff !important; }
.theme-mono .artboard-protection .bg-\[\#00ffff\] { background-color: #00ffff !important; }
.theme-mono .artboard-protection .bg-\[\#00ffff\]\\/10 { background-color: rgba(0, 255, 255, 0.1) !important; }
.theme-mono .artboard-protection .accent-\[\#00ffff\] { accent-color: #00ffff !important; }

.theme-red .artboard-protection .bg-\[\#0a0c10\] { background-color: #0a0c10 !important; }
.theme-red .artboard-protection .bg-\[\#111418\] { background-color: #111418 !important; }
.theme-red .artboard-protection .bg-\[\#080a0d\] { background-color: #080a0d !important; }
.theme-red .artboard-protection .bg-\[\#1a1f26\] { background-color: #1a1f26 !important; }
.theme-red .artboard-protection .bg-\[\#1e252e\] { background-color: #1e252e !important; }
.theme-red .artboard-protection .bg-\[\#2d3640\] { background-color: #2d3640 !important; }
.theme-red .artboard-protection .border-\[\#1e252e\] { border-color: #1e252e !important; }
.theme-red .artboard-protection .border-\[\#2d3640\] { border-color: #2d3640 !important; }
.theme-red .artboard-protection .border-\[\#4e5d74\] { border-color: #4e5d74 !important; }
.theme-red .artboard-protection .border-\[\#00ffff\] { border-color: #00ffff !important; }
.theme-red .artboard-protection .border-\[\#00ffff\]\\/50 { border-color: rgba(0, 255, 255, 0.5) !important; }
.theme-red .artboard-protection .text-\[\#8a95a3\] { color: #8a95a3 !important; }
.theme-red .artboard-protection .text-\[\#e2e8f0\] { color: #e2e8f0 !important; }
.theme-red .artboard-protection .text-\[\#4e5d74\] { color: #4e5d74 !important; }
.theme-red .artboard-protection .text-\[\#00ffff\] { color: #00ffff !important; }
.theme-red .artboard-protection .text-white { color: #ffffff !important; }
.theme-red .artboard-protection .bg-\[\#00ffff\] { background-color: #00ffff !important; }
.theme-red .artboard-protection .bg-\[\#00ffff\]\\/10 { background-color: rgba(0, 255, 255, 0.1) !important; }
.theme-red .artboard-protection .accent-\[\#00ffff\] { accent-color: #00ffff !important; }
"""

if "ARTBOARD PROTECTION" not in css:
    css += "\n" + protection_css
    with open('index.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("Added protection css")
else:
    print("Already added")
