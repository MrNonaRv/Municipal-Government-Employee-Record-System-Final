const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardViewer.tsx', 'utf8');

// 1. Add import
if (!code.includes("import AddAbsenceModal")) {
    code = code.replace("import LeaveCardPrintModal from './LeaveCardPrintModal';", "import LeaveCardPrintModal from './LeaveCardPrintModal';\nimport AddAbsenceModal from './AddAbsenceModal';");
}

// 2. Add state inside the component
if (!code.includes("isAddAbsenceOpen")) {
    code = code.replace("const [isPrintOpen, setIsPrintOpen] = useState(false);", "const [isPrintOpen, setIsPrintOpen] = useState(false);\n  const [isAddAbsenceOpen, setIsAddAbsenceOpen] = useState(false);");
}

// 3. Add handleAddAbsence logic
const addAbsenceLogic = `
  const handleAddAbsence = (year: number, month: string, leaveType: string, dates: string) => {
    if (!onSave) return;
    let newRecords = [...records];
    const periodMatch = \`\${year} \${month}\`.toLowerCase();
    
    // Find or create record for this year and month
    let existingIdx = newRecords.findIndex(r => 
        r.period?.toLowerCase() === periodMatch || 
        (r.period?.toLowerCase().includes(year.toString()) && r.period?.toLowerCase().includes(month.toLowerCase()))
    );

    let rec: LeaveRecord;
    if (existingIdx !== -1) {
        rec = { ...newRecords[existingIdx] };
    } else {
        rec = {
          id: 'lc-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
          period: \`\${year} \${month}\`,
          vlEarned: '1.25',
          slEarned: '1.25',
          vlAbsUndWp: '',
          vlBalance: '',
          vlAbsUndWop: '',
          slAbsUndWp: '',
          slBalance: '',
          slAbsUndWop: '',
          dateAndAction: '',
          particulars: ''
        };
    }

    // Append to existing particulars
    const newEntry = \`\${leaveType}: \${dates}\`;
    if (rec.particulars && rec.particulars.trim().length > 0) {
        // If it already has particulars, check if this leaveType exists
        const regex = new RegExp(\`\\\\b\${leaveType}\\\\s*:\\\\s*([^VLSAWOPFL]+\\\\b)\`, 'i');
        const match = rec.particulars.match(regex);
        if (match) {
           rec.particulars = rec.particulars.replace(regex, \`\${leaveType}: \${match[1].trim()}, \${dates}\`);
        } else {
           rec.particulars = \`\${rec.particulars} \${newEntry}\`.trim();
        }
    } else {
        rec.particulars = newEntry;
    }

    // Now recalculate WOP/WP based on new particulars
    const parsed = parseDetailedAbsences(rec.particulars);
    const slDays = parsed.sl;
    const vlDays = parsed.vl + parsed.unknown + parsed.spl + parsed.pl + parsed.fl;
    const vlWopDays = parsed.vl_wop;
    const slWopDays = parsed.sl_wop;

    if (slDays > 0) {
        rec.slAbsUndWp = slDays.toString();
    } else if (slDays === 0) {
        rec.slAbsUndWp = '';
    }

    if (slWopDays > 0) {
        rec.slAbsUndWop = slWopDays.toString();
    } else if (slWopDays === 0) {
        rec.slAbsUndWop = '';
    }

    if (vlDays > 0) {
        rec.vlAbsUndWp = vlDays.toString();
    } else if (vlDays === 0) {
        rec.vlAbsUndWp = '';
    }

    if (vlWopDays > 0) {
        rec.vlAbsUndWop = vlWopDays.toString();
    } else if (vlWopDays === 0) {
        rec.vlAbsUndWop = '';
    }
    
    // Sort logic (can just append and sort or replace)
    if (existingIdx !== -1) {
        newRecords[existingIdx] = rec;
    } else {
        newRecords.push(rec);
        newRecords.sort((a, b) => {
          if (a.isSeparator) return -1;
          if (b.isSeparator) return 1;
          const aYear = parseInt(a.period?.match(/\\b(20\\d{2})\\b/)?.[1] || '0');
          const bYear = parseInt(b.period?.match(/\\b(20\\d{2})\\b/)?.[1] || '0');
          if (aYear !== bYear) return aYear - bYear;
          const getMonthIndex = (period: string) => {
            const p = (period || '').toLowerCase();
            const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            const idx = months.findIndex(m => p.includes(m));
            return idx === -1 ? 99 : idx;
          };
          return getMonthIndex(a.period || '') - getMonthIndex(b.period || '');
        });
    }

    newRecords = recalculateBalances(newRecords);
    onSave({ ...employee, leaveRecords: newRecords });
    setIsAddAbsenceOpen(false);
  };
`;

if (!code.includes("handleAddAbsence")) {
    code = code.replace("const handleFillStandardYear = (yearToFill: number) => {", addAbsenceLogic + "\n  const handleFillStandardYear = (yearToFill: number) => {");
}

// 4. Add the button in the UI
const buttonCode = `          {onSave && (
            <button
              onClick={() => setIsAddAbsenceOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-blue-700 transition-colors h-[52px]"
            >
              <Calendar size={16} /> Add Leave Entry
            </button>
          )}
          {onSave && (
            <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden h-[52px]">`;

if (!code.includes("Add Leave Entry")) {
    code = code.replace(`          {onSave && (
            <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden h-[52px]">`, buttonCode);
}

// 5. Add the modal rendering
const modalCode = `      {isAddAbsenceOpen && (
        <AddAbsenceModal 
          onClose={() => setIsAddAbsenceOpen(false)} 
          onSave={handleAddAbsence} 
        />
      )}
      {isPrintOpen && (`;

if (!code.includes("<AddAbsenceModal")) {
    code = code.replace("{isPrintOpen && (", modalCode);
}

// Add Calendar icon if missing
if (!code.includes("Calendar")) {
    code = code.replace(/import \{ ([^}]+) \} from 'lucide-react';/, "import { $1, Calendar } from 'lucide-react';");
}


fs.writeFileSync('src/components/LeaveCardViewer.tsx', code);
