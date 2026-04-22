const sequelize = require('../config/database');

async function createPaymentsTable() {
  console.log('--- FORCING PAYMENTS TABLE CREATION ---');
  try {
    await sequelize.authenticate();
    
    // Raw SQL to create the table if it doesn't exist
    // This bypasses mass ALTER churn on other tables
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "payments" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "planId" VARCHAR(255) NOT NULL,
        "amount" INTEGER NOT NULL,
        "currency" VARCHAR(255) NOT NULL,
        "reference" VARCHAR(255) NOT NULL UNIQUE,
        "status" VARCHAR(255) NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);
    
    console.log('Table "payments" checked/created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to create payments table:', error);
    process.exit(1);
  }
}

createPaymentsTable();
