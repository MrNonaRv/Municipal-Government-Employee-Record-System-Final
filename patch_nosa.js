const fs = require('fs');
let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

const replacement = `
  const sortedRecords = [...(employee.serviceRecords || [])];
  
  const defaults = React.useMemo(() => {
     let nSal = '';
     let oSal = '';
     let nDate = 'January 1, 2026';
     let oDate = 'December 31, 2025';
     let des = '';
     
     const resolvedLatest = sortedRecords.length > 0 ? getResolvedLatestRecord(sortedRecords) : null;
     des = resolvedLatest?.designation || 'Municipal Civil Registrar';

     if (sortedRecords.length >= 2) {
       nSal = sortedRecords[sortedRecords.length - 1].salary || '';
       oSal = sortedRecords[sortedRecords.length - 2].salary || '';
     } else if (sortedRecords.length === 1) {
       nSal = sortedRecords[0].salary || '';
     }
     
     return {
       nSal: nSal.replace(/[^0-9.]/g, ''),
       oSal: oSal.replace(/[^0-9.]/g, ''),
       nDate,
       oDate,
       des
     };
  }, [employee]);

  const [selectedHistoryId, setSelectedHistoryId] = useState<string>('');
  
  const [dateOfNotice, setDateOfNotice] = useState(new Date().toISOString().split('T')[0]);
  const [mayorName, setMayorName] = useState('LEODEGARIO A. LABAO JR.');
  
  const [oldSg, setOldSg] = useState('');
  const [oldStep, setOldStep] = useState('');
  const [oldSalary, setOldSalary] = useState(defaults.oSal);
  const [oldDate, setOldDate] = useState(defaults.oDate);

  const [newSg, setNewSg] = useState('');
  const [newStep, setNewStep] = useState('');
  const [newSalary, setNewSalary] = useState(defaults.nSal);
  const [newDate, setNewDate] = useState(defaults.nDate);

  const [lbcNo, setLbcNo] = useState('');
  const [lbcDate, setLbcDate] = useState('');
  const [eoNo, setEoNo] = useState('');
  const [eoDate, setEoDate] = useState('');

  const [designation, setDesignation] = useState(defaults.des);
  const [itemNo, setItemNo] = useState('');
  const [fy, setFy] = useState(new Date().getFullYear().toString());
`;

code = code.replace(/const \[selectedHistoryId(.*?)const \[fy, setFy\] = useState\('2019'\);/s, replacement.trim());

fs.writeFileSync('src/components/NOSAModal.tsx', code);
