import re

with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r"const badgeBg = .*?;",
    r"const badgeBg = '#f0f0f0';",
    content
)

content = re.sub(
    r"const badgeText = .*?;",
    r"const badgeText = '#8a95a3';",
    content
)

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated badge colors")
