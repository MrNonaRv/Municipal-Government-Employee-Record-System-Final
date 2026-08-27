const fs = require('fs');

function fixSingleNOSA() {
  let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

  // Fix the missing handleSave AGAIN
  const handlePrintMatch = code.indexOf('const handlePrint = () => {');
  if (handlePrintMatch !== -1) {
       const replacement = `  const handleSave = () => {
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
  } else if (!code.includes('const handleSave = () => {')) {
      // If there is no handlePrint either, find where diff is calculated
      const diffMatch = code.indexOf('const diff = parseFloat(newSalary');
      if (diffMatch !== -1) {
          const replacement = `  const handleSave = () => {
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
  
  const diff = parseFloat(newSalary`;
          code = code.replace('const diff = parseFloat(newSalary', replacement);
      }
  }

  fs.writeFileSync('src/components/NOSAModal.tsx', code);
}

fixSingleNOSA();
