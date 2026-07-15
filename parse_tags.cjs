const fs = require('fs');
const babel = require('@babel/parser');

const code = fs.readFileSync('App.tsx', 'utf-8');

try {
  babel.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
} catch (e) {
  console.log("Error:", e.message);
}

// Just parse with a simple regex to build a tree of <div> tags.
let lines = code.split('\n');
let stack = [];
for (let i = 1059; i < 1515; i++) {
    let line = lines[i];
    // This regex will find all <div and </div, but we MUST avoid <div ... />
    // Actually we can do it more carefully.
    let pos = 0;
    while (pos < line.length) {
        let openIdx = line.indexOf('<div', pos);
        let closeIdx = line.indexOf('</div', pos);
        
        if (openIdx !== -1 && (closeIdx === -1 || openIdx < closeIdx)) {
            // Check if it's self closing by looking for /> before the next >
            let endTag = line.indexOf('>', openIdx);
            if (endTag !== -1 && line[endTag - 1] === '/') {
                // self closing
                pos = endTag + 1;
            } else {
                stack.push(i + 1);
                pos = openIdx + 4;
            }
        } else if (closeIdx !== -1) {
            if (stack.length > 0) {
                stack.pop();
            }
            pos = closeIdx + 5;
        } else {
            break;
        }
    }
}
console.log("Remaining stack:", stack);
