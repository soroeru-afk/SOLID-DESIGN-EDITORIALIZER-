const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// 1. Remove border classes from getLayoutConfig
code = code.replace(/border-\[16px\] border-white shadow-\[0_40px_80px_rgba\(0,0,0,0\.12\)\] /, "shadow-2xl ");
code = code.replace(/border-\[8px\] border-white shadow-\[0_20px_40px_rgba\(0,0,0,0\.1\)\] /, "shadow-xl ");
code = code.replace(/border-\[4px\] border-white /, "");

// Remove backdrop-blur from impact pattern
code = code.replace(/bg-black\/40 p-8 border border-white\/10 backdrop-blur /, "flex-col ");
code = code.replace(/bg-black\/40 p-10 border border-white\/10 backdrop-blur/, "");

// Add centerOrigin to ALL DraggableBlocks except the ones added previously
const textBlockIds = ['kicker', 'titleContainer', 'bodyContainer', 'body2Container', 'meta1', 'meta2'];
textBlockIds.forEach(id => {
  code = code.replace(new RegExp(`<DraggableBlock(\\s+)id="${id}"`), `<DraggableBlock$1id="${id}"$1centerOrigin={true}`);
});

// For each textBlockId, add background style
textBlockIds.forEach(id => {
  const replaceTarget = new RegExp(`(id="${id}"([\\s\\S]*?)isHidden=\\{blockStyles\\['${id}'\\]\\?\\.isHidden\\})`, 'g');
  code = code.replace(replaceTarget, `$1
            style={{ 
              pointerEvents: isEditMode ? 'auto' : 'none',
              zIndex: blockStyles['${id}']?.zIndex !== undefined ? blockStyles['${id}'].zIndex : undefined,
              ...(blockStyles['${id}']?.bgBlur === 'dark' ? { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: '24px' } : {}),
              ...(blockStyles['${id}']?.bgBlur === 'light' ? { backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', padding: '24px' } : {})
            }}`
  );
});

fs.writeFileSync('App.tsx', code);
