const fs = require('fs');
let code = fs.readFileSync('src/components/EditModal.tsx', 'utf8');

const target = `          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full">
            <div className="space-y-1">
              <label htmlFor="surname" className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-sans">Surname</label>
              <input 
                id="surname"
                name="surname" 
                value={formData.surname || ''} 
                onChange={handleChange} 
                aria-invalid={!!validationErrors.surname}
                className={\`w-full border rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[var(--gold)] focus:border-transparent transition-all \${validationErrors.surname ? 'border-red-500 bg-red-50/10 font-bold' : 'border-slate-200 bg-white'}\`} 
              />
              {validationErrors.surname && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tight">{validationErrors.surname}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="firstName" className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-sans">First Name</label>
              <input 
                id="firstName"
                name="firstName" 
                value={formData.firstName || ''} 
                onChange={handleChange} 
                aria-invalid={!!validationErrors.firstName}
                className={\`w-full border rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[var(--gold)] focus:border-transparent transition-all \${validationErrors.firstName ? 'border-red-500 bg-red-50/10 font-bold' : 'border-slate-200 bg-white'}\`} 
              />
              {validationErrors.firstName && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tight">{validationErrors.firstName}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-sans">Middle Name</label>
              <input 
                name="middleName" 
                value={formData.middleName || ''} 
                onChange={handleChange} 
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[var(--gold)] focus:border-transparent transition-all bg-white" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-sans">Suffix (e.g. Jr., III)</label>
              <input 
                name="nameExtension" 
                value={formData.nameExtension || ''} 
                onChange={handleChange} 
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[var(--gold)] focus:border-transparent transition-all bg-white" 
              />
            </div>
          </div>`;

const replacement = `          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 w-full">
            <div className="space-y-1">
              <label htmlFor="surname" className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-sans">Surname</label>
              <input 
                id="surname"
                name="surname" 
                value={formData.surname || ''} 
                onChange={handleChange} 
                aria-invalid={!!validationErrors.surname}
                className={\`w-full border rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[var(--gold)] focus:border-transparent transition-all \${validationErrors.surname ? 'border-red-500 bg-red-50/10 font-bold' : 'border-slate-200 bg-white'}\`} 
              />
              {validationErrors.surname && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tight">{validationErrors.surname}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="firstName" className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-sans">First Name</label>
              <input 
                id="firstName"
                name="firstName" 
                value={formData.firstName || ''} 
                onChange={handleChange} 
                aria-invalid={!!validationErrors.firstName}
                className={\`w-full border rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[var(--gold)] focus:border-transparent transition-all \${validationErrors.firstName ? 'border-red-500 bg-red-50/10 font-bold' : 'border-slate-200 bg-white'}\`} 
              />
              {validationErrors.firstName && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tight">{validationErrors.firstName}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-sans">Middle Name</label>
              <input 
                name="middleName" 
                value={formData.middleName || ''} 
                onChange={handleChange} 
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[var(--gold)] focus:border-transparent transition-all bg-white" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-sans">Suffix (e.g. Jr.)</label>
              <input 
                name="nameExtension" 
                value={formData.nameExtension || ''} 
                onChange={handleChange} 
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[var(--gold)] focus:border-transparent transition-all bg-white" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-sans">Employee ID</label>
              <input 
                name="agencyEmployeeNo" 
                value={formData.agencyEmployeeNo || ''} 
                onChange={handleChange}
                aria-invalid={!!validationErrors.agencyEmployeeNo}
                className={\`w-full border rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[var(--gold)] focus:border-transparent transition-all \${validationErrors.agencyEmployeeNo ? 'border-red-500 bg-red-50/10 font-bold' : 'border-slate-200 bg-white'}\`} 
              />
              {validationErrors.agencyEmployeeNo && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tight">{validationErrors.agencyEmployeeNo}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-sans">Email</label>
              <input 
                name="email" 
                value={formData.email || ''} 
                onChange={handleChange} 
                aria-invalid={!!validationErrors.email}
                className={\`w-full border rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[var(--gold)] focus:border-transparent transition-all \${validationErrors.email ? 'border-red-500 bg-red-50/10 font-bold' : 'border-slate-200 bg-white'}\`} 
              />
              {validationErrors.email && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tight">{validationErrors.email}</p>}
            </div>
          </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/EditModal.tsx', code);
