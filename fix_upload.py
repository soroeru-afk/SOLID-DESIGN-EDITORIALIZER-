import re

with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""                        if (file && file.type.startsWith('image/')) {
                          const r = new FileReader(); r.onload = (ev) => setImageUrl(ev.target?.result as string); r.readAsDataURL(file);
                        }
                    >""",
"""                        if (file && file.type.startsWith('image/')) {
                          const r = new FileReader(); r.onload = (ev) => setImageUrl(ev.target?.result as string); r.readAsDataURL(file);
                        }
                      }}
                    >""")

content = content.replace(
"""                        if(file) { const r = new FileReader(); r.onload = (ev) => setImageUrl(ev.target?.result as string); r.readAsDataURL(file); } />""",
"""                        if(file) { const r = new FileReader(); r.onload = (ev) => setImageUrl(ev.target?.result as string); r.readAsDataURL(file); }
                      }} />""")

with open('App.tsx', 'w') as f:
    f.write(content)
