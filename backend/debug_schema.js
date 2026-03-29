const sequelize = require('./config/database');
async function run() {
  try {
    const [cols] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'deals'
    `);
    console.log('DEALS COLUMNS:', JSON.stringify(cols, null, 2));
    
    const [cats] = await sequelize.query(`
      SELECT * FROM categories LIMIT 5
    `);
    console.log('CATEGORIES SAMPLE:', JSON.stringify(cats, null, 2));

    const [deals] = await sequelize.query(`
      SELECT id, title, category_id FROM deals LIMIT 5
    `);
    console.log('DEALS SAMPLE:', JSON.stringify(deals, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
