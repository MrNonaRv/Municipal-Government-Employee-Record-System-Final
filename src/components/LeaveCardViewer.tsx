import React, { useMemo, useState } from 'react';
import { Employee, LeaveRecord } from '../types/employee';
import { formatDate, formatSalary } from '../utils/helpers';
import { Printer, Plus, Download, Calendar } from 'lucide-react';
import LeaveCardPrintModal from './LeaveCardPrintModal';
import AddAbsenceModal from './AddAbsenceModal';

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

const parseDetailedAbsences = (text: string) => {
  if (!text || !text.trim()) return { vl: 0, sl: 0, fl: 0, pl: 0, spl: 0, vl_wop: 0, sl_wop: 0, unknown: 0 };
  
  const parseChunk = (chunk: string) => {
    let days = 0;
    const dayMap = new Map<number, number>();
    const parts = chunk.split(',');
    for (let part of parts) {
      part = part.trim();
      if (!part) continue;
      
      const isHalf = part.toLowerCase().includes('half') || part.toLowerCase().includes('am') || part.toLowerCase().includes('pm');
      const weight = isHalf ? 0.5 : 1;
      
      const rangeMatch = part.match(/(\d+)\s*-\s*(\d+)/);
      if (rangeMatch) {
         const s = parseInt(rangeMatch[1]);
         const e = parseInt(rangeMatch[2]);
         if (e >= s && s <= 31 && e <= 31) {
            for (let i = s; i <= e; i++) {
               const curr = dayMap.get(i) || 0;
               dayMap.set(i, Math.max(curr, weight));
            }
         }
         continue;
      }
      
      const numMatch = part.match(/(\d+)/);
      if (numMatch) {
         const val = parseInt(numMatch[1]);
         if (val <= 31) {
            const curr = dayMap.get(val) || 0;
            dayMap.set(val, Math.max(curr, weight));
         }
      }
    }
    for (const value of dayMap.values()) days += value;
    return days;
  };
  
  const result = { vl: 0, sl: 0, fl: 0, pl: 0, spl: 0, vl_wop: 0, sl_wop: 0, unknown: 0 };
  const upperText = text.toUpperCase();
  
  if (!/(VL WOP|SL WOP|AWOL|LWOP|WOP|VL|SL|FL|PL|SPL)\s*:/.test(upperText)) {
      result.unknown = parseChunk(text);
      return result;
  }
  
  const parts = upperText.split(/(VL WOP|SL WOP|AWOL|LWOP|WOP|VL|SL|FL|PL|SPL)\s*:/).filter(Boolean);
  
  let currentType = 'unknown';
  for (let i = 0; i < parts.length; i++) {
     const p = parts[i].trim();
     if (['VL WOP', 'SL WOP', 'AWOL', 'LWOP', 'WOP', 'VL', 'SL', 'FL', 'PL', 'SPL'].includes(p)) {
         currentType = p.toLowerCase().replace(' ', '_');
         if (currentType === 'awol' || currentType === 'lwop' || currentType === 'wop') currentType = 'vl_wop';
     } else {
         (result as any)[currentType] += parseChunk(p);
     }
  }
  return result;
};

const EditableCellComponent = ({
  initialValue,
  onSave,
  onCancel,
  onTab,
  align,
  placeholder,
  isEditing
}: {
  initialValue: string;
  onSave: (val: string) => void;
  onCancel: () => void;
  onTab: (shiftKey: boolean) => void;
  align: string;
  placeholder: string;
  isEditing: boolean;
}) => {
  const [val, setVal] = useState(initialValue);
  
  return (
    <input
      autoFocus
      type="text"
      className={`w-full text-${align} border-b-2 border-blue-500 focus:outline-none bg-blue-50/50 px-1`}
      value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={() => onSave(val)}
      onKeyDown={e => {
        if (e.key === 'Escape') onCancel();
        else if (e.key === 'Enter') onSave(val);
        else if (e.key === 'Tab') {
          e.preventDefault();
          onSave(val);
          onTab(e.shiftKey);
        }
      }}
      onFocus={e => e.target.select()}
      placeholder={placeholder}
    />
  );
};

const LeaveCardViewer = ({ employee, onSave }: Props) => {
  const records = employee.leaveRecords || [];
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();


  const handleAddAbsence = (year: number, month: string, leaveType: string, dates: string) => {
    if (!onSave) return;
    let newRecords = [...records];
    const periodMatch = `${year} ${month}`.toLowerCase();
    
    let existingIdx = newRecords.findIndex(r => {
      const p = (r.period || '').toLowerCase();
      return p.includes(year.toString()) && p.includes(month.toLowerCase().replace('.', ''));
    });
    if (existingIdx >= 0) {
      let rec = { ...newRecords[existingIdx] };
      const parsed = parseDetailedAbsences(rec.particulars || '');
      
      let vlDays = parsed.vl + parsed.unknown + parsed.spl + parsed.pl + parsed.fl;
      let slDays = parsed.sl;
      let vlWop = parsed.vl_wop;
      let slWop = parsed.sl_wop;

      const newParsed = parseDetailedAbsences(leaveType + ': ' + dates);
      vlDays += newParsed.vl + newParsed.unknown + newParsed.spl + newParsed.pl + newParsed.fl;
      slDays += newParsed.sl;
      vlWop += newParsed.vl_wop;
      slWop += newParsed.sl_wop;

      let parts = rec.particulars ? rec.particulars + ', ' : '';
      if (leaveType === 'VL WOP' || leaveType === 'SL WOP' || leaveType === 'AWOL') {
         parts += `${leaveType}: ${dates}`;
      } else {
         parts += `${leaveType}: ${dates}`;
      }

      rec.particulars = parts;
      if (vlDays > 0) rec.vlAbsUndWp = vlDays.toString();
      if (slDays > 0) rec.slAbsUndWp = slDays.toString();
      if (vlWop > 0) rec.vlAbsUndWop = vlWop.toString();
      if (slWop > 0) rec.slAbsUndWop = slWop.toString();
      
      newRecords[existingIdx] = rec;
    } else {
      const newParsed = parseDetailedAbsences(leaveType + ': ' + dates);
      let vlDays = newParsed.vl + newParsed.unknown + newParsed.spl + newParsed.pl + newParsed.fl;
      let slDays = newParsed.sl;
      let vlWop = newParsed.vl_wop;
      let slWop = newParsed.sl_wop;

      newRecords.push({
        id: 'lc-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
        period: `${year} ${month}`,
        particulars: `${leaveType}: ${dates}`,
        vlEarned: '1.25',
        slEarned: '1.25',
        vlAbsUndWp: vlDays > 0 ? vlDays.toString() : '',
        slAbsUndWp: slDays > 0 ? slDays.toString() : '',
        vlAbsUndWop: vlWop > 0 ? vlWop.toString() : '',
        slAbsUndWop: slWop > 0 ? slWop.toString() : '', vlBalance: '', slBalance: '', dateAndAction: ''
      });
    }

    newRecords.sort((a, b) => {
        if (a.isSeparator) return -1;
        if (b.isSeparator) return 1;
        const aYear = parseInt(a.period?.match(/\b(20\d{2})\b/)?.[1] || '0');
        const bYear = parseInt(b.period?.match(/\b(20\d{2})\b/)?.[1] || '0');
        if (aYear !== bYear) return aYear - bYear;
        
        const getMonthIndex = (period: string) => {
          const p = (period || '').toLowerCase();
          const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
          const idx = months.findIndex(m => p.includes(m));
          return idx === -1 ? 99 : idx;
        };
        return getMonthIndex(a.period || '') - getMonthIndex(b.period || '');
    });

    newRecords = recalculateBalances(newRecords);
    onSave({ ...employee, leaveRecords: newRecords });
    setIsAddAbsenceOpen(false);
  };

  const exportToCSV = () => {
    let csvContent = 'Period,Particulars,VL Earned,VL Abs/Und W/P,VL Balance,VL Abs/Und WOP,SL Earned,SL Abs/Und W/P,SL Balance,SL Abs/Und WOP,Date and Action Taken\n';
    
    records.forEach(rec => {
      const row = [
        `"${rec.period || ''}"`,
        `"${rec.particulars || ''}"`,
        `"${rec.vlEarned || ''}"`,
        `"${rec.vlAbsUndWp || ''}"`,
        `"${rec.vlBalance || ''}"`,
        `"${rec.vlAbsUndWop || ''}"`,
        `"${rec.slEarned || ''}"`,
        `"${rec.slAbsUndWp || ''}"`,
        `"${rec.slBalance || ''}"`,
        `"${rec.slAbsUndWop || ''}"`,
        `"${rec.dateAndAction || ''}"`
      ];
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${employee.surname || 'Employee'}_Leave_Card.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const latestSalary = useMemo(() => {
    if (!employee.serviceRecords || employee.serviceRecords.length === 0) return 0;
    const latest = employee.serviceRecords[employee.serviceRecords.length - 1];
    const salaryStr = latest.salary?.toString().replace(/[^0-9.]/g, '') || '0';
    return parseFloat(salaryStr);
  }, [employee.serviceRecords]);

  const dailyRate = (latestSalary / 12) / 22;

  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isAddAbsenceOpen, setIsAddAbsenceOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);


  
  const [extraYears, setExtraYears] = useState<number[]>([]);
  const [addYearInput, setAddYearInput] = useState('');

  const firstAppointmentDate = useMemo(() => {
    if (!employee.serviceRecords || employee.serviceRecords.length === 0) return null;
    const sorted = [...employee.serviceRecords].sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());
    return sorted[0].from;
  }, [employee.serviceRecords]);

  const calculateDeduction = (wopStr: string) => {
    const wop = parseFloat(wopStr) || 0;
    return wop * dailyRate;
  };

  const recalculateBalances = (recordsList: LeaveRecord[], editedId?: string) => {
    let currentVl = 0;
    let currentSl = 0;
    const seenMonths = new Set<string>();

    // 1. Fill missing months before calculating balances
    if (recordsList.length > 0) {
      const stdMonths = [
        { label: 'Jan.', match: 'jan' }, { label: 'Feb.', match: 'feb' },
        { label: 'Mar.', match: 'mar' }, { label: 'Apr.', match: 'apr' },
        { label: 'May', match: 'may' }, { label: 'June', match: 'jun' },
        { label: 'July', match: 'jul' }, { label: 'Aug.', match: 'aug' },
        { label: 'Sept.', match: 'sep' }, { label: 'Oct.', match: 'oct' },
        { label: 'Nov.', match: 'nov' }, { label: 'Dec.', match: 'dec' }
      ];
      
      const getMonthIndex = (period: string) => {
        const p = (period || '').toLowerCase();
        const idx = stdMonths.findIndex(m => p.includes(m.match));
        return idx === -1 ? 99 : idx;
      };

      let minYear = 9999;
      let maxYear = new Date().getFullYear();
      recordsList.forEach(r => {
        const yrMatch = r.period?.match(/\b(20\d{2})\b/);
        if (yrMatch) {
          const y = parseInt(yrMatch[1]);
          if (y < minYear) minYear = y;
          if (y > maxYear) maxYear = y;
        }
      });
      if (minYear === 9999) minYear = maxYear;

      const currentYear = new Date().getFullYear();
      const currentMonthIndex = new Date().getMonth();

      const filledRecords: LeaveRecord[] = [];
      
      for (let y = minYear; y <= maxYear; y++) {
        stdMonths.forEach((month, monthIndex) => {
          const isFuture = y > currentYear || (y === currentYear && monthIndex > currentMonthIndex);
          if (isFuture) return;
          
          // Find all records for this year-month
          const monthRecords = recordsList.filter(r => {
            const yrMatch = r.period?.match(/\b(20\d{2})\b/);
            return yrMatch && parseInt(yrMatch[1]) === y && r.period?.toLowerCase().includes(month.match) && !r.isSeparator && !r.period?.toLowerCase().includes('force');
          });

          if (monthRecords.length === 0) {
            // Missing month, inject virtual record
            filledRecords.push({
              id: `new-virtual-${y}-${month.match}`,
              period: `${y} ${month.label}`,
              particulars: '',
              vlEarned: '1.25',
              vlAbsUndWp: '',
              vlBalance: '',
              vlAbsUndWop: '',
              slEarned: '1.25',
              slAbsUndWp: '',
              slBalance: '',
              slAbsUndWop: '',
              dateAndAction: ''
            });
          } else if (monthRecords.length > 1) {
            // Deduplicate: keep records that have actual data, discard empty filler duplicates
            const validRecords = monthRecords.filter(r => 
              (r.particulars && r.particulars.trim() !== '') || 
              (r.vlAbsUndWp && r.vlAbsUndWp.trim() !== '') || 
              (r.slAbsUndWp && r.slAbsUndWp.trim() !== '') || 
              (r.vlAbsUndWop && r.vlAbsUndWop.trim() !== '') || 
              (r.slAbsUndWop && r.slAbsUndWop.trim() !== '') || 
              (r.dateAndAction && r.dateAndAction.trim() !== '') ||
              r.vlManual ||
              r.slManual ||
              (r.vlEarned && r.vlEarned !== '1.25' && r.vlEarned !== '') ||
              (r.slEarned && r.slEarned !== '1.25' && r.slEarned !== '')
            );
            if (validRecords.length > 0) {
              filledRecords.push(...validRecords);
            } else {
              // If all are empty, just keep the first one
              filledRecords.push(monthRecords[0]);
            }
          } else {
            filledRecords.push(monthRecords[0]);
          }
        });
      }
      
      // Add back force leave and separators, which don't fit perfectly in the month timeline
      recordsList.forEach(r => {
        if (r.isSeparator || r.period?.toLowerCase().includes('force')) {
           filledRecords.push(r);
        }
      });

      // Sort them properly
      filledRecords.sort((a, b) => {
        if (a.isSeparator) return -1;
        if (b.isSeparator) return 1;
        const aYear = parseInt(a.period?.match(/\b(20\d{2})\b/)?.[1] || '0');
        const bYear = parseInt(b.period?.match(/\b(20\d{2})\b/)?.[1] || '0');
        if (aYear !== bYear) return aYear - bYear;
        return getMonthIndex(a.period || '') - getMonthIndex(b.period || '');
      });
      
      recordsList = filledRecords;
    }
    
    return recordsList.map((originalRec, index) => {
      const rec = { ...originalRec };
      
      const getMonthIndex = (period: string) => {
        const p = (period || '').toLowerCase();
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const idx = months.findIndex(m => p.includes(m));
        return idx === -1 ? 99 : idx;
      };
      
      const yearMatch = rec.period?.match(/\b(20\d{2})\b/);
      const year = yearMatch ? yearMatch[1] : '';
      const monthIdx = getMonthIndex(rec.period || '');
      
      if (year && monthIdx !== 99) {
        const monthKey = `${year}-${monthIdx}`;
        if (seenMonths.has(monthKey)) {
          if (rec.vlEarned === '1.25') rec.vlEarned = '';
          if (rec.slEarned === '1.25') rec.slEarned = '';
        }
        seenMonths.add(monthKey);
      }

      if (rec.id === editedId || rec.vlManual || (index === 0 && rec.vlManual !== false && rec.vlBalance)) {
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

      if (rec.id === editedId || rec.slManual || (index === 0 && rec.slManual !== false && rec.slBalance)) {
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
  const displayRecords = useMemo(() => {
    let newRecords = [...records];
    
    if (editingCell) {
      const { id, field, value: rawValue, year, month } = editingCell;
      let value = rawValue;
      if (field === 'particulars') {
         value = value.replace(/,\s*/g, ', ').trim();
      }

      if (id.startsWith('new-')) {
        if (value.trim()) {
          let newVlAbsUndWp = field === 'vlAbsUndWp' ? value : '';
          let newSlAbsUndWp = field === 'slAbsUndWp' ? value : '';
          let newVlAbsUndWop = field === 'vlAbsUndWop' ? value : '';
          let newSlAbsUndWop = field === 'slAbsUndWop' ? value : '';
          
          if (field === 'particulars') {
             const parsed = parseDetailedAbsences(value);
             if (parsed.vl > 0 || parsed.unknown > 0 || parsed.spl > 0 || parsed.pl > 0 || parsed.fl > 0) {
                newVlAbsUndWp = (parsed.vl + parsed.unknown + parsed.spl + parsed.pl + parsed.fl).toString();
             }
             if (parsed.sl > 0) {
                newSlAbsUndWp = parsed.sl.toString();
             }
             if (parsed.vl_wop > 0) {
                newVlAbsUndWop = parsed.vl_wop.toString();
             }
             if (parsed.sl_wop > 0) {
                newSlAbsUndWop = parsed.sl_wop.toString();
             }
          }

          const newRec: LeaveRecord = {
            id: 'lc-' + id,
            period: field === 'period' ? (value.includes(year!.toString()) ? value : `${year} ${value}`) : `${year} ${month}`,
            particulars: field === 'particulars' ? value : '',
            vlEarned: field === 'vlEarned' ? value : '1.25',
            vlAbsUndWp: newVlAbsUndWp,
            vlBalance: field === 'vlBalance' ? value : '',
            vlManual: field === 'vlBalance',
            vlAbsUndWop: newVlAbsUndWop,
            slEarned: field === 'slEarned' ? value : '1.25',
            slAbsUndWp: newSlAbsUndWp,
            slBalance: field === 'slBalance' ? value : '',
            slManual: field === 'slBalance',
            slAbsUndWop: newSlAbsUndWop,
            dateAndAction: field === 'dateAndAction' ? value : ''
          };
          
          newRecords.push(newRec);
        }
      } else {
        newRecords = newRecords.map(r => {
          if (r.id === id || r.id === `lc-${id}`) {
            let finalValue = value;
            if (field === 'period' && year && !finalValue.toString().includes(year.toString())) {
               finalValue = `${year} ${finalValue}`;
            }
            const updated = { ...r, [field]: finalValue };
            
            if (field === 'vlBalance') updated.vlManual = finalValue.toString().trim() !== '';
            if (field === 'slBalance') updated.slManual = finalValue.toString().trim() !== '';
            
            if (field === 'particulars') {
              const parsed = parseDetailedAbsences(finalValue.toString());
              const slDays = parsed.sl;
              const vlDays = parsed.vl + parsed.unknown + parsed.spl + parsed.pl + parsed.fl;
              const vlWopDays = parsed.vl_wop;
              const slWopDays = parsed.sl_wop;
              
              if (slDays > 0) {
                  updated.slAbsUndWp = slDays.toString();
              } else if (slDays === 0) {
                  updated.slAbsUndWp = '';
              }
              if (slWopDays > 0) {
                  updated.slAbsUndWop = slWopDays.toString();
              } else if (slWopDays === 0) {
                  updated.slAbsUndWop = '';
              }
              if (vlDays > 0) {
                  updated.vlAbsUndWp = vlDays.toString();
              } else if (vlDays === 0) {
                  updated.vlAbsUndWp = '';
              }
              if (vlWopDays > 0) {
                  updated.vlAbsUndWop = vlWopDays.toString();
              } else if (vlWopDays === 0) {
                  updated.vlAbsUndWop = '';
              }
            }
            if (field === 'vlBalance') updated.vlManual = true;
            if (field === 'slBalance') updated.slManual = true;
            if (field === 'vlEarned' || field === 'vlAbsUndWp') updated.vlManual = false;
            if (field === 'slEarned' || field === 'slAbsUndWp') updated.slManual = false;
            return updated;
          }
          return r;
        });
      }
    }

    newRecords.sort((a, b) => {
      if (a.isSeparator) return -1;
      if (b.isSeparator) return 1;
      const aYear = parseInt(a.period?.match(/\b(20\d{2})\b/)?.[1] || '0');
      const bYear = parseInt(b.period?.match(/\b(20\d{2})\b/)?.[1] || '0');
      if (aYear !== bYear) return aYear - bYear;
      
      const getMonthIndex = (period: string) => {
        const p = (period || '').toLowerCase();
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const idx = months.findIndex(m => p.includes(m));
        return idx === -1 ? 99 : idx;
      };
      return getMonthIndex(a.period || '') - getMonthIndex(b.period || '');
    });

    const isBalanceEdit = editingCell ? (editingCell.field === 'vlBalance' || editingCell.field === 'slBalance') : false;
    const editedId = editingCell && !editingCell.id.startsWith('new-') && isBalanceEdit ? editingCell.id : undefined;
    newRecords = recalculateBalances(newRecords, editedId);
    
    return newRecords;
  }, [records, editingCell]);

  const saveEdit = (nextCell?: EditingCell | null) => {
    if (!editingCell || !onSave) {
      if (nextCell !== undefined) setEditingCell(nextCell);
      else setEditingCell(null);
      return;
    }

    const { id, field, value } = editingCell;

    if (id.startsWith('new-') && !value.trim()) {
      if (nextCell !== undefined) setEditingCell(nextCell);
      else setEditingCell(null);
      return;
    }

    if (!id.startsWith('new-')) {
       if (field === 'period' && !value.trim()) {
           // Delete the record
           let filteredRecords = displayRecords.filter(r => r.id !== id && r.id !== `lc-${id}`);
           filteredRecords = recalculateBalances(filteredRecords);
           onSave({ ...employee, leaveRecords: filteredRecords });
           setEditingCell(null);
           return;
       }
       const existing = records.find(r => r.id === id);
       if (existing && existing[field] === value) {
         if (nextCell !== undefined) setEditingCell(nextCell);
         else setEditingCell(null);
         return;
       }
    }

    let newGeneratedId = '';
    const finalRecords = displayRecords.map(r => {
      if (r.id === `lc-${id}`) {
         newGeneratedId = 'lc-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
         return { ...r, id: newGeneratedId };
      }
      return r;
    });

    let finalNextCell = nextCell !== undefined ? nextCell : null;
    if (finalNextCell && finalNextCell.id === `lc-${id}`) {
        finalNextCell.id = newGeneratedId;
    }

    onSave({ ...employee, leaveRecords: finalRecords });
    setEditingCell(finalNextCell);
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
    const id = rec ? rec.id : `new-${year}-${monthMatch}`;
    const isEditing = (editingCell?.id === id || (editingCell?.id.startsWith('new-') && id === `lc-${editingCell.id}`)) && editingCell?.field === field;

    const handleDoubleClick = () => {
      if (!onSave) return;
      setEditingCell({
        id,
        field,
        value: rec ? (rec[field] !== undefined ? String(rec[field]) : '') : '',
        year,
        month: monthLabel
      });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingCell(null);
        return;
      }
      
      const fieldsOrder: (keyof LeaveRecord)[] = [
        'period', 'particulars', 'vlEarned', 'vlAbsUndWp', 'vlBalance', 'vlAbsUndWop',
        'slEarned', 'slAbsUndWp', 'slBalance', 'slAbsUndWop',
        'dateAndAction'
      ];
      const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'force leave'];

      if (e.key === 'Tab') {
        e.preventDefault();
        const currFieldIndex = fieldsOrder.indexOf(field);
        let nextField = field;
        
        if (e.shiftKey) {
           if (currFieldIndex > 0) nextField = fieldsOrder[currFieldIndex - 1];
        } else {
           if (currFieldIndex < fieldsOrder.length - 1) nextField = fieldsOrder[currFieldIndex + 1];
        }
        
        const currentRec = displayRecords.find(r => r.id === id || r.id === `lc-${id}`);
        const realNextId = currentRec ? currentRec.id : id;

        const nextCell: EditingCell = {
           id: realNextId,
           field: nextField,
           value: currentRec ? (currentRec[nextField] !== undefined ? String(currentRec[nextField]) : '') : '',
           year,
           month: monthLabel
        };
        saveEdit(nextCell);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        let mIdx = monthsList.findIndex(m => monthLabel.toLowerCase().includes(m.toLowerCase()));
        let nextMonthStr = monthLabel;
        let nextYear = year;
        
        if (e.shiftKey) {
            mIdx = mIdx - 1;
        } else {
            mIdx = mIdx + 1;
        }
        
        if (mIdx >= monthsList.length) {
            nextYear = year + 1;
            mIdx = 0;
        } else if (mIdx < 0) {
            nextYear = year - 1;
            mIdx = monthsList.length - 1;
        }
        
        const targetMonthMatch = monthsList[mIdx];
        const allTargetRecords = displayRecords.filter(r => r.period?.includes(nextYear.toString()));
        const nextRec = allTargetRecords.find(r => r.period?.toLowerCase().includes(targetMonthMatch.toLowerCase()));
        
        const realNextId = nextRec ? nextRec.id : `new-${nextYear}-${targetMonthMatch}`;
        
        const nextCell: EditingCell = {
           id: realNextId,
           field: field,
           value: nextRec ? ((nextRec as any)[field] || '') : '',
           year: nextYear,
           month: targetMonthMatch
        };
        saveEdit(nextCell);
      }
    };

    if (isEditing) {
      let placeholder = '';
      if (field === 'particulars') placeholder = 'e.g. VL: 1 SL: 2 AWOL: 3';
      
      return (
        <td className={className}>
          <input 
            autoFocus
            type="text"
            className={`w-full text-${align} border-b-2 border-blue-500 focus:outline-none bg-blue-50/50 px-1`}
            value={editingCell.value}
            onChange={e => setEditingCell({ ...editingCell, value: e.target.value })}
            onBlur={(e) => {
               // Only save if we are not clicking another cell inside the table
               // Actually, onBlur is fine, just save it.
               saveEdit();
            }}
            onKeyDown={handleKeyDown}
            onFocus={(e) => e.target.select()}
            placeholder={placeholder}
          />
        </td>
      );
    }

    return (
      <td 
        className={`${className} ${onSave ? 'cursor-pointer hover:bg-blue-50/30' : ''}`} 
        onClick={handleDoubleClick}
        title={onSave ? "Click to edit" : undefined}
      >
        {displayValue}
      </td>
    );
  };

  const yearsInRecords = records.map(r => {
    const m = r.period?.match(/\b(20\d{2})\b/);
    return m ? parseInt(m[1]) : null;
  }).filter(y => y !== null) as number[];
  
  let startYear = new Date().getFullYear();
  if (yearsInRecords.length > 0) {
    startYear = Math.min(...yearsInRecords);
  }


  const targetYears = [];
  for (let y = startYear; y <= Math.max(startYear, currentYear); y++) {
    targetYears.push(y);
  }
  extraYears.forEach(y => {
    if (!targetYears.includes(y)) targetYears.push(y);
  });
  targetYears.sort((a, b) => a - b);

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
          {firstAppointmentDate && (
            <p className="text-emerald-600 font-bold uppercase tracking-widest text-[10px] mt-1">Date of First Appointment: {formatDate(firstAppointmentDate)}</p>
          )}
          {onSave && <p className="text-blue-500 font-bold tracking-tight text-xs mt-2 italic">Double-click any cell to edit</p>}
        </div>
        <div className="flex gap-4 items-end">
          {onSave && (
            <button
              onClick={() => setIsAddAbsenceOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-blue-700 transition-colors h-[52px]"
            >
              <Calendar size={16} /> Add Leave Entry
            </button>
          )}
          {onSave && (
            <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden h-[52px]">
              <input
                type="number"
                value={addYearInput}
                onChange={(e) => setAddYearInput(e.target.value)}
                className="w-16 px-2 py-2 text-sm text-center focus:outline-none h-full"
                placeholder="YYYY"
              />
              <button
                onClick={() => {
                  const y = parseInt(addYearInput);
                  if (y && !targetYears.includes(y)) {
                     setExtraYears([...extraYears, y]);
                     setAddYearInput('');
                  }
                }}
                className="flex items-center gap-1 px-3 py-2 bg-slate-100 text-slate-700 text-[10px] uppercase font-bold tracking-widest hover:bg-slate-200 transition-colors h-full border-l border-slate-300"
              >
                <Plus size={14} /> Add Year
              </button>
            </div>
          )}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors h-[52px]"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={() => setIsPrintOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-slate-700 transition-colors h-[52px]"
          >
            <Printer size={16} /> Print CSC Form 14
          </button>
          <div className="text-right bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Base Annual Salary</p>
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
                <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 align-middle">Period</th>
                <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 align-middle">Particulars<br/><span className="text-[10px] font-normal">(Dates of Absence)</span></th>
                <th colSpan={4} className="px-4 py-2 border-r border-slate-200 text-center bg-blue-50/50 text-blue-800">Vacation Leave</th>
                <th colSpan={4} className="px-4 py-2 border-r border-slate-200 text-center bg-emerald-50/50 text-emerald-800">Sick Leave</th>
                <th rowSpan={2} className="px-4 py-3 border-r border-slate-200 align-middle">Date & Action Taken</th>
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
                const yearRecords = displayRecords.filter(r => r.period?.includes(year.toString()));
                const matchedIds = new Set<string>();
                const rows = [];

                rows.push(
                  <tr key={`year-${year}`} className="border-b-4 border-slate-300 bg-slate-100">
                    <td colSpan={12} className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-widest">
                      {year}
                    </td>
                  </tr>
                );

                stdMonths.forEach((month, monthIndex) => {
                  const isFuture = year > currentYear || (year === currentYear && monthIndex > currentMonthIndex);
                  const forceLeaveRecId = yearRecords.find(r => r.period?.toLowerCase().includes('force'))?.id;
                  const matched = yearRecords.filter(r => r.period?.toLowerCase().includes(month.match) && !r.isSeparator && r.id !== forceLeaveRecId);
                  
                  matched.forEach(rec => matchedIds.add(rec.id));
                  
                  if (matched.length > 0) {
                    matched.forEach(rec => {
                      let displayPeriod = rec.period || '';
                      if (displayPeriod.toLowerCase() === `${year} ${month.match}` || displayPeriod.toLowerCase() === `${year} ${month.label.toLowerCase()}`) {
                        displayPeriod = month.label;
                      } else {
                        displayPeriod = displayPeriod.replace(new RegExp(`\\b${year}\\b`, 'g'), '').trim();
                        if (!displayPeriod) displayPeriod = month.label;
                      }
                      
                      const totalDeduction = calculateDeduction(rec.vlAbsUndWop) + calculateDeduction(rec.slAbsUndWop);

                      const rowKey = rec.id.startsWith('lc-new-') ? `empty-${year}-${month.match}` : rec.id;
                      rows.push(
                        <tr key={rowKey} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          {renderEditableCell(rec, year, month.match, month.label, 'period', displayPeriod, "px-4 py-3 border-r border-slate-200 font-bold whitespace-nowrap", "left")}
                          {renderEditableCell(rec, year, month.match, month.label, 'particulars', rec.particulars, "px-4 py-3 border-r border-slate-200 text-sm text-slate-700 whitespace-nowrap", "left")}
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
                            {totalDeduction > 0 ? `-₱${totalDeduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                          </td>
                        </tr>
                      );
                    });
                  } else {
                    const rowClass = isFuture 
                       ? "border-b border-slate-100 opacity-50 hover:opacity-100 hover:bg-slate-50/50 transition-all" 
                       : "border-b border-slate-100 hover:bg-slate-50/50 transition-all bg-white";
                    
                    const earned = isFuture ? '' : '1.25';
                    rows.push(
                      <tr key={`empty-${year}-${month.match}`} className={rowClass}>
                        {renderEditableCell(null, year, month.match, month.label, 'period', month.label, "px-4 py-3 border-r border-slate-200 font-medium whitespace-nowrap text-slate-400", "left")}
                        {renderEditableCell(null, year, month.match, month.label, 'particulars', '', "px-4 py-3 border-r border-slate-200 text-sm text-slate-400 whitespace-nowrap", "left")}
                        {renderEditableCell(null, year, month.match, month.label, 'vlEarned', earned, "px-2 py-3 border-r border-slate-100 text-center")}
                        {renderEditableCell(null, year, month.match, month.label, 'vlAbsUndWp', '', "px-2 py-3 border-r border-slate-100 text-center")}
                        {renderEditableCell(null, year, month.match, month.label, 'vlBalance', '', "px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]")}
                        {renderEditableCell(null, year, month.match, month.label, 'vlAbsUndWop', '', "px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10")}
                        
                        {renderEditableCell(null, year, month.match, month.label, 'slEarned', earned, "px-2 py-3 border-r border-slate-100 text-center")}
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
                  const forceLeaveRecId = yearRecords.find(r => r.period?.toLowerCase().includes('force'))?.id;
                  if (!matchedIds.has(rec.id) && !rec.isSeparator && rec.id !== forceLeaveRecId) {
                    const totalDeduction = calculateDeduction(rec.vlAbsUndWop) + calculateDeduction(rec.slAbsUndWop);
                    rows.push(
                      <tr key={rec.id} className="border-b border-slate-100 bg-blue-50/20 hover:bg-slate-50/50 transition-colors">
                        {renderEditableCell(rec, year, 'force', 'Force Leave', 'period', rec.period?.replace(new RegExp(`\\b${year}\\b`, 'g'), '').trim(), "px-4 py-3 border-r border-slate-200 font-bold whitespace-nowrap", "left")}
                        {renderEditableCell(rec, year, 'force', 'Force Leave', 'particulars', rec.particulars, "px-4 py-3 border-r border-slate-200 text-sm text-slate-700 whitespace-nowrap", "left")}
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
                          {totalDeduction > 0 ? `-₱${totalDeduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
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
                        {totalDeduction > 0 ? `-₱${totalDeduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                      </td>
                    </tr>
                  );
                } else {
                  rows.push(
                    <tr key={`force-${year}`} className="border-b border-slate-100 opacity-50 hover:opacity-100 transition-all bg-slate-50">
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
            {isAddAbsenceOpen && (
        <AddAbsenceModal 
          onClose={() => setIsAddAbsenceOpen(false)} 
          onSave={handleAddAbsence} 
        />
      )}
      {isPrintOpen && (
        <LeaveCardPrintModal employee={employee} onClose={() => setIsPrintOpen(false)} />
      )}
    </div>
  );
}

export default React.memo(LeaveCardViewer);