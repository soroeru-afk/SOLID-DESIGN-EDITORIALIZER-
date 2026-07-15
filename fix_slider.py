import re

with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """                {showStatusText && (
                  <div className="flex flex-col gap-3">
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={statusOpacity}
                      onChange={(e) => setStatusOpacity(Number(e.target.value))}
                      className="w-full accent-[#00ffff]"
                    />
                    <div className="flex gap-2">"""

new_code = """                {showStatusText && (
                  <div className="flex flex-col gap-5 mt-5 mb-2">
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={statusOpacity}
                      onChange={(e) => setStatusOpacity(Number(e.target.value))}
                      className="w-full accent-[#00ffff] py-2 cursor-pointer"
                    />
                    <div className="flex gap-2">"""

content = content.replace(old_code, new_code)

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
