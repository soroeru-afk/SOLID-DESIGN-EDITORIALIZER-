with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace(r"\'Montserrat\', sans-serif\'", "'Montserrat', sans-serif")
content = content.replace(r"\'\"Montserrat\", sans-serif\'", "'\"Montserrat\", sans-serif'")
content = content.replace(r"style={{ fontFamily: \'\"Montserrat\", sans-serif\' }}", "style={{ fontFamily: '\"Montserrat\", sans-serif' }}")
content = content.replace(r"style={{ fontFamily: \\'\"Montserrat\", sans-serif\\' }}", "style={{ fontFamily: '\"Montserrat\", sans-serif' }}")
content = content.replace(r"style={{ fontFamily: \'\"Montserrat\", sans-serif\' }}", "style={{ fontFamily: '\"Montserrat\", sans-serif' }}")

with open('App.tsx', 'w') as f:
    f.write(content)
