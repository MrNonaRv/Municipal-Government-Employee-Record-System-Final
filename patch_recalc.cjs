const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardViewer.tsx', 'utf8');

const target = `    newRecords = recalculateBalances(newRecords, id.startsWith('new-') ? undefined : id);`;
const replacement = `    const isBalanceEdit = field === 'vlBalance' || field === 'slBalance';
    newRecords = recalculateBalances(newRecords, id.startsWith('new-') ? undefined : (isBalanceEdit ? id : undefined));`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/LeaveCardViewer.tsx', code);
  console.log('patched recalculation logic');
} else {
  console.log('could not find target');
}
