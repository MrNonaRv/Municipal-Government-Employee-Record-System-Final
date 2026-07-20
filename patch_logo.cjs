const fs = require('fs');
let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

code = code.replace(
  '<div className="w-20 h-20 rounded-full border border-slate-300 mx-auto"></div>',
  '<img src="/Systemlogo.jpg" alt="Seal" className="w-20 h-20 rounded-full mx-auto object-cover" />'
);

fs.writeFileSync('src/components/NOSAModal.tsx', code);
