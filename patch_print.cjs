const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardPrintModal.tsx', 'utf8');

const targetTbody = `            <tbody>
              {records.length > 0 ? records.map((record) => {`;
              
const endTbody = `              )}
            </tbody>`;

// We'll replace the entire tbody logic.
