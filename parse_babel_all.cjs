const fs = require('fs');
const babel = require('@babel/parser');

const code = fs.readFileSync('App.tsx', 'utf-8');

try {
  babel.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
  console.log("No errors");
} catch (e) {
  console.log("Error:", e.message);
}
