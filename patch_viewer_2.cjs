const fs = require('fs');

function applyPatch(file) {
  let code = fs.readFileSync(file, 'utf8');

  // We need to inject the current year and month logic into the targetYears.map
  // Wait, targetYears logic is inside the component. We can just add condition to stdMonths.forEach

  const target = `                stdMonths.forEach((month) => {
                  const matched = yearRecords.filter(r => r.period?.toLowerCase().includes(month.match) && !r.isSeparator);`;

  const newCode = `                stdMonths.forEach((month, monthIndex) => {
                  const currentYear = new Date().getFullYear();
                  const currentMonthIndex = new Date().getMonth();
                  if (year === currentYear && monthIndex > currentMonthIndex) {
                    return;
                  }
                  if (year > currentYear) {
                    return;
                  }
                  
                  const matched = yearRecords.filter(r => r.period?.toLowerCase().includes(month.match) && !r.isSeparator);`;

  code = code.replace(target, newCode);
  
  // also filter targetYears
  const targetYearsCode = `const targetYears = [startYear, startYear + 1, startYear + 2];`;
  const newTargetYearsCode = `const currentYear = new Date().getFullYear();
  const targetYears = [];
  for (let y = startYear; y <= Math.max(startYear, currentYear); y++) {
    targetYears.push(y);
  }`;
  
  code = code.replace(targetYearsCode, newTargetYearsCode);

  fs.writeFileSync(file, code);
}

applyPatch('src/components/LeaveCardViewer.tsx');
applyPatch('src/components/LeaveCardPrintModal.tsx');
console.log('patched viewer and print');
