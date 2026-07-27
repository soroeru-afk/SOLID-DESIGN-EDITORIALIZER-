const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

// The user wants ALL buttons and their wrapper divs in the sidebar to have square corners.
// Let's remove rounded, rounded-md, rounded-lg, rounded-sm, etc from specific areas.

// SAVE SLOT 1, DL IMAGE, DATA IMPORT, DATA EXPORT
content = content.replace(/rounded-md/g, '');
content = content.replace(/rounded-lg/g, '');
content = content.replace(/rounded-sm/g, '');
content = content.replace(/rounded-full/g, '');
content = content.replace(/rounded-l-lg/g, '');
content = content.replace(/rounded-r-lg/g, '');

// Also just "rounded" by itself
// Let's be careful not to remove it from layout canvas if there are any, but user said "レイアウト画面上にあるものは一切変更せずやってくれ" (do not change layout screen).
// The canvas elements are mostly in PreviewCanvas.
// Let's parse AST and remove rounded classes from EVERYTHING OUTSIDE of PreviewCanvas.
fs.writeFileSync('App.tsx', content);
