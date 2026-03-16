require('dotenv').config({ path: __dirname + '/../.env' });
const { Sequelize } = require('sequelize');

async function checkAdmin() {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL found.");
    process.exit(1);
  }
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
  });

  try {
    const [results] = await sequelize.query(`SELECT id, email, role, status FROM "users" WHERE email = 'aliofficial.busi@gmail.com'`);
    console.log("Admin DB Record:", results);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    process.exit(0);
  }
}

checkAdmin();
