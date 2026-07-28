const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const targetAdd = `  const handleAdd = () => {`;
const replaceAdd = `  const handleAddSeparator = () => {
    const newRecord = {
      id: 'lc-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9),
      period: '',
      vlEarned: '', vlAbsUndWp: '', vlBalance: '', vlAbsUndWop: '',
      slEarned: '', slAbsUndWp: '', slBalance: '', slAbsUndWop: '',
      dateAndAction: '',
      isSeparator: true
    };
    
    const updated = [...records, newRecord];
    onChange(updated);
    setEditingId(newRecord.id);
    setEditForm(newRecord);
    setError(null);
  };

  const handleAdd = () => {`;

code = code.replace(targetAdd, replaceAdd);
fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
