import re

with open('App.tsx', 'r') as f:
    lines = f.readlines()

opened = []
for i, line in enumerate(lines[1738:1980]):
    parts = re.split(r'(<div\b|</div\b)', line)
    
    j = 0
    while j < len(parts):
        part = parts[j]
        if part == '<div':
            opened.append((i + 1739, line.strip()))
        elif part == '</div':
            if opened:
                opened.pop()
        j += 1

print("Remaining opened in design block:")
for op in opened:
    print(f"Line {op[0]}: {op[1][:80]}")
