const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

const startMarker = '{/* PRINT-ONLY DOSSIER VIEW */}';
const endMarker = '{/* Scanned PDS image if exists */}';

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const fileContent = fs.readFileSync('printView.txt', 'utf8');
  const newCode = code.substring(0, startIndex) + fileContent + code.substring(endIndex);
  fs.writeFileSync('src/components/ProfileModal.tsx', newCode);
  console.log("Replaced successfully");
} else {
  console.log("Markers not found", { startIndex, endIndex });
}
