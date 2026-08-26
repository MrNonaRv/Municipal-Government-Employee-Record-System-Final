import { dbGetAll, dbPut } from '../services/db';
import { Employee } from '../types/employee';

const generateEmptyEmployee = (id: string): Employee => ({
  id,
  photo: null,
  surname: '',
  firstName: '',
  middleName: '',
  nameExtension: '',
  dateOfBirth: '',
  sex: '',
  civilStatus: '',
  citizenship: '',
  height: '',
  weight: '',
  bloodType: '',
  residentialAddress: '',
  permanentAddress: '',
  zipCode: '',
  telephone: '',
  cellphone: '',
  email: '',
  gsisNo: '',
  pagibigNo: '',
  philhealthNo: '',
  sssNo: '',
  tin: '',
  agencyEmployeeNo: '',
  spouseSurname: '',
  spouseFirstName: '',
  spouseMiddleName: '',
  spouseOccupation: '',
  spouseEmployer: '',
  spouseTelephone: '',
  children: [],
  fatherSurname: '',
  fatherFirstName: '',
  fatherMiddleName: '',
  motherSurname: '',
  motherFirstName: '',
  motherMiddleName: '',
  education: [],
  serviceRecords: [],
  attachments: [],
  nosaRecords: [],
  leaveRecords: [],
  pdsScan: null
});

const defaultEmployees = [
  { surname: 'Launio', firstName: 'Ma. Angel Adora C.', designation: 'Mun. Accountant', salary: '81937.00' },
  { surname: 'Lapidez', firstName: 'Honey D.', designation: 'Adm. Aide I', salary: '11567.00' },
  { surname: 'Lunas', firstName: 'Rechris L.', designation: 'Adm. Aide I', salary: '11473.00' },
  { surname: 'Salomeo', firstName: 'Nilo V.', designation: 'Mun. Treas.', salary: '79382.00' },
  { surname: 'Navarra', firstName: 'Danny L.', designation: 'Loc. Treas. Opr.', salary: '24638.00' },
  { surname: 'Laurio', firstName: 'Cynthia L.', designation: 'Rev. Coll. Clerk I', salary: '14916.00' },
  { surname: 'Andaya', firstName: 'Jovelyn L.', designation: 'Rev. Coll. Clerk I', salary: '14805.00' },
  { surname: 'Ledesma', firstName: 'Catalino', designation: 'Adm. Aide I', salary: '11473.00' }
];

export const seedDatabase = async () => {
  if (localStorage.getItem('gers_payroll_seeded_v1')) {
    return;
  }
  
  try {
    const existing = await dbGetAll();
    
    for (const empData of defaultEmployees) {
      // Check if employee already exists by name
      const exists = existing.some(e => 
        e.surname.toLowerCase().trim() === empData.surname.toLowerCase().trim() && 
        e.firstName.toLowerCase().trim() === empData.firstName.toLowerCase().trim()
      );
      
      if (!exists) {
        const newEmp = generateEmptyEmployee(crypto.randomUUID());
        newEmp.surname = empData.surname;
        newEmp.firstName = empData.firstName;
        
        // Add current service record
        newEmp.serviceRecords = [{
          id: crypto.randomUUID(),
          from: '01/01/26',
          to: 'PRESENT',
          designation: empData.designation,
          status: 'PERM.',
          salary: empData.salary,
          station: 'LGU Mambusao',
          branch: '',
          lwop: '',
          sepDate: '',
          sepCause: ''
        }];
        
        await dbPut(newEmp);
      }
    }
    
    localStorage.setItem('gers_payroll_seeded_v1', 'true');
    console.log('Successfully seeded general payroll data.');
  } catch (err) {
    console.error('Error seeding payroll data:', err);
  }
};
