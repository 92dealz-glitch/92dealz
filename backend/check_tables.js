const sequelize = require('./config/database');

async function check() {
  try {
    await sequelize.authenticate();
    console.log('Auth success');
    const [tables] = await sequelize.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
    console.log('TABLES:', tables.map(t => t.table_name));
    
    for (const table of ['deals', 'click_events', 'users', 'categories', 'submissions']) {
      try {
        const [cols] = await sequelize.query(`SELECT column_name FROM information_schema.columns WHERE table_name='${table}'`);
        console.log(`COLUMNS FOR ${table}:`, cols.map(c => c.column_name));
      } catch (e) {
        console.log(`Table ${table} might be missing or error:`, e.message);
      }
    }
  } catch (err) {
    console.error('Check failed:', err);
  } finally {
    process.exit();
  }
}

check();
