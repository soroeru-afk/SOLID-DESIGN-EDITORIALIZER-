with open('App.tsx', 'r') as f:
    lines = f.readlines()

# Search for COLOR to find line 1084 equivalents
color_idx = -1
z_index_idx = -1

for i, line in enumerate(lines):
    if '<div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">COLOR</div>' in line:
        color_idx = i - 1 # The <div className="w-full">
    if '<div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">Z-INDEX</div>' in line:
        z_index_idx = i - 2 # The <div className="flex gap-2 border-t ...">

if color_idx != -1 and z_index_idx != -1:
    lines.insert(z_index_idx, "            </>\n          )}\n")
    lines.insert(color_idx, "          {!isImageBlock && (\n            <>\n")

with open('App.tsx', 'w') as f:
    f.writelines(lines)
