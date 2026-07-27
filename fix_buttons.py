import re

with open('App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(len(lines)):
    if '<button' in lines[i] or '</button>' in lines[i] or ('onClick=' in lines[i] and 'className=' in lines[i] and 'button' in lines[i].lower()):
        # We only want to remove rounded classes from buttons.
        # But wait, we shouldn't use a multi-line state machine.
        # Let's just find lines that have a button.
        lines[i] = re.sub(r'\brounded(?:-[a-z0-9]+)?\b', '', lines[i])
        # clean up double spaces
        lines[i] = re.sub(r' +', ' ', lines[i])

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
