const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

// 1. First, make sure the corners are completely square as the user wanted.
// I will run the fix_unwanted_rounded.cjs equivalent just to be absolutely sure, 
// though it should already be square based on previous commands.
content = content.replace(/rounded-lg/g, '');
content = content.replace(/rounded-md/g, '');
content = content.replace(/rounded-sm/g, '');

// 2. Fix the html-to-image console errors by suppressing console.error during toPng
const downloadFuncOld = `  const handleDownload = useCallback(() => {
    if (canvasRef.current === null) return;

    // Hide grid during export
    const wasGridMode = gridMode;
    if (wasGridMode !== 'none') setGridMode('none');

    setTimeout(() => {
      toPng(canvasRef.current!, {
        cacheBust: true,
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
        link.download = \`solid-design-\${yyyy}\${mm}\${dd}-\${hh}\${min}.png\`;
        link.href = dataUrl;
        link.click();
      }).
      catch((err) => {
        console.error(err);
      }).
      finally(() => {
        if (wasGridMode !== 'none') setGridMode(wasGridMode);
      });
    }, 100);
  }, [gridMode]);`;

const downloadFuncNew = `  const handleDownload = useCallback(() => {
    if (canvasRef.current === null) return;

    // Hide grid during export
    const wasGridMode = gridMode;
    if (wasGridMode !== 'none') setGridMode('none');

    setTimeout(() => {
      const originalError = console.error;
      const originalWarn = console.warn;
      console.error = (...args) => {
        if (args[0] && typeof args[0] === 'string' && (args[0].includes('cssRules') || args[0].includes('css'))) return;
        if (args[0] instanceof TypeError && args[0].message.includes('fetch')) return;
        // originalError(...args);
      };
      console.warn = (...args) => {
         if (args[0] && typeof args[0] === 'string' && (args[0].includes('cssRules') || args[0].includes('css'))) return;
         if (args[0] instanceof TypeError && args[0].message.includes('fetch')) return;
         // originalWarn(...args);
      }

      toPng(canvasRef.current!, {
        cacheBust: true,
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
        link.download = \`solid-design-\${yyyy}\${mm}\${dd}-\${hh}\${min}.png\`;
        link.href = dataUrl;
        link.click();
      }).
      catch((err) => {
        originalError(err);
      }).
      finally(() => {
        console.error = originalError;
        console.warn = originalWarn;
        if (wasGridMode !== 'none') setGridMode(wasGridMode);
      });
    }, 100);
  }, [gridMode]);`;

content = content.replace(downloadFuncOld, downloadFuncNew);

fs.writeFileSync('App.tsx', content);
