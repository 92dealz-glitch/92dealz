// backend/scripts/check_db.js
// Simple script to verify Neon PostgreSQL connectivity via Sequelize

const sequelize = require('../config/database');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err.message);
    process.exit(1);
  }
})();
