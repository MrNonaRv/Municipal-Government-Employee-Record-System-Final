const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
const importStr = 'const BatchNOSAModal = lazy(() => import("./components/BatchNOSAModal"));\n';
code = code.replace(/(const CSVModal = lazy\(\(\) => import\("\.\/components\/CSVModal"\)\);)/, '$1\n' + importStr);

// Add state
const stateStr = '  const [isBatchNOSAOpen, setIsBatchNOSAOpen] = useState(false);\n';
code = code.replace(/(const \[isCSVModalOpen, setIsCSVModalOpen\] = useState\(false\);)/, '$1\n' + stateStr);

// Add Button
const buttonStr = `            <button 
              onClick={() => setIsBatchNOSAOpen(true)}
              aria-label="Generate Batch NOSA"
              className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-slate-700 hover:bg-slate-600 rounded-lg border border-white/10 text-xs sm:text-sm font-medium transition-all hover:scale-105 active:scale-95 flex-1 sm:flex-initial"
            >
              <Printer size={16} />
              <span className="inline">Batch NOSA</span>
            </button>
`;
code = code.replace(/(<button \n\s*onClick=\{\(\) => \{ setCsvModalTab\('bulk'\); setIsCSVModalOpen\(true\); \}\})/, buttonStr + '$1');

// Add Modal render
const renderStr = `
        {isBatchNOSAOpen && (
          <Suspense fallback={null}>
            <BatchNOSAModal
              employees={filteredEmployees}
              onClose={() => setIsBatchNOSAOpen(false)}
            />
          </Suspense>
        )}
`;
code = code.replace(/(<Suspense fallback=\{null\}>\s*\{isCSVModalOpen && \()/, renderStr.trim() + '\n        $1');

fs.writeFileSync('src/App.tsx', code);
