const sequelize = require('./config/database');

async function findVarying6() {
  try {
    const [results] = await sequelize.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND data_type = 'character varying' 
        AND character_maximum_length = 6
    `);
    
    console.log('\n--- COLUMNS WITH LENGTH 6 ---');
    console.log(JSON.stringify(results, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error('Error finding columns:', err);
    process.exit(1);
  }
}

findVarying6();
