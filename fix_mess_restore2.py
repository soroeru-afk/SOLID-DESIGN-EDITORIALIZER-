import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Fix 4: image2 block
content = content.replace(
"""                )
            </DraggableBlock>""",
"""                )}
            </DraggableBlock>"""
)

with open('App.tsx', 'w') as f:
    f.write(content)
