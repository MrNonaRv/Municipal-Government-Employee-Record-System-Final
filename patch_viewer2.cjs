const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardViewer.tsx', 'utf8');

const target = `              {records.map((record) => {
                const vlWopDeduction = calculateDeduction(record.vlAbsUndWop);`;

const replace = `              {records.map((record) => {
                if (record.isSeparator) {
                  return (
                    <tr key={record.id} className="border-b-4 border-slate-300 bg-slate-100">
                      <td colSpan={11} className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-widest">
                        {record.period || '--- YEAR SEPARATOR ---'}
                      </td>
                    </tr>
                  );
                }

                const vlWopDeduction = calculateDeduction(record.vlAbsUndWop);`;

if (code.includes(target)) {
  code = code.replace(target, replace);
  fs.writeFileSync('src/components/LeaveCardViewer.tsx', code);
  console.log("Patched successfully!");
} else {
  console.log("Not found.");
}
