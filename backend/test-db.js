const sequelize = require('./config/database');
console.log('Attempting to connect to database...');
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });
