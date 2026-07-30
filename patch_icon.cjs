const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardViewer.tsx', 'utf8');

if (!code.includes('Calendar')) {
    code = code.replace("import { Printer, Plus, Download } from 'lucide-react';", "import { Printer, Plus, Download, Calendar } from 'lucide-react';");
    fs.writeFileSync('src/components/LeaveCardViewer.tsx', code);
}
