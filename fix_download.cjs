const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

// 1. Add isDownloading state
const isSavingStr = "const [isSaving, setIsSaving] = useState(false);";
content = content.replace(isSavingStr, isSavingStr + "\n  const [isDownloading, setIsDownloading] = useState(false);");

// 2. Replace handleDownload
const oldHandleDownload = /const handleDownload = useCallback\(\(\) => \{[\s\S]*?\}, \[gridMode, stylePattern, orientation\]\);/;

const newHandleDownload = `const handleDownload = useCallback(() => {
    if (canvasRef.current === null) return;
    setIsDownloading(true);

    // Hide grid during export
    const wasGridMode = gridMode;
    if (wasGridMode !== 'none') setGridMode('none');

    setTimeout(() => {
      const originalError = console.error;
      const originalWarn = console.warn;
      console.error = (...args) => {
        if (args[0] && typeof args[0] === 'string' && (args[0].includes('cssRules') || args[0].includes('css'))) return;
        if (args[0] instanceof TypeError && args[0].message.includes('fetch')) return;
        originalError(...args);
      };
      console.warn = (...args) => {
         if (args[0] && typeof args[0] === 'string' && (args[0].includes('cssRules') || args[0].includes('css'))) return;
         if (args[0] instanceof TypeError && args[0].message.includes('fetch')) return;
         originalWarn(...args);
      }

      toPng(canvasRef.current, {
        quality: 1,
        pixelRatio: 2
      }).
      then((dataUrl) => {
        const link = document.createElement('a');
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        const timestamp = \`\${ yyyy}\${ mm}\${ dd}-\${ hh}\${ min}\${ ss}\`;
        
        link.download = \`editorial-\${ stylePattern}-\${ orientation}-\${ timestamp}.png\`;
        link.href = dataUrl;
        link.click();
        
        if (wasGridMode !== 'none') setGridMode(wasGridMode);
        setIsDownloading(false);
      }).
      catch((err) => {
        console.error('Failed to export image', err);
        if (wasGridMode !== 'none') setGridMode(wasGridMode);
        setIsDownloading(false);
      });
    }, 100);
  }, [gridMode, stylePattern, orientation]);`;

if (oldHandleDownload.test(content)) {
    content = content.replace(oldHandleDownload, newHandleDownload);
} else {
    console.log("Could not find handleDownload");
}

// 3. Update Download button
const oldButton = `<button className="col-span-1 py-1.5 text-[10px] font-bold tracking-widest  transition-all flex items-center justify-center gap-1.5 border border-[#2d3640] bg-[#111418] hover:bg-[#1e252e] text-white" onClick={handleDownload}>
              <Download size={12} /> {lang === 'jp' ? '画像DL' : 'DL IMAGE'}
 </button>`;

const newButton = `<button disabled={isDownloading} className={\`col-span-1 py-1.5 text-[10px] font-bold tracking-widest  transition-all flex items-center justify-center gap-1.5 border \${isDownloading ? 'border-[#00ffff] bg-[#00ffff]/20 text-[#00ffff]' : 'border-[#2d3640] bg-[#111418] hover:bg-[#1e252e] text-white'}\`} onClick={handleDownload}>
              {isDownloading ? <span className="animate-pulse">{lang === 'jp' ? '処理中...' : 'PROCESSING...'}</span> : <><Download size={12} /> {lang === 'jp' ? '画像DL' : 'DL IMAGE'}</>}
 </button>`;

content = content.replace(oldButton, newButton);

fs.writeFileSync('App.tsx', content);
console.log("Updated handleDownload and button");
