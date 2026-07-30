const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

if (!code.includes("lazy(() => import('./NOSAModal')")) {
    code = code.replace("import NOSAModal from './NOSAModal';", "import { lazy, Suspense } from 'react';\nconst NOSAModal = lazy(() => import('./NOSAModal'));");
    code = code.replace("import LeaveCardViewer from './LeaveCardViewer';", "const LeaveCardViewer = lazy(() => import('./LeaveCardViewer'));");
    code = code.replace("import { PreviewModal } from './PreviewModal';", "const PreviewModal = lazy(() => import('./PreviewModal').then(module => ({ default: module.PreviewModal })));");
    
    code = code.replace("<NOSAModal employee={employee} onSave={onSave} />", "<Suspense fallback={<div className='p-4 text-center'><Loader2 className='animate-spin inline-block mr-2' />Loading...</div>}><NOSAModal employee={employee} onSave={onSave} /></Suspense>");
    code = code.replace("<LeaveCardViewer employee={employee} onSave={onSave} />", "<Suspense fallback={<div className='p-4 text-center'><Loader2 className='animate-spin inline-block mr-2' />Loading...</div>}><LeaveCardViewer employee={employee} onSave={onSave} /></Suspense>");
    
    code = code.replace("<PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />", "<Suspense fallback={null}><PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} /></Suspense>");
    
    code = code.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect, Suspense, lazy } from 'react';");
    code = code.replace("import { lazy, Suspense } from 'react';\\n", "");

    fs.writeFileSync('src/components/ProfileModal.tsx', code);
}
