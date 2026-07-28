const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const targetAdd = `  const handleAdd = () => {`;
const replaceAdd = `  const handleAddSeparator = () => {
    const newId = 'lc-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
    const newRecord: LeaveRecord = {
      id: newId,
      isSeparator: true,
      period: '',
      vlEarned: '',
      vlAbsUndWp: '',
      vlBalance: '',
      vlAbsUndWop: '',
      slEarned: '',
      slAbsUndWp: '',
      slBalance: '',
      slAbsUndWop: '',
      dateAndAction: ''
    };
    onChange([...records, newRecord]);
    setEditingId(newId);
    setEditForm(newRecord);
    setError(null);
  };

  const handleAdd = () => {`;

code = code.replace(targetAdd, replaceAdd);
fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
