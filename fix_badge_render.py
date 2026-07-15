import re

with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """        {(gridMode !== 'none' || isEditMode) && (() => {
          const gridColor = gridMode === 'cyan' ? '#00ffff' : (gridMode === 'dark' ? '#333333' : (gridMode === 'light' ? '#e2e8f0' : (isMonotone ? '#111111' : '#e2e8f0')));
          return (
            <div className="absolute inset-0 z-50 pointer-events-none opacity-60">
              {isEditMode && (
                <div className="absolute top-4 left-4 bg-[#080a0d] px-3 py-1.5 text-[10px] font-bold tracking-widest z-50 flex items-center gap-2 border border-[#00ffff] text-[#00ffff]">
                  <span className="w-2 h-2 rounded-full animate-pulse bg-[#00ffff]"></span>
                  DESIGN MODE ACTIVE
                </div>
              )}"""

new_code = """        {(gridMode !== 'none' || isEditMode) && (() => {
          const gridColor = gridMode === 'cyan' ? '#00ffff' : (gridMode === 'dark' ? '#333333' : (gridMode === 'light' ? '#e2e8f0' : (themeMode === 'mono' ? '#111111' : '#e2e8f0')));
          const badgeBg = themeMode === 'mono' ? '#e8e8e8' : (themeMode === 'red' ? '#0f0707' : '#080a0d');
          const badgeText = themeMode === 'mono' ? '#111111' : (themeMode === 'red' ? '#b53333' : '#00ffff');
          return (
            <div className="absolute inset-0 z-50 pointer-events-none opacity-60">
              {isEditMode && (
                <div className="absolute top-4 left-4 px-3 py-1.5 text-[10px] font-bold tracking-widest z-50 flex items-center gap-2 border" style={{ backgroundColor: badgeBg, borderColor: badgeText, color: badgeText }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: badgeText }}></span>
                  DESIGN MODE ACTIVE
                </div>
              )}"""

if old_code in content:
    content = content.replace(old_code, new_code)
    print("Replaced successfully")
else:
    print("Old code not found!")

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
