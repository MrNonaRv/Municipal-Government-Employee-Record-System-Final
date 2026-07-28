const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const handleAddTarget = `  const handleAdd = () => {`;
const handleAddReplacement = `  const handleFieldChange = (field: keyof LeaveRecord, value: string) => {
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
  };

  const handleAdd = () => {`;
code = code.replace(handleAddTarget, handleAddReplacement);

const newRecordTarget = `const newRecord: LeaveRecord = {
      id: newId,
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
    };`;
const newRecordReplacement = `
    let prevVlBalance = 0;
    let prevSlBalance = 0;
    if (records.length > 0) {
      prevVlBalance = parseFloat(records[records.length - 1].vlBalance || '0') || 0;
      prevSlBalance = parseFloat(records[records.length - 1].slBalance || '0') || 0;
    }
    
    const newRecord: LeaveRecord = {
      id: newId,
      period: '',
      vlEarned: '1.25',
      vlAbsUndWp: '',
      vlBalance: Number((prevVlBalance + 1.25).toFixed(3)).toString(),
      vlAbsUndWop: '',
      slEarned: '1.25',
      slAbsUndWp: '',
      slBalance: Number((prevSlBalance + 1.25).toFixed(3)).toString(),
      slAbsUndWop: '',
      dateAndAction: ''
    };`;
code = code.replace(newRecordTarget, newRecordReplacement);

const replaceOnChange = (codeStr, field) => {
    const search = `onChange={e => setEditForm({...editForm, ${field}: e.target.value})}`;
    const replace = `onChange={e => handleFieldChange('${field}', e.target.value)}`;
    return codeStr.split(search).join(replace);
}

code = replaceOnChange(code, 'period');
code = replaceOnChange(code, 'vlEarned');
code = replaceOnChange(code, 'vlAbsUndWp');
code = replaceOnChange(code, 'vlBalance');
code = replaceOnChange(code, 'vlAbsUndWop');
code = replaceOnChange(code, 'slEarned');
code = replaceOnChange(code, 'slAbsUndWp');
code = replaceOnChange(code, 'slBalance');
code = replaceOnChange(code, 'slAbsUndWop');
code = replaceOnChange(code, 'dateAndAction');

fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
