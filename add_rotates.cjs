const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const blocks = ['bgWrapper', 'bgWrapper2', 'accent1', 'accent2', 'kicker', 'titleContainer', 'bodyContainer', 'body2Container', 'meta1', 'meta2'];

blocks.forEach(block => {
  const scaleLineRegex = new RegExp(`scale=\\{blockStyles\\['${block}'\\]\\?\.scale \\? blockStyles\\['${block}'\\]\\.scale \\/ 100 : 1\\}`);
  code = code.replace(scaleLineRegex, `scale={blockStyles['${block}']?.scale ? blockStyles['${block}'].scale / 100 : 1}\n            rotate={blockStyles['${block}']?.rotate || 0}`);
});

fs.writeFileSync('App.tsx', code);
