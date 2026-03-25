const sequelize = require('../backend/config/database');

const megaMenus = {
  "Health & beauty": {
    columns: [
      { heading: "Skin Care", items: ["Body Creams", "Face Serums", "Sunscreen", "Cleansers"] },
      { heading: "Hair Care", items: ["Shampoos", "Conditioners", "Hair Oils", "Wigs & Weaves"] },
      { heading: "Makeup", items: ["Foundations", "Lipsticks", "Eye Palettes", "Makeup Tools"] },
      { heading: "Fragrances", items: ["Men's Perfumes", "Women's Perfumes", "Unisex Scents"] }
    ]
  },
  "Home, Furniture & Appliances": {
    columns: [
      { heading: "Living Room", items: ["Sofas", "Coffee Tables", "TV Stands", "Armchairs"] },
      { heading: "Bedroom", items: ["Beds", "Mattresses", "Wardrobes", "Nightstands"] },
      { heading: "Kitchen & Dining", items: ["Dining Sets", "Cookware", "Kitchen Utensils", "Appliances"] },
      { heading: "Decor", items: ["Lighting", "Rugs", "Wall Art", "Curtains"] }
    ]
  },
  "Jobs": {
    columns: [
      { heading: "Industry", items: ["IT & Software", "Marketing", "Healthcare", "Accounting"] },
      { heading: "Type", items: ["Full-time", "Part-time", "Contract", "Remote"] },
      { heading: "Experience", items: ["Entry Level", "Mid Level", "Senior", "Executive"] }
    ]
  },
  "Services": {
    columns: [
      { heading: "Home Services", items: ["Cleaning", "Plumbing", "Electrical", "Painting"] },
      { heading: "Business", items: ["Consultivity", "Legal", "Design", "Marketing"] },
      { heading: "Personal", items: ["Tutors", "Personal Trainers", "Event Planning"] }
    ]
  },
  "Commercial Equipment & Tools": {
    columns: [
      { heading: "Industrial", items: ["Heavy Machinery", "Manufacturing", "Power Tools"] },
      { heading: "Office", items: ["Office Furniture", "Printers", "Stationery"] },
      { heading: "Trade", items: ["Construction", "Woodworking", "Metalworking"] }
    ]
  }
};

async function run() {
  try {
    for (const [name, menu] of Object.entries(megaMenus)) {
      await sequelize.query(
        'UPDATE categories SET mega_menu = :menu WHERE name = :name',
        { replacements: { menu: JSON.stringify(menu), name } }
      );
      console.log(`Updated mega menu for ${name}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
