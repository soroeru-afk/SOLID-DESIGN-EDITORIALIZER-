import re

with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""                    </div>
                  </div>
              </div>
                )}
            </>
          )}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#1e252e]">""",
"""                    </div>
                  </div>
                )}
              </div>
            </div>
            </>
          )}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#1e252e]">""")

with open('App.tsx', 'w') as f:
    f.write(content)
