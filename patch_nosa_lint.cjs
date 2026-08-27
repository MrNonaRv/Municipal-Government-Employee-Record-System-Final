const fs = require('fs');

function fixSingleNOSA() {
  let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

  // Fix the missing handleSave
  if (!code.includes('const handleSave = () => {')) {
    const handlePrintMatch = code.indexOf('const handlePrint = () => {');
    if (handlePrintMatch !== -1) {
       const replacement = `  const handleSave = () => {
    // Generate new record object
    const newRecord = {
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      newSg,
      newStep,
      newSalary,
      newDate,
      oldSg,
      oldStep,
      oldSalary,
      oldDate,
      lbcNo,
      lbcDate,
      eoNo,
      eoDate,
      fy,
      itemNo,
      designation,
      mayorName
    };
    
    const existingRecords = employee.nosaRecords || [];
    const updatedRecords = selectedHistoryId 
      ? existingRecords.map(r => r.id === selectedHistoryId ? { ...r, ...newRecord, id: r.id } : r)
      : [...existingRecords, newRecord];
      
    onSave({
      ...employee,
      nosaRecords: updatedRecords
    });
    setSelectedHistoryId(newRecord.id);
  };

  const handlePrint = () => {`;
       code = code.replace('const handlePrint = () => {', replacement);
    }
  }

  // Ensure imports are perfectly solid
  // Replace all lucide imports with the full correct set
  code = code.replace(/import \{.*?\} from 'lucide-react';/g, "import { X, Printer, Calendar, FileText, User, History, Save, DollarSign } from 'lucide-react';");

  fs.writeFileSync('src/components/NOSAModal.tsx', code);
}

function fixBatchNOSA() {
  let code = fs.readFileSync('src/components/BatchNOSAModal.tsx', 'utf8');
  code = code.replace(/import \{.*?\} from 'lucide-react';/g, "import { X, Printer, Calendar, FileText, User } from 'lucide-react';");
  fs.writeFileSync('src/components/BatchNOSAModal.tsx', code);
}

fixSingleNOSA();
fixBatchNOSA();
