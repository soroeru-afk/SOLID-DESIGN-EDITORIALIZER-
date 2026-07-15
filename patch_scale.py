import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Replace Math.round(artboardScaleParam)
content = re.sub(
    r'\{artboardScaleParam\}%',
    r'{Math.round(artboardScaleParam)}%',
    content
)

# Replace the style for the canvas container
style_regex = re.compile(
    r'transform: `translate\(\$\{artboardOffset\.x\}px, \$\{artboardOffset\.y\}px\) scale\(\$\{scale\}\)`,'
)
style_replacement = """translate: `${artboardOffset.x}px ${artboardOffset.y}px`,
             scale: scale,
             transition: 'scale 0.05s ease-out',"""

content = style_regex.sub(style_replacement, content)

with open('App.tsx', 'w') as f:
    f.write(content)
