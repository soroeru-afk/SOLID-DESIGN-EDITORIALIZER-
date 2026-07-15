import re

with open('App.tsx', 'r') as f:
    lines = f.readlines()

stack = []
for i, line in enumerate(lines[1738:1980]):
    parts = re.split(r'(<div\b|</div\b)', line)
    for part in parts:
        if part == '<div':
            stack.append(i + 1739)
        elif part == '</div':
            if stack:
                popped = stack.pop()
                if popped == 1741:
                    print(f"Line 1741 was closed at {i + 1739}")
