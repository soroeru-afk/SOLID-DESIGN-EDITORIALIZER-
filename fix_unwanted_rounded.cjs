const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

// Reverse of restore_corners.cjs
content = content.replace(/rounded-lg /g, '');
content = content.replace(/ rounded-lg"/g, '"');
content = content.replace(/rounded-md /g, '');
content = content.replace(/ rounded-md"/g, '"');

// And remove any leftover `rounded ` or ` rounded"` inside buttons or sidebar panels.
// We should just carefully replace specific `rounded` strings in the UI areas.

// Let's do a global replace for common button classes:
content = content.replace(/rounded /g, '');
content = content.replace(/ rounded"/g, '"');

fs.writeFileSync('App.tsx', content);
