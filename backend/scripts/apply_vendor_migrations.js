const sequelize = require('../config/database');

async function applyMigrations() {
  console.log('--- STARTING VENDOR MIGRATIONS ---');
  try {
    // 1. Add columns to deals
    console.log('Adding columns to deals...');
    await sequelize.query(`ALTER TABLE deals ADD COLUMN IF NOT EXISTS is_contacted BOOLEAN DEFAULT FALSE;`);
    await sequelize.query(`ALTER TABLE deals ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;`);
    await sequelize.query(`ALTER TABLE deals ADD COLUMN IF NOT EXISTS active_until TIMESTAMP WITH TIME ZONE;`);

    // 2. Add columns to users
    console.log('Adding columns to users...');
    await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS extra_slots_purchased INTEGER DEFAULT 0;`);
    await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_plan_expires_at TIMESTAMP WITH TIME ZONE;`);

    // 3. Update deals.plan_type ENUM to add 'premium'
    console.log('Adding premium to enum_deals_plan_type...');
    try {
      await sequelize.query(`ALTER TYPE "enum_deals_plan_type" ADD VALUE IF NOT EXISTS 'premium';`);
    } catch (e) {
      console.log('Enum deals.plan_type "premium" already exists or DB dialect issue:', e.message);
    }
    
    // 4. Update users.subscription_plan ENUM to add 'premium'
    console.log('Adding premium to enum_users_subscription_plan...');
    try {
      await sequelize.query(`ALTER TYPE "enum_users_subscription_plan" ADD VALUE IF NOT EXISTS 'premium';`);
    } catch (e) {
      console.log('Enum users.subscription_plan "premium" already exists or DB dialect issue:', e.message);
    }

    console.log('--- MIGRATIONS COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (err) {
    console.error('--- MIGRATION FAILED ---');
    console.error(err);
    process.exit(1);
  }
}

applyMigrations();
