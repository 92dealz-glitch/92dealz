import AdCard, { AdItem } from "./ui/AdCard";

const items: AdItem[] = [
  {
    id: 1,
    price: "₦ 317,000",
    title: "Iphone 12",
    desc: "This iPhone 12 is in excellent condition with a smooth, responsive screen and strong battery life.",
    badge: "/assets/images/iphone-1.svg",
  },
  {
    id: 2,
    price: "₦ 437,000",
    title: "Samsung Galaxy A35",
    desc: "It's designed to deliver a reliable balance of performance, display quality, camera capabilities, and battery life.",
    badge: "/assets/images/phone.svg",
  },
  {
    id: 3,
    price: "₦ 1,817,000",
    title: "iphone 16",
    desc: "Designed for users who want powerful performance, high-quality cameras, sleek design",
    badge: "/assets/images/phone.svg",
  },
  {
    id: 4,
    price: "₦ 117,000",
    title: "xiaomi",
    desc: "Experience smooth performance, sharp cameras, long-lasting battery life",
    badge: "/assets/images/phone.svg",
  },
  {
    id: 5,
    price: "₦ 117,000",
    title: "xiaomi",
    desc: "Experience smooth performance, sharp cameras, long-lasting battery life",
    badge: "/assets/images/phone.svg",
  },
  {
    id: 6,
    price: "₦ 1,817,000",
    title: "iphone 16",
    desc: "Designed for users who want powerful performance, high-quality cameras, sleek design",
    badge: "/assets/images/phone.svg",
  },
  {
    id: 7,
    price: "₦ 317,000",
    title: "Iphone 12",
    desc: "This iPhone 12 is in excellent condition with a smooth, responsive screen and strong battery life.",
    badge: "/assets/images/iphone-1.svg",
  },
  {
    id: 8,
    price: "₦ 437,000",
    title: "Samsung Galaxy A35",
    desc: "It's designed to deliver a reliable balance of performance, display quality, camera capabilities, and battery life.",
    badge: "/assets/images/phone.svg",
  },
];

export default function SimilarItems() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 lg:px-0 pb-12 pt-5">
      <h3 className="text-2xl font-extrabold text-[#FF6B35] mb-6">Similar Items You May Like</h3>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[1fr] items-stretch">
        {items.map((it) => (
          <AdCard key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}
