const fs = require('fs');
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

    // Fetch all employees from the database
    const res = await client.query("SELECT id, surname, first_name FROM employees;");
    const dbEmployees = res.rows;
    console.log(`Fetched ${dbEmployees.length} employees from database.`);

    // Read the final fix file
    const sqlContent = fs.readFileSync('final_fix_v2.sql', 'utf8');
    const lines = sqlContent.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith('--'));

    console.log(`Checking ${lines.length} updates against DB...`);

    const mismatches = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Extract surname and first_name from ILIKE clauses
      const surnameMatch = line.match(/surname ILIKE '%([^%]+)%'/i);
      const firstNameMatch = line.match(/first_name ILIKE '%([^%]+)%'/i);

      if (surnameMatch && firstNameMatch) {
        const surnameQuery = surnameMatch[1].trim();
        const firstNameQuery = firstNameMatch[1].trim();

        // Check if there is a match in DB
        const match = dbEmployees.find(emp => {
          return emp.surname.toLowerCase().includes(surnameQuery.toLowerCase()) &&
                 emp.first_name.toLowerCase().includes(firstNameQuery.toLowerCase());
        });

        if (!match) {
          mismatches.push({
            index: i + 1,
            surnameQuery,
            firstNameQuery,
            line
          });
        }
      }
    }

    console.log(`\nFound ${mismatches.length} unmatched updates:`);
    for (const m of mismatches) {
      console.log(`\n[Line ${m.index}] Query for "${m.surnameQuery}, ${m.firstNameQuery}" did not match any row.`);
      
      // Let's search for fuzzy matches in dbEmployees
      const closeMatches = dbEmployees.filter(emp => {
        // loose match: surname starting with first 3 chars or similar
        const sSub = m.surnameQuery.substring(0, 3).toLowerCase();
        const fSub = m.firstNameQuery.substring(0, 3).toLowerCase();
        return emp.surname.toLowerCase().includes(sSub) || emp.first_name.toLowerCase().includes(fSub);
      });

      if (closeMatches.length > 0) {
        console.log("  Potential candidates in database:");
        closeMatches.slice(0, 5).forEach(c => {
          console.log(`  - ID: ${c.id} | Surname: "${c.surname}" | FirstName: "${c.first_name}"`);
        });
      } else {
        console.log("  No close candidates found.");
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
