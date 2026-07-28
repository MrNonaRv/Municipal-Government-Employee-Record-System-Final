const fs = require('fs');

const code = `import React, { useMemo, useState } from 'react';
import { Employee, LeaveRecord } from '../types/employee';
import { Printer } from 'lucide-react';
import LeaveCardPrintModal from './LeaveCardPrintModal';

interface Props {
  employee: Employee;
}

export default function LeaveCardViewer({ employee }: Props) {
  const records = employee.leaveRecords || [];
  
  const latestSalary = useMemo(() => {
    if (!employee.serviceRecords || employee.serviceRecords.length === 0) return 0;
    const latest = employee.serviceRecords[employee.serviceRecords.length - 1];
    const salaryStr = latest.salary?.toString().replace(/[^0-9.]/g, '') || '0';
    return parseFloat(salaryStr);
  }, [employee.serviceRecords]);

  const dailyRate = latestSalary / 22;
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  const calculateDeduction = (wopStr: string) => {
    const wop = parseFloat(wopStr) || 0;
    return wop * dailyRate;
  };

  const yearsInRecords = records.map(r => {
    const m = r.period?.match(/\\b(20\\d{2})\\b/);
    return m ? parseInt(m[1]) : null;
  }).filter(y => y !== null) as number[];
  
  let startYear = new Date().getFullYear();
  if (yearsInRecords.length > 0) {
    startYear = Math.min(...yearsInRecords);
  }

  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();

  const targetYears = [];
  for (let y = startYear; y <= Math.max(startYear, currentYear); y++) {
    targetYears.push(y);
  }

  const stdMonths = [
    { label: 'Jan.', match: 'jan' },
    { label: 'Feb.', match: 'feb' },
    { label: 'Mar.', match: 'mar' },
    { label: 'Apr.', match: 'apr' },
    { label: 'May', match: 'may' },
    { label: 'June', match: 'jun' },
    { label: 'July', match: 'jul' },
    { label: 'Aug.', match: 'aug' },
    { label: 'Sept.', match: 'sep' },
    { label: 'Oct.', match: 'oct' },
    { label: 'Nov.', match: 'nov' },
    { label: 'Dec.', match: 'dec' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold uppercase tracking-tight text-[var(--navy)]">Leave Card</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Official Leave Records & Salary Calculation</p>
        </div>
        <div className="flex gap-4 items-end">
          <button
            onClick={() => setIsPrintOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-slate-700 transition-colors h-[52px]"
          >
            <Printer size={16} /> Print CSC Form 14
          </button>
          <div className="text-right bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Base Monthly Salary</p>
          <p className="font-mono font-bold text-lg text-slate-800">₱{latestSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-[9px] uppercase font-bold text-slate-400 mt-1">Est. Daily Rate: ₱{dailyRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        {records.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Leave Records Found</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] uppercase bg-slate-50 text-slate-500 font-black tracking-wider">
              <tr>
                <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 align-middle">Period / Particulars</th>
                <th colSpan={4} className="px-4 py-2 border-r border-slate-200 text-center bg-blue-50/50 text-blue-800">Vacation Leave</th>
                <th colSpan={4} className="px-4 py-2 border-r border-slate-200 text-center bg-emerald-50/50 text-emerald-800">Sick Leave</th>
                <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 align-middle">Action Taken</th>
                <th rowSpan={2} className="px-4 py-3 align-middle text-right bg-red-50/50 text-red-800">Est. Salary Deduction (WOP)</th>
              </tr>
              <tr className="border-b border-slate-200">
                <th className="px-2 py-2 border-r border-slate-200 bg-blue-50/30 text-center" title="Earned">Earned</th>
                <th className="px-2 py-2 border-r border-slate-200 bg-blue-50/30 text-center" title="Absence/Undertime With Pay">Abs/Und W/P</th>
                <th className="px-2 py-2 border-r border-slate-200 bg-blue-50/30 text-center" title="Balance">Balance</th>
                <th className="px-2 py-2 border-r border-slate-200 bg-blue-50/30 text-center text-red-600" title="Absence/Undertime Without Pay">Abs/Und WOP</th>
                <th className="px-2 py-2 border-r border-slate-200 bg-emerald-50/30 text-center" title="Earned">Earned</th>
                <th className="px-2 py-2 border-r border-slate-200 bg-emerald-50/30 text-center" title="Absence/Undertime With Pay">Abs/Und W/P</th>
                <th className="px-2 py-2 border-r border-slate-200 bg-emerald-50/30 text-center" title="Balance">Balance</th>
                <th className="px-2 py-2 border-r border-slate-200 bg-emerald-50/30 text-center text-red-600" title="Absence/Undertime Without Pay">Abs/Und WOP</th>
              </tr>
            </thead>
            <tbody>
              {targetYears.map((year) => {
                const yearRecords = records.filter(r => r.period?.includes(year.toString()));
                const matchedIds = new Set<string>();
                const rows = [];

                rows.push(
                  <tr key={\`year-\${year}\`} className="border-b-4 border-slate-300 bg-slate-100">
                    <td colSpan={11} className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-widest">
                      {year}
                    </td>
                  </tr>
                );

                stdMonths.forEach((month, monthIndex) => {
                  const isFuture = year > currentYear || (year === currentYear && monthIndex > currentMonthIndex);
                  const matched = yearRecords.filter(r => r.period?.toLowerCase().includes(month.match) && !r.isSeparator);
                  
                  if (matched.length > 0 && !isFuture) {
                    matched.forEach(rec => {
                      matchedIds.add(rec.id);
                      let displayPeriod = rec.period || '';
                      if (displayPeriod.toLowerCase() === \`\${year} \${month.match}\` || displayPeriod.toLowerCase() === \`\${year} \${month.label.toLowerCase()}\`) {
                        displayPeriod = month.label;
                      } else {
                        displayPeriod = displayPeriod.replace(new RegExp(\`\\\\b\${year}\\\\b\`, 'g'), '').trim();
                        if (!displayPeriod) displayPeriod = month.label;
                      }
                      
                      const totalDeduction = calculateDeduction(rec.vlAbsUndWop) + calculateDeduction(rec.slAbsUndWop);

                      rows.push(
                        <tr key={rec.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 border-r border-slate-200 font-bold whitespace-nowrap">{displayPeriod}</td>
                          <td className="px-2 py-3 border-r border-slate-100 text-center">{rec.vlEarned}</td>
                          <td className="px-2 py-3 border-r border-slate-100 text-center">{rec.vlAbsUndWp}</td>
                          <td className="px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]">{rec.vlBalance}</td>
                          <td className="px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10">{rec.vlAbsUndWop}</td>
                          <td className="px-2 py-3 border-r border-slate-100 text-center">{rec.slEarned}</td>
                          <td className="px-2 py-3 border-r border-slate-100 text-center">{rec.slAbsUndWp}</td>
                          <td className="px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]">{rec.slBalance}</td>
                          <td className="px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10">{rec.slAbsUndWop}</td>
                          <td className="px-4 py-3 border-r border-slate-200 text-xs text-slate-600">{rec.dateAndAction}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-red-600 bg-red-50/10">
                            {totalDeduction > 0 ? \`-₱\${totalDeduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\` : '-'}
                          </td>
                        </tr>
                      );
                    });
                  } else {
                    // For future months or missing months, render a blank row
                    rows.push(
                      <tr key={\`empty-\${year}-\${month.match}\`} className="border-b border-slate-100 opacity-50 hover:opacity-100 hover:bg-slate-50/50 transition-all">
                        <td className="px-4 py-3 border-r border-slate-200 font-medium whitespace-nowrap text-slate-400">{month.label}</td>
                        <td className="px-2 py-3 border-r border-slate-100 text-center"></td>
                        <td className="px-2 py-3 border-r border-slate-100 text-center"></td>
                        <td className="px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]"></td>
                        <td className="px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10"></td>
                        <td className="px-2 py-3 border-r border-slate-100 text-center"></td>
                        <td className="px-2 py-3 border-r border-slate-100 text-center"></td>
                        <td className="px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]"></td>
                        <td className="px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10"></td>
                        <td className="px-4 py-3 border-r border-slate-200 text-xs text-slate-600"></td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-red-600 bg-red-50/10">-</td>
                      </tr>
                    );
                  }
                });

                const forceLeaveRec = yearRecords.find(r => r.period?.toLowerCase().includes('force leave'));
                if (forceLeaveRec) matchedIds.add(forceLeaveRec.id);

                yearRecords.forEach(rec => {
                  if (!matchedIds.has(rec.id) && !rec.isSeparator) {
                    const totalDeduction = calculateDeduction(rec.vlAbsUndWop) + calculateDeduction(rec.slAbsUndWop);
                    rows.push(
                      <tr key={rec.id} className="border-b border-slate-100 bg-blue-50/20 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 border-r border-slate-200 font-bold whitespace-nowrap">{rec.period?.replace(new RegExp(\`\\\\b\${year}\\\\b\`, 'g'), '').trim()}</td>
                        <td className="px-2 py-3 border-r border-slate-100 text-center">{rec.vlEarned}</td>
                        <td className="px-2 py-3 border-r border-slate-100 text-center">{rec.vlAbsUndWp}</td>
                        <td className="px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]">{rec.vlBalance}</td>
                        <td className="px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10">{rec.vlAbsUndWop}</td>
                        <td className="px-2 py-3 border-r border-slate-100 text-center">{rec.slEarned}</td>
                        <td className="px-2 py-3 border-r border-slate-100 text-center">{rec.slAbsUndWp}</td>
                        <td className="px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]">{rec.slBalance}</td>
                        <td className="px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10">{rec.slAbsUndWop}</td>
                        <td className="px-4 py-3 border-r border-slate-200 text-xs text-slate-600">{rec.dateAndAction}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-red-600 bg-red-50/10">
                          {totalDeduction > 0 ? \`-₱\${totalDeduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\` : '-'}
                        </td>
                      </tr>
                    );
                  }
                });

                if (forceLeaveRec) {
                  const totalDeduction = calculateDeduction(forceLeaveRec.vlAbsUndWop) + calculateDeduction(forceLeaveRec.slAbsUndWop);
                  rows.push(
                    <tr key={forceLeaveRec.id} className="border-b border-slate-100 bg-orange-50 hover:bg-orange-100/50 transition-colors">
                      <td className="px-4 py-3 border-r border-slate-200 font-bold whitespace-nowrap text-sm leading-tight text-orange-900">Deduct force leave if<br/>{year} not taken</td>
                      <td className="px-2 py-3 border-r border-slate-100 text-center">{forceLeaveRec.vlEarned}</td>
                      <td className="px-2 py-3 border-r border-slate-100 text-center">{forceLeaveRec.vlAbsUndWp}</td>
                      <td className="px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]">{forceLeaveRec.vlBalance}</td>
                      <td className="px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10">{forceLeaveRec.vlAbsUndWop}</td>
                      <td className="px-2 py-3 border-r border-slate-100 text-center">{forceLeaveRec.slEarned}</td>
                      <td className="px-2 py-3 border-r border-slate-100 text-center">{forceLeaveRec.slAbsUndWp}</td>
                      <td className="px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]">{forceLeaveRec.slBalance}</td>
                      <td className="px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10">{forceLeaveRec.slAbsUndWop}</td>
                      <td className="px-4 py-3 border-r border-slate-200 text-xs text-slate-600">{forceLeaveRec.dateAndAction}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-red-600 bg-red-50/10">
                        {totalDeduction > 0 ? \`-₱\${totalDeduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\` : '-'}
                      </td>
                    </tr>
                  );
                } else {
                  rows.push(
                    <tr key={\`force-\${year}\`} className="border-b border-slate-100 opacity-50 hover:opacity-100 transition-all bg-slate-50">
                      <td className="px-4 py-3 border-r border-slate-200 font-medium whitespace-nowrap text-xs leading-tight text-slate-500">Deduct force leave if<br/>{year} not taken</td>
                      <td colSpan={10} className="px-4 py-3 text-center text-slate-400">Not recorded</td>
                    </tr>
                  );
                }

                return rows;
              })}
            </tbody>
          </table>
        )}
      </div>
      {isPrintOpen && (
        <LeaveCardPrintModal employee={employee} onClose={() => setIsPrintOpen(false)} />
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/components/LeaveCardViewer.tsx', code);
console.log('rewrote viewer');
