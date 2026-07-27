const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

const offsetHandler = `
  const handleOffsetChange = (axis: 'x' | 'y', value: number | undefined, blockIdOverride?: string) => {
    const targetId = blockIdOverride || selectedBlockId;
    if (!targetId) return;
    setOffsets((prev) => {
      const activeKey = \`\${stylePattern}-\${orientation}\`;
      const activeOffsets = prev[activeKey] || {};
      const current = activeOffsets[targetId] || { x: 0, y: 0 };
      return {
        ...prev,
        [activeKey]: {
          ...activeOffsets,
          [targetId]: {
            ...current,
            [axis]: value !== undefined ? value : 0
          }
        }
      };
    });
  };
`;

const blockStyleChangeRegex = /(const handleBlockStyleChange = [\s\S]*?\}\;\n)/;
content = content.replace(blockStyleChangeRegex, `$1${offsetHandler}`);
fs.writeFileSync('App.tsx', content);
