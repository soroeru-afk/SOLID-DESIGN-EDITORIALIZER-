import re

with open('App.tsx', 'r') as f:
    content = f.read()

replacement = """        .then((dataUrl) => {
          const link = document.createElement('a');
          const now = new Date();
          const yyyy = now.getFullYear();
          const mm = String(now.getMonth() + 1).padStart(2, '0');
          const dd = String(now.getDate()).padStart(2, '0');
          const hh = String(now.getHours()).padStart(2, '0');
          const min = String(now.getMinutes()).padStart(2, '0');
          const ss = String(now.getSeconds()).padStart(2, '0');
          const timestamp = `${yyyy}${mm}${dd}-${hh}${min}${ss}`;
          link.download = `editorial-${stylePattern}-${orientation}-${timestamp}.png`;
          link.href = dataUrl;"""

content = content.replace(
    "        .then((dataUrl) => {\n          const link = document.createElement('a');\n          link.download = `editorial-${stylePattern}-${orientation}.png`;\n          link.href = dataUrl;",
    replacement
)

with open('App.tsx', 'w') as f:
    f.write(content)
