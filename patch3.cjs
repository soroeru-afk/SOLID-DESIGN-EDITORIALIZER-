const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
  /Maximize/,
  'Maximize,\n  Minimize'
);

fs.writeFileSync('App.tsx', content);
