import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Fix `}}` which is invalid inside JSX (around line 389)
content = re.sub(r'\}\s*\}\}', '}', content)

# Fix `)} : (`
content = re.sub(r'\)\}\s*:\s*\(', ') : (', content)

with open('App.tsx', 'w') as f:
    f.write(content)
