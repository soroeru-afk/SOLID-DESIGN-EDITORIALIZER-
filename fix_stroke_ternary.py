import re

with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""                  {(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke) ? (
                      <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">""",
"""                  {(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke) ? (
                    <>
                      <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">""")

content = content.replace(
"""                        onChange={(e) => handleBlockStyleChange('textStrokeWidth', Number(e.target.value), blockId)} 
                      />
                ) : (""",
"""                        onChange={(e) => handleBlockStyleChange('textStrokeWidth', Number(e.target.value), blockId)} 
                      />
                    </>
                ) : (""")

with open('App.tsx', 'w') as f:
    f.write(content)
