const fs = require('fs');
const code = fs.readFileSync('App.tsx', 'utf8');

const stack = [];

for (let i = 0; i < code.length; i++) {
  const c = code[i];
  if (['(', '{', '['].includes(c)) {
    // only track if it's not inside string? no, too complex. 
    // let's do a simple heuristic
    stack.push({ char: c, line: code.substring(0, i).split('\n').length });
  } else if ([')', '}', ']'].includes(c)) {
    const pair = c === ')' ? '(' : c === '}' ? '{' : '[';
    // Walk back to find the matching pair
    let found = false;
    for (let j = stack.length - 1; j >= 0; j--) {
      if (stack[j].char === pair) {
        stack.splice(j, stack.length - j); // pop it and anything after (imperfect but works)
        found = true;
        break;
      }
    }
  }
}

console.log("Unclosed stack:");
for (const item of stack) {
  console.log(`Line ${item.line}: ${item.char}`);
}
