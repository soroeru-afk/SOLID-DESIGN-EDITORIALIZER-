import re

with open('App.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'<h1 className="text-white font-black tracking-\[0\.25em\] text-\[15px\] leading-\[1\.3\]" style={{ fontFamily: \'"Montserrat", sans-serif\' }}>',
    r'<h1 className="text-white font-black tracking-[0.2em] text-[15px] leading-[1.2]">',
    content
)

with open('App.tsx', 'w') as f:
    f.write(content)
