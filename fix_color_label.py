import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Replace the COLOR section to only show if it's not an image block, or change label
old_color_section = """              <div className="w-full">
                <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">COLOR</div>
              <div className="flex gap-1 overflow-x-auto h-[21px]">
                 <button """

new_color_section = """              {!isImageBlock && (
              <div className="w-full">
                <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">TEXT COLOR</div>
              <div className="flex gap-1 overflow-x-auto h-[21px]">
                 <button """

content = content.replace(old_color_section, new_color_section)

old_color_close = """                   />
                 </label>
              </div>
            </div>"""

new_color_close = """                   />
                 </label>
              </div>
            </div>
            )}"""

content = content.replace(old_color_close, new_color_close)

with open('App.tsx', 'w') as f:
    f.write(content)
