const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// 1. Remove classes
code = code.replace(/border-\[16px\] border-white shadow-\[0_40px_80px_rgba\(0,0,0,0\.12\)\] /g, "shadow-[0_40px_80px_rgba(0,0,0,0.12)] ");
code = code.replace(/border-\[8px\] border-white shadow-\[0_20px_40px_rgba\(0,0,0,0\.1\)\] /g, "shadow-[0_20px_40px_rgba(0,0,0,0.1)] ");
code = code.replace(/border-\[4px\] border-white /g, "");
code = code.replace(/bg-black\/40 p-8 border border-white\/10 backdrop-blur items-start/g, "flex-col items-start");
code = code.replace(/bg-black\/40 p-10 border border-white\/10 backdrop-blur/g, "");

const textBlockIds = ['kicker', 'titleContainer', 'bodyContainer', 'body2Container', 'meta1', 'meta2'];

textBlockIds.forEach(id => {
  // Add centerOrigin={true}
  code = code.replace(
    new RegExp(`(<DraggableBlock\\s+)(id="${id}"\\s+)`),
    `$1$2centerOrigin={true}\n            `
  );

  // Instead of replacing the whole style object with a complex regex, let's just insert our backdrop entries before whiteSpace: 'pre-wrap'
  // using string replacement.
  code = code.replace(
    new RegExp(`(whiteSpace: 'pre-wrap')(\\s*\\}\\}\\s*isSelected=\\{selectedBlockId === '${id}'\\})`),
    `$1,
              ...(blockStyles['${id}']?.bgBlur === 'dark' ? { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '8px' } : {}),
              ...(blockStyles['${id}']?.bgBlur === 'light' ? { backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '8px' } : {})$2`
  );
});

// Also UI additions for bgBlur
const colorUITarget = `<div className="flex gap-2 pt-2 border-t border-[#1e252e]">
            <div className="flex-1">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">COLOR</div>`;
              
const colorUIReplacement = `<div className="flex gap-2 pt-2 border-t border-[#1e252e]">
            <div className="flex-1">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">BG BLUR</div>
              <div className="flex gap-1 overflow-x-auto">
                 {['', 'light', 'dark'].map(blur => {
                    const isActive = (blockStyles[\`\${stylePattern}-\${orientation}\`]?.[blockId]?.bgBlur || '') === blur;
                    return (
                       <button 
                         key={blur}
                         className={\`flex-1 py-1 text-[9px] font-bold rounded transition-all flex items-center justify-center min-w-[32px] \${isActive ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}\`}
                         onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('bgBlur', blur, blockId); }}
                       >
                         {blur === '' ? 'OFF' : blur.toUpperCase()}
                       </button>
                    );
                 })}
              </div>
            </div>
            <div className="flex-1 border-l border-[#1e252e] pl-2">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">COLOR</div>`;
              
code = code.replace(colorUITarget, colorUIReplacement);

fs.writeFileSync('App.tsx', code);
