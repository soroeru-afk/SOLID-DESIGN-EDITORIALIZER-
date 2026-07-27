const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

// The issue is like: border${isMonotone
// Or text-left${
// We can use a regex to find any word followed directly by ${ inside className={
// Actually, it's safer to just fix all words followed by ${

content = content.replace(/([a-zA-Z0-9\]])\$\{/g, '$1 ${');
content = content.replace(/([a-zA-Z0-9\]])\$\{/g, '$1 ${'); // run again in case of overlap? no.
content = content.replace(/\$\{([a-zA-Z0-9]+)/g, '${ $1');

fs.writeFileSync('App.tsx', content);
