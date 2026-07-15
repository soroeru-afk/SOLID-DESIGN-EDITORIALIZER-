with open('App.tsx', 'r') as f:
    content = f.read()

# Fix 1
content = content.replace("                )}}", "              )}")

# Fix 2
content = content.replace("                )} : (", "              ) : (")

# Fix 3: any other `              )}` that shouldn't be there?
# Actually, the original error was:
# /app/applet/App.tsx:439:27: ERROR: Unterminated regular expression
# 437|                  <div className="w-full h-full min-w-[10px] min-h-[10px]" />
# 438|                )
# 439|            </DraggableBlock>
# 440|  
# So I want to change `438|                )` to `)}`

with open('App.tsx', 'w') as f:
    f.write(content)
