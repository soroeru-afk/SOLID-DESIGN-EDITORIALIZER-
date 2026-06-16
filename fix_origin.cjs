const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

code = code.replace(
  /isHidden = false,\n  onClick\n\}: any\) => \{/,
  `isHidden = false,\n  centerOrigin = false,\n  onClick\n}: any) => {`
);

code = code.replace(
  /originX: 0, originY: 0,/,
  `originX: centerOrigin ? 0.5 : 0, originY: centerOrigin ? 0.5 : 0,`
);

code = code.replace(/<DraggableBlock(\s+)id="bgWrapper"/, `<DraggableBlock$1id="bgWrapper"$1centerOrigin={true}`);
code = code.replace(/<DraggableBlock(\s+)id="bgWrapper2"/, `<DraggableBlock$1id="bgWrapper2"$1centerOrigin={true}`);

fs.writeFileSync('App.tsx', code);
