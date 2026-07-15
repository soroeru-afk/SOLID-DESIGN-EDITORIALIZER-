import re

with open('App.tsx', 'r') as f:
    lines = f.readlines()

opened = []
for i, line in enumerate(lines[2000:2082]):
    parts = re.split(r'(<div\b|</div\b)', line)
    
    j = 0
    while j < len(parts):
        part = parts[j]
        if part == '<div':
            opened.append((i + 2001, line.strip()))
        elif part == '</div':
            if opened:
                opened.pop()
        j += 1

print("Remaining opened in global settings block:")
for op in opened:
    if "/>" not in op[1]:
        print(f"Line {op[0]}: {op[1][:80]}")
