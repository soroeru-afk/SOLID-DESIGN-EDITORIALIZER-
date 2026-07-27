const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

const target = `const renderSharedSettings = (tabType: 'image' | 'text') => {
    const blockId = selectedBlockId;`;

const replacement = `const renderSharedSettings = (tabType: 'image' | 'text') => {
    const blockId = selectedBlockId;
    const blockNames: Record<string, string> = {
      kicker: 'KICKER TAG',
      titleContainer: 'HEADING TEXT',
      bodyContainer: 'BODY TEXT 1',
      body2Container: 'BODY TEXT 2',
      meta1: 'META 1',
      meta2: 'META 2',
      bgWrapper: 'IMAGE 1',
      bgWrapper2: 'IMAGE 2',
      accent1: 'ACCENT 1',
      accent2: 'ACCENT 2'
    };`;

content = content.replace(target, replacement);
fs.writeFileSync('App.tsx', content);
