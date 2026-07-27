const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

const regex = /catch\(\(err\) => \{\s*originalError\(err\);\s*\}\)/;
const replacement = `catch((err) => {
        if (err && err.message && err.message.includes('remote stylesheet')) return;
        if (err && err.message && err.message.includes('Failed to fetch')) return;
        originalError(err);
      })`;

content = content.replace(regex, replacement);
fs.writeFileSync('App.tsx', content);
