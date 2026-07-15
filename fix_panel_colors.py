import re

with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Locate Information Panel content
# Using text replacements for specific statusTheme checks
content = content.replace("statusTheme === 'dark' ? 'text-[#8a95a3]' : 'text-gray-600'", "statusTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'")
content = content.replace("statusTheme === 'dark' ? 'text-[#4e5d74]' : 'text-gray-400'", "statusTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'")
content = content.replace("statusTheme === 'dark' ? 'text-[#00ffff]' : 'text-blue-600'", "statusTheme === 'dark' ? 'text-cyan-400' : 'text-blue-600'")
content = content.replace("statusTheme === 'dark' ? 'text-white' : 'text-black'", "statusTheme === 'dark' ? 'text-[#ffffff]' : 'text-[#000000]'")

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated panel colors")
