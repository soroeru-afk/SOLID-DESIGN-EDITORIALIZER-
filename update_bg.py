import re

with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update bgWrapper
bg_wrapper_style = "            borderColor: blockStyles['bgWrapper']?.borderColor || 'white'"
bg_wrapper_style_new = "            borderColor: blockStyles['bgWrapper']?.borderColor || 'white',\n            backgroundColor: blockStyles['bgWrapper']?.backgroundColor || undefined"
content = content.replace(bg_wrapper_style, bg_wrapper_style_new)

# Update bgWrapper2
bg_wrapper2_style = "            borderColor: blockStyles['bgWrapper2']?.borderColor || 'white'"
bg_wrapper2_style_new = "            borderColor: blockStyles['bgWrapper2']?.borderColor || 'white',\n            backgroundColor: blockStyles['bgWrapper2']?.backgroundColor || undefined"
content = content.replace(bg_wrapper2_style, bg_wrapper2_style_new)

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully")
