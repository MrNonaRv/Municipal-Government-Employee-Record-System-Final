const fs = require('fs');
let code = fs.readFileSync('src/components/PDSPrintModal.tsx', 'utf8');
code = code.replace('className="bg-slate-200 rounded-2xl shadow-2xl w-[98vw] max-w-[1800px] h-[95vh]', 'className="bg-slate-200 rounded-2xl shadow-2xl w-[98vw] max-w-[1200px] h-[95vh]');
fs.writeFileSync('src/components/PDSPrintModal.tsx', code);
