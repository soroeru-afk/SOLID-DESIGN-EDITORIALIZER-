import re

with open('App.tsx', 'r') as f:
    content = f.read()

replacement = """                      const a = document.createElement('a');
                      a.href = url;
                      const now = new Date();
                      const yyyy = now.getFullYear();
                      const mm = String(now.getMonth() + 1).padStart(2, '0');
                      const dd = String(now.getDate()).padStart(2, '0');
                      const hh = String(now.getHours()).padStart(2, '0');
                      const min = String(now.getMinutes()).padStart(2, '0');
                      const ss = String(now.getSeconds()).padStart(2, '0');
                      const timestamp = `${yyyy}${mm}${dd}-${hh}${min}${ss}`;
                      a.download = `solid-design-export-${timestamp}.json`;
                      a.click();"""

content = content.replace(
    "                      const a = document.createElement('a');\n                      a.href = url;\n                      a.download = 'solid-design-export.json';\n                      a.click();",
    replacement
)

with open('App.tsx', 'w') as f:
    f.write(content)
