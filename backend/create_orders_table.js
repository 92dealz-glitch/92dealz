const sequelize = require('./config/database');

async function createOrdersTable() {
  console.log("Creating orders table...");
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGSERIAL PRIMARY KEY,
        buyer_id INTEGER NOT NULL,
        vendor_id INTEGER NOT NULL,
        deal_id INTEGER NOT NULL,
        price FLOAT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        buyer_notes TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);
    console.log("Orders table created successfully.");
  } catch (err) {
    console.error("Failed to create orders table:", err);
  } finally {
    process.exit(0);
  }
}

createOrdersTable();
