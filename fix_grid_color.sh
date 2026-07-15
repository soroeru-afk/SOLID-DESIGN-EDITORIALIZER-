#!/bin/bash
sed -i "s/const gridColor = gridMode === 'cyan' ? '#00ffff' : (gridMode === 'dark' ? '#333333' : '#e2e8f0');/const gridColor = gridMode === 'cyan' ? '#00ffff' : (gridMode === 'dark' ? '#333333' : (gridMode === 'light' ? '#e2e8f0' : (themeMode === 'mono' ? '#444444' : '#e2e8f0')));/g" App.tsx
