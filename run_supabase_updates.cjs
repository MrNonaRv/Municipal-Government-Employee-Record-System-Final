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

    console.log(`Loaded ${lines.length} queries to execute.`);

    let successCount = 0;
    let failedCount = 0;
    let totalRowsAffected = 0;

    for (let i = 0; i < lines.length; i++) {
      const query = lines[i];
      try {
        const res = await client.query(query);
        totalRowsAffected += res.rowCount;
        successCount++;
        // Print progress every 10 queries or if rowCount is > 0
        if (res.rowCount > 0 || i === 0 || i === lines.length - 1 || i % 10 === 0) {
          console.log(`[Query ${i + 1}/${lines.length}] Success. Rows affected: ${res.rowCount}. Query starts with: "${query.substring(0, 100)}..."`);
        }
      } catch (err) {
        failedCount++;
        console.error(`[Query ${i + 1}/${lines.length}] Failed: ${err.message}. Query: "${query}"`);
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
