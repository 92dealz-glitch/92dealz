const sequelize = require('../backend/config/database');

async function run() {
  try {
    const [rows] = await sequelize.query('SELECT name, mega_menu FROM categories');
    const empty = rows.filter(r => !r.mega_menu || !r.mega_menu.columns || r.mega_menu.columns.length === 0);
    console.log("Categories with empty mega menus:");
    empty.forEach(r => console.log(`- ${r.name}`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
