const fs = require('fs');
const code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const target = `              onClick={() => {
                const year = bulkYear || new Date().getFullYear().toString();
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                let currentVlBalance = 0;
                let currentSlBalance = 0;
                if (records.length > 0) {
                  currentVlBalance = parseFloat(records[records.length - 1].vlBalance || '0') || 0;
                  currentSlBalance = parseFloat(records[records.length - 1].slBalance || '0') || 0;
                }
                const newRecords = months.map((m, i) => {`;

const newCode = `              onClick={() => {
                const year = bulkYear || new Date().getFullYear().toString();
                const currentYear = new Date().getFullYear().toString();
                const currentMonthIndex = new Date().getMonth();
                const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                
                const targetMonths = year === currentYear 
                  ? allMonths.slice(0, currentMonthIndex + 1)
                  : parseInt(year) > parseInt(currentYear)
                    ? [] 
                    : allMonths;

                if (targetMonths.length === 0) {
                  alert("Cannot add leave records for future years.");
                  return;
                }

                let currentVlBalance = 0;
                let currentSlBalance = 0;
                if (records.length > 0) {
                  currentVlBalance = parseFloat(records[records.length - 1].vlBalance || '0') || 0;
                  currentSlBalance = parseFloat(records[records.length - 1].slBalance || '0') || 0;
                }
                const newRecords = targetMonths.map((m, i) => {`;

fs.writeFileSync('src/components/LeaveCardEditor.tsx', code.replace(target, newCode));
console.log('patched editor');
