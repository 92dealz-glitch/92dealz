const sequelize = require('../config/database');
const User = require('../models/User');

async function cleanup() {
  try {
    console.log('Starting admin cleanup...');
    
    // We want to remove any user with role 'admin' OR the old admin email
    // to ensure no leftover records conflict with the new override logic.
    const oldAdminEmail = '234dealss@gmail.com';
    
    const deletedCount = await User.destroy({
      where: {
        [require('sequelize').Op.or]: [
          { role: 'admin' },
          { email: oldAdminEmail }
        ]
      }
    });
    
    console.log(`Cleanup complete. Removed ${deletedCount} user(s).`);
    process.exit(0);
  } catch (err) {
    console.error('Cleanup failed:', err);
    process.exit(1);
  }
}

cleanup();
