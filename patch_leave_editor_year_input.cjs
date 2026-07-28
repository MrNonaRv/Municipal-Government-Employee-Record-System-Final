const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const importTarget = `const [error, setError] = useState<string | null>(null);`;
const importReplacement = `const [error, setError] = useState<string | null>(null);\n  const [bulkYear, setBulkYear] = useState<string>(new Date().getFullYear().toString());`;
code = code.replace(importTarget, importReplacement);

const targetAddBtn = `<div className="flex gap-2 items-center">
          <button 
            type="button" 
            onClick={() => {
              const year = new Date().getFullYear().toString();
              const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
              const newRecords = months.map((m, i) => ({
                id: 'lc-' + Date.now().toString(36) + '-' + i + '-' + Math.random().toString(36).substring(2, 9),
                period: year + ' ' + m,
                vlEarned: '', vlAbsUndWp: '', vlBalance: '', vlAbsUndWop: '',
                slEarned: '', slAbsUndWp: '', slBalance: '', slAbsUndWop: '',
                dateAndAction: ''
              }));
              onChange([...records, ...newRecords]);
            }} 
            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--gold)] text-[var(--navy)] rounded text-sm font-bold hover:bg-opacity-90 transition-colors"
          >
            <Plus size={16} /> Add 12 Months
          </button>
          <button 
            type="button" 
            onClick={handleAdd} 
            aria-label="Add new leave record entry"
            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--navy)] text-white rounded text-sm hover:bg-opacity-90 transition-colors"
          >
            <Plus size={16} /> Add Row
          </button>
        </div>`;

const replacementAddBtn = `<div className="flex gap-2 items-center">
          <div className="flex items-center bg-white border border-slate-300 rounded overflow-hidden">
            <input 
              type="text" 
              value={bulkYear}
              onChange={(e) => setBulkYear(e.target.value)}
              className="w-16 px-2 py-1.5 text-sm text-center focus:outline-none"
              placeholder="YYYY"
            />
            <button 
              type="button" 
              onClick={() => {
                const year = bulkYear || new Date().getFullYear().toString();
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                const newRecords = months.map((m, i) => ({
                  id: 'lc-' + Date.now().toString(36) + '-' + i + '-' + Math.random().toString(36).substring(2, 9),
                  period: year + ' ' + m,
                  vlEarned: '', vlAbsUndWp: '', vlBalance: '', vlAbsUndWop: '',
                  slEarned: '', slAbsUndWp: '', slBalance: '', slAbsUndWop: '',
                  dateAndAction: ''
                }));
                onChange([...records, ...newRecords]);
              }} 
              className="flex items-center gap-1 px-3 py-1.5 bg-[var(--gold)] text-[var(--navy)] text-sm font-bold hover:bg-opacity-90 transition-colors"
            >
              <Plus size={14} /> Add Year
            </button>
          </div>
          <button 
            type="button" 
            onClick={handleAdd} 
            aria-label="Add new leave record entry"
            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--navy)] text-white rounded text-sm hover:bg-opacity-90 transition-colors"
          >
            <Plus size={16} /> Add Row
          </button>
        </div>`;

code = code.replace(targetAddBtn, replacementAddBtn);
fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
