import re

with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
            )}
                <div className="flex-1">
                  <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">TEXT STROKE</div>""",
"""                </div>
              </div>
            </div>
          )}
          {['kicker', 'titleContainer', 'bodyContainer', 'body2Container', 'meta1', 'meta2'].includes(blockId) && (
              <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
                <div className="flex-1">
                  <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">TEXT STROKE</div>""")

with open('App.tsx', 'w') as f:
    f.write(content)
