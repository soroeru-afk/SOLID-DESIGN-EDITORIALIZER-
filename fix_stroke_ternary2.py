import re

with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""                  ) : (
                      <div className="text-[8px] font-bold tracking-widest opacity-30 text-center">STROKE DISABLED</div>
                  </div>
                </div>""",
"""                  ) : (
                      <div className="text-[8px] font-bold tracking-widest opacity-30 text-center">STROKE DISABLED</div>
                  )}
                  </div>
                </div>""")

with open('App.tsx', 'w') as f:
    f.write(content)
