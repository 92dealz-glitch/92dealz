/**
 * Full database sync script
 * Imports ALL models before syncing to ensure every table is created
 * in the Neon PostgreSQL database.
 */
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const sequelize = require('../config/database');

// Import ALL models so Sequelize knows about them
require('../models/userModel');
require('../models/Deal');
require('../models/Category');
require('../models/Store');
require('../models/Favorite');
require('../models/PasswordReset');
require('../models/Alert');
require('../models/ClickEvent');
require('../models/Submission');
require('../models/PendingRegistration');
require('../models/Message');
require('../models/Order');
require('../models/Notification');
require('../models/Review');
require('../models/Report');
require('../models/Visitor');
require('../models/Payment');

async function fullSync() {
  console.log('=== FULL DATABASE SYNC STARTING ===');
  console.log(`Dialect: ${sequelize.options.dialect}`);
  console.log(`Database: ${sequelize.config.database}`);
  console.log(`Host: ${sequelize.config.host}`);
  console.log('');

  try {
    // 1. Test connection
    await sequelize.authenticate();
    console.log('✅ Connection established successfully.\n');

    // 2. Sync all models (alter: true adds missing columns/tables without dropping)
    console.log('Syncing all models with { alter: true }...');
    await sequelize.sync({ alter: true });
    console.log('✅ All models synchronized successfully.\n');

    // 3. List all tables created
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log(`📋 Tables in database (${tables.length}):`);
    tables.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.table_name}`);
    });

    console.log('\n=== FULL DATABASE SYNC COMPLETED SUCCESSFULLY ===');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    process.exit(1);
  }
}

fullSync();
