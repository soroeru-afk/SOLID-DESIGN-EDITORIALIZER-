const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// 1. type LayoutStyle
code = code.replace(/type LayoutStyle = 'impact' \| 'story' \| 'gallery' \| 'split' \| 'magazine';/, "type LayoutStyle = 'impact' | 'story' | 'gallery' | 'split' | 'magazine' | 'blank';");

// 2. Add 'blank' pattern logic
const blankPatternCode = `else if (pattern === 'split') {`;
const newBlankPatternCode = `else if (pattern === 'blank') {
    c.container = "bg-white text-black w-full h-full relative overflow-hidden";
    c.bgWrapper = "absolute z-0 w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    c.titleContainer += " z-10 top-10 left-10";
    c.bodyContainer += " z-10 bottom-10 left-10 w-[300px] " + (isV ? "h-[300px]" : "w-[300px]");
    c.kicker += " z-10 top-4 left-10";
    c.meta1 += " z-10 bottom-4 right-10";
    c.meta2 += " z-10 top-4 right-10";
    c.titleLine += isV ? " text-[48px] text-black" : " text-[48px] text-black";
    c.bodyLine += " text-[#333]";
    c.accent1 += " hidden";
    c.accent2 += " hidden";
  }
  else if (pattern === 'split') {`;
code = code.replace(blankPatternCode, newBlankPatternCode);

// 3. Add 'BLANK' button to UI
const uiButtonsCode = `<button 
                    className={\`flex flex-col items-start p-3 border \${stylePattern === 'split' ? 'border-[#00ffff] bg-[#00ffff]/5' : 'border-[#1e252e] bg-[#0a0c10] hover:border-[#4e5d74]'}\`}
                    onClick={() => setStylePattern('split')}
                  >
                    <span className={\`text-[11px] font-bold tracking-widest \${stylePattern === 'split' ? 'text-white' : 'text-[#8a95a3]'}\`}>SPLIT</span>
                    <span className="text-[9px] text-[#4e5d74] mt-1 font-bold">2分割コントラスト</span>
                  </button>`;
const newUiButtonsCode = `<button 
                    className={\`flex flex-col items-start p-3 border \${stylePattern === 'split' ? 'border-[#00ffff] bg-[#00ffff]/5' : 'border-[#1e252e] bg-[#0a0c10] hover:border-[#4e5d74]'}\`}
                    onClick={() => setStylePattern('split')}
                  >
                    <span className={\`text-[11px] font-bold tracking-widest \${stylePattern === 'split' ? 'text-white' : 'text-[#8a95a3]'}\`}>SPLIT</span>
                    <span className="text-[9px] text-[#4e5d74] mt-1 font-bold">2分割コントラスト</span>
                  </button>
                  <button 
                    className={\`flex flex-col items-start p-3 border \${stylePattern === 'blank' ? 'border-[#00ffff] bg-[#00ffff]/5' : 'border-[#1e252e] bg-[#0a0c10] hover:border-[#4e5d74]'}\`}
                    onClick={() => setStylePattern('blank')}
                  >
                    <span className={\`text-[11px] font-bold tracking-widest \${stylePattern === 'blank' ? 'text-white' : 'text-[#8a95a3]'}\`}>BLANK</span>
                    <span className="text-[9px] text-[#4e5d74] mt-1 font-bold">ゼロから構築</span>
                  </button>`;
code = code.replace(uiButtonsCode, newUiButtonsCode);

code = code.replace(/TEXT COLOR OVERRIDE/, 'COLOR OVERRIDE');

fs.writeFileSync('App.tsx', code);
