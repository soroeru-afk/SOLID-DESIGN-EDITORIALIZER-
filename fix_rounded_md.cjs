const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf-8');

function addRoundedMd(searchStr) {
  content = content.replace(searchStr, searchStr.replace('transition-all', 'rounded-md transition-all'));
}

// 1. SAVE SLOT buttons
// The save slot loop is: <button onClick={() => saveStateToSlot(slot)} className={`w-full py-2.5 text-[11px] font-bold tracking-widest transition-all flex flex-col items-center justify-center gap-1.5 border border-[#1e252e] ${...}`}>
// Wait, the ones above were handleManualSave which is SAVE SLOT 1 or 一時保存.
addRoundedMd("className={`col-span-1 py-1.5 text-[10px] font-bold tracking-widest transition-all");
addRoundedMd('className="col-span-1 py-1.5 text-[10px] font-bold tracking-widest transition-all');
addRoundedMd('className="col-span-1 py-1.5 text-[10px] font-bold tracking-widest transition-all flex items-center justify-center gap-1.5 border border-[#1e252e] bg-[#080a0d] hover:bg-[#1e252e] text-[#8a95a3]"'); // export
addRoundedMd('className="col-span-1 py-1.5 text-[10px] font-bold tracking-widest transition-all flex items-center justify-center gap-1.5 border border-[#1e252e] bg-[#080a0d] hover:bg-[#1e252e] text-[#8a95a3]"'); // Load State

// Save Slot loop buttons (the 1 to 4 loop):
// `w-full py-2.5 text-[11px] font-bold tracking-widest transition-all ...
addRoundedMd('className={`w-full py-2.5 text-[11px] font-bold tracking-widest transition-all');

// Header buttons (Settings, Fullscreen, Close)
// `p-1.5 text-[#8a95a3] hover:text-[#e2e8f0] bg-[#111418] hover:bg-[#2d3640] border border-[#1e252e] transition-colors`
// Oh wait, transition-colors, not transition-all.
content = content.replace(/className="p-1\.5 text-\[\#8a95a3\] hover:text-\[\#e2e8f0\] bg-\[\#111418\] hover:bg-\[\#2d3640\] border border-\[\#1e252e\] transition-colors"/g, 'className="p-1.5 text-[#8a95a3] hover:text-[#e2e8f0] bg-[#111418] hover:bg-[#2d3640] border border-[#1e252e] rounded-md transition-colors"');

// Close Header button in corner
content = content.replace(/className="p-1\.5 bg-white\/90 text-gray-700 hover:text-gray-900 border border-gray-300 hover:bg-white transition-colors shadow-sm backdrop-blur-sm"/g, 'className="p-1.5 bg-white/90 text-gray-700 hover:text-gray-900 border border-gray-300 hover:bg-white rounded-md transition-colors shadow-sm backdrop-blur-sm"');


fs.writeFileSync('App.tsx', content);
