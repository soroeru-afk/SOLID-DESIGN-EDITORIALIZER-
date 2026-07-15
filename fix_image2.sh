#!/bin/bash
sed -i 's/border-\[#00ffff\]\/50/border-gray-500\/50/g' App.tsx
sed -i 's/bg-\[#00ffff\]\/10/bg-gray-500\/10/g' App.tsx
sed -i 's/text-\[#00ffff\].*IMAGE 2/text-gray-500 text-[10px] font-bold font-mono">IMAGE 2/g' App.tsx
