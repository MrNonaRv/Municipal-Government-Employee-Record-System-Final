const fs = require('fs');
let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

code = code.replace(
  'className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"',
  'className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm print:static print:p-0 print:block print:bg-white"'
);

code = code.replace(
  'className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden max-h-[95vh]"',
  'className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden max-h-[95vh] print:max-h-none print:overflow-visible print:shadow-none print:w-full print:max-w-none print:block print:rounded-none"'
);

code = code.replace(
  'className="w-full md:w-2/3 bg-slate-200 p-8 overflow-y-auto flex justify-center print:p-0 print:bg-white print:overflow-visible print:block"',
  'className="w-full md:w-2/3 bg-slate-200 p-8 overflow-y-auto flex justify-center print:p-0 print:bg-white print:overflow-visible print:block print:w-full"'
);

code = code.replace(
  'className="bg-white p-12 shadow-sm w-full max-w-[8.5in] min-h-[11in] text-black font-sans relative print:shadow-none print:w-full"',
  'className="bg-white p-12 shadow-sm w-full max-w-[8.5in] min-h-[11in] text-black font-sans relative print:shadow-none print:w-full print:max-w-none print:min-h-0 print:p-0 mx-auto"'
);

fs.writeFileSync('src/components/NOSAModal.tsx', code);
