const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

const brokenCode = `  const handleBlockStyleChange = (key: string, value: string | number | boolean, blockIdOverride?: string) => {
    const targetId = blockIdOverride || selectedBlockId;
    if (!targetId) return;
    setBlockStyles((prev) => {
      const activeKey = \`\${ stylePattern}-\${ orientation}\`;
      const activeStyles = prev[activeKey] || {};

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
  };`;

const fixedCode = `  const handleOffsetChange = (axis: 'x' | 'y', value: number | undefined, blockIdOverride?: string) => {
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

  const handleBlockStyleChange = (key: string, value: string | number | boolean, blockIdOverride?: string) => {
    const targetId = blockIdOverride || selectedBlockId;
    if (!targetId) return;
    setBlockStyles((prev) => {
      const activeKey = \`\${ stylePattern}-\${ orientation}\`;
      const activeStyles = prev[activeKey] || {};`;

content = content.replace(brokenCode, fixedCode);
fs.writeFileSync('App.tsx', content);
console.log("Fixed!");
