import re

with open('index.css', 'r') as f:
    content = f.read()

# Add Montserrat
if 'Montserrat' not in content:
    content = content.replace(
        "@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono",
        "@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Share+Tech+Mono"
    )
    with open('index.css', 'w') as f:
        f.write(content)
