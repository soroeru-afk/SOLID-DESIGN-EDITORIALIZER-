import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Remove the old badge
old_badge_pattern = r"        <AnimatePresence>\n          \{isEditMode && \(\n            <motion\.div \n              initial=\{\{ opacity: 0, y: -10 \}\}\n              animate=\{\{ opacity: 1, y: 0 \}\}\n              exit=\{\{ opacity: 0, y: -10 \}\}\n              className=\"absolute top-4 left-1\/2 -translate-x-1\/2 z-\[65\] pointer-events-none\"\n            >\n              <div className=\"px-3 py-1\.5 text-\[9px\] font-bold tracking-widest flex items-center gap-2 rounded-full backdrop-blur-sm bg-\[\#111418\]\/60 border border-\[\#2d3640\] text-\[\#8a95a3\] shadow-sm\">\n                <span className=\"w-1\.5 h-1\.5 rounded-full animate-pulse bg-\[\#00ffff\] opacity-80\"><\/span>\n                \{lang === 'jp' \? 'デザインモード' : 'DESIGN MODE'\}\n              <\/div>\n            <\/motion\.div>\n          \)\}\n        <\/AnimatePresence>\n\n"

content = re.sub(old_badge_pattern, "", content)

# Insert the badge next to the MODE toggle
mode_toggle_pattern = r"                 \{\/\* Mode Toggle \*\/}\n                 <div className=\"flex items-center gap-2\">"

new_mode_toggle = """                 {/* Mode Toggle */}
                 <div className="flex items-center gap-2">
                    <AnimatePresence>
                      {isEditMode && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="mr-2"
                        >
                          <div className="px-3 py-1.5 text-[9px] font-bold tracking-widest flex items-center gap-2 rounded-full bg-[#111418] border border-[#2d3640] text-[#00ffff] shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#00ffff]"></span>
                            {lang === 'jp' ? 'デザインモード' : 'DESIGN MODE'}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>"""

content = content.replace("                 {/* Mode Toggle */}\n                 <div className=\"flex items-center gap-2\">", new_mode_toggle)

with open('App.tsx', 'w') as f:
    f.write(content)
