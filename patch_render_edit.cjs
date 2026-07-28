const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const targetRender = `  const renderEditFormFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">`;

const replaceRender = `  const renderEditFormFields = () => {
    if (editForm.isSeparator) {
      return (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Separator Text (Year/Period)</label>
            <input 
              type="text" 
              value={editForm.period || ''} 
              onChange={e => handleFieldChange('period', e.target.value)} 
              className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm bg-white" 
              placeholder="e.g. 2024"
            />
          </div>
        </div>
      );
    }
    return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">`;

code = code.replace(targetRender, replaceRender);

// Also we need to fix the desktop inline edit mode, because it might not be using renderEditFormFields().
fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
