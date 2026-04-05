const sequelize = require('./config/database');

/**
 * Manually forces the OTP column to be resized from VARCHAR(6) to VARCHAR(255)
 * in the live Postgres database. This is a safety measure if 'alter: true' fails.
 */
async function forceSchemaFix() {
  console.log('--- STARTING PRODUCTION SCHEMA FIX (OTP RESIZE) ---');
  try {
    // 1. Check if the columns exist first to avoid crashing
    const [cols] = await sequelize.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name IN ('password_resets', 'pending_registrations')
        AND column_name = 'otp'
    `);
    
    if (cols.length === 0) {
      console.log('No OTP columns found to fix matching targets.');
      return;
    }

    // 2. Force the resize to VARCHAR(255)
    for (const col of cols) {
      console.log(`Fixing column: ${col.table_name}.${col.column_name} (Current: ${col.data_type})`);
      await sequelize.query(`
        ALTER TABLE ${col.table_name} 
        ALTER COLUMN ${col.column_name} TYPE VARCHAR(255);
      `);
      console.log(`Successfully resized ${col.table_name}.${col.column_name} to VARCHAR(255)`);
    }

    console.log('--- SCHEMA FIX COMPLETED SUCCESSFULLY ---');

    // 3. Force ENUM role update
    try {
      await sequelize.query(`ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'csr';`);
      console.log('Successfully added csr to enum_users_role');
    } catch (enumErr) {
      console.log('Enum csr addition skipped or already exists:', enumErr.message);
    }
  } catch (err) {
    console.error('--- SCHEMA FIX FAILED ---');
    console.error(err);
    // We don't crash the server if this fails, just log it.
  }
}

module.exports = forceSchemaFix;
