const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardViewer.tsx', 'utf8');

const anchor = `  const saveEdit = () => {`;

const injection = `  const displayRecords = useMemo(() => {
    let newRecords = [...records];
    if (!editingCell) return newRecords;

    const { id, field, value, year, month } = editingCell;

    if (id.startsWith('new-')) {
      if (!value.trim()) return newRecords;
      
      const newRec: LeaveRecord = {
        id: 'lc-' + id,
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

    const isBalanceEdit = field === 'vlBalance' || field === 'slBalance';
    newRecords = recalculateBalances(newRecords, id.startsWith('new-') ? undefined : (isBalanceEdit ? id : undefined));
    return newRecords;
  }, [records, editingCell]);

  const saveEdit = () => {`;

code = code.replace(anchor, injection);

// Rewrite saveEdit to use displayRecords
const saveEditOld = `  const saveEdit = () => {
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

    const isBalanceEdit = field === 'vlBalance' || field === 'slBalance';
    newRecords = recalculateBalances(newRecords, id.startsWith('new-') ? undefined : (isBalanceEdit ? id : undefined));
    onSave({ ...employee, leaveRecords: newRecords });
    setEditingCell(null);
  };`;

const saveEditNew = `  const saveEdit = () => {
    if (!editingCell || !onSave) {
      setEditingCell(null);
      return;
    }

    const { id, field, value } = editingCell;

    if (id.startsWith('new-') && !value.trim()) {
      setEditingCell(null);
      return;
    }

    if (!id.startsWith('new-')) {
       const existing = records.find(r => r.id === id);
       if (existing && existing[field] === value) {
         setEditingCell(null);
         return;
       }
    }

    const finalRecords = displayRecords.map(r => 
      r.id === \`lc-\${id}\` ? { ...r, id: 'lc-' + Date.now().toString(36) } : r
    );

    onSave({ ...employee, leaveRecords: finalRecords });
    setEditingCell(null);
  };`;

code = code.replace(saveEditOld, saveEditNew);

// Replace mapping to use displayRecords
code = code.replace(/const yearRecords = records.filter/g, 'const yearRecords = displayRecords.filter');

fs.writeFileSync('src/components/LeaveCardViewer.tsx', code);
console.log('patched successfully');
