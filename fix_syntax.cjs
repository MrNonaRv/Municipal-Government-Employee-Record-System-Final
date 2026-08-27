const fs = require('fs');

let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

// The broken code looks like:
// <button
//   onClick={() => setShowNosa(true)}
//   
//             <button
//               onClick={() => setShowPdsPrint(true)}

const regex = /<button\s+onClick=\{\(\) => setShowNosa\(true\)\}\s+<button[\s\S]*?aria-label="Generate NOSA"/g;

// Instead of regex, I'll just restore the original and do it right. Let me check the output of sed.
