with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""                 </div>
              </div>
            </div>
          {['kicker', 'titleContainer', 'bodyContainer', 'body2Container', 'meta1', 'meta2'].includes(blockId) && (""",
"""                 </div>
              </div>
            </div>
          )}
          {['kicker', 'titleContainer', 'bodyContainer', 'body2Container', 'meta1', 'meta2'].includes(blockId) && (""")

with open('App.tsx', 'w') as f:
    f.write(content)
