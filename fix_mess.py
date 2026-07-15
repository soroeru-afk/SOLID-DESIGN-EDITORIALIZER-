import re

with open('App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip() in ["{!isImageBlock && (", "<>", "</>", ")}"]:
        continue
    new_lines.append(line)

with open('App.tsx', 'w') as f:
    f.writelines(new_lines)
