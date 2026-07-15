#!/bin/bash
cat << 'INNER_EOF' > append2.txt
      {/* Canvas Area */}
      <div 
        ref={containerRef} 
        className="flex-1 flex flex-col items-center justify-center relative overflow-hidden group/canvasarea" 
        style={{ backgroundColor: canvasBgColor }}
        onClick={() => setSelectedBlockId(null)}
INNER_EOF
sed -i '2109r append2.txt' App.tsx
