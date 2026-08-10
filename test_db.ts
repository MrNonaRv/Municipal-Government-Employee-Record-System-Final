import { db } from './src/db/index';
import { employees } from './src/db/schema';
async function main() {
  const records = await db.select().from(employees).limit(1);
  console.log(records[0].serviceRecords);
}
main().catch(console.error).then(() => process.exit(0));
