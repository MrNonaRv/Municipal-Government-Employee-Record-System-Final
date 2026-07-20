const fs = require('fs');
let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

code = code.replace(
  '<p className="text-xs">Republic of the Philippines</p>',
  '<p className="text-[11pt]">Republic of the Philippines</p>'
);

code = code.replace(
  '<p className="text-xs">Province of Capiz</p>',
  '<p className="text-[11pt]">Province of Capiz</p>'
);

code = code.replace(
  '<p className="text-xs font-bold">Municipality of Mambusao</p>',
  '<p className="text-[11pt] font-bold">Municipality of Mambusao</p>'
);

code = code.replace(
  '<p className="text-sm font-bold uppercase mt-2">OFFICE OF THE MAYOR</p>',
  '<p className="text-[12pt] font-bold uppercase mt-2">OFFICE OF THE MAYOR</p>'
);

code = code.replace(
  '<p className="text-[10px] italic">Telephone (036) 6470-045</p>',
  '<p className="text-[10pt] italic">Telephone (036) 6470-045</p>'
);

code = code.replace(
  '<p className="text-[10px] italic">Email Address: mambusao_lgu@yahoo</p>',
  '<p className="text-[10pt] italic">Email Address: mambusao_lgu@yahoo</p>'
);

fs.writeFileSync('src/components/NOSAModal.tsx', code);
