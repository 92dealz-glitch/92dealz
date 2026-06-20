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
  const isSqlite = sequelize.options.dialect === 'sqlite';
  await sequelize.sync({ alter: !isSqlite });

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
      },
      specifications_template: [
        { label: "Condition", type: "select", options: ["New", "Used - Like New", "Used - Good"] },
        { label: "Brand", type: "text", placeholder: "e.g. Gucci, Nike, Zara" },
        { label: "Color", type: "text", placeholder: "e.g. Black, White, Red" },
        { label: "Size", type: "select", options: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "38", "39", "40", "41", "42", "43", "44", "45"] },
        { label: "Material", type: "text", placeholder: "e.g. Cotton, Leather, Polyester" },
        { label: "Gender", type: "select", options: ["Men", "Women", "Unisex", "Boys", "Girls"] },
        { label: "Style/Occasion", type: "text", placeholder: "e.g. Casual, Formal, Sport" }
      ]
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
      },
      specifications_template: [
        { label: "Condition", type: "select", options: ["New", "Used - Like New", "Used - Good", "Refurbished"] },
        { label: "Brand", type: "text", placeholder: "e.g. Apple, Samsung, Xiaomi" },
        { label: "Model", type: "text", placeholder: "e.g. iPhone 15 Pro, Galaxy S24" },
        { label: "Color", type: "text", placeholder: "e.g. Titanium, Black, Blue" },
        { label: "RAM", type: "select", options: ["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"] },
        { label: "Internal Storage", type: "select", options: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"] },
        { label: "Screen Size (inches)", type: "number", placeholder: "e.g. 6.1" },
        { label: "Battery (mAh)", type: "number", placeholder: "e.g. 5000" },
        { label: "Main Camera (MP)", type: "number", placeholder: "e.g. 48" },
        { label: "Operating System", type: "select", options: ["iOS", "Android", "Windows", "Other"] }
      ]
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
      },
      specifications_template: [
        { label: "Condition", type: "select", options: ["New", "Used - Like New", "Used - Good", "Refurbished"] },
        { label: "Brand", type: "text", placeholder: "e.g. HP, Dell, Apple, Lenovo" },
        { label: "Model", type: "text", placeholder: "e.g. MacBook Pro M3, ThinkPad X1" },
        { label: "Color", type: "text", placeholder: "e.g. Silver, Space Gray" },
        { label: "RAM", type: "select", options: ["4GB", "8GB", "16GB", "32GB", "64GB", "128GB"] },
        { label: "Storage Capacity", type: "text", placeholder: "e.g. 512GB SSD, 1TB HDD" },
        { label: "Processor", type: "text", placeholder: "e.g. Intel Core i7, Apple M2" },
        { label: "Graphics Card", type: "text", placeholder: "e.g. NVIDIA RTX 4060" },
        { label: "Screen Size (inches)", type: "number", placeholder: "e.g. 15.6" },
        { label: "Operating System", type: "select", options: ["Windows", "macOS", "Linux", "ChromeOS", "DOS"] }
      ]
    },
    {
      name: 'Vehicle',
      slug: 'vehicle',
      icon: '/assets/images/car.svg',
      mega_menu: {
        columns: [
          { heading: "Cars", items: ["Toyota", "Honda", "Mercedes-Benz", "Lexus"] },
          { heading: "Other", items: ["Buses", "Motorcycles", "Trucks", "Car Parts"] }
        ]
      },
      specifications_template: [
        { label: "Condition", type: "select", options: ["Brand New", "Foreign Used (Tokunbo)", "Locally Used"] },
        { label: "Make/Brand", type: "text", placeholder: "e.g. Toyota, Honda, Mercedes-Benz" },
        { label: "Model", type: "text", placeholder: "e.g. Camry, Accord, C-Class" },
        { label: "Color", type: "text", placeholder: "e.g. Black, White, Red" },
        { label: "Year of Manufacture", type: "number", placeholder: "e.g. 2022" },
        { label: "Mileage (km)", type: "number", placeholder: "e.g. 45000" },
        { label: "Transmission", type: "select", options: ["Automatic", "Manual", "CVT", "Semi-Auto"] },
        { label: "Fuel Type", type: "select", options: ["Petrol", "Diesel", "Electric", "Hybrid"] },
        { label: "Body Type", type: "select", options: ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Pickup", "Van", "Bus"] },
        { label: "Registered Status", type: "select", options: ["Registered", "Unregistered"] },
        { label: "Engine Size (cc)", type: "number", placeholder: "e.g. 2000" },
        { label: "Number of Seats", type: "select", options: ["2", "4", "5", "7", "8+"] }
      ]
    },
    {
      name: 'Properties',
      slug: 'properties',
      icon: '/assets/images/house.svg',
      mega_menu: {
        columns: [
          { heading: "Residential", items: ["Apartments", "Houses", "Lands", "Rooms"] },
          { heading: "Commercial", items: ["Offices", "Shops", "Warehouses", "Event Centers"] },
          { heading: "Short Let", items: ["Apartments", "Hotels", "Guest Houses"] }
        ]
      },
      specifications_template: [
        { label: "Property Type", type: "select", options: ["House", "Apartment/Flat", "Land", "Commercial Space", "Office", "Warehouse"] },
        { label: "Bedrooms", type: "select", options: ["0 (Studio)", "1", "2", "3", "4", "5", "6+"] },
        { label: "Bathrooms", type: "select", options: ["1", "2", "3", "4", "5+"] },
        { label: "Property Size (sqft/sqm)", type: "text", placeholder: "e.g. 450 sqm" },
        { label: "Furnishing", type: "select", options: ["Furnished", "Semi-Furnished", "Unfurnished"] },
        { label: "Parking Space", type: "select", options: ["Yes", "No"] },
        { label: "Pets Allowed", type: "select", options: ["Yes", "No", "Negotiable"] }
      ]
    },
    {
      name: 'Health & beauty',
      slug: 'health',
      icon: '/assets/images/woman.svg',
      mega_menu: {
        columns: [
          { heading: "Skin Care", items: ["Body Creams", "Face Serums", "Sunscreen", "Cleansers"] },
          { heading: "Hair Care", items: ["Shampoos", "Conditioners", "Hair Oils", "Wigs & Weaves"] },
          { heading: "Makeup", items: ["Foundations", "Lipsticks", "Eye Palettes", "Makeup Tools"] },
          { heading: "Fragrances", items: ["Men's Perfumes", "Women's Perfumes", "Unisex Scents"] }
        ]
      },
      specifications_template: [
        { label: "Brand", type: "text", placeholder: "e.g. L'Oreal, Nivea, MAC" },
        { label: "Skin/Hair Type", type: "select", options: ["All", "Oily", "Dry", "Combination", "Sensitive", "Damaged"] },
        { label: "Formulation", type: "select", options: ["Liquid", "Cream", "Powder", "Gel", "Solid", "Oil", "Serum"] },
        { label: "Target Gender", type: "select", options: ["Women", "Men", "Unisex"] },
        { label: "Volume/Weight", type: "text", placeholder: "e.g. 150ml, 50g" },
        { label: "Expiration Date", type: "text", placeholder: "e.g. MM/YYYY" }
      ]
    },
    {
      name: 'Furniture & appliances',
      slug: 'furniture',
      icon: '/assets/images/furniture.svg',
      mega_menu: {
        columns: [
          { heading: "Living Room", items: ["Sofas", "TV Units", "Chairs"] },
          { heading: "Kitchen", items: ["Fridges", "Microwaves", "Gas Cookers"] },
          { heading: "Bedroom", items: ["Beds", "Wardrobes", "Mattresses"] }
        ]
      },
      specifications_template: [
        { label: "Condition", type: "select", options: ["New", "Used - Like New", "Used - Good", "Refurbished"] },
        { label: "Brand", type: "text", placeholder: "e.g. LG, Samsung, Sony" },
        { label: "Color", type: "text", placeholder: "e.g. Black, White, Silver" },
        { label: "Primary Material", type: "text", placeholder: "e.g. Mahogany Wood, Stainless Steel, Leather" },
        { label: "Room Type", type: "select", options: ["Living Room", "Bedroom", "Kitchen", "Dining", "Office", "Outdoor/Patio"] },
        { label: "Dimensions (L x W x H)", type: "text", placeholder: "e.g. 200 x 150 x 80 cm" },
        { label: "Power Rating (Watts)", type: "text", placeholder: "e.g. 1500W (for appliances)" }
      ]
    },
    {
      name: 'Babies & kids',
      slug: 'babies',
      icon: '/assets/images/girl.svg',
      mega_menu: {
        columns: [
          { heading: "Clothing", items: ["Baby Wear", "Boys Clothing", "Girls Clothing"] },
          { heading: "Essentials", items: ["Diapers", "Baby Food", "Feeding Bottles"] },
          { heading: "Toys", items: ["Educational", "Dolls", "Action Figures"] }
        ]
      },
      specifications_template: [
        { label: "Condition", type: "select", options: ["New", "Used - Like New", "Used - Good"] },
        { label: "Brand", type: "text", placeholder: "e.g. Mothercare, Pampers" },
        { label: "Age Range", type: "select", options: ["0-6 Months", "6-12 Months", "1-3 Years", "4-7 Years", "8-12 Years", "13+ Years"] },
        { label: "Gender", type: "select", options: ["Boy", "Girl", "Unisex"] },
        { label: "Material/Fabric", type: "text", placeholder: "e.g. 100% Cotton, BPA-Free Plastic" }
      ]
    },
    {
      name: 'Agriculture & food',
      slug: 'agriculture',
      icon: '/assets/images/foodbaasket.svg',
      mega_menu: {
        columns: [
          { heading: "Farm Produce", items: ["Fruit", "Vegetables", "Grains", "Livestock"] },
          { heading: "Equipment", items: ["Tractors", "Irrigation", "Trailers"] },
          { heading: "Feeds", items: ["Poultry Feed", "Fish Feed", "Cattle Feed"] }
        ]
      },
      specifications_template: [
        { label: "Category Type", type: "select", options: ["Crops & Seeds", "Livestock & Poultry", "Farm Machinery", "Feeds & Supplements", "Fertilizers/Chemicals", "Processed Food"] },
        { label: "Quantity/Weight", type: "text", placeholder: "e.g. 50 kg, 100 birds, 1 Ton" },
        { label: "Packaging Type", type: "select", options: ["Bag", "Carton", "Bulk", "Pcs", "Bottle", "Can", "Crate"] },
        { label: "Organic/Non-Organic", type: "select", options: ["Organic", "Non-Organic", "N/A"] },
        { label: "Shelf Life", type: "text", placeholder: "e.g. 6 Months, Fresh" }
      ]
    },
    {
      name: 'Services',
      slug: 'services',
      icon: '/assets/images/engineer.svg',
      mega_menu: {
        columns: [
          { heading: "Home Services", items: ["Cleaning", "Plumbing", "Electrical", "Painting"] },
          { heading: "Business", items: ["Consultivity", "Legal", "Design", "Marketing"] },
          { heading: "Personal", items: ["Tutors", "Personal Trainers", "Event Planning"] }
        ]
      },
      specifications_template: [
        { label: "Service Area", type: "select", options: ["Consulting", "Cleaning", "Catering", "Event Planning", "Digital/IT Services", "Educational/Tutors", "Legal", "Handyman/Repairs", "Beauty/Spa"] },
        { label: "Delivery Format", type: "select", options: ["Remote/Online", "On-site/In-person", "Hybrid"] },
        { label: "Estimated Duration", type: "text", placeholder: "e.g. 1 Hour, 1 Day, Project Based" },
        { label: "Availability", type: "select", options: ["Weekdays", "Weekends", "24/7", "By Appointment Only"] }
      ]
    },
    {
      name: 'Electronics',
      slug: 'electronics',
      icon: '/assets/images/tv.svg',
      mega_menu: {
        columns: [
          { heading: "TV & HOME THEATER", items: ["LED TVs", "Smart TVs", "Projectors"] },
          { heading: "AUDIO", items: ["Speakers", "Headphones", "Home Audio"] }
        ]
      },
      specifications_template: [
        { label: "Condition", type: "select", options: ["New", "Used - Like New", "Used - Good", "Refurbished"] },
        { label: "Brand", type: "text", placeholder: "e.g. Sony, LG, JBL" },
        { label: "Model", type: "text", placeholder: "e.g. Bravia, X Boom" },
        { label: "Color", type: "text", placeholder: "e.g. Black, Silver" },
        { label: "Warranty Period", type: "select", options: ["No Warranty", "3 Months", "6 Months", "1 Year", "2 Years+"] },
        { label: "Connectivity", type: "text", placeholder: "e.g. Bluetooth, Wi-Fi, HDMI, USB" },
        { label: "Screen/Driver Size", type: "text", placeholder: "e.g. 55 inches, 40mm driver" },
        { label: "Power Configuration", type: "text", placeholder: "e.g. Rechargeable, AC Powered, Battery" }
      ]
    },
    {
      name: 'Commercial equipment',
      slug: 'commercial',
      icon: '/assets/images/equipment.svg',
      mega_menu: {
        columns: [
          { heading: "Industrial", items: ["Heavy Machinery", "Manufacturing", "Power Tools"] },
          { heading: "Office", items: ["Office Furniture", "Printers", "Stationery"] },
          { heading: "Trade", items: ["Construction", "Woodworking", "Metalworking"] }
        ]
      },
      specifications_template: [
        { label: "Condition", type: "select", options: ["New", "Used - Like New", "Used - Good", "Refurbished"] },
        { label: "Brand", type: "text", placeholder: "e.g. Caterpillar, Mikano, Siemens" },
        { label: "Industry Focus", type: "select", options: ["Restaurant/Catering", "Medical/Clinical", "Heavy Manufacturing", "Office", "Retail/POS", "Logistics"] },
        { label: "Power Source", type: "select", options: ["Electric", "Gas", "Diesel", "Solar", "Manual"] },
        { label: "Year Manufactured", type: "number", placeholder: "e.g. 2018" },
        { label: "Operating Capacity", type: "text", placeholder: "e.g. 500 liters/hr, 2 Tons" }
      ]
    },
    {
      name: 'Repair and construction',
      slug: 'repair',
      icon: '/assets/images/equipmentbaket.svg',
      mega_menu: {
        columns: [
          { heading: "Materials", items: ["Cement", "Bricks", "Tiles", "Roofing"] },
          { heading: "Tools", items: ["Power Tools", "Hand Tools", "Safety Gear"] },
          { heading: "Services", items: ["Plumbing", "Electrical", "Carpentry"] }
        ]
      },
      specifications_template: [
        { label: "Condition", type: "select", options: ["New", "Used", "Refurbished"] },
        { label: "Brand", type: "text", placeholder: "e.g. Bosch, Makita" },
        { label: "Item Classification", type: "select", options: ["Power Tools", "Hand Tools", "Building Materials", "Safety Gear (PPE)", "Electrical", "Plumbing", "Paints/Finishes"] },
        { label: "Material Composition", type: "text", placeholder: "e.g. Stainless Steel, PVC, Cement" },
        { label: "Voltage/Power Spec", type: "text", placeholder: "e.g. 220V, 1500W, N/A" }
      ]
    },
    {
      name: 'Pets and animals',
      slug: 'pets',
      icon: '/assets/images/pet.svg',
      mega_menu: {
        columns: [
          { heading: "Pets", items: ["Dogs", "Cats", "Birds", "Fish"] },
          { heading: "Supplies", items: ["Pet Food", "Cages", "Grooming Kits"] }
        ]
      },
      specifications_template: [
        { label: "Animal Category", type: "select", options: ["Dogs", "Cats", "Birds", "Fish", "Reptiles", "Farm Animals/Livestock"] },
        { label: "Breed/Species", type: "text", placeholder: "e.g. German Shepherd, Persian Cat" },
        { label: "Age", type: "text", placeholder: "e.g. 2 Months, 3 Years" },
        { label: "Color", type: "text", placeholder: "e.g. Brown, White, Bi-Color" },
        { label: "Gender", type: "select", options: ["Male", "Female", "Unknown"] },
        { label: "Vaccination Status", type: "select", options: ["Fully Vaccinated", "Partially Vaccinated", "Not Vaccinated"] }
      ]
    }
  ];

  for (const c of categories) {
    await Category.upsert({
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      mega_menu: c.mega_menu,
      specifications_template: c.specifications_template
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
