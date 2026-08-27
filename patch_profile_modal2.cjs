const fs = require('fs');

let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

// Add PDSPrintModal to the render
if (!code.includes('<PDSPrintModal')) {
  code = code.replace(
    '{showNosa && (',
    `{showPdsPrint && (
          <Suspense fallback={<div>Loading PDS generator...</div>}>
            <PDSPrintModal
              employee={employee}
              onClose={() => setShowPdsPrint(false)}
            />
          </Suspense>
        )}
        {showNosa && (`
  );
}

fs.writeFileSync('src/components/ProfileModal.tsx', code);
