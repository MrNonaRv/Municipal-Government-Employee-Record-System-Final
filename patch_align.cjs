const fs = require('fs');
let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

code = code.replace(
  'className="w-full md:w-2/3 bg-slate-200 p-8 overflow-y-auto flex justify-center print:p-0 print:bg-white print:overflow-visible print:block print:w-full"',
  'className="w-full md:w-2/3 bg-slate-200 p-8 overflow-y-auto flex justify-center items-start print:p-0 print:bg-white print:overflow-visible print:block print:w-full"'
);

fs.writeFileSync('src/components/NOSAModal.tsx', code);
