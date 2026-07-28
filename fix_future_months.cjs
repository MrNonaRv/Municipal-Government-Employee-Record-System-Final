const fs = require('fs');

function applyFix(file) {
  let code = fs.readFileSync(file, 'utf8');

  const target = `                stdMonths.forEach((month, monthIndex) => {
                  const isFuture = year > currentYear || (year === currentYear && monthIndex > currentMonthIndex);
                  const matched = yearRecords.filter(r => r.period?.toLowerCase().includes(month.match) && !r.isSeparator);
                  
                  if (matched.length > 0 && !isFuture) {
                    matched.forEach(rec => {
                      matchedIds.add(rec.id);`;

  const replacement = `                stdMonths.forEach((month, monthIndex) => {
                  const isFuture = year > currentYear || (year === currentYear && monthIndex > currentMonthIndex);
                  const matched = yearRecords.filter(r => r.period?.toLowerCase().includes(month.match) && !r.isSeparator);
                  
                  matched.forEach(rec => matchedIds.add(rec.id));
                  
                  if (matched.length > 0 && !isFuture) {
                    matched.forEach(rec => {`;

  if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('Fixed ' + file);
  } else {
    console.log('Could not find target in ' + file);
  }
}

applyFix('src/components/LeaveCardViewer.tsx');
applyFix('src/components/LeaveCardPrintModal.tsx');
