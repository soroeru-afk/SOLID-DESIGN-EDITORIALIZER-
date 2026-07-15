const fs = require('fs');
const babel = require('@babel/parser');

function check(code) {
  try {
    babel.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });
    return true;
  } catch (e) {
    return e;
  }
}

const originalCode = fs.readFileSync('App.tsx', 'utf-8');
const lines = originalCode.split('\n');

// The details tag is from 1060 to 1515
// Let's remove from 1350 to 1500 and check
let testLines = [...lines];
testLines.splice(1350, 150);
let res = check(testLines.join('\n'));
if (res === true) {
    console.log("Error is between 1350 and 1500");
} else {
    console.log("Error is NOT between 1350 and 1500. Message:", res.message);
}

