const fs = require('fs');
let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

code = code.replace(
  '<div className="w-24 h-14 bg-slate-200 mt-2"></div>',
  '<img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Flag_of_the_Philippines.svg" alt="Flag" className="w-24 h-[3rem] object-cover mt-2 border border-slate-200" />'
);

fs.writeFileSync('src/components/NOSAModal.tsx', code);
