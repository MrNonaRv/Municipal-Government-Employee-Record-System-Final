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

    const res = await client.query("SELECT id, surname, first_name, service_records FROM employees;");
    const dbEmployees = res.rows;

    const unmatchedNames = [
      { s: 'Villoza', f: 'Pamela', pos: 'Soc. Welfare Asst. II' },
      { s: 'Moña', f: 'Neisa', pos: 'Adm. Aide I' },
      { s: 'Moaña', f: 'Neisa', pos: 'Adm. Aide I' },
      { s: 'Alcjado', f: 'Shanie', pos: 'Adm. Aide II' },
      { s: 'Labao', f: 'Rexjhon', pos: 'MGADH I' },
      { s: 'Leno', f: 'Luna', pos: 'Adm. Aide I' },
      { s: 'Guatio', f: 'Rhodora', pos: 'Adm. Aide I' },
      { s: 'Barte', f: 'Michel', pos: 'Adm. Aide I' },
      { s: 'Lago', f: 'Teresa', pos: 'Adm. Aide I' },
      { s: 'Villiester', f: 'Catherine', pos: 'S. B. Member' },
      { s: 'Ticer', f: 'Raul', pos: 'S. B. Member' },
      { s: 'Quincy', f: 'George', pos: 'ABC President' },
      { s: 'Buenavista', f: 'Frederick', pos: 'SK President' },
      { s: 'Bersurto', f: 'Irish', pos: 'Local Leg Staff Officer IV' },
      { s: 'Benjamin', f: 'Vincent', pos: 'Loc. Leg. Staff Asst. I' },
      { s: 'Benjamin', f: 'Cenneth', pos: 'Loc. Leg. Staff Employee' },
      { s: 'Canique', f: 'Jinalyn', pos: 'Loc. Leg. Staff Employee' },
      { s: 'Vpinosa', f: 'Levi', pos: 'Adm. aide III' },
      { s: 'Lincio', f: 'Abner', pos: 'Adm. Aide I' },
      { s: 'Lorja', f: 'Mary', pos: 'Adm. Aide II' },
      { s: 'Lorja', f: 'Mary Mae', pos: 'Adm. Aide II' },
      { s: 'Arteza', f: 'Jerce', pos: 'Adm. Aide I' },
      { s: 'Salsya', f: 'Shiela', pos: 'Adm. Aide I' },
      { s: 'Valiente', f: 'Bernardith', pos: 'Adm. Aide VI' },
      { s: 'Lardoc', f: 'Honey', pos: 'Adm. Aide I' },
      { s: 'Llana', f: 'Gellne', pos: 'Adm. Aide I' },
      { s: 'Lunas', f: 'Rachris', pos: 'Adm. Aide I' },
      { s: 'Calsitoro', f: 'Kimberly', pos: 'Adm. Aide I' },
      { s: 'Dila', f: 'Gracelyn', pos: 'Adm. Aide I' },
      { s: 'Feizado', f: 'Lilibeth', pos: 'Adm. Aide I' },
      { s: 'Aleyon', f: 'Pablito', pos: 'Adm. Aide I' },
      { s: 'Dela Cruz', f: 'Joseph', pos: 'Adm. Aide I' },
      { s: 'Ledesma', f: 'Jay', pos: 'Assess. Clerk I' },
      { s: 'Ayro', f: 'Ramon', pos: 'Adm. Aide I' },
      { s: 'Luces', f: 'Manuel', pos: 'Adm. Aide I' },
      { s: 'Ricalia', f: 'Racquel', pos: 'Adm. Aide I' },
      { s: 'Solis', f: 'Eida', pos: 'Adm. Aide I' }
    ];

    console.log("Analyzing precise mappings...");
    const mappings = [];

    for (const item of unmatchedNames) {
      // Find candidate
      const candidates = dbEmployees.filter(emp => {
        const surnameMatch = emp.surname.toLowerCase().includes(item.s.toLowerCase()) || 
                             item.s.toLowerCase().includes(emp.surname.toLowerCase());
        const firstNameMatch = emp.first_name.toLowerCase().includes(item.f.toLowerCase()) ||
                               item.f.toLowerCase().includes(emp.first_name.toLowerCase());
        return surnameMatch || firstNameMatch;
      });

      console.log(`\nQuery: ${item.s}, ${item.f} (${item.pos})`);
      if (candidates.length > 0) {
        console.log("  Candidates found:");
        candidates.forEach(c => {
          console.log(`  - ID: ${c.id} | Surname: "${c.surname}" | FirstName: "${c.first_name}"`);
        });
      } else {
        console.log("  No candidates found in database.");
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
