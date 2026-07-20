const fs = require('fs');
let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

code = code.replace(
  'className="bg-white p-12 shadow-sm w-full max-w-[8.5in] min-h-[11in] text-black font-sans relative print:shadow-none print:w-full print:max-w-none print:min-h-0 print:p-0 mx-auto"',
  'className="bg-white p-10 shadow-sm w-full max-w-[8.5in] min-h-[11in] text-black font-serif relative print:shadow-none print:w-full print:max-w-none print:min-h-0 print:p-0 mx-auto"'
);

fs.writeFileSync('src/components/NOSAModal.tsx', code);
