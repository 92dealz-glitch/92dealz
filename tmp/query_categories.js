const sequelize = require('../backend/config/database');

async function run() {
  try {
    const [rows] = await sequelize.query('SELECT name, slug, mega_menu FROM categories');
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
