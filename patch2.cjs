const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardViewer.tsx', 'utf8');

const regex = /const slDays = parsed\.sl;\s*const vlDays = parsed\.vl \+ parsed\.unknown \+ parsed\.spl \+ parsed\.pl \+ parsed\.fl;\s*if \(slDays > 0\) \{[\s\S]*?updated\.vlAbsUndWop = '';\n\s*\}/;
const newCode = `const slDays = parsed.sl;
            const vlDays = parsed.vl + parsed.unknown + parsed.spl + parsed.pl + parsed.fl;
            const vlWopDays = parsed.vl_wop;
            const slWopDays = parsed.sl_wop;

            if (slDays > 0) {
                updated.slAbsUndWp = slDays.toString();
            } else if (slDays === 0) {
                updated.slAbsUndWp = '';
            }

            if (slWopDays > 0) {
                updated.slAbsUndWop = slWopDays.toString();
            } else if (slWopDays === 0) {
                updated.slAbsUndWop = '';
            }

            if (vlDays > 0) {
                updated.vlAbsUndWp = vlDays.toString();
            } else if (vlDays === 0) {
                updated.vlAbsUndWp = '';
            }

            if (vlWopDays > 0) {
                updated.vlAbsUndWop = vlWopDays.toString();
            } else if (vlWopDays === 0) {
                updated.vlAbsUndWop = '';
            }`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/components/LeaveCardViewer.tsx', code);
