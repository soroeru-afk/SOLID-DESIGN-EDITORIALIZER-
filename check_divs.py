import re
with open('App.tsx', 'r') as f:
    lines = f.readlines()

opened = []
for i, line in enumerate(lines[1059:1515]):
    # count how many <div ... > and </div> are in the line
    opens = len(re.findall(r'<div\b', line))
    closes = len(re.findall(r'</div\b', line))
    
    for _ in range(opens):
        opened.append(i + 1060)
        
    for _ in range(closes):
        if opened:
            opened.pop()

print("Unclosed divs opened at lines:", opened)
