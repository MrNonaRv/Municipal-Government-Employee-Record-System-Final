import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Employee } from '../types/employee';

interface Props {
  employee: Employee;
}

export default function LeaveTrendsChart({ employee }: Props) {
  const data = useMemo(() => {
    if (!employee.leaveRecords || employee.leaveRecords.length === 0) return [];
    
    // Parse records to get year and month
    const records = employee.leaveRecords.filter(r => !r.isSeparator && r.period);
    
    // Get last 12 months from now
    const now = new Date();
    const last12Months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last12Months.push({
        year: d.getFullYear(),
        month: d.toLocaleString('en-US', { month: 'short' }),
        label: `${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`
      });
    }

    return last12Months.map(tm => {
      // Find matching record
      const rec = records.find(r => 
        r.period?.toLowerCase().includes(tm.year.toString()) && 
        r.period?.toLowerCase().includes(tm.month.toLowerCase())
      );

      let vlAbs = 0;
      let slAbs = 0;
      let wop = 0;

      if (rec) {
        vlAbs = parseFloat(rec.vlAbsUndWp || '0') || 0;
        slAbs = parseFloat(rec.slAbsUndWp || '0') || 0;
        wop = (parseFloat(rec.vlAbsUndWop || '0') || 0) + (parseFloat(rec.slAbsUndWop || '0') || 0);
      }

      return {
        name: tm.label,
        VL: vlAbs,
        SL: slAbs,
        WOP: wop
      };
    });
  }, [employee]);

  if (!employee.leaveRecords || employee.leaveRecords.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-[250px] mt-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">12-Month Absence Trend (Days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#334155' }}
            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
          />
          <Area type="monotone" dataKey="VL" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Vacation Leave" />
          <Area type="monotone" dataKey="SL" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} name="Sick Leave" />
          <Area type="monotone" dataKey="WOP" stackId="2" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} name="Without Pay" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
