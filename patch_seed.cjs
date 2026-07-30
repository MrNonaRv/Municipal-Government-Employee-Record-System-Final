const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("generateAuroraSample")) {
    code = code.replace("import { generateEmptyEmployee } from './utils/helpers';", "import { generateEmptyEmployee } from './utils/helpers';\nimport { generateAuroraSample } from './utils/seedData';");
    
    // Add load sample button
    // We can find:
    // <button 
    //   onClick={() => setSearchQuery('')}
    //   className="mt-6 text-[var(--gold-dark)] font-bold hover:underline"
    // >
    //   Clear all filters
    // </button>
    // And add another button, but maybe it's in the initial state?
    // Let's add it to the header or near the "New Record" button.
    
    const newRecordBtn = `<button 
              onClick={handleAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-[var(--navy)] rounded-xl font-bold transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New Record</span>
            </button>`;
            
    const withSeedBtn = `${newRecordBtn}
            <button 
              onClick={async () => {
                const sample = generateAuroraSample();
                await handleSave(sample);
                addToast('Sample record loaded', 'success');
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Load Sample</span>
            </button>`;
            
    code = code.replace(newRecordBtn, withSeedBtn);
    fs.writeFileSync('src/App.tsx', code);
}
