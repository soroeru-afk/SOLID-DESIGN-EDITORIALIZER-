const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const regex = /return \(\s*<div className={`w-full h-screen flex flex-col theme-\${themeMode} bg-\[#080a0d\] text-\[#8a95a3\] font-sans overflow-hidden`}>([\s\S]*?)<div className={`flex-1 flex flex-col \${sidebarPosition === 'right' \? 'md:flex-row-reverse' : 'md:flex-row'} overflow-hidden relative`}>\s*\{\/\* Editor Sidebar \*\/\}/;

const match = content.match(regex);
if (match) {
  const headerContent = match[1];
  
  // Replace the outer container and move Sidebar up.
  content = content.replace(regex, `return (
    <div className={\`w-full h-screen flex \${sidebarPosition === 'right' ? 'flex-row-reverse' : 'flex-row'} theme-\${themeMode} bg-[#080a0d] text-[#8a95a3] font-sans overflow-hidden\`}>
      {/* Editor Sidebar */}`);
      
  // Now we need to insert the headerContent BEFORE the Canvas Area.
  const canvasRegex = /\{\/\* Canvas Area \*\/\}/;
  content = content.replace(canvasRegex, `
      {/* Main Content Area (Header + Canvas) */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        ${headerContent}
        
        {/* Canvas Area */}
  `);
  
  // Also we need to close that new `div` at the very end of the Canvas Area.
  // Wait, the Canvas Area was inside `<div className="flex-1 flex flex-col md:flex-row...">`, which we REMOVED!
  // So the closing tag for the flex-row container is now closing the new flex-col container.
  
  fs.writeFileSync('App.tsx', content);
  console.log("Success");
} else {
  console.log("No match found");
}
