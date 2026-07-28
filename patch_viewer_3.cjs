const fs = require('fs');

function fixFutureMonths(file) {
  let code = fs.readFileSync(file, 'utf8');

  // Find the exact block we added and replace it to just loop through all months without skipping.
  // We'll let the standard matched.length > 0 check handle whether it's blank or not.
  // Since future months won't have records auto-generated, they will naturally be blank.
  
  const toReplace = `                stdMonths.forEach((month, monthIndex) => {
                  const currentYear = new Date().getFullYear();
                  const currentMonthIndex = new Date().getMonth();
                  if (year === currentYear && monthIndex > currentMonthIndex) {
                    return;
                  }
                  if (year > currentYear) {
                    return;
                  }
                  
                  const matched = yearRecords.filter(r => r.period?.toLowerCase().includes(month.match) && !r.isSeparator);`;

  const newCode = `                stdMonths.forEach((month, monthIndex) => {
                  const matched = yearRecords.filter(r => r.period?.toLowerCase().includes(month.match) && !r.isSeparator);`;

  if (code.includes(toReplace)) {
    code = code.replace(toReplace, newCode);
    fs.writeFileSync(file, code);
    console.log('Fixed ' + file);
  } else {
    console.log('Could not find target block in ' + file);
  }
}

fixFutureMonths('src/components/LeaveCardViewer.tsx');
fixFutureMonths('src/components/LeaveCardPrintModal.tsx');
