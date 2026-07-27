const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const code = fs.readFileSync('App.tsx', 'utf-8');

const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx', 'typescript']
});

let modified = false;

traverse(ast, {
  JSXOpeningElement(path) {
    if (path.node.name.name === 'button') {
      const classNameAttr = path.node.attributes.find(attr => attr.name && attr.name.name === 'className');
      
      if (classNameAttr) {
        if (classNameAttr.value.type === 'StringLiteral') {
          const oldVal = classNameAttr.value.value;
          const newVal = oldVal.replace(/\brounded(?:-[a-zA-Z0-9-]+)?\b/g, '').replace(/\s+/g, ' ').trim();
          if (oldVal !== newVal) {
            classNameAttr.value.value = newVal;
            modified = true;
          }
        } else if (classNameAttr.value.type === 'JSXExpressionContainer') {
          // Inside a template literal or string literal in the expression
          if (classNameAttr.value.expression.type === 'TemplateLiteral') {
            classNameAttr.value.expression.quasis.forEach(quasi => {
              const oldVal = quasi.value.raw;
              const newVal = oldVal.replace(/\brounded(?:-[a-zA-Z0-9-]+)?\b/g, '').replace(/\s+/g, ' ').trim();
              if (oldVal !== newVal) {
                quasi.value.raw = newVal;
                quasi.value.cooked = newVal;
                modified = true;
              }
            });
          } else if (classNameAttr.value.expression.type === 'StringLiteral') {
             const oldVal = classNameAttr.value.expression.value;
             const newVal = oldVal.replace(/\brounded(?:-[a-zA-Z0-9-]+)?\b/g, '').replace(/\s+/g, ' ').trim();
             if (oldVal !== newVal) {
               classNameAttr.value.expression.value = newVal;
               modified = true;
             }
          }
        }
      }
    }
  }
});

if (modified) {
  const output = generate(ast, { retainLines: true, retainFunctionParens: true }).code;
  fs.writeFileSync('App.tsx', output);
  console.log('Modified AST.');
} else {
  console.log('No modifications.');
}
