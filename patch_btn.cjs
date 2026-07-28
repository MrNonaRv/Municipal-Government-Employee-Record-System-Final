const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const targetBtn = `          <button 
            type="button" 
            onClick={handleAdd} 
            aria-label="Add new leave record entry"
            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--navy)] text-white rounded text-sm hover:bg-opacity-90 transition-colors"
          >
            <Plus size={16} /> Add Row
          </button>
        </div>`;

const replaceBtn = `          <button 
            type="button" 
            onClick={handleAdd} 
            aria-label="Add new leave record entry"
            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--navy)] text-white rounded text-sm hover:bg-opacity-90 transition-colors"
          >
            <Plus size={16} /> Add Row
          </button>
          <button 
            type="button" 
            onClick={handleAddSeparator} 
            aria-label="Add blank separator space"
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
          >
            <Plus size={16} /> Add Space
          </button>
        </div>`;

code = code.replace(targetBtn, replaceBtn);
fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
