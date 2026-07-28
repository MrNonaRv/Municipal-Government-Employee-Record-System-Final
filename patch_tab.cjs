const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

code = code.replace(
  `<button 
                role="tab" 
                id="tab-docs"
                aria-controls="panel-docs"
                aria-selected={activeTab === 'docs'} 
                onClick={() => setActiveTab('docs')} `,
  `<button 
                role="tab" 
                id="tab-leaves"
                aria-controls="panel-leaves"
                aria-selected={activeTab === 'leaves'} 
                onClick={() => setActiveTab('leaves')} 
                className={\`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex-shrink-0 \${activeTab === 'leaves' ? 'bg-[var(--gold)] text-[var(--navy)] shadow-lg shadow-gold/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}\`}
              >
                <Calendar size={14} />
                Leave Card
              </button>
              <button 
                role="tab" 
                id="tab-docs"
                aria-controls="panel-docs"
                aria-selected={activeTab === 'docs'} 
                onClick={() => setActiveTab('docs')} `
);

fs.writeFileSync('src/components/ProfileModal.tsx', code);
