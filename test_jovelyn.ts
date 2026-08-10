import { db } from './src/db/index';
import { employees } from './src/db/schema';
async function main() {
  const allEmployees = await db.select().from(employees);
  for (const e of allEmployees) {
    if (e.firstName.toLowerCase().includes('jovelyn') || e.surname.toLowerCase().includes('jovelyn') || e.surname.toLowerCase().includes('andaya')) {
      console.log(e.id, e.surname, e.firstName, e.middleName);
    }
  }
}
main().catch(console.error).then(() => process.exit(0));
