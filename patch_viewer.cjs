const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardViewer.tsx', 'utf8');

const targetViewer = `              {records.map((record) => {
                const vlWopDeduction = calculateDeduction(record.vlAbsUndWop);
                const slWopDeduction = calculateDeduction(record.slAbsUndWop);
                const totalDeduction = vlWopDeduction + slWopDeduction;
                
                return (
                  <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 border-r border-slate-200 font-bold whitespace-nowrap">{record.period}</td>
                    
                    {/* VL */}
                    <td className="px-2 py-3 border-r border-slate-100 text-center">{record.vlEarned}</td>
                    <td className="px-2 py-3 border-r border-slate-100 text-center">{record.vlAbsUndWp}</td>
                    <td className="px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]">{record.vlBalance}</td>
                    <td className="px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10">{record.vlAbsUndWop}</td>
                    
                    {/* SL */}
                    <td className="px-2 py-3 border-r border-slate-100 text-center">{record.slEarned}</td>
                    <td className="px-2 py-3 border-r border-slate-100 text-center">{record.slAbsUndWp}</td>
                    <td className="px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]">{record.slBalance}</td>
                    <td className="px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10">{record.slAbsUndWop}</td>
                    
                    <td className="px-4 py-3 border-r border-slate-200 text-xs text-slate-600">{record.dateAndAction}</td>
                    
                    <td className="px-4 py-3 text-right font-mono font-bold text-red-600 bg-red-50/10">
                      {totalDeduction > 0 ? \`-₱\${totalDeduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\` : '-'}
                    </td>
                  </tr>
                );
              })}`;

const replaceViewer = `              {records.map((record) => {
                if (record.isSeparator) {
                  return (
                    <tr key={record.id} className="border-b-4 border-slate-300 bg-slate-100">
                      <td colSpan={11} className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-widest">
                        {record.period || '--- YEAR SEPARATOR ---'}
                      </td>
                    </tr>
                  );
                }

                const vlWopDeduction = calculateDeduction(record.vlAbsUndWop);
                const slWopDeduction = calculateDeduction(record.slAbsUndWop);
                const totalDeduction = vlWopDeduction + slWopDeduction;
                
                return (
                  <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 border-r border-slate-200 font-bold whitespace-nowrap">{record.period}</td>
                    
                    {/* VL */}
                    <td className="px-2 py-3 border-r border-slate-100 text-center">{record.vlEarned}</td>
                    <td className="px-2 py-3 border-r border-slate-100 text-center">{record.vlAbsUndWp}</td>
                    <td className="px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]">{record.vlBalance}</td>
                    <td className="px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10">{record.vlAbsUndWop}</td>
                    
                    {/* SL */}
                    <td className="px-2 py-3 border-r border-slate-100 text-center">{record.slEarned}</td>
                    <td className="px-2 py-3 border-r border-slate-100 text-center">{record.slAbsUndWp}</td>
                    <td className="px-2 py-3 border-r border-slate-100 text-center font-bold text-[var(--navy)]">{record.slBalance}</td>
                    <td className="px-2 py-3 border-r border-slate-200 text-center font-bold text-red-500 bg-red-50/10">{record.slAbsUndWop}</td>
                    
                    <td className="px-4 py-3 border-r border-slate-200 text-xs text-slate-600">{record.dateAndAction}</td>
                    
                    <td className="px-4 py-3 text-right font-mono font-bold text-red-600 bg-red-50/10">
                      {totalDeduction > 0 ? \`-₱\${totalDeduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\` : '-'}
                    </td>
                  </tr>
                );
              })}`;

code = code.replace(targetViewer, replaceViewer);
fs.writeFileSync('src/components/LeaveCardViewer.tsx', code);
