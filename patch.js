const fs = require('fs');
const content = fs.readFileSync('App.tsx', 'utf8');

const newLayout = content.replace(
  /<div className={`w-full h-screen flex flex-col theme-\${themeMode} bg-\[#080a0d\] text-\[#8a95a3\] font-sans overflow-hidden`}>([\s\S]*?)<div className={`flex-1 flex flex-col \${sidebarPosition === 'right' \? 'md:flex-row-reverse' : 'md:flex-row'} overflow-hidden relative`}>\s*\{\/\* Editor Sidebar \*\/\}/,
  (match, headerContent) => {
    return `<div className={\`w-full h-screen flex \${sidebarPosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} theme-\${themeMode} bg-[#080a0d] text-[#8a95a3] font-sans overflow-hidden\`}>
      {/* Editor Sidebar */}
`;
  }
);

// Wait, I need to insert the headerContent INTO the flex-1 container for Canvas.
