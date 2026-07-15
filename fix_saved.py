import re

with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""                          >
                            <span className="opacity-50 text-[16px] leading-none mb-1">+</span>
                            SAVE SLOT {slot}
                          </button>
                      </div>
                    );""",
"""                          >
                            <span className="opacity-50 text-[16px] leading-none mb-1">+</span>
                            SAVE SLOT {slot}
                          </button>
                        )}
                      </div>
                    );""")

with open('App.tsx', 'w') as f:
    f.write(content)
