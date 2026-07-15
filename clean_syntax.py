import re

with open('App.tsx', 'r') as f:
    content = f.read()

# I want to revert the COLOR wrapper if it exists:
content = content.replace("{!isImageBlock && (\\n              <div className=\\\"w-full\\\">\\n                <div className=\\\"text-[8px] font-bold tracking-widest opacity-60 mb-1\\\">COLOR</div>", "<div className=\\\"w-full\\\">\\n              <div className=\\\"text-[8px] font-bold tracking-widest opacity-60 mb-1\\\">COLOR</div>")

# I want to revert the FONT wrapper if it exists:
content = content.replace("{!isImageBlock && (\\n              <div className=\\\"w-full\\\">\\n                <div className=\\\"text-[8px] font-bold tracking-widest opacity-60 mb-1\\\">FONT</div>", "<div className=\\\"w-full\\\">\\n              <div className=\\\"text-[8px] font-bold tracking-widest opacity-60 mb-1\\\">FONT</div>")

with open('App.tsx', 'w') as f:
    f.write(content)
