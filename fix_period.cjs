const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const targetSave = `  const handleSave = () => {
    if (!editingId) return;
    if (!editForm.isSeparator && !editForm.period?.trim()) {
      setError("Period/Particulars is required.");
      return;
    }`;

const targetSaveAlt = `  const handleSave = () => {
    if (!editingId) return;
    if (!editForm.period?.trim()) {
      setError("Period/Particulars is required.");
      return;
    }`;

const replaceSave = `  const handleSave = () => {
    if (!editingId) return;
    // Removed strict period check so users can save balance adjustments easily`;

code = code.replace(targetSave, replaceSave).replace(targetSaveAlt, replaceSave);
fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
