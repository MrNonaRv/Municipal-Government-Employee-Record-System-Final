const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardViewer.tsx', 'utf8');

code = code.replace(
  "import { Printer } from 'lucide-react';",
  "import { Printer, Plus } from 'lucide-react';"
);

code = code.replace(
  "const [editingCell, setEditingCell] = useState<EditingCell | null>(null);",
  "const [editingCell, setEditingCell] = useState<EditingCell | null>(null);\n  const [extraYears, setExtraYears] = useState<number[]>([]);\n  const [addYearInput, setAddYearInput] = useState('');"
);

code = code.replace(
  "  const targetYears = [];\n  for (let y = startYear; y <= Math.max(startYear, currentYear); y++) {\n    targetYears.push(y);\n  }",
  "  const targetYears = [];\n  for (let y = startYear; y <= Math.max(startYear, currentYear); y++) {\n    targetYears.push(y);\n  }\n  extraYears.forEach(y => {\n    if (!targetYears.includes(y)) targetYears.push(y);\n  });\n  targetYears.sort((a, b) => a - b);"
);

const buttonHtml = `        <div className="flex gap-4 items-end">
          {onSave && (
            <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden h-[52px]">
              <input
                type="number"
                value={addYearInput}
                onChange={(e) => setAddYearInput(e.target.value)}
                className="w-16 px-2 py-2 text-sm text-center focus:outline-none h-full"
                placeholder="YYYY"
              />
              <button
                onClick={() => {
                  const y = parseInt(addYearInput);
                  if (y && !targetYears.includes(y)) {
                     setExtraYears([...extraYears, y]);
                     setAddYearInput('');
                  }
                }}
                className="flex items-center gap-1 px-3 py-2 bg-slate-100 text-slate-700 text-[10px] uppercase font-bold tracking-widest hover:bg-slate-200 transition-colors h-full border-l border-slate-300"
              >
                <Plus size={14} /> Add Year
              </button>
            </div>
          )}
          <button
            onClick={() => setIsPrintOpen(true)}`;

code = code.replace(
  `        <div className="flex gap-4 items-end">
          <button
            onClick={() => setIsPrintOpen(true)}`,
  buttonHtml
);

fs.writeFileSync('src/components/LeaveCardViewer.tsx', code);
console.log('patched');
