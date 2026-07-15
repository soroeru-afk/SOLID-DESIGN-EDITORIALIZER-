import re

with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the condition for bgWrapper2 rendering
content = content.replace("{(image2Url || isEditMode) && (", "{(image2Url || blockStyles['bgWrapper2']?.backgroundColor || isEditMode) && (")

# Remove opacity-60, opacity-80, opacity-50 from c.image and c.image2
content = content.replace('c.image += " opacity-60 scale-105";', 'c.image += " scale-105";')
content = content.replace('c.image2 += " opacity-80 drop-shadow-2xl";', 'c.image2 += " drop-shadow-2xl";')
content = content.replace('c.image += " opacity-80 brightness-110";', 'c.image += " brightness-110";')
content = content.replace('c.image2 += " opacity-50 grayscale blend-multiply";', 'c.image2 += " grayscale blend-multiply";')

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated")
