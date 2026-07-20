const fs = require('fs');
let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

code = code.replaceAll(
  '<div className="w-48 flex justify-between ml-auto">',
  '<div className="w-1/4 flex gap-2">'
);

fs.writeFileSync('src/components/NOSAModal.tsx', code);
