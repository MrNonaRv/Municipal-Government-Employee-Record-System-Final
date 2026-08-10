import { db } from './src/db/index';
import { employees } from './src/db/schema';
import { eq } from 'drizzle-orm';
async function query() {
  await db.update(employees).set({ middleName: 'A' }).where(eq(employees.id, 94));
  // Wait, I shouldn't blindly update without knowing ID.
}
