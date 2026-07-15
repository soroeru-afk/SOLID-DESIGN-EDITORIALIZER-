import re

with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("  isMonotone: boolean;\n}", "  isMonotone: boolean;\n  themeMode: 'dark'|'mono'|'red';\n}")
content = content.replace("selectedBlockId, onSelectBlock, isMonotone \n}: PreviewCanvasProps) => {", "selectedBlockId, onSelectBlock, isMonotone, themeMode\n}: PreviewCanvasProps) => {")
content = content.replace("isMonotone={isMonotone}", "isMonotone={isMonotone}\n               themeMode={themeMode}")

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
