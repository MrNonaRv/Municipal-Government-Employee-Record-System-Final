const fs = require('fs');
const code = fs.readFileSync('src/components/LeaveCardViewer.tsx', 'utf8');

const newCode = `import React, { useMemo, useState } from 'react';
import { Employee, LeaveRecord } from '../types/employee';
import { Printer } from 'lucide-react';
import LeaveCardPrintModal from './LeaveCardPrintModal';

interface Props {
  employee: Employee;
  onSave?: (emp: Employee) => void;
}

interface EditingCell {
  id: string;
  field: keyof LeaveRecord;
  value: string;
  year?: number;
  month?: string;
}

export default function LeaveCardViewer({ employee, onSave }: Props) {
  const records = employee.leaveRecords || [];
  
  const latestSalary = useMemo(() => {
    if (!employee.serviceRecords || employee.serviceRecords.length === 0) return 0;
    const latest = employee.serviceRecords[employee.serviceRecords.length - 1];
    const salaryStr = latest.salary?.toString().replace(/[^0-9.]/g, '') || '0';
    return parseFloat(salaryStr);
  }, [employee.serviceRecords]);

  const dailyRate = latestSalary / 22;
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

  const calculateDeduction = (wopStr: string) => {
    const wop = parseFloat(wopStr) || 0;
    return wop * dailyRate;
  };

  const recalculateBalances = (recordsList: LeaveRecord[], editedId?: string) => {
    let currentVl = 0;
    let currentSl = 0;
    return recordsList.map((rec) => {
      if (rec.id === editedId || rec.vlManual) {
        currentVl = parseFloat(rec.vlBalance || '0') || 0;
      } else {
        const vlEarnedStr = rec.vlEarned?.trim() || '';
        const vlAbsStr = rec.vlAbsUndWp?.trim() || '';
        
        if (vlEarnedStr === '' && vlAbsStr === '' && rec.vlBalance) {
          currentVl = parseFloat(rec.vlBalance || '0') || 0;
        } else {
          const vlEarned = parseFloat(vlEarnedStr || '0') || 0;
          const vlAbs = parseFloat(vlAbsStr || '0') || 0;
          currentVl = currentVl + vlEarned - vlAbs;
          rec.vlBalance = Number(currentVl.toFixed(3)).toString();
        }
      }

      if (rec.id === editedId || rec.slManual) {
        currentSl = parseFloat(rec.slBalance || '0') || 0;
      } else {
        const slEarnedStr = rec.slEarned?.trim() || '';
        const slAbsStr = rec.slAbsUndWp?.trim() || '';
        
        if (slEarnedStr === '' && slAbsStr === '' && rec.slBalance) {
          currentSl = parseFloat(rec.slBalance || '0') || 0;
        } else {
          const slEarned = parseFloat(slEarnedStr || '0') || 0;
          const slAbs = parseFloat(slAbsStr || '0') || 0;
          currentSl = currentSl + slEarned - slAbs;
          rec.slBalance = Number(currentSl.toFixed(3)).toString();
        }
      }
      return rec;
    });
  };

  const saveEdit = () => {
    if (!editingCell || !onSave) {
      setEditingCell(null);
      return;
    }
    
    let newRecords = [...records];
    const { id, field, value, year, month } = editingCell;

    if (id.startsWith('new-')) {
      if (!value.trim()) {
         setEditingCell(null);
         return;
      }
      const newRec: LeaveRecord = {
        id: 'lc-' + Date.now().toString(36),
        period: \`\${year} \${month}\`,
        vlEarned: field === 'vlEarned' ? value : '1.25',
        vlAbsUndWp: field === 'vlAbsUndWp' ? value : '',
        vlBalance: field === 'vlBalance' ? value : '',
        vlAbsUndWop: field === 'vlAbsUndWop' ? value : '',
        slEarned: field === 'slEarned' ? value : '1.25',
        slAbsUndWp: field === 'slAbsUndWp' ? value : '',
        slBalance: field === 'slBalance' ? value : '',
        slAbsUndWop: field === 'slAbsUndWop' ? value : '',
        dateAndAction: field === 'dateAndAction' ? value : ''
      };
      
      newRecords.push(newRec);
      
      // Sort chronologically
      newRecords.sort((a, b) => {
        if (a.isSeparator) return -1;
        if (b.isSeparator) return 1;
        const aYear = parseInt(a.period?.match(/\\b(20\\d{2})\\b/)?.[1] || '0');
        const bYear = parseInt(b.period?.match(/\\b(20\\d{2})\\b/)?.[1] || '0');
        if (aYear !== bYear) return aYear - bYear;
        
        const getMonthIndex = (period: string) => {
          const p = (period || '').toLowerCase();
          const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
          const idx = months.findIndex(m => p.includes(m));
          return idx === -1 ? 99 : idx;
        };
        return getMonthIndex(a.period || '') - getMonthIndex(b.period || '');
      });
      
    } else {
      const existing = newRecords.find(r => r.id === id);
      if (existing && existing[field] === value) {
        setEditingCell(null);
        return;
      }
      
      newRecords = newRecords.map(r => {
        if (r.id === id) {
          const updated = { ...r, [field]: value };
          if (field === 'vlBalance') updated.vlManual = true;
          if (field === 'slBalance') updated.slManual = true;
          if (field === 'vlEarned' || field === 'vlAbsUndWp') updated.vlManual = false;
          if (field === 'slEarned' || field === 'slAbsUndWp') updated.slManual = false;
          return updated;
        }
        return r;
      });
    }

    newRecords = recalculateBalances(newRecords, id.startsWith('new-') ? undefined : id);
    onSave({ ...employee, leaveRecords: newRecords });
    setEditingCell(null);
  };

  const renderEditableCell = (
    rec: LeaveRecord | null, 
    year: number, 
    monthMatch: string, 
    monthLabel: string, 
    field: keyof LeaveRecord, 
    displayValue: string | undefined, 
    className: string, 
    align: 'left' | 'center' | 'right' = 'center'
  ) => {
    const id = rec ? rec.id : \`new-\${year}-\${monthMatch}\`;
    const isEditing = editingCell?.id === id && editingCell?.field === field;

    const handleDoubleClick = () => {
      if (!onSave) return;
      setEditingCell({
        id,
        field,
        value: rec ? (rec[field] || '') : '',
        year,
        month: monthLabel
      });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        saveEdit();
      } else if (e.key === 'Escape') {
        setEditingCell(null);
      }
    };

    if (isEditing) {
      return (
        <td className={className}>
          <input 
            autoFocus
            type="text"
            className={\`w-full text-\${align} border-b-2 border-blue-500 focus:outline-none bg-blue-50/50 px-1\`}
            value={editingCell.value}
            onChange={e => setEditingCell({ ...editingCell, value: e.target.value })}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
          />
        </td>
      );
    }

    return (
      <td 
        className={\`\${className} \${onSave ? 'cursor-pointer hover:bg-blue-50/30' : ''}\`} 
        onDoubleClick={handleDoubleClick}
        title={onSave ? "Double-click to edit" : undefined}
      >
        {displayValue}
      </td>
    );
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
          {onSave && <p className="text-blue-500 font-bold tracking-tight text-xs mt-2 italic">Double-click any cell to edit</p>}
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
        {records.length === 0 && !onSave ? (
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
                  
                  matched.forEach(rec => matchedIds.add(rec.id));
                  
                  if (matched.length > 0 && !isFuture) {
                    matched.forEach(rec => {
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
                          {renderEditableCell(rec, year, month.match, month.label, 'vlEarned', rec.vlEarned, "px-2 py-3 border-r border-slate-100 text-center")}
                          {renderEditableCell(rec, year, month.match, month.label, 'vlAbsUndWp', rec.vlAbsUndWp, "px-2 py-3 border-r border-slate-100 text-center")}
                          {renderEditableCell(rec, year, month.match, month.label, 'vlBalance', rec.vlBalance, "px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]")}
                          {renderEditableCell(rec, year, month.match, month.label, 'vlAbsUndWop', rec.vlAbsUndWop, "px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10")}
                          
                          {renderEditableCell(rec, year, month.match, month.label, 'slEarned', rec.slEarned, "px-2 py-3 border-r border-slate-100 text-center")}
                          {renderEditableCell(rec, year, month.match, month.label, 'slAbsUndWp', rec.slAbsUndWp, "px-2 py-3 border-r border-slate-100 text-center")}
                          {renderEditableCell(rec, year, month.match, month.label, 'slBalance', rec.slBalance, "px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]")}
                          {renderEditableCell(rec, year, month.match, month.label, 'slAbsUndWop', rec.slAbsUndWop, "px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10")}
                          
                          {renderEditableCell(rec, year, month.match, month.label, 'dateAndAction', rec.dateAndAction, "px-4 py-3 border-r border-slate-200 text-xs text-slate-600", "left")}
                          
                          <td className="px-4 py-3 text-right font-mono font-bold text-red-600 bg-red-50/10">
                            {totalDeduction > 0 ? \`-₱\${totalDeduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\` : '-'}
                          </td>
                        </tr>
                      );
                    });
                  } else {
                    rows.push(
                      <tr key={\`empty-\${year}-\${month.match}\`} className="border-b border-slate-100 opacity-50 hover:opacity-100 hover:bg-slate-50/50 transition-all">
                        <td className="px-4 py-3 border-r border-slate-200 font-medium whitespace-nowrap text-slate-400">{month.label}</td>
                        {renderEditableCell(null, year, month.match, month.label, 'vlEarned', '', "px-2 py-3 border-r border-slate-100 text-center")}
                        {renderEditableCell(null, year, month.match, month.label, 'vlAbsUndWp', '', "px-2 py-3 border-r border-slate-100 text-center")}
                        {renderEditableCell(null, year, month.match, month.label, 'vlBalance', '', "px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]")}
                        {renderEditableCell(null, year, month.match, month.label, 'vlAbsUndWop', '', "px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10")}
                        
                        {renderEditableCell(null, year, month.match, month.label, 'slEarned', '', "px-2 py-3 border-r border-slate-100 text-center")}
                        {renderEditableCell(null, year, month.match, month.label, 'slAbsUndWp', '', "px-2 py-3 border-r border-slate-100 text-center")}
                        {renderEditableCell(null, year, month.match, month.label, 'slBalance', '', "px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]")}
                        {renderEditableCell(null, year, month.match, month.label, 'slAbsUndWop', '', "px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10")}
                        
                        {renderEditableCell(null, year, month.match, month.label, 'dateAndAction', '', "px-4 py-3 border-r border-slate-200 text-xs text-slate-600", "left")}
                        
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
                        {renderEditableCell(rec, year, '', '', 'vlEarned', rec.vlEarned, "px-2 py-3 border-r border-slate-100 text-center")}
                        {renderEditableCell(rec, year, '', '', 'vlAbsUndWp', rec.vlAbsUndWp, "px-2 py-3 border-r border-slate-100 text-center")}
                        {renderEditableCell(rec, year, '', '', 'vlBalance', rec.vlBalance, "px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]")}
                        {renderEditableCell(rec, year, '', '', 'vlAbsUndWop', rec.vlAbsUndWop, "px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10")}
                        
                        {renderEditableCell(rec, year, '', '', 'slEarned', rec.slEarned, "px-2 py-3 border-r border-slate-100 text-center")}
                        {renderEditableCell(rec, year, '', '', 'slAbsUndWp', rec.slAbsUndWp, "px-2 py-3 border-r border-slate-100 text-center")}
                        {renderEditableCell(rec, year, '', '', 'slBalance', rec.slBalance, "px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]")}
                        {renderEditableCell(rec, year, '', '', 'slAbsUndWop', rec.slAbsUndWop, "px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10")}
                        
                        {renderEditableCell(rec, year, '', '', 'dateAndAction', rec.dateAndAction, "px-4 py-3 border-r border-slate-200 text-xs text-slate-600", "left")}
                        
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
                      {renderEditableCell(forceLeaveRec, year, 'force leave', 'force leave', 'vlEarned', forceLeaveRec.vlEarned, "px-2 py-3 border-r border-slate-100 text-center")}
                      {renderEditableCell(forceLeaveRec, year, 'force leave', 'force leave', 'vlAbsUndWp', forceLeaveRec.vlAbsUndWp, "px-2 py-3 border-r border-slate-100 text-center")}
                      {renderEditableCell(forceLeaveRec, year, 'force leave', 'force leave', 'vlBalance', forceLeaveRec.vlBalance, "px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]")}
                      {renderEditableCell(forceLeaveRec, year, 'force leave', 'force leave', 'vlAbsUndWop', forceLeaveRec.vlAbsUndWop, "px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10")}
                      
                      {renderEditableCell(forceLeaveRec, year, 'force leave', 'force leave', 'slEarned', forceLeaveRec.slEarned, "px-2 py-3 border-r border-slate-100 text-center")}
                      {renderEditableCell(forceLeaveRec, year, 'force leave', 'force leave', 'slAbsUndWp', forceLeaveRec.slAbsUndWp, "px-2 py-3 border-r border-slate-100 text-center")}
                      {renderEditableCell(forceLeaveRec, year, 'force leave', 'force leave', 'slBalance', forceLeaveRec.slBalance, "px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]")}
                      {renderEditableCell(forceLeaveRec, year, 'force leave', 'force leave', 'slAbsUndWop', forceLeaveRec.slAbsUndWop, "px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10")}
                      
                      {renderEditableCell(forceLeaveRec, year, 'force leave', 'force leave', 'dateAndAction', forceLeaveRec.dateAndAction, "px-4 py-3 border-r border-slate-200 text-xs text-slate-600", "left")}
                      
                      <td className="px-4 py-3 text-right font-mono font-bold text-red-600 bg-red-50/10">
                        {totalDeduction > 0 ? \`-₱\${totalDeduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\` : '-'}
                      </td>
                    </tr>
                  );
                } else {
                  rows.push(
                    <tr key={\`force-\${year}\`} className="border-b border-slate-100 opacity-50 hover:opacity-100 transition-all bg-slate-50">
                      <td className="px-4 py-3 border-r border-slate-200 font-medium whitespace-nowrap text-xs leading-tight text-slate-500">Deduct force leave if<br/>{year} not taken</td>
                      {renderEditableCell(null, year, 'force leave', 'force leave', 'vlEarned', '', "px-2 py-3 border-r border-slate-100 text-center")}
                      {renderEditableCell(null, year, 'force leave', 'force leave', 'vlAbsUndWp', '', "px-2 py-3 border-r border-slate-100 text-center")}
                      {renderEditableCell(null, year, 'force leave', 'force leave', 'vlBalance', '', "px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]")}
                      {renderEditableCell(null, year, 'force leave', 'force leave', 'vlAbsUndWop', '', "px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10")}
                      {renderEditableCell(null, year, 'force leave', 'force leave', 'slEarned', '', "px-2 py-3 border-r border-slate-100 text-center")}
                      {renderEditableCell(null, year, 'force leave', 'force leave', 'slAbsUndWp', '', "px-2 py-3 border-r border-slate-100 text-center")}
                      {renderEditableCell(null, year, 'force leave', 'force leave', 'slBalance', '', "px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]")}
                      {renderEditableCell(null, year, 'force leave', 'force leave', 'slAbsUndWop', '', "px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10")}
                      {renderEditableCell(null, year, 'force leave', 'force leave', 'dateAndAction', '', "px-4 py-3 border-r border-slate-200 text-xs text-slate-600", "left")}
                      <td className="px-4 py-3 text-right font-mono font-bold text-red-600 bg-red-50/10">-</td>
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
`
fs.writeFileSync('src/components/LeaveCardViewer.tsx', newCode);
console.log('patched viewer for edit');
