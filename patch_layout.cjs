const fs = require('fs');
let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

// 1. Header
code = code.replace(
`            {/* Header */}
            <div className="flex justify-center items-center mb-8 relative">
              <div className="absolute left-8">
                {/* Placeholder for left logo */}
                <div className="w-16 h-16 rounded-full border-2 border-slate-300"></div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[11pt]">Republic of the Philippines</p>
                <p className="text-[11pt]">Province of Capiz</p>
                <p className="text-[11pt] font-bold">Municipality of Mambusao</p>
                <p className="text-[12pt] font-bold uppercase mt-2">OFFICE OF THE MAYOR</p>
                <div className="w-full h-px bg-black my-2"></div>
                <p className="text-[10pt] italic">Telephone (036) 6470-045</p>
                <p className="text-[10pt] italic">Email Address: mambusao_lgu@yahoo</p>
              </div>
              <div className="absolute right-8">
                {/* Placeholder for right logo */}
                <div className="w-20 h-12 bg-slate-200"></div>
              </div>
            </div>`,
`            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div className="w-24">
                  {/* Left Logo (Seal) */}
                  <div className="w-20 h-20 rounded-full border border-slate-300 mx-auto"></div>
                </div>
                <div className="flex-1 text-center leading-snug">
                  <p className="text-[11pt]">Republic of the Philippines</p>
                  <p className="text-[11pt]">Province of Capiz</p>
                  <p className="text-[11pt]">Municipality of Mambusao</p>
                  <p className="text-[14pt] font-bold uppercase mt-3 mb-1">OFFICE OF THE MAYOR</p>
                  <p className="text-[10pt] italic">Telephone (036) 6470-045</p>
                  <p className="text-[10pt] italic">Email Address: mambusao_lgu@yahoo.com</p>
                </div>
                <div className="w-24 flex justify-center">
                  {/* Right Logo (Flag) */}
                  <div className="w-24 h-14 bg-slate-200 mt-2"></div>
                </div>
              </div>
              <div className="w-full h-[1px] bg-black mt-4"></div>
            </div>`
);

// 2. Title
code = code.replace(
  '<h1 className="text-xl font-bold uppercase underline">NOTICE OF SALARY ADJUSTMENT</h1>',
  '<h1 className="text-[14pt] font-bold uppercase">NOTICE OF SALARY ADJUSTMENT</h1>'
);

// 3. Name section
code = code.replace(
  '<div className="mb-6 text-[12pt] space-y-1">',
  '<div className="mb-6 text-[12pt] leading-tight">'
);

// 4. Salutation
code = code.replace(
  '<div className="mb-4 text-[12pt]">',
  '<div className="mb-6 text-[12pt]">'
);

// 5. Enumeration styling
code = code.replace(
`            <div className="px-8 space-y-6 text-[12pt] mb-8">
              <div className="flex justify-between items-start">
                <div className="w-3/4">
                  <p>1. Adjusted monthly basic salary effective {newDate}, under the new Salary Schedule; SG- {newSg}, Step {newStep}</p>
                </div>
                <div className="w-1/4 text-right">
                  <p>P {formattedNewSalary}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-start">
                <div className="w-3/4">
                  <p>2. Actual monthly basic salary as of {oldDate}; SG- {oldSg}, Step {oldStep}</p>
                </div>
                <div className="w-1/4 text-right">
                  <p>P {formattedOldSalary}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-start font-bold">
                <div className="w-3/4">
                  <p>3. Monthly Salary Adjustment effective {newDate}</p>
                </div>
                <div className="w-1/4 text-right">
                  <p>P {monthlyAdjustment}</p>
                </div>
              </div>
            </div>`,
`            <div className="pl-12 pr-8 space-y-6 text-[12pt] mb-8">
              <div className="flex justify-between items-start">
                <div className="w-3/4 flex gap-4">
                  <span>1.</span>
                  <p>Adjusted monthly basic salary effective {newDate}, under<br/>the new Salary Schedule; SG- {newSg}, Step {newStep}</p>
                </div>
                <div className="w-1/4 flex justify-between">
                  <span>P</span>
                  <span className="text-right">{formattedNewSalary}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-start">
                <div className="w-3/4 flex gap-4">
                  <span>2.</span>
                  <p>Actual monthly basic salary as of {oldDate};<br/>SG- {oldSg}, Step {oldStep}</p>
                </div>
                <div className="w-1/4 flex justify-between">
                  <span>P</span>
                  <span className="text-right">{formattedOldSalary}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-start">
                <div className="w-3/4 flex gap-4">
                  <span>3.</span>
                  <p>Monthly Salary Adjustment effective {newDate}</p>
                </div>
                <div className="w-1/4 flex justify-between">
                  <span>P</span>
                  <span className="text-right">{monthlyAdjustment}</span>
                </div>
              </div>
            </div>`
);

// 6. Signatory
code = code.replace(
  '<p className="font-bold uppercase underline">{mayorName}</p>',
  '<p className="font-bold uppercase">{mayorName}</p>'
);
code = code.replace(
  '<p className="text-left mb-8">Very truly yours,</p>',
  '<p className="text-left mb-10">Very truly yours,</p>'
);

// 7. Footer
code = code.replace(
  '<div className="text-[11pt] space-y-1">',
  '<div className="text-[11pt] leading-tight">'
);
code = code.replace(
  '<div className="mt-4 text-[11pt] space-y-1">',
  '<div className="mt-6 text-[11pt] leading-tight">'
);
code = code.replace(
`              <div className="pl-8">
                <p>1. HRM Section</p>
                <p className="pl-4">LGU- Mambusao, Capiz</p>
                <p>2. GSIS- Roxas City</p>
              </div>`,
`              <div className="pl-12">
                <p>1. HRM Section</p>
                <p className="pl-6">LGU- Mambusao, Capiz</p>
                <p>2. GSIS- Roxas City</p>
              </div>`
);


fs.writeFileSync('src/components/NOSAModal.tsx', code);
