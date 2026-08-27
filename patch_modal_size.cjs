const fs = require('fs');

function fixModalSize(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Find the motion.div class name
  const match = code.match(/className="bg-white rounded-2xl shadow-2xl[^"]*"/);
  if (match) {
    const newClass = 'className="bg-white rounded-2xl shadow-2xl w-[98vw] max-w-[1800px] h-[95vh] flex flex-col md:flex-row overflow-hidden print:w-full print:max-w-none print:shadow-none print:block print:overflow-visible print:h-auto print:rounded-none"';
    code = code.replace(match[0], newClass);
    fs.writeFileSync(file, code);
  }
}

fixModalSize('src/components/NOSAModal.tsx');
fixModalSize('src/components/BatchNOSAModal.tsx');
