import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Let's find all <button ... > tags and their classes
buttons = re.findall(r'<button\b[^>]*>', content)
for i, btn in enumerate(buttons):
    if 'rounded' in btn:
        print(f"Button {i}: {btn}\n")
