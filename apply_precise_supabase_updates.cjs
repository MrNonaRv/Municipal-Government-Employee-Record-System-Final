const { Pool } = require('pg');
const SUPABASE_URL = "postgresql://postgres.oxtjlhcwibieeuwbhnyj:Olanoko_1529@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres";

// Complete dataset of all employees with correct details from the table
const employeeData = [
  { s: 'Talaban', f: 'Babelyn', pos: 'MSWDO', sal: '80648.00', ann: '967776.00', station: 'Municipal Social Welfare and Development Office' },
  { s: 'Lacuarta', f: 'Jerry', pos: 'Soc. Welfare Asst.', sal: '18456.00', ann: '221472.00', station: 'Municipal Social Welfare and Development Office' },
  { s: 'Villoza', f: 'Pamela', pos: 'Soc. Welfare Asst. II', sal: '17645.00', ann: '211740.00', station: 'Municipal Social Welfare and Development Office' },
  { s: 'Arteza', f: 'Jeanny', pos: 'Soc. Welfare Aide', sal: '13845.00', ann: '166140.00', station: 'Municipal Social Welfare and Development Office' },
  { s: 'Laz', f: 'Jose Ronnie', pos: 'Adm. Aide III', sal: '12941.00', ann: '155292.00', station: 'Municipal Social Welfare and Development Office' },
  { s: 'Palomo', f: 'Frankie', pos: 'Adm. Aide III', sal: '12843.00', ann: '154116.00', station: 'Municipal Social Welfare and Development Office' },
  { s: 'Diaz', f: 'Frank Lloyd', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: 'Municipal Social Welfare and Development Office' },
  { s: 'Moña', f: 'Neisa', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: 'Municipal Social Welfare and Development Office' },
  { s: 'Moaña', f: 'Neisa', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: 'Municipal Social Welfare and Development Office' },
  { s: 'Mesias', f: 'Sallie', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: 'Municipal Social Welfare and Development Office' },
  { s: 'Dela Cruz', f: 'Joselito', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: 'Municipal Social Welfare and Development Office' },
  { s: 'Galapia', f: 'Jackelyn', pos: 'Adm. Aide I', sal: '11388.00', ann: '136656.00', station: 'Municipal Social Welfare and Development Office' },
  { s: 'Montorio', f: 'Desam', pos: 'H.R.M.O V', sal: '79382.00', ann: '952584.00', station: 'Human Resource Management Office' },
  { s: 'Golez', f: 'Maryjean', pos: 'Adm. Aide IV', sal: '14373.00', ann: '172476.00', station: 'Human Resource Management Office' },
  { s: 'Alcjado', f: 'Shanie', pos: 'Adm. Aide II', sal: '12092.00', ann: '145104.00', station: 'Human Resource Management Office' },
  { s: 'Baldonado', f: 'Joselito', pos: 'Adm. Aide I', sal: '11662.00', ann: '139944.00', station: 'Human Resource Management Office' },
  { s: 'Andaya', f: 'Ma. Aurora', pos: 'Mun. Civil Registrar', sal: '84577.00', ann: '1014924.00', station: "Municipal Civil Registrar's Office" },
  { s: 'Mesias', f: 'Erlinda', pos: 'Messenger', sal: '12274.00', ann: '147288.00', station: "Municipal Civil Registrar's Office" },
  { s: 'Gregore', f: 'Erly', pos: 'Adm. Aide I', sal: '11567.00', ann: '138804.00', station: "Municipal Civil Registrar's Office" },
  { s: 'Labo', f: 'Sharon', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: "Municipal Civil Registrar's Office" },
  { s: 'Leonardo', f: 'Irene', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: "Municipal Civil Registrar's Office" },
  { s: 'Letran', f: 'Angel Heart', pos: 'Adm. Aide I', sal: '11388.00', ann: '136656.00', station: "Municipal Civil Registrar's Office" },
  { s: 'Labo', f: 'Alejandre', pos: 'Mun. Engineer', sal: '88659.00', ann: '1063908.00', station: 'Municipal Engineering Office' },
  { s: 'Labao', f: 'Rexjhon', pos: 'MGADH I', sal: '63153.00', ann: '757836.00', station: 'Municipal Engineering Office' },
  { s: 'Berganio', f: 'Karen', pos: 'Engineer III', sal: '45515.00', ann: '546180.00', station: 'Municipal Engineering Office' },
  { s: 'Toledo', f: 'Gerbert', pos: 'Gen. Foreman', sal: '17496.00', ann: '209952.00', station: 'Municipal Engineering Office' },
  { s: 'Guion', f: 'Gerold', pos: 'Adm. Aide I', sal: '11951.00', ann: '143412.00', station: 'Municipal Engineering Office' },
  { s: 'Villareal', f: 'Gemma', pos: 'Adm. Aide I', sal: '11951.00', ann: '143412.00', station: 'Municipal Engineering Office' },
  { s: 'Puncion', f: 'Josephine', pos: 'Adm. Aide I', sal: '11662.00', ann: '139944.00', station: 'Municipal Engineering Office' },
  { s: 'Leno', f: 'Luna Rose', pos: 'Adm. Aide I', sal: '11567.00', ann: '138804.00', station: 'Municipal Engineering Office' },
  { s: 'Guatio', f: 'Rhodora', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: 'Municipal Engineering Office' },
  { s: 'Magbanua', f: 'Noe', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: 'Municipal Engineering Office' },
  { s: 'Osias', f: 'Ferdinand', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: 'Municipal Engineering Office' },
  { s: 'Gallardo', f: 'Amie', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: 'Municipal Engineering Office' },
  { s: 'Barte', f: 'Michel', pos: 'Adm. Aide I', sal: '11388.00', ann: '136656.00', station: 'Municipal Engineering Office' },
  { s: 'Ocbeña', f: 'Darenne', pos: 'Adm. Aide I', sal: '11854.00', ann: '142248.00', station: 'General Services / Admin' },
  { s: 'Crisostomo', f: 'Mila', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: 'General Services / Admin' },
  { s: 'Gregorio', f: 'Mica', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: 'General Services / Admin' },
  { s: 'Lago', f: 'Teresa', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: 'General Services / Admin' },
  { s: 'Buenavista', f: 'Richard', pos: 'Mun. Vice Mayor', sal: '90367.00', ann: '1084404.00', station: 'Sangguniang Bayan Office' },
  { s: 'Labao', f: 'Mary Ann', pos: 'S. B. Member', sal: '80648.00', ann: '967776.00', station: 'Sangguniang Bayan Office' },
  { s: 'Villiester', f: 'Catherine', pos: 'S. B. Member', sal: '80648.00', ann: '967776.00', station: 'Sangguniang Bayan Office' },
  { s: 'Ticer', f: 'Raul', pos: 'S. B. Member', sal: '79382.00', ann: '952584.00', station: 'Sangguniang Bayan Office' },
  { s: 'Laurilla', f: 'John', pos: 'S. B. Member', sal: '79382.00', ann: '952584.00', station: 'Sangguniang Bayan Office' },
  { s: 'Trajano', f: 'Fatima', pos: 'S. B. Member', sal: '79382.00', ann: '952584.00', station: 'Sangguniang Bayan Office' },
  { s: 'Layo', f: 'Jeffrey', pos: 'S. B. Member', sal: '79382.00', ann: '952584.00', station: 'Sangguniang Bayan Office' },
  { s: 'Jumbas', f: 'Joefred sheen', pos: 'S. B. Member', sal: '79382.00', ann: '952584.00', station: 'Sangguniang Bayan Office' },
  { s: 'Uy', f: 'Maria Rhodora', pos: 'S. B. Member', sal: '80648.00', ann: '967776.00', station: 'Sangguniang Bayan Office' },
  { s: 'Quincy', f: 'George', pos: 'ABC President', sal: '79382.00', ann: '952584.00', station: 'Sangguniang Bayan Office' },
  { s: 'Buenavista', f: 'Frederick', pos: 'SK President', sal: '79382.00', ann: '952584.00', station: 'Sangguniang Bayan Office' },
  { s: 'Leonida', f: 'Jerry', pos: 'SB Secretary', sal: '88659.00', ann: '1063908.00', station: 'Sangguniang Bayan Office' },
  { s: 'Bersurto', f: 'Irish', pos: 'Local Leg Staff Officer IV', sal: '45515.00', ann: '546180.00', station: 'Sangguniang Bayan Office' },
  { s: 'Puncion', f: 'Che-An', pos: 'Local Leg Staff Officer I', sal: '27777.00', ann: '333324.00', station: 'Sangguniang Bayan Office' },
  { s: 'Ladoc', f: 'Mariane', pos: 'Loc. Leg. Staff Asst. III', sal: '24399.00', ann: '292788.00', station: 'Sangguniang Bayan Office' },
  { s: 'Benjamin', f: 'Vincent', pos: 'Loc. Leg. Staff Asst. I', sal: '20795.00', ann: '249540.00', station: 'Sangguniang Bayan Office' },
  { s: 'Benjamin', f: 'Cenneth', pos: 'Loc. Leg. Staff Employee', sal: '15359.00', ann: '184308.00', station: 'Sangguniang Bayan Office' },
  { s: 'Canique', f: 'Jinalyn', pos: 'Loc. Leg. Staff Employee', sal: '13741.00', ann: '164892.00', station: 'Sangguniang Bayan Office' },
  { s: 'Llorente', f: 'Christine Joy', pos: 'Adm. aide III', sal: '12941.00', ann: '155292.00', station: 'Sangguniang Bayan Office' },
  { s: 'Vpinosa', f: 'Levi', pos: 'Adm. aide III', sal: '12941.00', ann: '155292.00', station: 'Sangguniang Bayan Office' },
  { s: 'Labao', f: 'Hazel', pos: 'Local Leg. Staff Employee', sal: '12367.00', ann: '148404.00', station: 'Sangguniang Bayan Office' },
  { s: 'Labris', f: 'Jesa', pos: 'Messenger', sal: '12274.00', ann: '147288.00', station: 'Sangguniang Bayan Office' },
  { s: 'Palma', f: 'Criselda', pos: 'Messenger', sal: '12092.00', ann: '145104.00', station: 'Sangguniang Bayan Office' },
  { s: 'Palmes', f: 'Renelyn', pos: 'Loc. Leg. Staff Employee', sal: '12183.00', ann: '146196.00', station: 'Sangguniang Bayan Office' },
  { s: 'Lincio', f: 'Abner', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: 'Sangguniang Bayan Office' },
  { s: 'Sangrones', f: 'Genalyn', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: 'Sangguniang Bayan Office' },
  { s: 'Lozada', f: 'Heber', pos: 'Adm. Aide I', sal: '11388.00', ann: '136656.00', station: 'Sangguniang Bayan Office' },
  { s: 'Labao', f: 'Leodegario', pos: 'Municipal Mayor', sal: '119106.00', ann: '1429272.00', station: "Mayor's Office" },
  { s: 'Domingo', f: 'Cherry Lyn', pos: 'Supply Ofcr. IV', sal: '63153.00', ann: '757836.00', station: "Mayor's Office" },
  { s: 'Marabe', f: 'Edwin', pos: 'Adm. Officer V', sal: '42287.00', ann: '507444.00', station: "Mayor's Office" },
  { s: 'Villorente', f: 'Kenneth John', pos: 'Tourism Opr. Officer', sal: '32453.00', ann: '389436.00', station: "Mayor's Office" },
  { s: 'Lozada', f: 'Edgardo', pos: 'Comm. Equip Inspr.', sal: '24636.00', ann: '295632.00', station: "Mayor's Office" },
  { s: 'Clarite', f: 'Jeovy', pos: 'Adm. Aide III', sal: '12843.00', ann: '154116.00', station: "Mayor's Office" },
  { s: 'Dela Cruz', f: 'Kristy', pos: 'Adm. Aide II', sal: '12183.00', ann: '146196.00', station: "Mayor's Office" },
  { s: 'Lorja', f: 'Mary Mae', pos: 'Adm. Aide II', sal: '12183.00', ann: '146196.00', station: "Mayor's Office" },
  { s: 'Villanueva', f: 'Cris', pos: 'Adm. Aide I', sal: '11567.00', ann: '138804.00', station: "Mayor's Office" },
  { s: 'Silvestre', f: 'Nikki', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: "Mayor's Office" },
  { s: 'Delfin', f: 'Brenn', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: "Mayor's Office" },
  { s: 'Arteza', f: 'Jerce', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: "Mayor's Office" },
  { s: 'Apruebo', f: 'Adiel', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: "Mayor's Office" },
  { s: 'Monajan', f: 'Sergio', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: "Mayor's Office" },
  { s: 'Salsya', f: 'Shiela', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: "Mayor's Office" },
  { s: 'Martinez', f: 'Randy Ryan', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: "Mayor's Office" },
  { s: 'Launio', f: 'Ma. Angel Adora', pos: 'Municipal Accountant', sal: '81937.00', ann: '983244.00', station: 'Municipal Accounting Office' },
  { s: 'Valiente', f: 'Bernardith', pos: 'Adm. Aide VI', sal: '15359.00', ann: '184308.00', station: 'Municipal Accounting Office' },
  { s: 'Lardoc', f: 'Honey', pos: 'Adm. Aide I', sal: '11567.00', ann: '138804.00', station: 'Municipal Accounting Office' },
  { s: 'Llana', f: 'Gellne', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: 'Municipal Accounting Office' },
  { s: 'De Domingo', f: 'Rodelyn', pos: 'Adm. Aide I', sal: '11388.00', ann: '136656.00', station: 'Municipal Accounting Office' },
  { s: 'Lunas', f: 'Rachris', pos: 'Adm. Aide I', sal: '11388.00', ann: '136656.00', station: 'Municipal Accounting Office' },
  { s: 'Calsitoro', f: 'Kimberly', pos: 'Adm. Aide I', sal: '11388.00', ann: '136656.00', station: 'Municipal Accounting Office' },
  { s: 'Dila', f: 'Gracelyn', pos: 'Adm. Aide I', sal: '11388.00', ann: '136656.00', station: 'Municipal Accounting Office' },
  { s: 'Andaya', f: 'Charlene', pos: 'Mun. Assessor', sal: '79382.00', ann: '952584.00', station: "Municipal Assessor's Office" },
  { s: 'Laurilla', f: 'Princes Diana', pos: 'Loc. Asst. Ofcr. I', sal: '24165.00', ann: '289980.00', station: "Municipal Assessor's Office" },
  { s: 'Bautista', f: 'Juneleen', pos: 'Assess. Clerk I', sal: '13638.00', ann: '163656.00', station: "Municipal Assessor's Office" },
  { s: 'Feizado', f: 'Lilibeth', pos: 'Adm. Aide I', sal: '11662.00', ann: '139944.00', station: "Municipal Assessor's Office" },
  { s: 'Aleyon', f: 'Pablito', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: "Municipal Assessor's Office" },
  { s: 'Sibug', f: 'Rose', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: "Municipal Assessor's Office" },
  { s: 'Dela Cruz', f: 'Joseph', pos: 'Adm. Aide I', sal: '11388.00', ann: '136656.00', station: "Municipal Assessor's Office" },
  { s: 'Lusabia', f: 'John Paul', pos: 'MGDH I', sal: '79382.00', ann: '952584.00', station: 'Municipal Disaster Risk Reduction & Mgmt Office' },
  { s: 'Bolido', f: 'Gerry', pos: 'Loc. MDRRM Ofcr. III', sal: '41410.00', ann: '496920.00', station: 'Municipal Disaster Risk Reduction & Mgmt Office' },
  { s: 'Candido', f: 'Mary Rose', pos: 'Nurse I', sal: '39311.00', ann: '471732.00', station: 'Municipal Disaster Risk Reduction & Mgmt Office' },
  { s: 'Alayon', f: 'Ma. AJ', pos: 'Loc. MDRRM', sal: '17329.00', ann: '207948.00', station: 'Municipal Disaster Risk Reduction & Mgmt Office' },
  { s: 'Ledesma', f: 'Jay', pos: 'Assess. Clerk I', sal: '13638.00', ann: '163656.00', station: "Municipal Assessor's Office" },
  { s: 'Ayro', f: 'Ramon', pos: 'Adm. Aide I', sal: '11473.00', ann: '137676.00', station: 'Municipal Disaster Risk Reduction & Mgmt Office' },
  { s: 'Luces', f: 'Manuel', pos: 'Adm. Aide I', sal: '11388.00', ann: '136656.00', station: 'Municipal Disaster Risk Reduction & Mgmt Office' },
  { s: 'Ricalia', f: 'Racquel', pos: 'Adm. Aide I', sal: '11388.00', ann: '136656.00', station: 'Municipal Disaster Risk Reduction & Mgmt Office' },
  { s: 'Solis', f: 'Eida', pos: 'Adm. Aide I', sal: '11388.00', ann: '136656.00', station: 'Municipal Disaster Risk Reduction & Mgmt Office' }
];

// Special precise mappings to handle typos, backwards records, and spacing issues in the actual database
const specialMappings = {
  'Villoza-Pamela': { s: 'VILLEZA', f: 'PAMELA' },
  'Moña-Neisa': { s: 'MOAÑA', f: 'NELSE' },
  'Moña-Neisa B.': { s: 'MOAÑA', f: 'NELSE' },
  'Moña-Neisa B': { s: 'MOAÑA', f: 'NELSE' },
  'Moaña-Neisa': { s: 'MOAÑA', f: 'NELSE' },
  'Alcjado-Shanie': { s: 'ALOJADO', f: 'SHANIE' },
  'Labao-Rexjhon': { s: 'LABAO', f: 'FERJHON' },
  'Leno-Luna Rose': { s: 'LERIO', f: 'LUNA ROSE' },
  'Guatio-Rhodora': { s: 'GUSTILO', f: 'RHODORA' },
  'Barte-Michel': { s: 'BERTE', f: 'MICHEL' },
  'Lago-Teresa': { s: 'TERESA A', f: 'LAGO' },
  'Villiester-Catherine': { s: 'VILLAESTER', f: 'CATHERINE' },
  'Ticer-Raul': { s: 'TICAR', f: 'RAUL' },
  'Quincy-George': { s: 'DIANGSON', f: 'QUINCY GEORGE' },
  'Buenavista-Frederick': { s: 'BUENAVISTA', f: 'FREDERICK RUIZ' },
  'Bersurto-Irish': { s: 'BENSURTO', f: 'IRISH ANN' },
  'Benjamin-Vincent': { s: 'BERJAMIN', f: 'VINCENT' },
  'Benjamin-Cenneth': { s: 'BERJAMIN', f: 'MA. CENNETH' },
  'Canique-Jinalyn': { s: 'CAMIQUE', f: 'JINALYN' },
  'Vpinosa-Levi': { s: 'VIPINOSA', f: 'LEVI' },
  'Lincio-Abner': { s: 'LINDA', f: 'ABNER' },
  'Lorja-Mary Mae': { s: 'LORIJO', f: 'MARY MAE' },
  'Arteza-Jerce': { s: 'ARTEZA', f: 'JEROE ANN' },
  'Salsya-Shiela': { s: 'SALAYA', f: 'SHIELLA MARIE' },
  'Valiente-Bernardith': { s: 'VALIENTE', f: 'MA.BERNADITH' },
  'Lardoc-Honey': { s: 'Lapidez', f: 'Honey D.', useId: 338 },
  'Llana-Gellne': { s: 'LLENA', f: 'GELINE' },
  'Lunas-Rachris': { s: 'Lunas', f: 'Rechris L.', useId: 339 }, // We'll manually update both Rechris entries
  'Calsitoro-Kimberly': { s: 'CALFOFORO', f: 'KIMBERLY' },
  'Dila-Gracelyn': { s: 'DILE', f: 'GRACELYN' },
  'Feizado-Lilibeth': { s: 'FELIZARDO', f: 'LILIBETH' },
  'Aleyon-Pablito': { s: 'ALAYON', f: 'PABLITO' },
  'Dela Cruz-Joseph': { s: 'DELACRUZ', f: 'JOSEPH' },
  'Ledesma-Jay': { s: 'LEDESMA', f: 'JAYANN.' },
  'Ayro-Ramon': { s: 'AYCO', f: 'RAMON' },
  'Luces-Manuel': { s: 'LUCES', f: 'MANUEL' },
  'Ricalia-Racquel': { s: 'RICAÑA', f: 'RACQUEL ANN' },
  'Solis-Eida': { s: 'SOLIS', f: 'ELDE' }
};

async function main() {
  const pool = new Pool({
    connectionString: SUPABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log("Connected to Supabase!");

    let successCount = 0;
    let failedCount = 0;
    let totalRowsAffected = 0;

    for (let i = 0; i < employeeData.length; i++) {
      const emp = employeeData[i];
      const key = `${emp.s}-${emp.f}`;
      
      let whereClause = "";
      
      if (specialMappings[key]) {
        const mapping = specialMappings[key];
        if (mapping.useId) {
          whereClause = `id = ${mapping.useId}`;
        } else {
          whereClause = `surname = '${mapping.s}' AND first_name = '${mapping.f}'`;
        }
      } else {
        whereClause = `surname ILIKE '%${emp.s}%' AND first_name ILIKE '%${emp.f}%'`;
      }

      const srId = `sr-fixed-${emp.s}-${emp.f.replace(/\s+/g, '')}`;
      const serviceRecordsJson = JSON.stringify([{
        id: srId,
        to: "Present",
        from: "2016-07-01",
        salary: emp.sal,
        annual_salary: emp.ann,
        station: emp.station,
        designation: emp.pos,
        status: "Permanent"
      }]);

      // Double escape single quotes for SQL string safety
      const escapedJson = serviceRecordsJson.replace(/'/g, "''");
      const query = `UPDATE employees SET service_records = '${escapedJson}'::jsonb WHERE ${whereClause};`;

      try {
        const res = await client.query(query);
        totalRowsAffected += res.rowCount;
        successCount++;
        if (res.rowCount === 0) {
          console.warn(`[Employee ${i + 1}/${employeeData.length}] 0 rows updated for "${emp.s}, ${emp.f}" using: "${whereClause}"`);
        } else {
          console.log(`[Employee ${i + 1}/${employeeData.length}] Successfully updated "${emp.s}, ${emp.f}" (${res.rowCount} row affected)`);
        }

        // Special extra updates (e.g. for second duplicate records)
        if (key === 'Lunas-Rachris') {
          // Also update the second LUNAS record (ID: 132)
          const extraQuery = `UPDATE employees SET service_records = '${escapedJson}'::jsonb WHERE id = 132;`;
          const extraRes = await client.query(extraQuery);
          totalRowsAffected += extraRes.rowCount;
          console.log(`  - Extra update for LUNAS Rechris (ID: 132): ${extraRes.rowCount} row affected`);
        }
      } catch (err) {
        failedCount++;
        console.error(`[Employee ${i + 1}/${employeeData.length}] Failed for "${emp.s}, ${emp.f}": ${err.message}\nQuery: "${query}"`);
      }
    }

    console.log("\nDatabase updates completed successfully!");
    console.log(`- Total Records Processed: ${employeeData.length}`);
    console.log(`- Success: ${successCount}`);
    console.log(`- Failed: ${failedCount}`);
    console.log(`- Total Rows Affected: ${totalRowsAffected}`);

    client.release();
  } catch (err) {
    console.error("Main Connection error:", err);
  } finally {
    await pool.end();
  }
}

main();
