const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

code = code.replace(/<motion\.div layout layoutId=\{`titleLine-\$\{i\}`\} key=\{i\} className=\{c\.titleLine\} transition=\{spring\}>/g, "<motion.div layout layoutId={`titleLine-${i}`} key={i} className={c.titleLine} transition={spring} style={{ color: blockStyles['titleContainer']?.color || undefined }}>");
code = code.replace(/<motion\.p layout layoutId=\{`bodyData-\$\{i\}`\} key=\{i\} className=\{c\.bodyLine\} transition=\{spring\}>/g, "<motion.p layout layoutId={`bodyData-${i}`} key={i} className={c.bodyLine} transition={spring} style={{ color: blockStyles['bodyContainer']?.color || undefined }}>");

fs.writeFileSync('App.tsx', code);
