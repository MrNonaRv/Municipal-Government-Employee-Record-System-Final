import { db } from './src/db/index';
import { employees } from './src/db/schema';
async function query() {
  const all = await db.select().from(employees);
  const m = new Map();
  for (const e of all) {
      if (e.middleName && e.middleName.length > 0) {
          m.set(e.id, (m.get(e.id) || 0) + 1);
      }
  }
}
query().catch(console.error).then(() => process.exit(0));
