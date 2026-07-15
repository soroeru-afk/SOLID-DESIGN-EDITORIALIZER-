import re

with open('index.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Make artboard-protection less aggressive for inline styles
css = css.replace('.text-white { color: #ffffff !important; }', '.text-white:not([style*="color:"]) { color: #ffffff !important; }')

# For bg panel
css = css.replace('.theme-mono .bg-\\[\\#111418\\] { background-color: var(--bg-panel) !important; }', '.theme-mono .bg-\\[\\#111418\\]:not(.ignore-theme) { background-color: var(--bg-panel) !important; }')
css = css.replace('.theme-red .bg-\\[\\#111418\\] { background-color: var(--bg-panel) !important; }', '.theme-red .bg-\\[\\#111418\\]:not(.ignore-theme) { background-color: var(--bg-panel) !important; }')

css = css.replace('.theme-mono .bg-\\[\\#080a0d\\] { background-color: var(--bg-input) !important; }', '.theme-mono .bg-\\[\\#080a0d\\]:not(.ignore-theme) { background-color: var(--bg-input) !important; }')
css = css.replace('.theme-red .bg-\\[\\#080a0d\\] { background-color: var(--bg-input) !important; }', '.theme-red .bg-\\[\\#080a0d\\]:not(.ignore-theme) { background-color: var(--bg-input) !important; }')

with open('index.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("Fixed CSS overrides")
