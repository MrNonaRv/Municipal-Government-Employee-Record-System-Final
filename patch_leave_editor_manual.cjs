const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const targetFieldChange = `  const handleFieldChange = (field: keyof LeaveRecord, value: string) => {
    const newForm = { ...editForm, [field]: value };
    
    if (field === 'vlEarned' || field === 'vlAbsUndWp') {
      const earned = parseFloat(newForm.vlEarned || '0') || 0;
      const abs = parseFloat(newForm.vlAbsUndWp || '0') || 0;
      const currentIndex = records.findIndex(r => r.id === editingId);
      let prevBalance = 0;
      if (currentIndex > 0) {
        prevBalance = parseFloat(records[currentIndex - 1].vlBalance || '0') || 0;
      }
      const newBalance = prevBalance + earned - abs;
      newForm.vlBalance = Number(newBalance.toFixed(3)).toString();
    }
    
    if (field === 'slEarned' || field === 'slAbsUndWp') {
      const earned = parseFloat(newForm.slEarned || '0') || 0;
      const abs = parseFloat(newForm.slAbsUndWp || '0') || 0;
      const currentIndex = records.findIndex(r => r.id === editingId);
      let prevBalance = 0;
      if (currentIndex > 0) {
        prevBalance = parseFloat(records[currentIndex - 1].slBalance || '0') || 0;
      }
      const newBalance = prevBalance + earned - abs;
      newForm.slBalance = Number(newBalance.toFixed(3)).toString();
    }
    
    setEditForm(newForm);
  };`;

const replacementFieldChange = `  const handleFieldChange = (field: keyof LeaveRecord, value: string) => {
    const newForm = { ...editForm, [field]: value };
    
    if (field === 'vlBalance') {
      newForm.vlManual = true;
    }
    
    if (field === 'slBalance') {
      newForm.slManual = true;
    }
    
    if (field === 'vlEarned' || field === 'vlAbsUndWp') {
      newForm.vlManual = false;
      const earned = parseFloat(newForm.vlEarned || '0') || 0;
      const abs = parseFloat(newForm.vlAbsUndWp || '0') || 0;
      const currentIndex = records.findIndex(r => r.id === editingId);
      let prevBalance = 0;
      if (currentIndex > 0) {
        prevBalance = parseFloat(records[currentIndex - 1].vlBalance || '0') || 0;
      }
      const newBalance = prevBalance + earned - abs;
      newForm.vlBalance = Number(newBalance.toFixed(3)).toString();
    }
    
    if (field === 'slEarned' || field === 'slAbsUndWp') {
      newForm.slManual = false;
      const earned = parseFloat(newForm.slEarned || '0') || 0;
      const abs = parseFloat(newForm.slAbsUndWp || '0') || 0;
      const currentIndex = records.findIndex(r => r.id === editingId);
      let prevBalance = 0;
      if (currentIndex > 0) {
        prevBalance = parseFloat(records[currentIndex - 1].slBalance || '0') || 0;
      }
      const newBalance = prevBalance + earned - abs;
      newForm.slBalance = Number(newBalance.toFixed(3)).toString();
    }
    
    setEditForm(newForm);
  };`;

code = code.replace(targetFieldChange, replacementFieldChange);

const targetRecalculate = `  const recalculateBalances = (recordsList: LeaveRecord[]) => {
    let currentVl = 0;
    let currentSl = 0;
    return recordsList.map((rec) => {
      // Treat as empty if not provided
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

      return { ...rec };
    });
  };

  const handleSave = () => {
    if (!editingId) return;
    if (!editForm.period?.trim()) {
      setError("Period/Particulars is required.");
      return;
    }

    setError(null);
    const updatedRecords = records.map(r => r.id === editingId ? { ...r, ...editForm } as LeaveRecord : r);
    onChange(recalculateBalances(updatedRecords));
    setEditingId(null);
  };`;

const replacementRecalculate = `  const recalculateBalances = (recordsList: LeaveRecord[], editedId?: string) => {
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

      return { ...rec };
    });
  };

  const handleSave = () => {
    if (!editingId) return;
    if (!editForm.period?.trim()) {
      setError("Period/Particulars is required.");
      return;
    }

    setError(null);
    const updatedRecords = records.map(r => r.id === editingId ? { ...r, ...editForm } as LeaveRecord : r);
    onChange(recalculateBalances(updatedRecords, editingId));
    setEditingId(null);
  };`;

code = code.replace(targetRecalculate, replacementRecalculate);
fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
