const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardViewer.tsx', 'utf8');

const target1 = `import React, { useMemo } from 'react';
import { Employee, LeaveRecord } from '../types/employee';`;
const replace1 = `import React, { useMemo, useState } from 'react';
import { Employee, LeaveRecord } from '../types/employee';
import { Printer } from 'lucide-react';
import LeaveCardPrintModal from './LeaveCardPrintModal';`;

const target2 = `  const calculateDeduction = (wopStr: string) => {
    const wop = parseFloat(wopStr) || 0;
    return wop * dailyRate;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">`;
const replace2 = `  const [isPrintOpen, setIsPrintOpen] = useState(false);

  const calculateDeduction = (wopStr: string) => {
    const wop = parseFloat(wopStr) || 0;
    return wop * dailyRate;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">`;

const target3 = `        <div className="text-right bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
          <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Base Monthly Salary</p>`;
const replace3 = `        <div className="flex gap-4 items-end">
          <button
            onClick={() => setIsPrintOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-slate-700 transition-colors h-[52px]"
          >
            <Printer size={16} /> Print CSC Form 14
          </button>
          <div className="text-right bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Base Monthly Salary</p>`;

const target4 = `      </div>
    </div>
  );
}`;
const replace4 = `      </div>
      {isPrintOpen && (
        <LeaveCardPrintModal employee={employee} onClose={() => setIsPrintOpen(false)} />
      )}
    </div>
  );
}`;

if (code.includes(target1)) code = code.replace(target1, replace1);
else console.log("Failed 1");

if (code.includes(target2)) code = code.replace(target2, replace2);
else console.log("Failed 2");

if (code.includes(target3)) code = code.replace(target3, replace3);
else console.log("Failed 3");

if (code.includes(target4)) code = code.replace(target4, replace4);
else console.log("Failed 4");

fs.writeFileSync('src/components/LeaveCardViewer.tsx', code);
console.log("Patched successfully!");
