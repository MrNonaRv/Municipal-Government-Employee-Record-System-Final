const fs = require('fs');
let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

// Fix the container width to prevent squishing
code = code.replace(
  'className="bg-white p-[1in] shadow-sm w-full max-w-[8.5in] min-h-[11in] text-black font-serif relative print:shadow-none print:w-full print:max-w-none print:min-h-0 print:p-[1in] mx-auto"',
  'className="bg-white p-[1in] shadow-sm w-[8.5in] min-w-[8.5in] max-w-[8.5in] shrink-0 min-h-[11in] text-black font-serif relative print:shadow-none print:w-full print:min-w-0 print:max-w-none print:min-h-0 print:p-[1in] mx-auto"'
);

code = code.replace(
  'className="w-full md:w-2/3 bg-slate-200 p-8 overflow-y-auto flex justify-center items-start print:p-0 print:bg-white print:overflow-visible print:block print:w-full"',
  'className="w-full md:w-2/3 bg-slate-200 p-8 overflow-y-auto overflow-x-auto flex justify-center items-start print:p-0 print:bg-white print:overflow-visible print:block print:w-full"'
);

// Add custom font inline style to ensure Times New Roman
code = code.replace(
  '<div className="mb-8">',
  '<div className="mb-8" style={{ fontFamily: \'"Times New Roman", Times, serif\' }}>'
);
// Wait, we need to wrap the whole page content with the font style.
code = code.replace(
  '<div className="bg-white p-[1in]',
  '<div style={{ fontFamily: \'"Times New Roman", Times, serif\' }} className="bg-white p-[1in]'
);

// Fix "Email Address: mambusao_lgu@yahoo.com" wrapping. The container has w-24 left and right logos.
code = code.replace(
  '<div className="w-24">',
  '<div className="w-[120px]">'
);
code = code.replace(
  '<div className="w-24 flex justify-center">',
  '<div className="w-[120px] flex justify-center">'
);

// Format enumeration lines
code = code.replace(
  '<div className="w-1/4 flex justify-between">',
  '<div className="w-48 flex justify-between ml-auto">'
);
code = code.replace(
  '<div className="w-1/4 flex justify-between">',
  '<div className="w-48 flex justify-between ml-auto">'
);
code = code.replace(
  '<div className="w-1/4 flex justify-between">',
  '<div className="w-48 flex justify-between ml-auto">'
);


fs.writeFileSync('src/components/NOSAModal.tsx', code);
