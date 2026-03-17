const sequelize = require('./config/database');
const fs = require('fs');

async function check() {
  try {
    await sequelize.authenticate();
    console.log('Postgres Authenticated');
    
    const [tables] = await sequelize.query("SELECT tablename as table_name, schemaname FROM pg_catalog.pg_tables WHERE schemaname != 'information_schema' AND schemaname != 'pg_catalog'");
    console.log('Tables found:', tables.length);
    
    const result = { tables: [], columns: {} };
    
    for (const t of tables) {
      const tableName = t.table_name;
      const schemaName = t.schemaname;
      result.tables.push(`${schemaName}.${tableName}`);
      
      const [columns] = await sequelize.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${tableName}' AND table_schema = '${schemaName}'`);
      result.columns[`${schemaName}.${tableName}`] = columns.map(c => ({
        name: c.column_name,
        type: c.data_type
      }));
    }
    
    fs.writeFileSync('audit_db.json', JSON.stringify(result, null, 2));
    console.log('Success: audit_db.json written');
  } catch (err) {
    console.error('Audit Error:', err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

check();
