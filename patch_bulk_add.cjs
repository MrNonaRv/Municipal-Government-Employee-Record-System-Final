const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const search = `                const newRecords = months.map((m, i) => ({
                  id: 'lc-' + Date.now().toString(36) + '-' + i + '-' + Math.random().toString(36).substring(2, 9),
                  period: year + ' ' + m,
                  vlEarned: '', vlAbsUndWp: '', vlBalance: '', vlAbsUndWop: '',
                  slEarned: '', slAbsUndWp: '', slBalance: '', slAbsUndWop: '',
                  dateAndAction: ''
                }));`;

const replace = `                let currentVlBalance = 0;
                let currentSlBalance = 0;
                if (records.length > 0) {
                  currentVlBalance = parseFloat(records[records.length - 1].vlBalance || '0') || 0;
                  currentSlBalance = parseFloat(records[records.length - 1].slBalance || '0') || 0;
                }
                const newRecords = months.map((m, i) => {
                  currentVlBalance += 1.25;
                  currentSlBalance += 1.25;
                  return {
                    id: 'lc-' + Date.now().toString(36) + '-' + i + '-' + Math.random().toString(36).substring(2, 9),
                    period: year + ' ' + m,
                    vlEarned: '1.25', vlAbsUndWp: '', vlBalance: Number(currentVlBalance.toFixed(3)).toString(), vlAbsUndWop: '',
                    slEarned: '1.25', slAbsUndWp: '', slBalance: Number(currentSlBalance.toFixed(3)).toString(), slAbsUndWop: '',
                    dateAndAction: ''
                  };
                });`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
