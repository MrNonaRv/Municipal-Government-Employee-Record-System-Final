import { db } from './src/db/index';
import { employees } from './src/db/schema';
async function query() {
  const all = await db.select().from(employees);
  for (const e of all) {
      if (e.surname.includes('LAGO')) console.log(e.id, e.surname, e.firstName, e.middleName);
  }
}
query().catch(console.error).then(() => process.exit(0));
