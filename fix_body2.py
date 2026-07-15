with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""                <div className="w-full h-full border border-dashed border-gray-500/50 flex items-center justify-center bg-gray-500/10 min-w-[100px] min-h-[50px]">
                  <span className="text-[#00ffff] text-[10px] font-bold font-mono">BODY TEXT 2</span>
                </div>
            </DraggableBlock>
          <DraggableBlock""",
"""                <div className="w-full h-full border border-dashed border-gray-500/50 flex items-center justify-center bg-gray-500/10 min-w-[100px] min-h-[50px]">
                  <span className="text-[#00ffff] text-[10px] font-bold font-mono">BODY TEXT 2</span>
                </div>
              )}
            </DraggableBlock>
        )}
          <DraggableBlock""")

with open('App.tsx', 'w') as f:
    f.write(content)
