const sequelize = require('../backend/config/database');

const megaMenus = {
  "Properties": {
    columns: [
      { heading: "Residential", items: ["Apartments", "Houses", "Lands", "Rooms"] },
      { heading: "Commercial", items: ["Offices", "Shops", "Warehouses", "Event Centers"] },
      { heading: "Short Let", items: ["Apartments", "Hotels", "Guest Houses"] }
    ]
  },
  "Furniture & appliances": {
    columns: [
      { heading: "Living Room", items: ["Sofas", "TV Units", "Chairs"] },
      { heading: "Kitchen", items: ["Fridges", "Microwaves", "Gas Cookers"] },
      { heading: "Bedroom", items: ["Beds", "Wardrobes", "Mattresses"] }
    ]
  },
  "Agriculture & food": {
    columns: [
      { heading: "Farm Produce", items: ["Fruit", "Vegetables", "Grains", "Livestock"] },
      { heading: "Equipment", items: ["Tractors", "Irrigation", "Trailers"] },
      { heading: "Feeds", items: ["Poultry Feed", "Fish Feed", "Cattle Feed"] }
    ]
  },
  "Repair and construction": {
    columns: [
      { heading: "Materials", items: ["Cement", "Bricks", "Tiles", "Roofing"] },
      { heading: "Tools", items: ["Power Tools", "Hand Tools", "Safety Gear"] },
      { heading: "Services", items: ["Plumbing", "Electrical", "Carpentry"] }
    ]
  },
  "Pets and animals": {
    columns: [
      { heading: "Pets", items: ["Dogs", "Cats", "Birds", "Fish"] },
      { heading: "Supplies", items: ["Pet Food", "Cages", "Grooming Kits"] }
    ]
  },
  "Babies & kids": {
    columns: [
      { heading: "Clothing", items: ["Baby Wear", "Boys Clothing", "Girls Clothing"] },
      { heading: "Essentials", items: ["Diapers", "Baby Food", "Feeding Bottles"] },
      { heading: "Toys", items: ["Educational", "Dolls", "Action Figures"] }
    ]
  },
  "Vehicle": {
    columns: [
      { heading: "Cars", items: ["Toyota", "Honda", "Mercedes-Benz", "Lexus"] },
      { heading: "Other", items: ["Buses", "Motorcycles", "Trucks", "Car Parts"] }
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
