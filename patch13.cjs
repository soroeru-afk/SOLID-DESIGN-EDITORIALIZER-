const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const themeAndScaleHtml = `
                 {/* Theme Toggles */}
                 <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold tracking-widest text-[#4e5d74] mr-2">THEME</span>
                    <button 
                      onClick={() => setThemeMode(prev => prev === 'dark' ? 'mono' : (prev === 'mono' ? 'red' : 'dark'))} 
                      className="px-4 py-1.5 bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold text-[#00ffff] uppercase hover:bg-[#2d3640] transition-colors"
                    >
                      {themeMode}
                    </button>
                 </div>

                 {/* Artboard Scale */}
                 <div className="flex items-center gap-3 border-l border-[#1e252e] pl-6">
                    <span className="text-[9px] font-bold tracking-widest text-[#4e5d74] mr-1">SCALE</span>
                    <input 
                      type="range" 
                      min="10" 
                      max="300" 
                      value={artboardScaleParam}
                      onChange={(e) => setArtboardScaleParam(Number(e.target.value))}
                      className="w-[100px] accent-[#00ffff] h-1 bg-[#1e252e] rounded-lg appearance-none outline-none"
                    />
                    <span className="text-[9px] font-bold text-[#00ffff] w-[30px] text-right">{artboardScaleParam}%</span>
                 </div>`;

content = content.replace(
  /\s*\{\/\* Theme Toggles \*\/\}\s*<div className="flex items-center gap-2">\s*<span className="text-\[9px\] font-bold tracking-widest text-\[\#4e5d74\] mr-2">THEME<\/span>\s*<div className="flex bg-\[\#111418\] border border-\[\#1e252e\] rounded text-\[9px\] font-bold p-0\.5">\s*<button onClick=\{\(\) => setThemeMode\('dark'\)\} className=\{`px-4 py-1\.5 rounded-sm transition-colors \$\{themeMode === 'dark' \? 'bg-\\[\#2d3640\\] text-\\[\#00ffff\\]' : 'text-\\[\#8a95a3\\] hover:text-\\[\#e2e8f0\\]'\}`\}>DARK<\/button>\s*<button onClick=\{\(\) => setThemeMode\('mono'\)\} className=\{`px-4 py-1\.5 rounded-sm transition-colors \$\{themeMode === 'mono' \? 'bg-\\[\#2d3640\\] text-\\[\#00ffff\\]' : 'text-\\[\#8a95a3\\] hover:text-\\[\#e2e8f0\\]'\}`\}>MONO<\/button>\s*<button onClick=\{\(\) => setThemeMode\('red'\)\} className=\{`px-4 py-1\.5 rounded-sm transition-colors \$\{themeMode === 'red' \? 'bg-\\[\#2d3640\\] text-\\[\#00ffff\\]' : 'text-\\[\#8a95a3\\] hover:text-\\[\#e2e8f0\\]'\}`\}>RED<\/button>\s*<\/div>\s*<\/div>/,
  themeAndScaleHtml
);

content = content.replace(
  /\s*<div>\s*<div className="flex justify-between items-end mb-2">\s*<div className="text-\[9px\] font-bold tracking-widest text-\[\#4e5d74\] uppercase">\{lang === 'jp' \? 'アートボード倍率' : 'Artboard Scale'\}<\/div>\s*<div className="text-\[10px\] font-bold text-\[\#00ffff\]">\{artboardScaleParam\}%<\/div>\s*<\/div>\s*<input \s*type="range" \s*min="10" \s*max="300" \s*value=\{artboardScaleParam\}\s*onChange=\{\(e\) => setArtboardScaleParam\(Number\(e\.target\.value\)\)\}\s*className="w-full accent-\[\#00ffff\]"\s*\/>\s*<\/div>/,
  ''
);

fs.writeFileSync('App.tsx', content);
