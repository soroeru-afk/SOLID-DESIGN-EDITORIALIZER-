import re

with open('App.tsx', 'r') as f:
    content = f.read()

replacement = """      {/* Main Content Area (Header + Canvas) */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        <AnimatePresence>
          {isEditMode && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-[65] pointer-events-none"
            >
              <div className="px-3 py-1.5 text-[9px] font-bold tracking-widest flex items-center gap-2 rounded-full backdrop-blur-sm bg-[#111418]/60 border border-[#2d3640] text-[#8a95a3] shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#00ffff] opacity-80"></span>
                {lang === 'jp' ? 'デザインモード' : 'DESIGN MODE'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Header Container */}"""

pattern = r"      \{\/\* Main Content Area \(Header \+ Canvas\) \*\/}\n      <div className=\"flex-1 flex flex-col relative overflow-hidden\">\n        \n      \{\/\* Header Container \*\/}"

content = re.sub(pattern, replacement, content)

with open('App.tsx', 'w') as f:
    f.write(content)
