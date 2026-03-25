const path = require('path');
const fs = require('fs');
const sequelize = require(path.resolve(__dirname, '../backend/config/database'));

async function run() {
  try {
    const [cols] = await sequelize.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name='deals'`
    );
    fs.writeFileSync(path.resolve(__dirname, 'deals_schema.json'), JSON.stringify(cols, null, 2), 'utf8');
    
    const [rows] = await sequelize.query('SELECT id, title, category_id FROM deals LIMIT 5');
    fs.writeFileSync(path.resolve(__dirname, 'deals_sample.json'), JSON.stringify(rows, null, 2), 'utf8');
    
    console.log('Schema and samples saved to tmp/');
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

run();
