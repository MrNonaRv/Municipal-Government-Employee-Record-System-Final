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
    const res = await client.query("SELECT id, surname, first_name, service_records FROM employees LIMIT 10;");
    console.log("Employee records in Supabase:");
    res.rows.forEach(row => {
      console.log(`- ${row.surname}, ${row.first_name} (ID: ${row.id})`);
      console.log("  Service Records:", JSON.stringify(row.service_records, null, 2));
    });
    client.release();
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await pool.end();
  }
}

main();
