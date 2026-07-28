const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const targetSave = `  const handleSave = () => {
    if (!editingId) return;
    if (!editForm.period?.trim()) {
      setError("Period/Particulars is required.");
      return;
    }

    setError(null);
    onChange(records.map(r => r.id === editingId ? { ...r, ...editForm } as LeaveRecord : r));
    setEditingId(null);
  };`;

const replacementSave = `  const recalculateBalances = (recordsList: LeaveRecord[]) => {
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

code = code.replace(targetSave, replacementSave);

const targetDelete = `  const handleDelete = (id: string) => {
    onChange(records.filter(r => r.id !== id));
    setDeletingId(null);
  };`;

const replacementDelete = `  const handleDelete = (id: string) => {
    const updatedRecords = records.filter(r => r.id !== id);
    onChange(recalculateBalances(updatedRecords));
    setDeletingId(null);
  };`;

code = code.replace(targetDelete, replacementDelete);

const targetBulk = `onChange([...records, ...newRecords]);`;
const replacementBulk = `onChange(recalculateBalances([...records, ...newRecords]));`;

code = code.replace(targetBulk, replacementBulk);

fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
