import type { AdItem } from "../components/ui/AdCard";

const items: (AdItem & { category: string })[] = [
  {
    id: "1",
    price: "₦ 117,000",
    priceRaw: 117000,
    title: "Air Conditioner",
    brand: "lg",
    desc: "Selling brand new, in-the-box split unit air conditioners from leading brands Hisense and LG.",
    badge: "/images/litsingimage.svg",
    location: "Lagos, Ojo",
    likes: 14,
    rating: 4,
    condition: "Brand New",
    category: "phones",
  },
  {
    id: "2",
    price: "₦ 317,000",
    priceRaw: 317000,
    title: "Iphone 12",
    brand: "apple",
    desc: "This iPhone 12 is in excellent condition with a smooth, responsive screen and strong battery life.",
    badge: "/images/marketplace.png",
    location: "Delta, Warri",
    likes: 14,
    rating: 5,
    condition: "Foreign Used",
    category: "phones",
  },
  {
    id: "3",
    price: "₦ 17,000",
    priceRaw: 17000,
    title: "Sneakers",
    brand: "nike",
    desc: "Selling brand new, Sneakers Size 30",
    badge: "/images/marketplace.png",
    location: "Lagos, Ojo",
    likes: 20,
    rating: 5,
    condition: "Brand New",
    category: "fashion",
  },
  {
    id: "4",
    price: "₦ 317,000",
    priceRaw: 317000,
    title: "Sumec Firman",
    brand: "firman",
    desc: "Sumec Firman SF1980 is a cost effective generator for your home or small business.",
    badge: "/images/marketplace.png",
    location: "Delta, Warri",
    likes: 14,
    rating: 3,
    condition: "Nigeria Used",
    category: "electronics",
  },
  {
    id: "5",
    price: "₦ 5,817,000",
    priceRaw: 5817000,
    title: "Chevrolet",
    brand: "chevrolet",
    desc: "This Chevrolet is in excellent working condition with a strong engine, smooth gear selection.",
    badge: "/images/marketplace.png",
    location: "Delta, Warri",
    likes: 40,
    rating: 4,
    condition: "Used",
    category: "phones",
  },
  // duplicate some items to increase grid count
  {
    id: "6",
    price: "₦ 17,000",
    priceRaw: 17000,
    title: "Sneakers",
    brand: "adidas",
    desc: "Selling brand new, Sneakers Size 30",
    badge: "/images/marketplace.png",
    location: "Lagos, Ojo",
    likes: 20,
    rating: 4,
    condition: "Brand New",
    category: "fashion",
  },
  {
    id: "7",
    price: "₦ 317,000",
    priceRaw: 317000,
    title: "Iphone 12 - Blue",
    brand: "apple",
    desc: "Great condition, minimal scratches.",
    badge: "/images/marketplace.png",
    location: "Lagos, Ikeja",
    likes: 12,
    rating: 4,
    condition: "Foreign Used",
    category: "phones",
  },
];

export async function getItemsByCategory(category: string) {
  // simple filter now; replace with API call later
  return items.filter((it) => it.category === category);
}

export async function getAllItems() {
  return items;
}

export default items;
