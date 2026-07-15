import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Regular / Reels
content = re.sub(
    r'>\s*☰ REGULAR\s*<\/button>',
    r'>{lang === \'jp\' ? \'☰ 横\' : \'☰ REGULAR\'}</button>',
    content
)

content = re.sub(
    r'>\s*\|\| REELS\s*<\/button>',
    r'>{lang === \'jp\' ? \'|| 縦\' : \'|| REELS\'}</button>',
    content
)

# Design, Image, Text Tabs
content = re.sub(
    r'>\s*DESIGN\s*<\/button>',
    r'>{lang === \'jp\' ? \'デザイン\' : \'DESIGN\'}</button>',
    content
)

content = re.sub(
    r'>\s*IMAGE\s*<\/button>',
    r'>{lang === \'jp\' ? \'画像\' : \'IMAGE\'}</button>',
    content
)

content = re.sub(
    r'>\s*TEXT\s*<\/button>',
    r'>{lang === \'jp\' ? \'テキスト\' : \'TEXT\'}</button>',
    content
)

# Text Direction
content = re.sub(
    r'>AUTO<\/button>',
    r'>{lang === \'jp\' ? \'自動\' : \'AUTO\'}</button>',
    content
)

content = re.sub(
    r'>HORZ<\/button>',
    r'>{lang === \'jp\' ? \'横\' : \'HORZ\'}</button>',
    content
)

content = re.sub(
    r'>VERT<\/button>',
    r'>{lang === \'jp\' ? \'縦\' : \'VERT\'}</button>',
    content
)

content = re.sub(
    r'<div className="text-\[8px\] font-bold tracking-widest opacity-60 mb-1">TEXT DIRECTION<\/div>',
    r'<div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">{lang === \'jp\' ? \'文字の向き\' : \'TEXT DIRECTION\'}</div>',
    content
)


with open('App.tsx', 'w') as f:
    f.write(content)
