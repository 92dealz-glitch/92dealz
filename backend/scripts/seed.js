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
    {
      name: 'Fashion',
      slug: 'fashion',
      icon: '/assets/images/dress.svg',
      mega_menu: {
        columns: [
          { heading: "WOMAN'S FASHION", items: ["Clothing", "Shoes", "Accessories", "Maternity", "Dresses", "Traditional", "Jewelry", "Handbags & Wallets", "Beach & Swimwear"] },
          { heading: "MEN'S FASHION", items: ["Clothing", "Shoes", "Accessories", "Underwear & Sleepwear", "Traditional & Cultural Wear", "T-Shirts", "Polo Shirts", "Trousers & Chinos", "Sneakers"] },
          { heading: "KID'S FASHION", items: ["Boy's Fashion", "Girl's Fashion"] },
          { heading: "WATCHES", items: ["Men's Watches", "Women's Watches"] },
          { heading: "SUNGLASSES", items: ["Men's Sunglasses", "Women's Sunglasses"] },
        ]
      }
    },
    {
      name: 'Phones & tablets',
      slug: 'phones',
      icon: '/assets/images/phone.svg',
      mega_menu: {
        columns: [
          { heading: "MOBILE PHONES", items: ["Smartphones", "Android Phones", "iPhones", "Cordless Telephones", "Dual Sim Phones", "Basic Phones", "Refurbished Phones", "Rugged Phones"] },
          { heading: "TABLETS", items: ["iPads", "Android Tablets", "Educational Tablets", "Tablet Accessories", "Microsoft Tablets"] },
          { heading: "MOBILE ACCESSORIES", items: ["Adapters", "Batteries", "Bluetooth Headsets", "Chargers", "Selfie Sticks & Tripods", "Power Banks", "Screen Protectors", "Phone Camera Lenses", "Earphones & Headset"] },
          { heading: "TOP SMARTPHONES", items: ["iPhone 15 & 15 Pro Max", "Samsung Galaxy S24 & S24 Ultra", "Xiaomi Redmi 13c", "Itel A70", "Tecno Pop 8", "Infinix Smart 8", "Tecno Spark 20 & 20 Pro", "Itel S23 & S23 Plus"] },
          { heading: "TOP PHONE BRANDS", items: ["Samsung", "Apple", "Xiaomi", "Tecno"] },
        ]
      }
    },
    {
      name: 'Computer & accessories',
      slug: 'computer',
      icon: '/assets/images/laptop.svg',
      mega_menu: {
        columns: [
          { heading: "LAPTOPS", items: ["Windows Laptops", "MacBooks", "Chromebooks"] },
          { heading: "DESKTOPS", items: ["All-in-one", "Towers", "Gaming PCs"] },
          { heading: "ACCESSORIES", items: ["Monitors", "Keyboards", "Mice", "Routers", "Storage"] },
        ]
      }
    },
    {
      name: 'Vehicle',
      slug: 'vehicle',
      icon: '/assets/images/car.svg',
      mega_menu: { columns: [] }
    },
    {
      name: 'Properties',
      slug: 'properties',
      icon: '/assets/images/house.svg',
      mega_menu: { columns: [] }
    },
    {
      name: 'Health & beauty',
      slug: 'health',
      icon: '/assets/images/woman.svg',
      mega_menu: {
        columns: [
          { heading: "BEAUTY", items: ["Makeup", "Skincare", "Fragrances"] },
          { heading: "HEALTH", items: ["Supplements", "Medical Supplies", "Wellness"] },
        ]
      }
    },
    {
      name: 'Furniture & appliances',
      slug: 'furniture',
      icon: '/assets/images/furniture.svg',
      mega_menu: { columns: [] }
    },
    {
      name: 'Babies & kids',
      slug: 'babies',
      icon: '/assets/images/girl.svg',
      mega_menu: { columns: [] }
    },
    {
      name: 'Agriculture & food',
      slug: 'agriculture',
      icon: '/assets/images/foodbaasket.svg',
      mega_menu: { columns: [] }
    },
    {
      name: 'Services',
      slug: 'services',
      icon: '/assets/images/engineer.svg',
      mega_menu: { columns: [] }
    },
    {
      name: 'Electronics',
      slug: 'electronics',
      icon: '/assets/images/tv.svg',
      mega_menu: {
        columns: [
          { heading: "TV & HOME THEATER", items: ["LED TVs", "Smart TVs", "Projectors"] },
          { heading: "AUDIO", items: ["Speakers", "Headphones", "Home Audio"] },
        ]
      }
    },
    {
      name: 'Commercial equipment',
      slug: 'commercial',
      icon: '/assets/images/equipment.svg',
      mega_menu: { columns: [] }
    },
    {
      name: 'Repair and construction',
      slug: 'repair',
      icon: '/assets/images/equipmentbaket.svg',
      mega_menu: { columns: [] }
    },
    {
      name: 'Pets and animals',
      slug: 'pets',
      icon: '/assets/images/pet.svg',
      mega_menu: { columns: [] }
    }
  ];

  for (const c of categories) {
    await Category.upsert({
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      mega_menu: c.mega_menu
    });
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
