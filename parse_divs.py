import re

with open('App.tsx', 'r') as f:
    lines = f.readlines()

opened = []
for i, line in enumerate(lines[1059:1515]):
    # find all '<div ' and '</div>'
    
    parts = re.split(r'(<div\b|</div\b)', line)
    
    for part in parts:
        if part == '<div':
            # Check if this line has "/>" which MIGHT close it
            # this is a heuristic
            opened.append((i + 1060, line.strip()))
        elif part == '</div':
            if opened:
                opened.pop()
            else:
                print("Extra closing div at line", i + 1060)

for op in opened:
    if "/>" not in op[1]:
        print(f"Line {op[0]}: {op[1][:80]}")
