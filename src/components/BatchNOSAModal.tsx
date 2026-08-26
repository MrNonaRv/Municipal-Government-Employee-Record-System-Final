import React, { useState, useMemo } from 'react';
import { Employee } from '../types/employee';
import { X, Printer } from 'lucide-react';
import { getResolvedLatestRecord } from '../utils/helpers';
import { motion } from 'motion/react';

interface Props {
  employees: Employee[];
  onClose: () => void;
}

export default function BatchNOSAModal({ employees, onClose }: Props) {
  const [dateOfNotice, setDateOfNotice] = useState(new Date().toISOString().split('T')[0]);
  const [mayorName, setMayorName] = useState('LEODEGARIO A. LABAO JR.');
  
  const [lbcNo, setLbcNo] = useState('');
  const [lbcDate, setLbcDate] = useState('');
  const [eoNo, setEoNo] = useState('');
  const [eoDate, setEoDate] = useState('');
  const [fy, setFy] = useState(new Date().getFullYear().toString());
  const [itemNo, setItemNo] = useState('');
  
  const [newDate, setNewDate] = useState('January 1, 2026');
  const [oldDate, setOldDate] = useState('December 31, 2025');

  // Filter employees who actually have an adjustment in 2026 (or just all employees with >= 2 service records)
  // Let's just generate for all selected/filtered employees
  const nosaList = useMemo(() => {
    return employees.map(employee => {
      const sortedRecords = [...(employee.serviceRecords || [])].sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());
      const resolvedLatest = sortedRecords.length > 0 ? getResolvedLatestRecord(sortedRecords) : null;
      const des = resolvedLatest?.designation || 'Municipal Civil Registrar';

      let nSal = '';
      let oSal = '';

      if (sortedRecords.length >= 2) {
        nSal = sortedRecords[sortedRecords.length - 1].salary || '';
        oSal = sortedRecords[sortedRecords.length - 2].salary || '';
      } else if (sortedRecords.length === 1) {
        nSal = sortedRecords[0].salary || '';
      }

      nSal = nSal.replace(/[^0-9.]/g, '');
      oSal = oSal.replace(/[^0-9.]/g, '');

      const diff = parseFloat(nSal) - parseFloat(oSal);
      const monthlyAdjustment = isNaN(diff) ? '0.00' : diff.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      const formattedNewSalary = isNaN(parseFloat(nSal)) ? '0.00' : parseFloat(nSal).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      const formattedOldSalary = isNaN(parseFloat(oSal)) ? '0.00' : parseFloat(oSal).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

      return {
        employee,
        des,
        nSal,
        oSal,
        formattedNewSalary,
        formattedOldSalary,
        monthlyAdjustment,
        newSg: '',
        newStep: '',
        oldSg: '',
        oldStep: ''
      };
    });
  }, [employees]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm print:static print:p-0 print:block print:bg-white"
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden print:w-full print:max-w-none print:shadow-none print:block print:overflow-visible print:h-auto"
      >
        {/* SETTINGS SIDE */}
        <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 p-6 flex flex-col overflow-y-auto print:hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--navy)]">Batch NOSA</h2>
              <p className="text-xs text-slate-500 mt-1">Generate for {employees.length} employees</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          <div className="space-y-6 flex-1">
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <h3 className="text-xs font-bold uppercase text-[var(--navy)] tracking-wider">Document Settings</h3>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Date of Notice</label>
                <input type="date" value={dateOfNotice} onChange={e => setDateOfNotice(e.target.value)} className="w-full border border-slate-200 rounded px-2 py-1 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Effective Date (New)</label>
                <input type="text" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full border border-slate-200 rounded px-2 py-1 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">As of Date (Old)</label>
                <input type="text" value={oldDate} onChange={e => setOldDate(e.target.value)} className="w-full border border-slate-200 rounded px-2 py-1 text-sm" />
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <h3 className="text-xs font-bold uppercase text-[var(--navy)] tracking-wider">Circular Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">LBC No.</label>
                  <input type="text" value={lbcNo} onChange={e => setLbcNo(e.target.value)} className="w-full border border-slate-200 rounded px-2 py-1 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">LBC Date</label>
                  <input type="text" value={lbcDate} onChange={e => setLbcDate(e.target.value)} className="w-full border border-slate-200 rounded px-2 py-1 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">EO No.</label>
                  <input type="text" value={eoNo} onChange={e => setEoNo(e.target.value)} className="w-full border border-slate-200 rounded px-2 py-1 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">EO Date</label>
                  <input type="text" value={eoDate} onChange={e => setEoDate(e.target.value)} className="w-full border border-slate-200 rounded px-2 py-1 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Plantilla Year</label>
                  <input type="text" value={fy} onChange={e => setFy(e.target.value)} className="w-full border border-slate-200 rounded px-2 py-1 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Generic Item No.</label>
                  <input type="text" value={itemNo} onChange={e => setItemNo(e.target.value)} className="w-full border border-slate-200 rounded px-2 py-1 text-sm" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <h3 className="text-xs font-bold uppercase text-[var(--navy)] tracking-wider">Signatory</h3>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Mayor's Name</label>
                <input type="text" value={mayorName} onChange={e => setMayorName(e.target.value)} className="w-full border border-slate-200 rounded px-2 py-1 text-sm" />
              </div>
            </div>
            
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <button 
              onClick={() => window.print()} 
              className="w-full py-3 bg-[var(--gold)] text-[var(--navy)] font-bold uppercase tracking-widest rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Printer size={18} /> Print {employees.length} Documents
            </button>
          </div>
        </div>

        {/* PREVIEW/PRINT SIDE */}
        <div className="w-full md:w-2/3 bg-slate-200 p-8 overflow-y-auto overflow-x-auto flex flex-col items-center justify-start print:p-0 print:bg-white print:overflow-visible print:block print:w-full">
          {nosaList.map((nosa, idx) => (
            <div key={nosa.employee.id} style={{ fontFamily: '"Times New Roman", Times, serif', pageBreakAfter: idx < nosaList.length - 1 ? 'always' : 'auto' }} className="bg-white p-[1in] shadow-sm w-[8.5in] min-w-[8.5in] max-w-[8.5in] shrink-0 min-h-[11in] text-black font-serif relative mb-8 print:mb-0 print:shadow-none print:w-full print:min-w-0 print:max-w-none print:min-h-0 print:p-[1in] mx-auto">
              {/* Header */}
              <div className="mb-8" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                <div className="flex justify-between items-start">
                  <div className="w-[120px]">
                    {/* Left Logo (Seal) */}
                    <img src="/Systemlogo.jpg" alt="Seal" className="w-20 h-20 rounded-full mx-auto object-cover" />
                  </div>
                  <div className="flex-1 text-center leading-snug">
                    <p className="text-[11pt]">Republic of the Philippines</p>
                    <p className="text-[11pt]">Province of Capiz</p>
                    <p className="text-[11pt]">Municipality of Mambusao</p>
                    <p className="text-[14pt] font-bold uppercase mt-3 mb-1">OFFICE OF THE MAYOR</p>
                    <p className="text-[10pt] italic">Telephone (036) 6470-045</p>
                    <p className="text-[10pt] italic">Email Address: mambusao_lgu@yahoo.com</p>
                  </div>
                  <div className="w-[120px] flex justify-center">
                    {/* Right Logo (Flag) */}
                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Flag_of_the_Philippines.svg" alt="Flag" className="w-24 h-[3rem] object-cover mt-2 border border-slate-200" />
                  </div>
                </div>
                <div className="w-full h-[1px] bg-black mt-4"></div>
              </div>

              <div className="text-center mb-6">
                <h1 className="text-[14pt] font-bold uppercase">NOTICE OF SALARY ADJUSTMENT</h1>
              </div>

              <div className="flex justify-end mb-6 text-[12pt]">
                <p>{new Date(dateOfNotice).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>

              <div className="mb-6 text-[12pt] leading-tight">
                <p className="font-bold uppercase">{(nosa.employee.sex === 'Female' ? (nosa.employee.civilStatus === 'Married' ? 'MRS. ' : 'MS. ') : 'MR. ')} {nosa.employee.firstName} {nosa.employee.middleName ? nosa.employee.middleName.charAt(0) + '.' : ''} {nosa.employee.surname}</p>
                <p>{nosa.des}</p>
                <p>Office of the {nosa.des}</p>
                <p>Mambusao, Capiz</p>
              </div>

              <div className="mb-6 text-[12pt]">
                <p>Dear {(nosa.employee.sex === 'Female' ? (nosa.employee.civilStatus === 'Married' ? 'Mrs. ' : 'Ms. ') : 'Mr. ')} {nosa.employee.surname}:</p>
              </div>

              <div className="mb-6 text-[12pt] text-justify indent-12 leading-relaxed">
                <p>
                  Pursuant to Local Budget Circular No. {lbcNo}, dated {lbcDate} implementing Executive Order No. {eoNo} dated {eoDate}, your salary is hereby adjusted effective {newDate}, as follows:
                </p>
              </div>

              <div className="pl-12 pr-8 space-y-6 text-[12pt] mb-8">
                <div className="flex justify-between items-start">
                  <div className="w-3/4 flex gap-4">
                    <span>1.</span>
                    <p>Adjusted monthly basic salary effective {newDate}, under<br/>the new Salary Schedule; SG- {nosa.newSg}, Step {nosa.newStep}</p>
                  </div>
                  <div className="w-1/4 flex gap-2">
                    <span>P</span>
                    <span className="text-right">{nosa.formattedNewSalary}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div className="w-3/4 flex gap-4">
                    <span>2.</span>
                    <p>Actual monthly basic salary as of {oldDate};<br/>SG- {nosa.oldSg}, Step {nosa.oldStep}</p>
                  </div>
                  <div className="w-1/4 flex gap-2">
                    <span>P</span>
                    <span className="text-right">{nosa.formattedOldSalary}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div className="w-3/4 flex gap-4">
                    <span>3.</span>
                    <p>Monthly Salary Adjustment effective {newDate}</p>
                  </div>
                  <div className="w-1/4 flex gap-2">
                    <span>P</span>
                    <span className="text-right">{nosa.monthlyAdjustment}</span>
                  </div>
                </div>
              </div>

              <div className="mb-8 text-[12pt] text-justify indent-12 leading-relaxed">
                <p>
                  It is understood that this fourth tranche is subject to usual accounting and auditing rules and regulations, and to appropriate re-adjustment and refund if found not in order.
                </p>
              </div>

              <div className="flex justify-end mb-8 pr-12 text-[12pt]">
                <div className="text-center">
                  <p className="text-left mb-10">Very truly yours,</p>
                  <p className="font-bold uppercase">{mayorName}</p>
                  <p>Municipal Mayor</p>
                </div>
              </div>

              <div className="text-[11pt] leading-tight">
                <p>Position Title: {nosa.des}</p>
                <p>Salary Grade: {nosa.newSg}/{nosa.newStep}</p>
                <p>Item No. {itemNo}, FY {fy}, Plantilla of Personnel {fy}</p>
              </div>

              <div className="mt-6 text-[11pt] leading-tight">
                <p>Copy furnished:</p>
                <div className="pl-12">
                  <p>1. HRM Section</p>
                  <p className="pl-6">LGU- Mambusao, Capiz</p>
                  <p>2. GSIS- Roxas City</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
