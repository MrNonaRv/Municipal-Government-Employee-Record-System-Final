const fs = require('fs');

function fixSingleNOSA() {
  let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

  // Remove duplicate dateOfNotice
  code = code.replace(/dateOfNotice,\s*dateOfNotice,/g, 'dateOfNotice,');
  
  // also handle the case if it's spread out
  code = code.replace(/dateOfNotice,\n\s*dateOfNotice,/g, 'dateOfNotice,');

  fs.writeFileSync('src/components/NOSAModal.tsx', code);
}

fixSingleNOSA();
