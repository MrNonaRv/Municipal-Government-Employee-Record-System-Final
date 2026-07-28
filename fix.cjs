const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const target = `                    </td>
                  </tr>
                ) : rec.isSeparator ? (
                  <tr className="border-b-4 border-gray-300 bg-gray-100">`;

const replace = `                    </td>
                  </tr>
                  )
                ) : rec.isSeparator ? (
                  <tr className="border-b-4 border-gray-300 bg-gray-100">`;

code = code.replace(target, replace);
fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
