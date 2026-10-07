
import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Employee } from '../types/employee';
import { dbPut } from '../services/db';
import { Upload, X, Loader2, AlertTriangle, Check } from 'lucide-react';

interface Props {
  onClose: () => void;
  employees: Employee[];
}

export default function ExcelUploadModal({ onClose, employees }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      try {
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // Use header: 1 to get raw rows
        const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Skip header row
        const dataRows = rows.slice(1);
        
        let updatedCount = 0;
        for (const row of dataRows) {
          // Structure: Name, Position, Department, Annual Salary
          const [fullName, position, department, annualSalary] = row;
          
          if (!fullName) continue;

          // Split name to find match
          const parts = String(fullName).split(', ');
          const surname = parts[0].trim();
          const firstName = parts.length > 1 ? parts[1].trim() : '';

          const emp = employees.find(e => 
            e.surname.toLowerCase() === surname.toLowerCase() && 
            e.firstName.toLowerCase() === firstName.toLowerCase()
          );

          if (emp) {
            // Update service record
            const monthlySalary = (parseFloat(String(annualSalary).replace(/[^0-9.]/g, '')) / 12).toFixed(2);
            
            const updatedEmp = { ...emp };
            updatedEmp.serviceRecords = [{
                id: `sr-fixed-${emp.surname}-${emp.firstName}`,
                to: 'Present',
                from: '2016-07-01',
                salary: monthlySalary,
                annual_salary: String(annualSalary).replace(/[^0-9.]/g, ''),
                station: department || '',
                designation: position || '',
                status: 'Permanent'
            }];

            await dbPut(updatedEmp);
            updatedCount++;
          }
        }
        
        setSuccess(`Successfully updated ${updatedCount} employees.`);
      } catch (err) {
        console.error(err);
        setError("Failed to parse the file. Please ensure it is the LGU personnel format.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-[var(--navy)]">Upload Personnel Data</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-sm">{success}</div>}

        <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500 hover:bg-gray-50 flex flex-col items-center gap-2"
        >
          {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
          {isUploading ? 'Processing...' : 'Click to upload Excel file'}
        </button>
      </div>
    </div>
  );
}
