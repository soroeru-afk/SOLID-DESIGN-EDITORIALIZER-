import re

with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""        onPointerDown={(e) => {
          if (e.button === 2) { // Right click
            setIsPanning(true);
            e.currentTarget.setPointerCapture(e.pointerId);
          }
        onPointerMove={(e) => {""",
"""        onPointerDown={(e) => {
          if (e.button === 2) { // Right click
            setIsPanning(true);
            e.currentTarget.setPointerCapture(e.pointerId);
          }
        }}
        onPointerMove={(e) => {""")

content = content.replace(
"""            setArtboardOffset(prev => ({
              x: prev.x + e.movementX,
              y: prev.y + e.movementY
            }));
          }
        onPointerUp={(e) => {""",
"""            setArtboardOffset(prev => ({
              x: prev.x + e.movementX,
              y: prev.y + e.movementY
            }));
          }
        }}
        onPointerUp={(e) => {""")

content = content.replace(
"""          if (isPanning && e.button === 2) {
            setIsPanning(false);
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        onContextMenu={(e) => e.preventDefault()}""",
"""          if (isPanning && e.button === 2) {
            setIsPanning(false);
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        }}
        onContextMenu={(e) => e.preventDefault()}""")

with open('App.tsx', 'w') as f:
    f.write(content)
