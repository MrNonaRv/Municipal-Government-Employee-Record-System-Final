
import { Employee } from '../types/employee';
import { dbPut } from '../services/db';

export const importEmployees = async () => {
  const data: { name: string, position: string, salary: string }[] = [
    { name: "Talaban, Babelyn L.", position: "MSWDO", salary: "80,648.00" },
    { name: "Lacuarta, Jerry N.", position: "Soc. Welfare Asst.", salary: "18,456.00" },
    { name: "Villoza, Pamela B.", position: "Soc. Welfare Asst. II", salary: "17,645.00" },
    // ... add more ...
  ];

  for (const item of data) {
    const nameParts = item.name.split(', ');
    const surname = nameParts[0] || '';
    const firstParts = nameParts[1]?.split(' ') || [];
    const firstName = firstParts[0] || '';
    const middleName = firstParts.slice(1).join(' ') || '';

    const newEmployee: Employee = {
      id: crypto.randomUUID(),
      photo: null,
      surname,
      firstName,
      middleName,
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
      serviceRecords: [{
        id: crypto.randomUUID(),
        from: '',
        to: '',
        designation: item.position,
        status: '',
        salary: item.salary,
        station: '',
        branch: '',
        lwop: '',
        sepDate: '',
        sepCause: ''
      }],
      attachments: [],
      nosaRecords: [],
      leaveRecords: []
    };

    await dbPut(newEmployee);
  }
};
