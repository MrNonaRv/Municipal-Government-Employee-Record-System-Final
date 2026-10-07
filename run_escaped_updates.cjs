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

    const sqlContent = fs.readFileSync('final_fix_v2.sql', 'utf8');
    const lines = sqlContent.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith('--'));

    console.log(`Loaded ${lines.length} queries to clean and execute.`);

    let successCount = 0;
    let failedCount = 0;
    let totalRowsAffected = 0;

    for (let i = 0; i < lines.length; i++) {
      let query = lines[i];

      // We need to escape single quotes within the JSON string literal.
      // The literal starts with = ' and ends with '::jsonb
      const setPrefix = "SET service_records = '";
      const suffixMarker = "'::jsonb";
      
      const setIdx = query.indexOf(setPrefix);
      const suffixIdx = query.indexOf(suffixMarker);

      if (setIdx !== -1 && suffixIdx !== -1 && suffixIdx > setIdx) {
        const jsonStart = setIdx + setPrefix.length;
        const jsonPart = query.substring(jsonStart, suffixIdx);
        // Escape single quotes inside the jsonPart
        const escapedJsonPart = jsonPart.replace(/'/g, "''");
        
        query = query.substring(0, jsonStart) + escapedJsonPart + query.substring(suffixIdx);
      }

      try {
        const res = await client.query(query);
        totalRowsAffected += res.rowCount;
        successCount++;
        if (res.rowCount === 0) {
          console.warn(`[Query ${i + 1}/${lines.length}] Success, but 0 rows affected for: "${query.substring(0, 120)}..."`);
        } else if (i % 20 === 0 || i === lines.length - 1) {
          console.log(`[Query ${i + 1}/${lines.length}] Success. Rows affected: ${res.rowCount}.`);
        }
      } catch (err) {
        failedCount++;
        console.error(`[Query ${i + 1}/${lines.length}] Failed: ${err.message}\nQuery: "${query}"`);
      }
    }

    console.log("\nExecution completed!");
    console.log(`- Total Queries: ${lines.length}`);
    console.log(`- Success: ${successCount}`);
    console.log(`- Failed: ${failedCount}`);
    console.log(`- Total Rows Affected: ${totalRowsAffected}`);

    client.release();
  } catch (err) {
    console.error("Connection or reading error:", err);
  } finally {
    await pool.end();
  }
}

main();
