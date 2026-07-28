import React, { useMemo } from 'react';
import { Employee, LeaveRecord } from '../types/employee';

interface Props {
  employee: Employee;
}

export default function LeaveCardViewer({ employee }: Props) {
  const records = employee.leaveRecords || [];
  
  // Try to get latest salary from service records
  const latestSalary = useMemo(() => {
    if (!employee.serviceRecords || employee.serviceRecords.length === 0) return 0;
    const latest = employee.serviceRecords[employee.serviceRecords.length - 1];
    // Remove non-numeric characters except dot
    const salaryStr = latest.salary?.toString().replace(/[^0-9.]/g, '') || '0';
    return parseFloat(salaryStr);
  }, [employee.serviceRecords]);

  // Daily rate: usually monthly salary / 22 working days (approximate for government standard if not specified)
  const dailyRate = latestSalary / 22;

  const calculateDeduction = (wopStr: string) => {
    const wop = parseFloat(wopStr) || 0;
    return wop * dailyRate;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold uppercase tracking-tight text-[var(--navy)]">Leave Card</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Official Leave Records & Salary Calculation</p>
        </div>
        <div className="text-right bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
          <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Base Monthly Salary</p>
          <p className="font-mono font-bold text-lg text-slate-800">₱{latestSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-[9px] uppercase font-bold text-slate-400 mt-1">Est. Daily Rate: ₱{dailyRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
              {records.map((record) => {
                if (record.isSeparator) {
                  return (
                    <tr key={record.id} className="border-b-4 border-slate-300 bg-slate-100">
                      <td colSpan={11} className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-widest">
                        {record.period || '--- YEAR SEPARATOR ---'}
                      </td>
                    </tr>
                  );
                }

                const vlWopDeduction = calculateDeduction(record.vlAbsUndWop);
                const slWopDeduction = calculateDeduction(record.slAbsUndWop);
                const totalDeduction = vlWopDeduction + slWopDeduction;
                
                return (
                  <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 border-r border-slate-200 font-bold whitespace-nowrap">{record.period}</td>
                    
                    {/* VL */}
                    <td className="px-2 py-3 border-r border-slate-100 text-center">{record.vlEarned}</td>
                    <td className="px-2 py-3 border-r border-slate-100 text-center">{record.vlAbsUndWp}</td>
                    <td className="px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]">{record.vlBalance}</td>
                    <td className="px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10">{record.vlAbsUndWop}</td>
                    
                    {/* SL */}
                    <td className="px-2 py-3 border-r border-slate-100 text-center">{record.slEarned}</td>
                    <td className="px-2 py-3 border-r border-slate-100 text-center">{record.slAbsUndWp}</td>
                    <td className="px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]">{record.slBalance}</td>
                    <td className="px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10">{record.slAbsUndWop}</td>
                    
                    <td className="px-4 py-3 border-r border-slate-200 text-xs text-slate-600">{record.dateAndAction}</td>
                    
                    <td className="px-4 py-3 text-right font-mono font-bold text-red-600 bg-red-50/10">
                      {totalDeduction > 0 ? `-₱${totalDeduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
