import re

with open('App.tsx', 'r') as f:
    lines = f.readlines()

opened = []
for i, line in enumerate(lines[1059:1516]):
    # find all '<div' and '</div'
    
    parts = re.split(r'(<div\b|</div\b|/>)', line)
    
    j = 0
    while j < len(parts):
        part = parts[j]
        if part == '<div':
            # check if it's self-closing in the subsequent parts of this line
            is_self_closing = False
            for k in range(j+1, len(parts)):
                if parts[k] == '/>':
                    # wait, this is just a quick hack, what if there's an input with />?
                    pass
            opened.append((i + 1060, line.strip()))
        elif part == '</div':
            if opened:
                opened.pop()
        elif part == '/>':
            # if we see />, we should pop the last tag IF it was on this line?
            # Better: use a proper stack for ALL tags.
            pass
        j += 1

