const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

const strToFind = `<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-white border border-slate-200 rounded-2xl mb-4 text-left shadow-sm">
                      <div>
                        <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest block mb-1">Employee Surname</span>
                        <strong className="text-base font-extrabold text-slate-900 uppercase block">{employee.surname || '—'}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest block mb-1">Given & Middle Name</span>
                        <strong className="text-base font-extrabold text-slate-900 uppercase block">{employee.firstName} {employee.middleName || ''} {employee.nameExtension || ''}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest block mb-1">Dossier Account ID</span>
                        <strong className="text-base font-mono text-slate-900 font-bold block">EMP-{employee.id.toString().padStart(3, '0')}</strong>
                      </div>
                    </div>`;

const strToReplace = `<div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white border border-slate-200 rounded-2xl mb-4 text-left shadow-sm">
                      <div>
                        <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest block mb-1">Employee Surname</span>
                        <strong className="text-base font-extrabold text-slate-900 uppercase block">{employee.surname || '—'}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest block mb-1">Given & Middle Name</span>
                        <strong className="text-base font-extrabold text-slate-900 uppercase block">{employee.firstName} {employee.middleName || ''} {employee.nameExtension || ''}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest block mb-1">Date of Birth</span>
                        <strong className="text-base font-extrabold text-slate-900 uppercase block">{employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest block mb-1">Dossier Account ID</span>
                        <strong className="text-base font-mono text-slate-900 font-bold block">EMP-{employee.id.toString().padStart(3, '0')}</strong>
                      </div>
                    </div>`;

if (code.includes(strToFind)) {
    code = code.replace(strToFind, strToReplace);
    fs.writeFileSync('src/components/ProfileModal.tsx', code);
} else {
    console.log("Could not find string to replace");
}
