import re
with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace(r"\'jp\'", "'jp'")
content = content.replace(r"\'文字の向き\'", "'文字の向き'")
content = content.replace(r"\'TEXT DIRECTION\'", "'TEXT DIRECTION'")
content = content.replace(r"\'自動\'", "'自動'")
content = content.replace(r"\'AUTO\'", "'AUTO'")
content = content.replace(r"\'横\'", "'横'")
content = content.replace(r"\'HORZ\'", "'HORZ'")
content = content.replace(r"\'縦\'", "'縦'")
content = content.replace(r"\'VERT\'", "'VERT'")
content = content.replace(r"\'☰ 横\'", "'☰ 横'")
content = content.replace(r"\'☰ REGULAR\'", "'☰ REGULAR'")
content = content.replace(r"\'|| 縦\'", "'|| 縦'")
content = content.replace(r"\'|| REELS\'", "'|| REELS'")
content = content.replace(r"\'デザイン\'", "'デザイン'")
content = content.replace(r"\'DESIGN\'", "'DESIGN'")
content = content.replace(r"\'画像\'", "'画像'")
content = content.replace(r"\'IMAGE\'", "'IMAGE'")
content = content.replace(r"\'テキスト\'", "'テキスト'")
content = content.replace(r"\'TEXT\'", "'TEXT'")

with open('App.tsx', 'w') as f:
    f.write(content)
