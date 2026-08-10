import { db } from './src/db/index';
import { employees } from './src/db/schema';
import { eq, like, or } from 'drizzle-orm';
async function query() {
  const records = await db.select().from(employees);
  for (const r of records) {
    if (r.surname.includes('PATRIARCA') || r.surname.includes('JARANA') || r.surname.includes('SELORIO')) {
      console.log(r.id, r.surname, r.firstName, r.middleName);
    }
  }
}
query().catch(console.error).then(() => process.exit(0));
