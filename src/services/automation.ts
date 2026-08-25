import { db } from '../db';
import { employees } from '../db/schema';
import { Employee, ServiceRecord } from '../types/employee';
import { eq } from 'drizzle-orm';

export async function runAnnualCarryOver() {
  const currentYear = new Date().getFullYear();
  const allEmployees = await db.select().from(employees);
  
  let updatedCount = 0;

  for (const emp of allEmployees) {
    const serviceRecords = (emp.serviceRecords || []) as ServiceRecord[];
    if (serviceRecords.length === 0) continue;

    // Sort by 'from' date to find latest (simple sort, assumes format MM/DD/YY)
    const sortedRecords = [...serviceRecords].sort((a, b) => {
        const dateA = new Date(a.from);
        const dateB = new Date(b.from);
        return dateB.getTime() - dateA.getTime();
    });
    
    const latestRecord = sortedRecords[0];
    const latestYear = new Date(latestRecord.from).getFullYear();

    if (latestYear < currentYear) {
      // Logic: mirror entry for current year
      const newRecord: ServiceRecord = {
        id: crypto.randomUUID(),
        from: `01/01/${currentYear.toString().slice(-2)}`,
        to: 'PRESENT',
        designation: latestRecord.designation,
        status: latestRecord.status,
        salary: latestRecord.salary,
        station: latestRecord.station,
        branch: latestRecord.branch,
        lwop: latestRecord.lwop,
        sepDate: '',
        sepCause: ''
      };

      await db.update(employees)
        .set({
          serviceRecords: [...serviceRecords, newRecord]
        })
        .where(eq(employees.originalId, emp.originalId));
        
      updatedCount++;
    }
  }
  return updatedCount;
}
