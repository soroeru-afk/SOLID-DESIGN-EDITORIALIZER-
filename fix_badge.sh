#!/bin/bash
sed -i 's/style={{ color: badgeColor, borderColor: badgeColor }}/className="absolute top-4 left-4 bg-[#080a0d] px-3 py-1.5 text-[10px] font-bold tracking-widest z-50 flex items-center gap-2 border border-[#00ffff] text-[#00ffff]"/g' App.tsx
sed -i 's/className="absolute top-4 left-4 bg-\[#080a0d\] px-3 py-1.5 text-\[10px\] font-bold tracking-widest z-50 flex items-center gap-2 border" className="absolute/className="absolute/g' App.tsx
sed -i 's/style={{ backgroundColor: badgeColor }}/className="w-2 h-2 rounded-full animate-pulse bg-[#00ffff]"/g' App.tsx
sed -i 's/className="w-2 h-2 rounded-full animate-pulse" className="w-2/className="w-2/g' App.tsx
