const fs = require('fs');
let code = fs.readFileSync('src/components/AddAbsenceModal.tsx', 'utf8');

if (!code.includes("SL WOP")) {
    code = code.replace(
        "{ value: 'SL', label: 'Sick Leave (SL)' },",
        "{ value: 'SL', label: 'Sick Leave (SL)' },\n    { value: 'SL WOP', label: 'Sick Leave Without Pay (SL WOP)' },"
    );
    fs.writeFileSync('src/components/AddAbsenceModal.tsx', code);
}
