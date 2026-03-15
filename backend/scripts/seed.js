const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const sequelize = require('../config/database');
const Category = require('../models/Category');
const Store = require('../models/Store');
const User = require('../models/userModel');
const Deal = require('../models/Deal');

async function main() {
  await sequelize.authenticate();

  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home', slug: 'home' },
    { name: 'Beauty', slug: 'beauty' },
    { name: 'Groceries', slug: 'groceries' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Gaming', slug: 'gaming' },
  ];

  for (const c of categories) {
    await Category.findOrCreate({ where: { slug: c.slug }, defaults: c });
  }

  const stores = [
    { name: 'MegaMart', logo: null, website_url: 'https://megamart.local' },
    { name: 'GizmoHub', logo: null, website_url: 'https://gizmohub.local' },
    { name: 'QuickBuy', logo: null, website_url: 'https://quickbuy.local' },
    { name: 'StyleStreet', logo: null, website_url: 'https://stylestreet.local' },
  ];

  for (const s of stores) {
    await Store.findOrCreate({ where: { name: s.name }, defaults: s });
  }

  const user = await User.findOne({ where: { email: 'testuser@example.com' } });
  if (user) {
    const existing = await Deal.findOne({ where: { title: 'Sample Deal' } });
    if (!existing) {
      await Deal.create({
        title: 'Sample Deal',
        description: 'Seeded sample deal for testing',
        price: 99.99,
        userId: user.id,
      });
    }
  }

  await sequelize.close();
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
