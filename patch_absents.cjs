const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardViewer.tsx', 'utf8');

const oldCode = `            } else if (calculatedDays === 0) {
              // If they cleared particulars, we could clear the absents, but it's safer to leave them.
            }`;

const newCode = `            } else if (calculatedDays === 0) {
              updated.vlAbsUndWp = '';
              updated.slAbsUndWp = '';
              updated.vlAbsUndWop = '';
              updated.slAbsUndWop = '';
            }`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/components/LeaveCardViewer.tsx', code);
console.log('patched absents');
