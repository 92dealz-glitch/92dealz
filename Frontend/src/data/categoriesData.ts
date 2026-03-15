export type Column = {
  heading: string;
  items: string[];
};

export type CategoryData = {
  title: string;
  columns: Column[];
};

const categories: Record<string, CategoryData> = {
  fashion: {
    title: "Fashion",
    columns: [
      { heading: "WOMAN'S FASHION", items: ["Clothing", "Shoes", "Accessories", "Maternity", "Dresses", "Traditional", "Jewelry", "Handbags & Wallets", "Beach & Swimwear"] },
      { heading: "MEN'S FASHION", items: ["Clothing", "Shoes", "Accessories", "Underwear & Sleepwear", "Traditional & Cultural Wear", "T-Shirts", "Polo Shirts", "Trousers & Chinos", "Sneakers"] },
      { heading: "KID'S FASHION", items: ["Boy's Fashion", "Girl's Fashion"] },
      { heading: "WATCHES", items: ["Men's Watches", "Women's Watches"] },
      { heading: "SUNGLASSES", items: ["Men's Sunglasses", "Women's Sunglasses"] },
    ],
  },
  phones: {
    title: "Phones & Tablets",
    columns: [
      { heading: "MOBILE PHONES", items: ["Smartphones", "Android Phones", "iPhones", "Cordless Telephones", "Dual Sim Phones", "Basic Phones", "Refurbished Phones", "Rugged Phones"] },
      { heading: "TABLETS", items: ["iPads", "Android Tablets", "Educational Tablets", "Tablet Accessories", "Microsoft Tablets"] },
      { heading: "MOBILE ACCESSORIES", items: ["Adapters", "Batteries", "Bluetooth Headsets", "Chargers", "Selfie Sticks & Tripods", "Power Banks", "Screen Protectors", "Phone Camera Lenses", "Earphones & Headset"] },
      { heading: "TOP SMARTPHONES", items: ["iPhone 15 & 15 Pro Max", "Samsung Galaxy S24 & S24 Ultra", "Xiaomi Redmi 13c", "Itel A70", "Tecno Pop 8", "Infinix Smart 8", "Tecno Spark 20 & 20 Pro", "Itel S23 & S23 Plus"] },
      { heading: "TOP PHONE BRANDS", items: ["Samsung", "Apple", "Xiaomi", "Tecno"] },
    ],
  },
  computer: {
    title: "Computer & Accessories",
    columns: [
      { heading: "LAPTOPS", items: ["Windows Laptops", "MacBooks", "Chromebooks"] },
      { heading: "DESKTOPS", items: ["All-in-one", "Towers", "Gaming PCs"] },
      { heading: "ACCESSORIES", items: ["Monitors", "Keyboards", "Mice", "Routers", "Storage"] },
    ],
  },
  health: {
    title: "Health & Beauty",
    columns: [
      { heading: "BEAUTY", items: ["Makeup", "Skincare", "Fragrances"] },
      { heading: "HEALTH", items: ["Supplements", "Medical Supplies", "Wellness"] },
    ],
  },
  electronics: {
    title: "Electronics",
    columns: [
      { heading: "TV & HOME THEATER", items: ["LED TVs", "Smart TVs", "Projectors"] },
      { heading: "AUDIO", items: ["Speakers", "Headphones", "Home Audio"] },
    ],
  },
};

// Provider functions: return Promises to allow swapping with real API calls later.
export async function getCategories(): Promise<Record<string, CategoryData>> {
  return categories;
}

export async function getCategory(key: string): Promise<CategoryData | undefined> {
  return categories[key];
}

export default categories;
