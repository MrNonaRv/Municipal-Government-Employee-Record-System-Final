const { Pool } = require('pg');
const SUPABASE_URL = "postgresql://postgres.oxtjlhcwibieeuwbhnyj:Olanoko_1529@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres";

async function main() {
  const pool = new Pool({
    connectionString: SUPABASE_URL,
  });

  try {
    const result = await pool.query("SELECT DISTINCT sr->>'station' as station FROM employees, jsonb_array_elements(service_records) AS sr WHERE sr->>'station' IS NOT NULL AND sr->>'station' != ''");
    const stations = result.rows.map(row => row.station);
    console.log(JSON.stringify([...new Set(stations)].sort()));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
