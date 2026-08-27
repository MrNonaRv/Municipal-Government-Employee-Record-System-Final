const fs = require('fs');

function fixSingleNOSA() {
  let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

  // Add dateOfNotice to newRecord
  if (code.includes('const newRecord = {') && !code.includes('dateOfNotice,')) {
      code = code.replace(
        'const newRecord = {', 
        'const newRecord = {\n      dateOfNotice,'
      );
  }

  fs.writeFileSync('src/components/NOSAModal.tsx', code);
}

fixSingleNOSA();
