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

    // Search for LLANA or GELLNE or similar
    console.log("\nSearching for Llana / Gellne variations:");
    const res1 = await client.query("SELECT id, surname, first_name FROM employees WHERE surname ILIKE '%ll%' OR first_name ILIKE '%gel%';");
    res1.rows.forEach(r => console.log(`- ID: ${r.id} | Surname: "${r.surname}" | FirstName: "${r.first_name}"`));

    // Search for SALSAY or SHIELA or similar
    console.log("\nSearching for Salsya / Shiela variations:");
    const res2 = await client.query("SELECT id, surname, first_name FROM employees WHERE surname ILIKE '%sal%' OR first_name ILIKE '%sh%' OR first_name ILIKE '%si%';");
    res2.rows.forEach(r => console.log(`- ID: ${r.id} | Surname: "${r.surname}" | FirstName: "${r.first_name}"`));

    // Search for MOÑA or NEISA or similar
    console.log("\nSearching for Moña / Neisa / Nelse variations:");
    const res3 = await client.query("SELECT id, surname, first_name FROM employees WHERE surname ILIKE '%mo%' OR first_name ILIKE '%ne%';");
    res3.rows.forEach(r => console.log(`- ID: ${r.id} | Surname: "${r.surname}" | FirstName: "${r.first_name}"`));

    // Let's also check who ID 23 and 135 are in the database (since Labao Rexjhon might be stored under a different ID)
    console.log("\nSearching for Rex / Jhon / Labao:");
    const res4 = await client.query("SELECT id, surname, first_name FROM employees WHERE surname ILIKE '%lab%' OR first_name ILIKE '%rex%' OR first_name ILIKE '%jho%';");
    res4.rows.forEach(r => console.log(`- ID: ${r.id} | Surname: "${r.surname}" | FirstName: "${r.first_name}"`));

    client.release();
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

main();
