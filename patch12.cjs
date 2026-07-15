const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
  /gridMode: 'none' \| 'cyan' \| 'dark';/,
  "gridMode: 'none' | 'cyan' | 'dark' | 'light';"
);

fs.writeFileSync('App.tsx', content);
