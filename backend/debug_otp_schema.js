const sequelize = require('./config/database');

async function checkSchema() {
  try {
    const [cols] = await sequelize.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'password_resets' AND column_name = 'otp'
    `);
    
    console.log('\n--- SCHEMA INSPECTION: password_resets.otp ---');
    if (cols.length === 0) {
      console.log('Column "otp" not found in table "password_resets"!');
    } else {
      console.log(JSON.stringify(cols[0], null, 2));
    }
    
    const [tables] = await sequelize.query(`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
    `);
    console.log('\n--- ALL TABLES ---');
    console.log(tables.map(t => t.table_name).join(', '));
    
    process.exit(0);
  } catch (err) {
    console.error('Error inspecting schema:', err);
    process.exit(1);
  }
}

checkSchema();
