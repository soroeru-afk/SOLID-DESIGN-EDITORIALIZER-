const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// 1. Remove border classes from getLayoutConfig
code = code.replace(/border-\[16px\] border-white shadow-\[0_40px_80px_rgba\(0,0,0,0\.12\)\] /, "shadow-2xl ");
code = code.replace(/border-\[8px\] border-white shadow-\[0_20px_40px_rgba\(0,0,0,0\.1\)\] /, "shadow-xl ");
code = code.replace(/border-\[4px\] border-white /, "");

// Remove backdrop-blur from impact pattern
code = code.replace(/bg-black\/40 p-8 border border-white\/10 backdrop-blur /, "flex-col ");
code = code.replace(/bg-black\/40 p-10 border border-white\/10 backdrop-blur/, "");


fs.writeFileSync('App.tsx', code);
