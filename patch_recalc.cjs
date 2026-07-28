const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const targetRecalc = `  const recalculateBalances = (recordsList: LeaveRecord[], editedId?: string) => {
    let currentVl = 0;
    let currentSl = 0;
    return recordsList.map((rec) => {`;

const replaceRecalc = `  const recalculateBalances = (recordsList: LeaveRecord[], editedId?: string) => {
    let currentVl = 0;
    let currentSl = 0;
    return recordsList.map((rec) => {
      if (rec.isSeparator) {
        return { ...rec };
      }`;

code = code.replace(targetRecalc, replaceRecalc);
fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
