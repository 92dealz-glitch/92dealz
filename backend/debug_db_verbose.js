const sequelize = require('./config/database');
const fs = require('fs');
async function run() {
  let log = '';
  try {
    log += 'Attempting authentication...\n';
    await sequelize.authenticate();
    log += 'Authenticated successfully.\n';
    
    const [cols] = await sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name='deals'"
    );
    log += 'DEALS COLUMNS: ' + JSON.stringify(cols.map(c => c.column_name)) + '\n';
    
    const [[count]] = await sequelize.query("SELECT COUNT(*)::INT as c FROM deals");
    log += 'DEALS COUNT: ' + count.c + '\n';

    fs.writeFileSync('db_debug_result.txt', log);
    process.exit(0);
  } catch (err) {
    log += 'ERROR: ' + err.stack + '\n';
    fs.writeFileSync('db_debug_result.txt', log);
    process.exit(1);
  }
}
run();
