const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

code = code.replace(/backgroundColor: blockStyles\['accent1'\]\?\.color \|\| undefined,/g, "backgroundColor: blockStyles['accent1']?.color || undefined, borderColor: blockStyles['accent1']?.color || undefined, color: blockStyles['accent1']?.color || undefined,");
code = code.replace(/backgroundColor: blockStyles\['accent2'\]\?\.color \|\| undefined,/g, "backgroundColor: blockStyles['accent2']?.color || undefined, borderColor: blockStyles['accent2']?.color || undefined, color: blockStyles['accent2']?.color || undefined,");

fs.writeFileSync('App.tsx', code);
