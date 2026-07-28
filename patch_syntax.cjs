const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const target = `                  </tr>
                  )
                ) : rec.isSeparator ? (`;

const replace = `                  </tr>
                ) : rec.isSeparator ? (`;

code = code.replace(target, replace);
fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
