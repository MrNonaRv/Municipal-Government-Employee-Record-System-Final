
const employeesToUpdate = [
  { surname: 'Talaban', firstName: 'Babelyn', position: 'MSWD Officer', annualSalary: '967776.00', station: 'MSWDO' },
  { surname: 'Lacuarta', firstName: 'Jerry', position: 'Soc. Welfare Asst.', annualSalary: '221472.00', station: 'MSWDO' },
  { surname: 'Villoza', firstName: 'Pamela', position: 'Soc. Welfare Asst. II', annualSalary: '211740.00', station: 'MSWDO' },
  { surname: 'Arteza', firstName: 'Jeanny', position: 'Soc. Welfare Aide', annualSalary: '166140.00', station: 'MSWDO' },
  { surname: 'Laz', firstName: 'Jose', position: 'Adm. Aide III', annualSalary: '155292.00', station: 'MSWDO' },
  { surname: 'Palomo', firstName: 'Frankie', position: 'Adm. Aide III', annualSalary: '154116.00', station: 'MSWDO' },
  { surname: 'Diaz', firstName: 'Frank', position: 'Adm. Aide I', annualSalary: '137676.00', station: 'MSWDO' },
  { surname: 'Moaña', firstName: 'Neisa', position: 'Adm. Aide I', annualSalary: '137676.00', station: 'MSWDO' },
  { surname: 'Mesias', firstName: 'Sallie', position: 'Adm. Aide I', annualSalary: '137676.00', station: 'MSWDO' },
  { surname: 'Dela Cruz', firstName: 'Joselito', position: 'Adm. Aide I', annualSalary: '137676.00', station: 'MSWDO' },
  { surname: 'Galapia', firstName: 'Jackelyn', position: 'Adm. Aide I', annualSalary: '136656.00', station: 'MSWDO' }
];

employeesToUpdate.forEach(emp => {
    const annualSalary = emp.annualSalary.replace(/[^0-9.]/g, '');
    const monthlySalary = (parseFloat(annualSalary) / 12).toFixed(2);
    
    console.log(`UPDATE employees SET service_records = '[{"id": "sr-fixed-${emp.surname.replace(/ /g,'')}-${emp.firstName.replace(/ /g,'')}", "to": "Present", "from": "2016-07-01", "salary": "${monthlySalary}", "annual_salary": "${annualSalary}", "station": "${emp.station}", "designation": "${emp.position}", "status": "Permanent"}]'::jsonb WHERE surname ILIKE '%${emp.surname}%' AND first_name ILIKE '%${emp.firstName}%';`);
});
