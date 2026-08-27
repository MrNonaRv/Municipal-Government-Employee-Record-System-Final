const fs = require('fs');
let code = fs.readFileSync('src/components/CSVModal.tsx', 'utf8');

// Insert State
code = code.replace(
  "const [isLoggingInDrive, setIsLoggingInDrive] = useState(false);",
  `const [isLoggingInDrive, setIsLoggingInDrive] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccessMsg, setBackupSuccessMsg] = useState<string | null>(null);`
);

// Insert handleDriveBackup function
const handleDriveLogoutRegex = /const handleDriveLogout = async \(\) => \{[\s\S]*?\};\n/;
code = code.replace(handleDriveLogoutRegex, match => match + `
  const handleDriveBackup = async () => {
    setIsBackingUp(true);
    setBackupSuccessMsg(null);
    setError(null);
    try {
      const dataToExport = {
        timestamp: new Date().toISOString(),
        version: "1.0",
        employees: employees
      };
      
      const jsonStr = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      
      const fileName = \`GovRecords_Backup_\${new Date().toISOString().split('T')[0]}.json\`;
      
      // Upload to Google Drive using the service
      await uploadFileToDrive(blob, fileName, 'application/json', 'GovRecords_Backups');
      setBackupSuccessMsg(\`Successfully backed up to Google Drive as \${fileName}\`);
    } catch (err: any) {
      setError(err.message || 'Failed to backup database to Google Drive');
    } finally {
      setIsBackingUp(false);
    }
  };
`);

// Insert the UI block inside the isDriveConnected branch
const uiInsertionPoint = /<button\s+onClick=\{handleDriveLogout\}\s+className="w-full py-2\.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold rounded-lg transition-colors text-sm flex items-center justify-center gap-2"/;

const backupUI = `
                  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
                    <div>
                      <h4 className="font-bold text-[var(--navy)] flex items-center gap-2 text-sm mb-1">
                        <Database size={16} className="text-[var(--gold)]" />
                        Automated Database Backup
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Securely backup all your employee records directly to a dedicated folder in your Google Drive. This ensures you never lose your data.
                      </p>
                    </div>

                    {backupSuccessMsg && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md text-xs flex items-start gap-2">
                        <Check size={14} className="shrink-0 mt-0.5" />
                        <span>{backupSuccessMsg}</span>
                      </div>
                    )}

                    <button
                      onClick={handleDriveBackup}
                      disabled={isBackingUp}
                      className="w-full py-2.5 bg-[var(--navy)] hover:bg-[var(--navy-light)] text-white font-bold rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isBackingUp ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Backing up to Drive...
                        </>
                      ) : (
                        <>
                          <Cloud size={16} />
                          Backup Now (1-Click)
                        </>
                      )}
                    </button>
                  </div>
`;

code = code.replace(uiInsertionPoint, match => backupUI + "\n                  " + match);

fs.writeFileSync('src/components/CSVModal.tsx', code);
