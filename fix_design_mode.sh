#!/bin/bash
sed -i "s/const gridColor = gridMode === 'cyan' ? '#00ffff' : (gridMode === 'dark' ? '#333333' : (gridMode === 'light' ? '#e2e8f0' : (isMonotone ? '#444444' : '#e2e8f0')));/const gridColor = gridMode === 'cyan' ? '#00ffff' : (gridMode === 'dark' ? '#333333' : (gridMode === 'light' ? '#e2e8f0' : (isMonotone ? '#111111' : '#e2e8f0')));\n          const badgeColor = isMonotone ? (gridMode === 'light' ? '#111111' : gridColor) : gridColor;/g" App.tsx

sed -i "s/style={{ color: gridColor, borderColor: gridColor }}/style={{ color: badgeColor, borderColor: badgeColor }}/g" App.tsx
sed -i "s/style={{ backgroundColor: gridColor }}><\/span>/style={{ backgroundColor: badgeColor }}><\/span>/g" App.tsx
