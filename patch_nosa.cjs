const fs = require('fs');

function updateBatchNOSA() {
  let code = fs.readFileSync('src/components/BatchNOSAModal.tsx', 'utf8');

  // Add Lucide imports if not present
  if (!code.includes('Calendar, FileText, User, Printer, X')) {
    code = code.replace(/import { X, Printer } from 'lucide-react';/, "import { X, Printer, Calendar, FileText, User } from 'lucide-react';");
  }

  const startIdx = code.indexOf('<div className="w-full md:w-1/3');
  const printSideIdx = code.indexOf('{/* PREVIEW/PRINT SIDE */}');

  if (startIdx === -1 || printSideIdx === -1) {
    console.error("Could not find boundaries for BatchNOSAModal");
    return;
  }

  const newSidebar = `
        {/* SETTINGS SIDE */}
        <div className="w-full md:w-[400px] shrink-0 bg-slate-50 border-r border-slate-200 p-6 flex flex-col overflow-y-auto print:hidden shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-[var(--navy)]">Batch NOSA</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Generate for {employees.length} employees</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 text-slate-400 hover:text-rose-500 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5 flex-1">
            
            {/* Document Dates */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--navy)] border-b border-slate-100 pb-2">
                <Calendar size={16} className="text-[var(--gold)]" /> Document Dates
              </h3>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Date of Notice</label>
                <input type="date" value={dateOfNotice} onChange={e => setDateOfNotice(e.target.value)} className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Effective Date (New Salary)</label>
                <input type="text" value={newDate} onChange={e => setNewDate(e.target.value)} placeholder="e.g. January 1, 2026" className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">As of Date (Old Salary)</label>
                <input type="text" value={oldDate} onChange={e => setOldDate(e.target.value)} placeholder="e.g. December 31, 2025" className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
              </div>
            </div>

            {/* Legal Mandates */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--navy)] border-b border-slate-100 pb-2">
                <FileText size={16} className="text-[var(--gold)]" /> Legal Mandates
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">LBC No.</label>
                  <input type="text" value={lbcNo} onChange={e => setLbcNo(e.target.value)} placeholder="160" className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">LBC Date</label>
                  <input type="text" value={lbcDate} onChange={e => setLbcDate(e.target.value)} placeholder="01/01/2026" className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">EO No.</label>
                  <input type="text" value={eoNo} onChange={e => setEoNo(e.target.value)} placeholder="31" className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">EO Date</label>
                  <input type="text" value={eoDate} onChange={e => setEoDate(e.target.value)} placeholder="01/01/2026" className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
                </div>
              </div>
            </div>

            {/* General Info */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--navy)] border-b border-slate-100 pb-2">
                <User size={16} className="text-[var(--gold)]" /> General Details
              </h3>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Signatory (Mayor)</label>
                <input type="text" value={mayorName} onChange={e => setMayorName(e.target.value)} placeholder="Hon. Jane Doe" className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 flex justify-between">
                  Plantilla Year
                  <span className="font-normal text-slate-400 font-serif italic text-[10px]">Appears in bottom left</span>
                </label>
                <input type="text" value={fy} onChange={e => setFy(e.target.value)} placeholder="FY 2026" className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
              </div>
            </div>
            
          </div>

          <div className="mt-6 pt-5">
            <button 
              onClick={() => window.print()} 
              className="w-full py-3.5 bg-[var(--gold)] text-[var(--navy)] font-bold uppercase tracking-wider rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Printer size={18} /> Print {employees.length} Documents
            </button>
          </div>
        </div>

        `;

  code = code.substring(0, startIdx) + newSidebar + code.substring(printSideIdx);
  fs.writeFileSync('src/components/BatchNOSAModal.tsx', code);
}

function updateSingleNOSA() {
  let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

  // Add Lucide imports if not present
  if (!code.includes('Calendar, FileText, User, Printer, X, History, Save, DollarSign')) {
    code = code.replace(/import { X, Printer } from 'lucide-react';/, "import { X, Printer, Calendar, FileText, User, History, Save, DollarSign } from 'lucide-react';");
  }

  const startIdx = code.indexOf('<div className="w-full md:w-1/3');
  const printSideIdx = code.indexOf('{/* PREVIEW/PRINT SIDE */}');

  if (startIdx === -1 || printSideIdx === -1) {
    console.error("Could not find boundaries for NOSAModal");
    return;
  }

  const newSidebar = `
        {/* FORM SIDE (NO PRINT) */}
        <div className="w-full md:w-[400px] shrink-0 bg-slate-50 border-r border-slate-200 p-6 overflow-y-auto no-print flex flex-col">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-[var(--navy)]">Generate NOSA</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Individual Adjustment</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 text-slate-400 hover:text-rose-500 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-5 flex-1">
            
            {/* Record History Dropdown */}
            <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl shadow-sm space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-blue-900 border-b border-blue-200/50 pb-2">
                <History size={16} className="text-blue-500" /> Saved Records
              </h3>
              <select 
                value={selectedHistoryId} 
                onChange={e => {
                  if (e.target.value === '') {
                    setSelectedHistoryId('');
                  } else {
                    setSelectedHistoryId(e.target.value);
                  }
                }}
                className="w-full bg-white border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-3 py-2 text-sm transition-all outline-none text-blue-900 font-medium"
              >
                <option value="">-- Start New Blank NOSA --</option>
                {employee.nosaRecords?.map(record => (
                  <option key={record.id} value={record.id}>
                    {new Date(record.createdAt).toLocaleDateString()} - SG {record.newSg}/{record.newStep} ({record.newDate})
                  </option>
                ))}
              </select>
            </div>

            {/* Document Details */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--navy)] border-b border-slate-100 pb-2">
                <Calendar size={16} className="text-[var(--gold)]" /> Document Details
              </h3>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Date of Notice</label>
                <input type="date" value={dateOfNotice} onChange={e => setDateOfNotice(e.target.value)} className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
              </div>
            </div>

            {/* Salary Adjustments */}
            <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl shadow-sm space-y-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-900 border-b border-emerald-200/50 pb-2">
                <DollarSign size={16} className="text-emerald-500" /> Salary Adjustment
              </h3>
              
              {/* NEW */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest">New Salary</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-emerald-700/70">New SG</label>
                    <input type="text" value={newSg} onChange={e => setNewSg(e.target.value)} className="w-full bg-white border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-lg px-3 py-2 text-sm transition-all outline-none text-slate-800" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-emerald-700/70">New Step</label>
                    <input type="text" value={newStep} onChange={e => setNewStep(e.target.value)} className="w-full bg-white border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-lg px-3 py-2 text-sm transition-all outline-none text-slate-800" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-emerald-700/70">New Basic Salary</label>
                  <input type="number" value={newSalary} onChange={e => setNewSalary(e.target.value)} className="w-full bg-white border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-lg px-3 py-2 text-sm transition-all outline-none text-slate-800 font-mono font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-emerald-700/70">Effective Date</label>
                  <input type="text" value={newDate} onChange={e => setNewDate(e.target.value)} placeholder="e.g. January 1, 2026" className="w-full bg-white border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-lg px-3 py-2 text-sm transition-all outline-none text-slate-800" />
                </div>
              </div>

              <div className="w-full h-px bg-emerald-200/60 my-2"></div>

              {/* OLD */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest">Previous Salary</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-amber-700/70">Old SG</label>
                    <input type="text" value={oldSg} onChange={e => setOldSg(e.target.value)} className="w-full bg-white border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-lg px-3 py-2 text-sm transition-all outline-none text-slate-800" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-amber-700/70">Old Step</label>
                    <input type="text" value={oldStep} onChange={e => setOldStep(e.target.value)} className="w-full bg-white border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-lg px-3 py-2 text-sm transition-all outline-none text-slate-800" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-amber-700/70">Old Basic Salary</label>
                  <input type="number" value={oldSalary} onChange={e => setOldSalary(e.target.value)} className="w-full bg-white border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-lg px-3 py-2 text-sm transition-all outline-none text-slate-800 font-mono font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-amber-700/70">As of Date</label>
                  <input type="text" value={oldDate} onChange={e => setOldDate(e.target.value)} placeholder="e.g. December 31, 2025" className="w-full bg-white border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-lg px-3 py-2 text-sm transition-all outline-none text-slate-800" />
                </div>
              </div>
            </div>

            {/* Legal Mandates */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--navy)] border-b border-slate-100 pb-2">
                <FileText size={16} className="text-[var(--gold)]" /> Legal Mandates
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">LBC No.</label>
                  <input type="text" value={lbcNo} onChange={e => setLbcNo(e.target.value)} className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">LBC Date</label>
                  <input type="text" value={lbcDate} onChange={e => setLbcDate(e.target.value)} className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">EO No.</label>
                  <input type="text" value={eoNo} onChange={e => setEoNo(e.target.value)} className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">EO Date</label>
                  <input type="text" value={eoDate} onChange={e => setEoDate(e.target.value)} className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
                </div>
              </div>
            </div>

            {/* General Info */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--navy)] border-b border-slate-100 pb-2">
                <User size={16} className="text-[var(--gold)]" /> General Details
              </h3>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Designation / Title</label>
                <input type="text" value={designation} onChange={e => setDesignation(e.target.value)} className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Signatory (Mayor)</label>
                <input type="text" value={mayorName} onChange={e => setMayorName(e.target.value)} className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Item No.</label>
                  <input type="text" value={itemNo} onChange={e => setItemNo(e.target.value)} className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Plantilla Year</label>
                  <input type="text" value={fy} onChange={e => setFy(e.target.value)} className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 rounded-lg px-3 py-2.5 text-sm transition-all outline-none text-slate-800" />
                </div>
              </div>
            </div>

          </div>

          <div className="mt-6 pt-5 grid grid-cols-2 gap-3">
            <button 
              onClick={handleSave} 
              className="w-full py-3 bg-white border-2 border-[var(--navy)] text-[var(--navy)] font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Save size={16} /> Save Record
            </button>
            <button 
              onClick={() => window.print()} 
              className="w-full py-3 bg-[var(--gold)] text-[var(--navy)] font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Printer size={16} /> Print NOSA
            </button>
          </div>
        </div>
        
        `;

  code = code.substring(0, startIdx) + newSidebar + code.substring(printSideIdx);
  fs.writeFileSync('src/components/NOSAModal.tsx', code);
}

updateBatchNOSA();
updateSingleNOSA();

