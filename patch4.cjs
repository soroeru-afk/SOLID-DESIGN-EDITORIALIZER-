const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
  /<Maximize size=\{16\} \/>/g,
  '{isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}'
);

fs.writeFileSync('App.tsx', content);
