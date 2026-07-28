const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const targetAddBtn = `<button 
          type="button" 
          onClick={handleAdd} 
          aria-label="Add new leave record entry"
          className="flex items-center gap-1 px-3 py-1.5 bg-[var(--navy)] text-white rounded text-sm hover:bg-opacity-90 transition-colors"
        >
          <Plus size={16} /> Add Entry
        </button>`;

const replacementAddBtn = `<div className="flex gap-2">
          <button 
            type="button" 
            onClick={() => {
              const year = window.prompt("Enter Year (e.g., 2024):");
              if (year) {
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                const newRecords = months.map((m, i) => ({
                  id: 'lc-' + Date.now().toString(36) + '-' + i + '-' + Math.random().toString(36).substring(2, 9),
                  period: year + ' ' + m,
                  vlEarned: '', vlAbsUndWp: '', vlBalance: '', vlAbsUndWop: '',
                  slEarned: '', slAbsUndWp: '', slBalance: '', slAbsUndWop: '',
                  dateAndAction: ''
                }));
                onChange([...records, ...newRecords]);
              }
            }} 
            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--gold)] text-[var(--navy)] rounded text-sm font-bold hover:bg-opacity-90 transition-colors"
          >
            <Plus size={16} /> Add Full Year
          </button>
          <button 
            type="button" 
            onClick={handleAdd} 
            aria-label="Add new leave record entry"
            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--navy)] text-white rounded text-sm hover:bg-opacity-90 transition-colors"
          >
            <Plus size={16} /> Add Entry
          </button>
        </div>`;

code = code.replace(targetAddBtn, replacementAddBtn);
fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
