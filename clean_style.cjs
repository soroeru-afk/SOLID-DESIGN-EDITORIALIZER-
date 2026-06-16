const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// 1. Remove border classes from getLayoutConfig
code = code.replace(/border-\[16px\] border-white shadow-\[0_40px_80px_rgba\(0,0,0,0\.12\)\] /, "shadow-[0_40px_80px_rgba(0,0,0,0.12)] ");
code = code.replace(/border-\[8px\] border-white shadow-\[0_20px_40px_rgba\(0,0,0,0\.1\)\] /, "shadow-[0_20px_40px_rgba(0,0,0,0.1)] ");
code = code.replace(/border-\[4px\] border-white /, "");

// Remove backdrop-blur from impact pattern
code = code.replace(/bg-black\/40 p-8 border border-white\/10 backdrop-blur items-start/, "flex-col items-start");
code = code.replace(/bg-black\/40 p-10 border border-white\/10 backdrop-blur/, "");

// Add centerOrigin to ALL DraggableBlocks except the ones added previously
const textBlockIds = ['kicker', 'titleContainer', 'bodyContainer', 'body2Container', 'meta1', 'meta2'];
textBlockIds.forEach(id => {
  const replaceTarget = new RegExp(`<DraggableBlock(\\s+)id="${id}"`);
  code = code.replace(replaceTarget, `<DraggableBlock$1id="${id}"$1centerOrigin={true}`);
});

// Add background style for each textBlockId
textBlockIds.forEach(id => {
  const replaceTarget = new RegExp(`(id="${id}"([\\s\\S]*?)isHidden=\\{blockStyles\\['${id}'\\]\\?\\.isHidden\\})`, 'g');
  code = code.replace(replaceTarget, `$1
            style={{ 
              pointerEvents: isEditMode ? 'auto' : 'none',
              zIndex: blockStyles['${id}']?.zIndex !== undefined ? blockStyles['${id}'].zIndex : undefined,
              color: blockStyles['${id}']?.color || undefined,
              writingMode: blockStyles['${id}']?.writingMode || undefined,
              textAlign: blockStyles['${id}']?.textAlign || undefined,
              WebkitTextStroke: blockStyles['${id}']?.textStroke ? \`\${blockStyles['${id}']?.textStrokeWidth !== undefined ? blockStyles['${id}'].textStrokeWidth : 1}px \${blockStyles['${id}'].textStroke}\` : undefined,
              textShadow: blockStyles['${id}']?.textStroke ? \`0 0 \${blockStyles['${id}']?.textStrokeWidth !== undefined ? blockStyles['${id}'].textStrokeWidth * 2 : 2}px \${blockStyles['${id}'].textStroke}\` : undefined,
              whiteSpace: 'pre-wrap',
              ...(blockStyles['${id}']?.bgBlur === 'dark' ? { backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)', padding: '24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' } : {}),
              ...(blockStyles['${id}']?.bgBlur === 'light' ? { backgroundColor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(16px)', padding: '24px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' } : {})
            }}`
  );
});

// Since the above will duplicate the style attribute, let's remove the old style attribute.
textBlockIds.forEach(id => {
  const oldStyleRegex = new RegExp(`style=\\{\\{\\s*pointerEvents:[\\s\\S]*?whiteSpace: 'pre-wrap'\\s*\\}\\}`, 'g');
  // First clear out old ones carefully: it's better to just replace the whole thing.
});

fs.writeFileSync('App.tsx.tmp', code);
