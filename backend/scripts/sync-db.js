const sequelize = require('../config/database');
const User = require('../models/userModel');
const Payment = require('../models/Payment');

async function sync() {
  console.log('--- STARTING MANUAL DATABASE SYNC ---');
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const isSqlite = sequelize.options.dialect === 'sqlite';
    await sequelize.sync({ alter: !isSqlite });
    console.log('All models were synchronized successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

sync();
