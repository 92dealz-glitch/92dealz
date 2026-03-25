const path = require('path');
const fs = require('fs');
const sequelize = require(path.resolve(__dirname, '../backend/config/database'));

async function run() {
  try {
    const [rows] = await sequelize.query('SELECT id, name, slug FROM categories');
    fs.writeFileSync(path.resolve(__dirname, 'categories.json'), JSON.stringify(rows, null, 2), 'utf8');
    console.log('Categories saved to tmp/categories.json');
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

run();
