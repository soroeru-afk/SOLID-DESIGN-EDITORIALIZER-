import re

with open('App.tsx', 'r') as f:
    content = f.read()

content = re.sub(
r'''                      \}\)\}
                    </div>
              </div>
            </div>''',
r'''                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>''', content)

with open('App.tsx', 'w') as f:
    f.write(content)
