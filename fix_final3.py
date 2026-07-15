import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Fix 1: dropShadow ternary
content = content.replace(
"""                  ) : (
                      <div className="text-[8px] font-bold tracking-widest opacity-30 text-center">SHADOW DISABLED</div>
                  </div>
                </div>""",
"""                  ) : (
                      <div className="text-[8px] font-bold tracking-widest opacity-30 text-center">SHADOW DISABLED</div>
                  )}
                  </div>
                </div>""")

# Fix 2: close ['kicker', ...] block
content = content.replace(
"""                    </div>
                  </div>
              </div>
          <div className="flex flex-col gap-2 pt-2 border-t border-[#1e252e]">
            <div className="w-full">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">BG BLUR</div>""",
"""                    </div>
                  </div>
                )}
              </div>
          )}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#1e252e]">
            <div className="w-full">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">BG BLUR</div>""")

with open('App.tsx', 'w') as f:
    f.write(content)
