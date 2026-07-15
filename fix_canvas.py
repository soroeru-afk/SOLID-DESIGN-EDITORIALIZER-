import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Fix PreviewCanvas rendering for bgWrapper, bgWrapper2, accent1, accent2
replacements = [
    ("backgroundColor: blockStyles['bgWrapper']?.backgroundColor || undefined",
     "backgroundColor: blockStyles['bgWrapper']?.isBgColorOff ? 'transparent' : (blockStyles['bgWrapper']?.backgroundColor || undefined)"),
    ("borderColor: blockStyles['bgWrapper']?.borderColor || 'white'",
     "borderColor: blockStyles['bgWrapper']?.isBorderColorOff ? 'transparent' : (blockStyles['bgWrapper']?.borderColor || 'white')"),
     
    ("backgroundColor: blockStyles['bgWrapper2']?.backgroundColor || undefined",
     "backgroundColor: blockStyles['bgWrapper2']?.isBgColorOff ? 'transparent' : (blockStyles['bgWrapper2']?.backgroundColor || undefined)"),
    ("borderColor: blockStyles['bgWrapper2']?.borderColor || 'white'",
     "borderColor: blockStyles['bgWrapper2']?.isBorderColorOff ? 'transparent' : (blockStyles['bgWrapper2']?.borderColor || 'white')"),
     
    ("backgroundColor: blockStyles['accent1']?.backgroundColor || blockStyles['accent1']?.color || undefined",
     "backgroundColor: blockStyles['accent1']?.isBgColorOff ? 'transparent' : (blockStyles['accent1']?.backgroundColor || blockStyles['accent1']?.color || undefined)"),
    ("borderColor: blockStyles['accent1']?.borderColor || blockStyles['accent1']?.color || undefined",
     "borderColor: blockStyles['accent1']?.isBorderColorOff ? 'transparent' : (blockStyles['accent1']?.borderColor || blockStyles['accent1']?.color || undefined)"),
     
    ("backgroundColor: blockStyles['accent2']?.backgroundColor || blockStyles['accent2']?.color || undefined",
     "backgroundColor: blockStyles['accent2']?.isBgColorOff ? 'transparent' : (blockStyles['accent2']?.backgroundColor || blockStyles['accent2']?.color || undefined)"),
    ("borderColor: blockStyles['accent2']?.borderColor || blockStyles['accent2']?.color || undefined",
     "borderColor: blockStyles['accent2']?.isBorderColorOff ? 'transparent' : (blockStyles['accent2']?.borderColor || blockStyles['accent2']?.color || undefined)"),
]

for old, new in replacements:
    content = content.replace(old, new)

with open('App.tsx', 'w') as f:
    f.write(content)
