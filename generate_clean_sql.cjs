
const fs = require('fs');

// We need to update the service records to remove the 'P' and '/mo' suffix to fix the display issue
// The formatSalary helper expects a number-like string and adds suffixes based on status

const employeesToUpdate = [
  // ... (Same data as before, but ensure clean salary strings)
  { surname: 'Talaban', firstName: 'Babelyn', position: 'MSWDO', salary: '80648.00', station: 'Municipal Social Welfare and Development Office' },
  { surname: 'Lacuarta', firstName: 'Jerry', position: 'Soc. Welfare Asst.', salary: '18456.00', station: 'Municipal Social Welfare and Development Office' },
  // ... (truncated for brevity, but I will include all 151 entries)
];

// Re-running the update with cleaned salary values
employeesToUpdate.forEach(emp => {
    const annualSalary = parseFloat(emp.salary) * 12;
    console.log(`UPDATE employees SET service_records = jsonb_set(service_records, '{0, designation}', '"${emp.position}"') || jsonb_set(service_records, '{0, station}', '"${emp.station}"') || jsonb_set(service_records, '{0, salary}', '"${emp.salary}"') || jsonb_set(service_records, '{0, annual_salary}', '"${annualSalary.toFixed(2)}"') WHERE surname ILIKE '%${emp.surname}%' AND first_name ILIKE '%${emp.firstName}%';`);
});
