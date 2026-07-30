const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

if (!code.includes("import LeaveTrendsChart")) {
    // Add import
    code = code.replace("import React, { useState, useEffect, Suspense, lazy } from 'react';", "import React, { useState, useEffect, Suspense, lazy } from 'react';\nconst LeaveTrendsChart = lazy(() => import('./LeaveTrendsChart'));");
    
    // Add inside the leaves tab
    // We have:
    // <Suspense fallback={<div className='p-4 text-center'><Loader2 className='animate-spin inline-block mr-2' />Loading...</div>}><LeaveCardViewer employee={employee} onSave={onSave} /></Suspense>
    
    code = code.replace("<Suspense fallback={<div className='p-4 text-center'><Loader2 className='animate-spin inline-block mr-2' />Loading...</div>}><LeaveCardViewer employee={employee} onSave={onSave} /></Suspense>", 
    "<Suspense fallback={<div className='p-4 text-center'><Loader2 className='animate-spin inline-block mr-2' />Loading...</div>}><LeaveCardViewer employee={employee} onSave={onSave} /></Suspense>\n                  <Suspense fallback={null}><LeaveTrendsChart employee={employee} /></Suspense>");

    fs.writeFileSync('src/components/ProfileModal.tsx', code);
}
