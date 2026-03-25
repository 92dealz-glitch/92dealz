const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'backend', 'config', 'database'));

async function checkSchema() {
  try {
    const [dealsCols] = await sequelize.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'deals'");
    console.log('DEALS_COLUMNS: ' + dealsCols.map(c => c.column_name).join(', '));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkSchema();
