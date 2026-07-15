import re

with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "backgroundColor: blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.isBgColorOff ? 'transparent' : (blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.backgroundColor || 'transparent')",
    "backgroundColor: blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.backgroundColor || 'transparent'"
)

content = content.replace(
    "backgroundColor: blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.isBorderColorOff ? 'transparent' : (blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.borderColor || 'transparent')",
    "backgroundColor: blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.borderColor || 'transparent'"
)

with open('App.tsx', 'w') as f:
    f.write(content)
