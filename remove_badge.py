import re

with open('App.tsx', 'r') as f:
    content = f.read()

replacement = """              {gridMode !== 'none' && (
                <>"""

content = content.replace(
    """              {isEditMode && (
                <div className="absolute top-4 left-4 px-3 py-1.5 text-[10px] font-bold tracking-widest z-50 flex items-center gap-2 border" style={{ backgroundColor: badgeBg, borderColor: badgeText, color: badgeText }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: badgeText }}></span>
                  DESIGN MODE ACTIVE
                </div>
              )}
              {gridMode !== 'none' && (
                <>""",
    replacement
)

with open('App.tsx', 'w') as f:
    f.write(content)
