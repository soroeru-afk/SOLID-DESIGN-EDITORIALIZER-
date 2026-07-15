import re

with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""                       onChange={(e) => { 
                         e.stopPropagation(); 
                         handleBlockStyleChange('isBgColorOff', false, blockId);
                         setTimeout(() => handleBlockStyleChange('backgroundColor', e.target.value, blockId), 0);
                       }}""",
"""                       onChange={(e) => { 
                         e.stopPropagation(); 
                         handleBlockStyleChange('isBgColorOff', false, blockId);
                         handleBlockStyleChange('backgroundColor', e.target.value, blockId);
                       }}""")

content = content.replace(
"""                       onChange={(e) => { 
                         e.stopPropagation(); 
                         handleBlockStyleChange('isBorderColorOff', false, blockId);
                         setTimeout(() => handleBlockStyleChange('borderColor', e.target.value, blockId), 0);
                       }}""",
"""                       onChange={(e) => { 
                         e.stopPropagation(); 
                         handleBlockStyleChange('isBorderColorOff', false, blockId);
                         handleBlockStyleChange('borderColor', e.target.value, blockId);
                       }}""")

with open('App.tsx', 'w') as f:
    f.write(content)
