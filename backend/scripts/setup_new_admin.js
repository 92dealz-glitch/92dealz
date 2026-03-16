const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const User = require('../models/User');

async function setup() {
  try {
    console.log('Starting setup of new database admin...');
    
    const adminEmail = 'aliofficial.busi@gmail.com';
    const adminPass = 'testing12345';
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(adminPass, salt);
    
    // 1. Ensure no other users have old hardcoded emails or roles that might conflict
    console.log('Cleaning up old roles...');
    await User.update({ role: 'user' }, {
      where: {
        email: '234dealss@gmail.com'
      }
    });

    // 2. Create or Update the new admin
    console.log(`Configuring ${adminEmail}...`);
    const [user, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        name: 'Super Admin',
        email: adminEmail,
        password: hashed,
        role: 'admin'
      }
    });
    
    if (!created) {
      console.log('User already exists, updating role and password...');
      user.role = 'admin';
      user.password = hashed;
      await user.save();
    }
    
    console.log('Admin setup complete.');
    process.exit(0);
  } catch (err) {
    console.error('Setup failed:', err);
    process.exit(1);
  }
}

setup();
