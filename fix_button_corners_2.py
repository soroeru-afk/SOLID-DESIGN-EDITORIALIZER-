import re

with open('App.tsx', 'r') as f:
    content = f.read()

def replace_button(match):
    button_tag = match.group(0)
    # Remove any word starting with "rounded" and its optional suffix
    new_button_tag = re.sub(r'\brounded(?:-[a-zA-Z0-9-]+)?\b', '', button_tag)
    # Clean up double spaces if any
    new_button_tag = re.sub(r'\s+', ' ', new_button_tag)
    # Put it back
    return new_button_tag

# match <button ...> taking care of possible newlines
new_content = re.sub(r'<button\b[^>]*>', replace_button, content)

with open('App.tsx', 'w') as f:
    f.write(new_content)
    
print("Done fixing buttons.")
