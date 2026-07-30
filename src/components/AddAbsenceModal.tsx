import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { LeaveRecord } from '../types/employee';

interface Props {
  onClose: () => void;
  onSave: (year: number, month: string, leaveType: string, dates: string) => void;
}

export default function AddAbsenceModal({ onClose, onSave }: Props) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState('Jan');
  const [leaveType, setLeaveType] = useState('VL');
  const [dates, setDates] = useState('');

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const leaveTypes = [
    { value: 'VL', label: 'Vacation Leave (VL)' },
    { value: 'SL', label: 'Sick Leave (SL)' },
    { value: 'SL WOP', label: 'Sick Leave Without Pay (SL WOP)' },
    { value: 'LWOP', label: 'Leave Without Pay (LWOP)' },
    { value: 'AWOL', label: 'Absence Without Leave (AWOL)' },
    { value: 'FL', label: 'Force Leave (FL)' },
    { value: 'SPL', label: 'Special Privilege Leave (SPL)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !month || !leaveType || !dates.trim()) return;
    onSave(parseInt(year), month, leaveType, dates.trim());
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={18} className="text-blue-600" />
            Add Leave / Absence Entry
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Year</label>
              <input
                type="number"
                required
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Month</label>
              <select
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {months.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Leave Type</label>
            <select
              value={leaveType}
              onChange={e => setLeaveType(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {leaveTypes.map(lt => (
                <option key={lt.value} value={lt.value}>{lt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Dates</label>
            <input
              type="text"
              required
              placeholder="e.g. 1-2, 4, 15 half"
              value={dates}
              onChange={e => setDates(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Use commas to separate multiple dates or ranges.</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
