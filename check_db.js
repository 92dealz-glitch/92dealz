const sequelize = require('./backend/config/database');

async function check() {
  try {
    const [cats] = await sequelize.query('SELECT id, name, slug FROM categories LIMIT 10');
    console.log('Categories:', cats);

    const [deals] = await sequelize.query('SELECT count(*) as total, category_id FROM deals GROUP BY category_id');
    console.log('Deals by Category:', deals);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
