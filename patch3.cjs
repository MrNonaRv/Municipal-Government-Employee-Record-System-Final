const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

let target1 = `  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);`;

let replacement1 = `  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);`;

code = code.replace(target1, replacement1);

let target2 = `  const filteredEmployees = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return employees.filter(emp => {
      const fullName = \`\${emp.firstName} \${emp.surname} \${emp.nameExtension || ""}\`.toLowerCase();
      const latestDesignation = emp.serviceRecords.length > 0 
        ? emp.serviceRecords[emp.serviceRecords.length - 1].designation.toLowerCase()
        : '';
      return fullName.includes(q) || emp.id.toLowerCase().includes(q) || latestDesignation.includes(q);
    });
  }, [employees, searchQuery]);`;

let replacement2 = `  const uniqueStatuses = useMemo(() => {
    const statuses = new Set<string>();
    employees.forEach(emp => {
      const latestSR = emp.serviceRecords[emp.serviceRecords.length - 1];
      if (latestSR && latestSR.status) statuses.add(latestSR.status);
    });
    return Array.from(statuses).sort();
  }, [employees]);

  const uniqueDepartments = useMemo(() => {
    const depts = new Set<string>();
    employees.forEach(emp => {
      const latestSR = emp.serviceRecords[emp.serviceRecords.length - 1];
      if (latestSR && latestSR.station) depts.add(latestSR.station);
    });
    return Array.from(depts).sort();
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return employees.filter(emp => {
      const fullName = \`\${emp.firstName} \${emp.surname} \${emp.nameExtension || ""}\`.toLowerCase();
      const latestSR = emp.serviceRecords.length > 0 ? emp.serviceRecords[emp.serviceRecords.length - 1] : null;
      const latestDesignation = latestSR ? latestSR.designation.toLowerCase() : '';
      
      const matchesSearch = fullName.includes(q) || emp.id.toLowerCase().includes(q) || latestDesignation.includes(q);
      const matchesStatus = statusFilter ? (latestSR?.status === statusFilter) : true;
      const matchesDept = departmentFilter ? (latestSR?.station === departmentFilter) : true;
      
      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [employees, searchQuery, statusFilter, departmentFilter]);`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', code);
