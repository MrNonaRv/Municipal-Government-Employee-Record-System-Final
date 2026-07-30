const fs = require('fs');

const code = `import React, { useRef, useEffect } from 'react';
import { ServiceRecord } from '../types/employee';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  records: ServiceRecord[];
  onChange: (records: ServiceRecord[]) => void;
}

export default function ServiceRecordEditor({ records, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAdd = () => {
    const newId = 'sr-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
    const newRecord: ServiceRecord = {
      id: newId, from: '', to: '', designation: '', status: 'Perm.',
      salary: '', station: '', branch: '', lwop: '', sepDate: '', sepCause: ''
    };
    onChange([...records, newRecord]);
    
    // Focus the first input of the new row after a short delay
    setTimeout(() => {
      if (containerRef.current) {
        const inputs = containerRef.current.querySelectorAll('input[data-id="' + newId + '"]');
        if (inputs.length > 0) {
          (inputs[0] as HTMLInputElement).focus();
        }
      }
    }, 50);
  };

  const updateRecord = (id: string, field: keyof ServiceRecord, value: string) => {
    onChange(records.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleDelete = (id: string) => {
    onChange(records.filter(r => r.id !== id));
  };

  return (
    <div className="flex flex-col gap-4" ref={containerRef}>
      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Service Records Encoding</h3>
          <p className="text-xs text-slate-500">Edit fields directly in the table. Use Tab to navigate.</p>
        </div>
        <button 
          type="button" 
          onClick={handleAdd} 
          className="flex items-center gap-1 px-4 py-2 bg-[var(--gold)] text-[var(--navy)] font-bold rounded-lg text-xs uppercase tracking-wider hover:bg-opacity-90 transition-colors shadow-sm"
        >
          <Plus size={14} /> Add Row
        </button>
      </div>

      <div className="w-full overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm custom-scrollbar">
        <table className="w-full text-xs text-left whitespace-nowrap">
          <thead className="bg-slate-100 text-slate-600 uppercase font-black tracking-wider text-[9px] border-b border-slate-200">
            <tr>
              <th className="px-2 py-3 w-10 text-center">#</th>
              <th className="px-2 py-3 w-32">From</th>
              <th className="px-2 py-3 w-32">To</th>
              <th className="px-2 py-3 min-w-[200px]">Designation</th>
              <th className="px-2 py-3 w-24">Status</th>
              <th className="px-2 py-3 w-32">Salary</th>
              <th className="px-2 py-3 min-w-[150px]">Station/Place</th>
              <th className="px-2 py-3 min-w-[120px]">Branch</th>
              <th className="px-2 py-3 w-24">L/V W/O Pay</th>
              <th className="px-2 py-3 w-32">Sep. Date</th>
              <th className="px-2 py-3 min-w-[150px]">Sep. Cause</th>
              <th className="px-2 py-3 w-12 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-12 text-center text-slate-400 font-medium">
                  No service records encoded. Click "Add Row" to start.
                </td>
              </tr>
            )}
            {records.map((rec, i) => (
              <tr key={rec.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-2 py-1 text-center font-mono text-slate-400 text-[10px]">{i + 1}</td>
                <td className="px-1 py-1">
                  <input
                    data-id={rec.id}
                    type="date"
                    value={rec.from || ''}
                    onChange={(e) => updateRecord(rec.id, 'from', e.target.value)}
                    className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[var(--gold)] focus:bg-white rounded px-2 py-1.5 transition-all outline-none"
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD or Present"
                    value={rec.to || ''}
                    onChange={(e) => updateRecord(rec.id, 'to', e.target.value)}
                    className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[var(--gold)] focus:bg-white rounded px-2 py-1.5 transition-all outline-none uppercase"
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="text"
                    value={rec.designation || ''}
                    onChange={(e) => updateRecord(rec.id, 'designation', e.target.value)}
                    className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[var(--gold)] focus:bg-white rounded px-2 py-1.5 transition-all outline-none uppercase"
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="text"
                    value={rec.status || ''}
                    onChange={(e) => updateRecord(rec.id, 'status', e.target.value)}
                    className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[var(--gold)] focus:bg-white rounded px-2 py-1.5 transition-all outline-none uppercase"
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="text"
                    value={rec.salary || ''}
                    onChange={(e) => updateRecord(rec.id, 'salary', e.target.value)}
                    className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[var(--gold)] focus:bg-white rounded px-2 py-1.5 transition-all outline-none font-mono"
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="text"
                    value={rec.station || ''}
                    onChange={(e) => updateRecord(rec.id, 'station', e.target.value)}
                    className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[var(--gold)] focus:bg-white rounded px-2 py-1.5 transition-all outline-none uppercase"
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="text"
                    value={rec.branch || ''}
                    onChange={(e) => updateRecord(rec.id, 'branch', e.target.value)}
                    className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[var(--gold)] focus:bg-white rounded px-2 py-1.5 transition-all outline-none uppercase"
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="text"
                    value={rec.lwop || ''}
                    onChange={(e) => updateRecord(rec.id, 'lwop', e.target.value)}
                    className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[var(--gold)] focus:bg-white rounded px-2 py-1.5 transition-all outline-none uppercase"
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="date"
                    value={rec.sepDate || ''}
                    onChange={(e) => updateRecord(rec.id, 'sepDate', e.target.value)}
                    className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[var(--gold)] focus:bg-white rounded px-2 py-1.5 transition-all outline-none"
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="text"
                    value={rec.sepCause || ''}
                    onChange={(e) => updateRecord(rec.id, 'sepCause', e.target.value)}
                    className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-[var(--gold)] focus:bg-white rounded px-2 py-1.5 transition-all outline-none uppercase"
                  />
                </td>
                <td className="px-2 py-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(rec.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Row"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/ServiceRecordEditor.tsx', code);
