const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'backend', 'config', 'database'));

async function testQuery() {
  try {
    console.log('Testing recentDeals...');
    // This uses d."userId" and d."updatedAt"
    await sequelize.query(
      `SELECT d.id, d.title, d.status, d.price, d."updatedAt", u.name as merchant,
              (SELECT COUNT(*)::INT FROM click_events ce WHERE ce.deal_id = d.id AND ce.type='view') as views
       FROM deals d
       LEFT JOIN users u ON u.id = d."userId"
       ORDER BY d."createdAt" DESC
       LIMIT 5`
    );
    
    console.log('recentDeals passed!');
    process.exit(0);
  } catch (err) {
    console.error('Query failed:', err.message);
    process.exit(1);
  }
}

testQuery();
