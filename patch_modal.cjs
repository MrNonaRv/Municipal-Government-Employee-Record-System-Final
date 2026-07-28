const fs = require('fs');

const code = `import React from 'react';
import { X, Printer } from 'lucide-react';
import { Employee } from '../types/employee';

interface Props {
  employee: Employee;
  onClose: () => void;
}

export default function LeaveCardPrintModal({ employee, onClose }: Props) {
  const records = employee.leaveRecords || [];
  
  const firstDayOfService = employee.serviceRecords && employee.serviceRecords.length > 0 
    ? employee.serviceRecords[0].serviceFrom 
    : '';

  const office = employee.serviceRecords && employee.serviceRecords.length > 0 
    ? employee.serviceRecords[employee.serviceRecords.length - 1].department 
    : '';

  const handlePrint = () => {
    window.print();
  };

  const yearsInRecords = records.map(r => {
    const m = r.period?.match(/\\b(20\\d{2})\\b/);
    return m ? parseInt(m[1]) : null;
  }).filter(y => y !== null) as number[];
  
  let startYear = new Date().getFullYear();
  if (yearsInRecords.length > 0) {
    startYear = Math.min(...yearsInRecords);
  }

  const targetYears = [startYear, startYear + 1, startYear + 2];

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
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center overflow-y-auto print:bg-white print:block print:inset-auto print:overflow-visible sm:p-4 font-sans text-black">
      <div className="bg-white w-full max-w-[800px] min-h-screen sm:min-h-0 sm:rounded-xl shadow-2xl flex flex-col print:shadow-none print:max-w-none print:w-full print:rounded-none">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 sticky top-0 z-10 print:hidden sm:rounded-t-xl">
          <h2 className="font-bold text-slate-800">Print Leave Card</h2>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors"
            >
              <Printer size={16} /> Print
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-8 print:p-0 bg-white print:w-full flex-1">
          <div className="text-center mb-6 leading-tight">
            <p className="text-sm">Republic of the Philippines</p>
            <p className="text-sm">Province of Capiz</p>
            <p className="text-sm font-bold">Municipality of Mambusao</p>
            <h1 className="text-xl font-bold mt-4 tracking-wide">LEAVE CARD</h1>
          </div>

          <div className="flex justify-between items-end mb-2 text-sm">
            <div className="flex flex-col items-center w-1/3">
              <div className="border-b border-black w-full text-center pb-0.5 min-h-[24px]">
                <span className="font-medium font-serif italic text-lg">{\`\${employee.firstName || ''} \${employee.middleName ? employee.middleName[0] + '.' : ''} \${employee.surname || ''}\`.trim()}</span>
              </div>
              <span className="text-xs">NAME</span>
            </div>
            
            <div className="flex flex-col items-center w-1/3 px-2">
              <div className="border-b border-black w-full text-center pb-0.5 min-h-[24px]">
                <span className="font-medium font-serif italic">{office}</span>
              </div>
              <span className="text-xs">OFFICE</span>
            </div>
            
            <div className="flex flex-col items-center w-1/4">
              <div className="border-b border-black w-full text-center pb-0.5 min-h-[24px]">
                <span className="font-medium font-serif italic">{firstDayOfService}</span>
              </div>
              <span className="text-xs">1ST DAY OF SERVICE</span>
            </div>
          </div>

          <table className="w-full border-collapse border border-black text-xs print:text-[11px]">
            <thead>
              <tr>
                <th rowSpan={2} className="border border-black p-1 text-center font-normal align-middle w-32">Period/Particulars</th>
                <th colSpan={4} className="border border-black p-1 text-center font-bold">VACATION LEAVE</th>
                <th colSpan={4} className="border border-black p-1 text-center font-bold">SICK LEAVE</th>
                <th rowSpan={2} className="border border-black p-1 text-center font-normal align-middle w-24 leading-tight">Date and Action<br/>Taken on<br/>Application<br/>for Leave</th>
              </tr>
              <tr>
                <th className="border border-black p-1 text-center font-normal w-12">Earned</th>
                <th className="border border-black p-1 text-center font-normal leading-tight w-12">Abs.<br/>Und.<br/>W/P</th>
                <th className="border border-black p-1 text-center font-normal w-14">Balance</th>
                <th className="border border-black p-1 text-center font-normal leading-tight w-12">Abs.<br/>Und.<br/>WOP</th>
                
                <th className="border border-black p-1 text-center font-normal w-12">Earned</th>
                <th className="border border-black p-1 text-center font-normal leading-tight w-12">Abs.<br/>Und.<br/>W/P</th>
                <th className="border border-black p-1 text-center font-normal w-14">Balance</th>
                <th className="border border-black p-1 text-center font-normal leading-tight w-12">Abs.<br/>Und.<br/>WOP</th>
              </tr>
            </thead>
            <tbody>
              {targetYears.map((year) => {
                const yearRecords = records.filter(r => r.period?.includes(year.toString()));
                const matchedIds = new Set<string>();
                const rows = [];

                rows.push(
                  <tr key={\`year-\${year}\`}>
                    <td colSpan={10} className="border border-black px-1 text-left">
                      <span className="border-b border-black pr-8">{\`\${year}\`}</span>
                    </td>
                  </tr>
                );

                stdMonths.forEach((month) => {
                  const matched = yearRecords.filter(r => r.period?.toLowerCase().includes(month.match) && !r.isSeparator);
                  if (matched.length > 0) {
                    matched.forEach(rec => {
                      matchedIds.add(rec.id);
                      let displayPeriod = rec.period || '';
                      // Simplify "2025 January" to "Jan."
                      if (displayPeriod.toLowerCase() === \`\${year} \${month.match}\` || displayPeriod.toLowerCase() === \`\${year} \${month.label.toLowerCase()}\`) {
                        displayPeriod = month.label;
                      } else {
                        displayPeriod = displayPeriod.replace(new RegExp(\`\\\\b\${year}\\\\b\`, 'g'), '').trim();
                        if (!displayPeriod) displayPeriod = month.label;
                      }

                      rows.push(
                        <tr key={rec.id}>
                          <td className="border border-black px-1 text-left whitespace-pre-wrap leading-tight">{displayPeriod}</td>
                          <td className="border border-black px-1 text-center">{rec.vlEarned}</td>
                          <td className="border border-black px-1 text-center">{rec.vlAbsUndWp}</td>
                          <td className="border border-black px-1 text-center">{rec.vlBalance}</td>
                          <td className="border border-black px-1 text-center">{rec.vlAbsUndWop}</td>
                          <td className="border border-black px-1 text-center">{rec.slEarned}</td>
                          <td className="border border-black px-1 text-center">{rec.slAbsUndWp}</td>
                          <td className="border border-black px-1 text-center">{rec.slBalance}</td>
                          <td className="border border-black px-1 text-center">{rec.slAbsUndWop}</td>
                          <td className="border border-black px-1 text-center leading-tight">{rec.dateAndAction}</td>
                        </tr>
                      );
                    });
                  } else {
                    rows.push(
                      <tr key={\`empty-\${year}-\${month.match}\`}>
                        <td className="border border-black px-1 text-left leading-tight">{month.label}</td>
                        <td className="border border-black px-1 text-center"></td>
                        <td className="border border-black px-1 text-center"></td>
                        <td className="border border-black px-1 text-center"></td>
                        <td className="border border-black px-1 text-center"></td>
                        <td className="border border-black px-1 text-center"></td>
                        <td className="border border-black px-1 text-center"></td>
                        <td className="border border-black px-1 text-center"></td>
                        <td className="border border-black px-1 text-center"></td>
                        <td className="border border-black px-1 text-center"></td>
                      </tr>
                    );
                  }
                });

                const forceLeaveRec = yearRecords.find(r => r.period?.toLowerCase().includes('force leave'));
                if (forceLeaveRec) matchedIds.add(forceLeaveRec.id);

                // Any unmatched records (e.g. Balance forwarded) for this year
                yearRecords.forEach(rec => {
                  if (!matchedIds.has(rec.id) && !rec.isSeparator) {
                    rows.push(
                      <tr key={rec.id}>
                        <td className="border border-black px-1 text-left whitespace-pre-wrap leading-tight">{rec.period?.replace(new RegExp(\`\\\\b\${year}\\\\b\`, 'g'), '').trim()}</td>
                        <td className="border border-black px-1 text-center">{rec.vlEarned}</td>
                        <td className="border border-black px-1 text-center">{rec.vlAbsUndWp}</td>
                        <td className="border border-black px-1 text-center">{rec.vlBalance}</td>
                        <td className="border border-black px-1 text-center">{rec.vlAbsUndWop}</td>
                        <td className="border border-black px-1 text-center">{rec.slEarned}</td>
                        <td className="border border-black px-1 text-center">{rec.slAbsUndWp}</td>
                        <td className="border border-black px-1 text-center">{rec.slBalance}</td>
                        <td className="border border-black px-1 text-center">{rec.slAbsUndWop}</td>
                        <td className="border border-black px-1 text-center leading-tight">{rec.dateAndAction}</td>
                      </tr>
                    );
                  }
                });

                // Force leave row
                if (forceLeaveRec) {
                  rows.push(
                    <tr key={forceLeaveRec.id}>
                      <td className="border border-black px-1 text-left leading-tight">Deduct force leave if<br/>{year} not taken</td>
                      <td className="border border-black px-1 text-center">{forceLeaveRec.vlEarned}</td>
                      <td className="border border-black px-1 text-center">{forceLeaveRec.vlAbsUndWp}</td>
                      <td className="border border-black px-1 text-center">{forceLeaveRec.vlBalance}</td>
                      <td className="border border-black px-1 text-center">{forceLeaveRec.vlAbsUndWop}</td>
                      <td className="border border-black px-1 text-center">{forceLeaveRec.slEarned}</td>
                      <td className="border border-black px-1 text-center">{forceLeaveRec.slAbsUndWp}</td>
                      <td className="border border-black px-1 text-center">{forceLeaveRec.slBalance}</td>
                      <td className="border border-black px-1 text-center">{forceLeaveRec.slAbsUndWop}</td>
                      <td className="border border-black px-1 text-center leading-tight">{forceLeaveRec.dateAndAction}</td>
                    </tr>
                  );
                } else {
                  rows.push(
                    <tr key={\`force-\${year}\`}>
                      <td className="border border-black px-1 text-left leading-tight">Deduct force leave if<br/>{year} not taken</td>
                      <td className="border border-black px-1 text-center"></td>
                      <td className="border border-black px-1 text-center"></td>
                      <td className="border border-black px-1 text-center"></td>
                      <td className="border border-black px-1 text-center"></td>
                      <td className="border border-black px-1 text-center"></td>
                      <td className="border border-black px-1 text-center"></td>
                      <td className="border border-black px-1 text-center"></td>
                      <td className="border border-black px-1 text-center"></td>
                      <td className="border border-black px-1 text-center"></td>
                    </tr>
                  );
                }

                return rows;
              })}
            </tbody>
          </table>

          <div className="mt-8">
            <h3 className="text-center font-bold text-sm mb-4">PERFORMANCE RATING</h3>
            <div className="flex justify-center gap-16 mb-8 text-sm">
              <div className="flex flex-col gap-1">
                <div>O - Outstanding</div>
                <div>VS - Very Satisfactory</div>
                <div>S - Satisfactory</div>
              </div>
              <div className="flex flex-col gap-1">
                <div>US - Unsatisfactory</div>
                <div>P - Poor</div>
              </div>
            </div>

            <div className="flex justify-between border-t border-black pt-2 text-sm max-w-[600px] mx-auto">
              <div className="flex flex-col w-32">
                <div>20___</div>
                <div>1st Sem.</div>
                <div>2nd Sem.</div>
              </div>
              <div className="flex flex-col w-32">
                <div className="text-center border-t border-black w-12 mb-1 mx-auto"></div>
                <div>20___</div>
                <div>1st Sem.</div>
                <div>2nd Sem.</div>
              </div>
              <div className="flex flex-col w-32">
                <div className="text-center border-t border-black w-12 mb-1 mx-auto"></div>
                <div>20___</div>
                <div>1st Sem.</div>
                <div>2nd Sem.</div>
              </div>
            </div>
          </div>

          <style>{\`
            @media print {
              @page { size: portrait; margin: 15mm; }
              body * { visibility: hidden; }
              .fixed.inset-0, .fixed.inset-0 * { visibility: visible; }
              .fixed.inset-0 { position: absolute; left: 0; top: 0; }
              .print\\\\:hidden { display: none !important; }
            }
          \`}</style>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/LeaveCardPrintModal.tsx', code);
console.log('patched');
