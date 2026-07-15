import re

with open('App.tsx', 'r') as f:
    content = f.read()

bad_str = """                  </label>
               </div>
            </div>
            <div className="w-full">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">FONT</div>"""

good_str = """                  </label>
               </div>
              </div>
            )}
            {!isImageBlock && (
              <div className="w-full">
                <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">FONT</div>"""

content = content.replace(bad_str, good_str)

with open('App.tsx', 'w') as f:
    f.write(content)
