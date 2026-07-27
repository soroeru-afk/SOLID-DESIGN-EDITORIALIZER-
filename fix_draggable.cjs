const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

const oldDraggable = `const DraggableBlock = ({
  id,
  className,
  isEditMode,
  gridMode,
  offset,
  onDragEnd,
  children,
  spring,
  style = {},
  scale = 1,
  rotate = 0,
  width,
  height,
  isSelected = false,
  isHidden = false,
  centerOrigin = false,
  onClick
}: any) => {
  const isEdit = isEditMode;
  const gridColor = gridMode === 'cyan' ? '#00ffff' : gridMode === 'dark' ? '#333333' : gridMode === 'light' ? '#e2e8f0' : 'transparent';
  const frameColor = gridMode === 'cyan' ? '#888888' : gridMode === 'dark' ? '#3b82f6' : gridMode === 'light' ? '#22c55e' : 'transparent';
  // Determine z-index based on state and style
  const currentZIndex = isSelected ? 9999 : style.zIndex;

  return (
    <motion.div
      id={id}
      onClick={onClick}
      className={\`\${ className} \${ isEdit ? 'ring-2 cursor-move' : ''} \${ isSelected ? 'ring-4 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''}\`}
      transition={spring}
      drag={isEdit}
      dragMomentum={false}
      onDragEnd={(e, info) => {
        onDragEnd(id, info.offset.x, info.offset.y);
      }}
      animate={{ x: offset.x, y: offset.y, scale, rotate }}
      whileDrag={{ zIndex: 10000 }}
      style={{
        transformOrigin: centerOrigin ? '50% 50%' : '0 0',
        ...style,
        display: isHidden ? 'none' : style.display,
        ...(width !== undefined ? { width: \`\${ width}px\` } : {}),
        ...(height !== undefined ? { height: \`\${ height}px\` } : {}),
        ...(currentZIndex !== undefined ? { zIndex: currentZIndex } : {}),
        ...(isEdit ? {
          touchAction: 'none',
          '--tw-ring-color': isSelected ? 'rgb(239, 68, 68)' : frameColor
        } : {})
      } as any}>
      
      {children}
    </motion.div>
  );
};`;

const newDraggable = `import { useAnimation } from 'framer-motion';

const DraggableBlock = ({
  id,
  className,
  isEditMode,
  gridMode,
  offset,
  onDragEnd,
  children,
  spring,
  style = {},
  scale = 1,
  rotate = 0,
  width,
  height,
  isSelected = false,
  isHidden = false,
  centerOrigin = false,
  onClick
}: any) => {
  const isEdit = isEditMode;
  const gridColor = gridMode === 'cyan' ? '#00ffff' : gridMode === 'dark' ? '#333333' : gridMode === 'light' ? '#e2e8f0' : 'transparent';
  const frameColor = gridMode === 'cyan' ? '#888888' : gridMode === 'dark' ? '#3b82f6' : gridMode === 'light' ? '#22c55e' : 'transparent';
  const currentZIndex = isSelected ? 9999 : style.zIndex;

  const controls = useAnimation();
  
  React.useEffect(() => {
    controls.start({ x: offset.x, y: offset.y, scale, rotate, transition: spring });
  }, [offset.x, offset.y, scale, rotate, controls, spring]);

  return (
    <motion.div
      id={id}
      onClick={onClick}
      className={\`\${ className} \${ isEdit ? 'ring-2 cursor-move' : ''} \${ isSelected ? 'ring-4 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''}\`}
      drag={isEdit}
      dragMomentum={false}
      onDragEnd={(e, info) => {
        onDragEnd(id, info.offset.x, info.offset.y);
      }}
      animate={controls}
      whileDrag={{ zIndex: 10000 }}
      style={{
        transformOrigin: centerOrigin ? '50% 50%' : '0 0',
        ...style,
        display: isHidden ? 'none' : style.display,
        ...(width !== undefined ? { width: \`\${ width}px\` } : {}),
        ...(height !== undefined ? { height: \`\${ height}px\` } : {}),
        ...(currentZIndex !== undefined ? { zIndex: currentZIndex } : {}),
        ...(isEdit ? {
          touchAction: 'none',
          '--tw-ring-color': isSelected ? 'rgb(239, 68, 68)' : frameColor
        } : {})
      } as any}>
      
      {children}
    </motion.div>
  );
};`;

// We have to remove the import useAnimation from the string since React is imported globally or differently
// Wait, we can just use \`React.useEffect\` and import \`useAnimation\` from 'framer-motion'
// Let's check how framer-motion is imported in App.tsx

content = content.replace(oldDraggable, newDraggable.replace("import { useAnimation } from 'framer-motion';", ""));

const importRegex = /import \{[\s\S]*?\} from 'framer-motion';/;
const currentImport = content.match(importRegex);
if (currentImport && !currentImport[0].includes('useAnimation')) {
    content = content.replace(importRegex, currentImport[0].replace('}', ', useAnimation }'));
}

fs.writeFileSync('App.tsx', content);
console.log("DraggableBlock fixed!");
