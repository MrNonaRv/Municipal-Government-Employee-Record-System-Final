const fs = require('fs');

let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

// Add import
if (!code.includes('PDSPrintModal')) {
  code = code.replace(
    'const NOSAModal = lazy(() => import("./NOSAModal"));',
    'const NOSAModal = lazy(() => import("./NOSAModal"));\nconst PDSPrintModal = lazy(() => import("./PDSPrintModal"));'
  );
}

// Add state
if (!code.includes('showPdsPrint')) {
  code = code.replace(
    'const [showNosa, setShowNosa] = useState(false);',
    'const [showNosa, setShowNosa] = useState(false);\n  const [showPdsPrint, setShowPdsPrint] = useState(false);'
  );
}

// Add button
if (!code.includes('Print PDS')) {
  const pdsButton = `
            <button
              onClick={() => setShowPdsPrint(true)}
              aria-label="Generate PDS"
              className="flex items-center gap-2 p-2.5 md:px-5 md:py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-purple-500/20 group"
            >
              <FileText
                size={14}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="hidden sm:inline">PDS (CS Form 212)</span>
            </button>`;
  
  code = code.replace(
    'aria-label="Generate NOSA"',
    pdsButton + '\n            <button\n              aria-label="Generate NOSA"' // wait, let's target NOSA button
  );
}

fs.writeFileSync('src/components/ProfileModal.tsx', code);
