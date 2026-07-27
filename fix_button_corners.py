import re

with open('App.tsx', 'r') as f:
    content = f.read()

def replace_button(match):
    # match.group(0) is the whole <button ... > tag
    # we want to remove 'rounded', 'rounded-md', 'rounded-lg', 'rounded-full', 'rounded-l-lg', 'rounded-r-lg', etc.
    # basically any class starting with 'rounded'
    button_tag = match.group(0)
    
    # We find class="..." inside the button tag
    def replace_class(class_match):
        class_content = class_match.group(1)
        # remove rounded\S*
        new_class_content = re.sub(r'\brounded-?\S*\b', '', class_content)
        # clean up extra spaces
        new_class_content = re.sub(r'\s+', ' ', new_class_content).strip()
        return class_match.group(0).replace(class_match.group(1), new_class_content)
        
    new_button_tag = re.sub(r'className=(["\'])(.*?)\1', replace_class, button_tag)
    # Also handle className={`...`}
    def replace_class_template(class_match):
        class_content = class_match.group(1)
        new_class_content = re.sub(r'\brounded-?\S*\b', '', class_content)
        return class_match.group(0).replace(class_match.group(1), new_class_content)
        
    new_button_tag = re.sub(r'className=\{`([^`]+)`\}', replace_class_template, new_button_tag)
    
    return new_button_tag

# replace all <button ... > with the updated one
new_content = re.sub(r'<button\b[^>]*>', replace_button, content)

with open('App.tsx', 'w') as f:
    f.write(new_content)
    
print("Done fixing buttons.")
