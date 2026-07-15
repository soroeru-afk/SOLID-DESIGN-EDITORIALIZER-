with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""                <div className="w-full h-full min-w-[10px] min-h-[10px]" />
              )
          }
          </DraggableBlock>
        )}""",
"""                <div className="w-full h-full min-w-[10px] min-h-[10px]" />
              )
            )}
          </DraggableBlock>
        )}""")

with open('App.tsx', 'w') as f:
    f.write(content)
