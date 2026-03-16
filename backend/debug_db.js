const sequelize = require('./config/database');
async function run() {
  try {
    const [cols] = await sequelize.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema='public' AND table_name='deals'`
    );
    console.log('DEALS COLUMNS:', cols.map(c => c.column_name));
    
    const [clickCols] = await sequelize.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema='public' AND table_name='click_events'`
    );
    console.log('CLICK_EVENTS COLUMNS:', clickCols.map(c => c.column_name));
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}
run();
