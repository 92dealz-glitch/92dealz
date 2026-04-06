const sequelize = require('../backend/config/database');
const { QueryTypes } = require('sequelize');

async function migrate() {
  try {
    console.log('Starting migration...');

    // Add columns to deals table
    await sequelize.query(`
      ALTER TABLE deals 
      ADD COLUMN IF NOT EXISTS "originalPrice" FLOAT,
      ADD COLUMN IF NOT EXISTS "originalCurrency" VARCHAR(10) DEFAULT 'NGN';
    `);
    console.log('Added originalPrice and originalCurrency to deals table.');

    // Add column to users table
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "currencyPreference" VARCHAR(10) DEFAULT 'USD';
    `);
    console.log('Added currencyPreference to users table.');

    // Populate originalPrice with current price for existing records
    await sequelize.query(`
      UPDATE deals SET "originalPrice" = price WHERE "originalPrice" IS NULL;
    `);
    console.log('Populated originalPrice for existing deals.');

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
