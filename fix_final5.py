import re

with open('App.tsx', 'r') as f:
    content = f.read()

# I will replace all of it from the end of OFFSET Y to BG BLUR.
content = re.sub(
r'''                    </div>
                  </div>
              </div>
                \)\}
            </>
          \)\}
          <div className="flex flex-col gap-2 pt-2 border-t border-\[#1e252e\]">''',
r'''                    </div>
                  </div>
                )}
              </div>
            </div>
            </>
          )}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#1e252e]">''', content)

with open('App.tsx', 'w') as f:
    f.write(content)
