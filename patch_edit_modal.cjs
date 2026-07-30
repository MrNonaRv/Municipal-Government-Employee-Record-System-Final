const fs = require('fs');
let code = fs.readFileSync('src/components/EditModal.tsx', 'utf8');

const dobField = `            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-sans">Date of Birth</label>
              <input 
                type="date"
                name="dateOfBirth" 
                value={formData.dateOfBirth || ''} 
                onChange={handleChange} 
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[var(--gold)] focus:border-transparent transition-all bg-white" 
              />
            </div>`;

if (!code.includes('Date of Birth')) {
    code = code.replace(
        '            <div className="space-y-1">\n              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-sans">Suffix (e.g. Jr., III)</label>\n              <input \n                name="nameExtension" \n                value={formData.nameExtension || \'\'} \n                onChange={handleChange} \n                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs uppercase focus:ring-1 focus:ring-[var(--gold)] focus:border-transparent transition-all bg-white" \n              />\n            </div>',
        '            <div className="space-y-1">\n              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-sans">Suffix (e.g. Jr., III)</label>\n              <input \n                name="nameExtension" \n                value={formData.nameExtension || \'\'} \n                onChange={handleChange} \n                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs uppercase focus:ring-1 focus:ring-[var(--gold)] focus:border-transparent transition-all bg-white" \n              />\n            </div>\n' + dobField
    );
    // adjust grid-cols to 5 if it was 4?
    code = code.replace('grid-cols-2 sm:grid-cols-4', 'grid-cols-2 sm:grid-cols-5');
    fs.writeFileSync('src/components/EditModal.tsx', code);
}
