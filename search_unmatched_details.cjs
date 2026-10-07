const { Pool } = require('pg');
const SUPABASE_URL = "postgresql://postgres.oxtjlhcwibieeuwbhnyj:Olanoko_1529@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres";

async function main() {
  const pool = new Pool({
    connectionString: SUPABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log("Connected to Supabase!");

    const searchTerms = ['Teresa', 'Neisa', 'Lago', 'Jerce', 'Rechris', 'Rachris', 'Mona', 'Moana'];

    for (const term of searchTerms) {
      console.log(`\n--- Searching for "${term}" ---`);
      const q = `
        SELECT id, surname, first_name, middle_name, agency_employee_no
        FROM employees
        WHERE surname ILIKE $1 
           OR first_name ILIKE $1 
           OR middle_name ILIKE $1;
      `;
      const res = await client.query(q, [`%${term}%`]);
      if (res.rows.length > 0) {
        res.rows.forEach(r => {
          console.log(`  ID: ${r.id} | Surname: "${r.surname}" | FirstName: "${r.first_name}" | MiddleName: "${r.middle_name}"`);
        });
      } else {
        console.log("  No matches.");
      }
    }

    client.release();
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

main();
