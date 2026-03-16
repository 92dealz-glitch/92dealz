const sequelize = require('../config/database');
const User = require('../models/User');

async function resetRoles() {
  try {
    console.log('Starting mass role reset (cleaning up accidental admins)...');
    
    const primaryAdminEmail = 'aliofficial.busi@gmail.com';
    
    // Reset all users who are NOT the primary admin and NOT vendors (if we want to keep vendors)
    // Actually, the safest is to reset everyone who is NOT the primary admin to 'user', 
    // but vendors might have been set correctly.
    // Let's just reset anyone with role 'admin' who IS NOT our primary admin.
    
    const [updatedCount] = await User.update(
      { role: 'user' },
      {
        where: {
          role: 'admin',
          email: { [require('sequelize').Op.ne]: primaryAdminEmail }
        }
      }
    );
    
    console.log(`Reset complete. ${updatedCount} user(s) had their admin role removed.`);
    process.exit(0);
  } catch (err) {
    console.error('Reset failed:', err);
    process.exit(1);
  }
}

resetRoles();
