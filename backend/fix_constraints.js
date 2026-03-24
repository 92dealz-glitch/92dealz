const sequelize = require('./config/database');

async function fixConstraints() {
  try {
    console.log('Starting constraint fix...');
    
    // List of tables and their foreign keys to Users that need CASCADE
    const associations = [
      { table: 'reviews', column: 'vendor_id', constraint: 'reviews_vendor_id_fkey' },
      { table: 'reviews', column: 'reviewer_id', constraint: 'reviews_reviewer_id_fkey' },
      { table: 'orders', column: 'buyer_id', constraint: 'orders_buyer_id_fkey' },
      { table: 'orders', column: 'vendor_id', constraint: 'orders_vendor_id_fkey' },
      { table: 'reports', column: 'reporter_id', constraint: 'reports_reporter_id_fkey' },
      { table: 'reports', column: 'vendor_id', constraint: 'reports_vendor_id_fkey' },
      { table: 'messages', column: 'from_user_id', constraint: 'messages_from_user_id_fkey' },
      { table: 'messages', column: 'to_user_id', constraint: 'messages_to_user_id_fkey' },
      { table: 'notifications', column: 'user_id', constraint: 'notifications_user_id_fkey' },
      { table: 'alerts', column: 'user_id', constraint: 'alerts_user_id_fkey' },
      { table: 'favorites', column: 'user_id', constraint: 'favorites_user_id_fkey' }
    ];

    for (const assoc of associations) {
      try {
        console.log(`Fixing ${assoc.table}.${assoc.column}...`);
        // Drop existing constraint (using IF EXISTS if possible, or just catch error)
        await sequelize.query(`ALTER TABLE "${assoc.table}" DROP CONSTRAINT IF EXISTS "${assoc.constraint}";`);
        // Add new constraint with ON DELETE CASCADE
        await sequelize.query(`
          ALTER TABLE "${assoc.table}" 
          ADD CONSTRAINT "${assoc.constraint}" 
          FOREIGN KEY ("${assoc.column}") 
          REFERENCES "users" ("id") 
          ON DELETE CASCADE;
        `);
      } catch (err) {
        console.warn(`Could not fix ${assoc.table}.${assoc.column}: ${err.message}`);
      }
    }

    console.log('Constraint fix completed.');
    process.exit(0);
  } catch (err) {
    console.error('Fatal error fixing constraints:', err);
    process.exit(1);
  }
}

fixConstraints();
