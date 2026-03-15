import AdCard, { AdItem } from "./ui/AdCard";

const items: AdItem[] = [
  {
    id: 1,
    price: "₦ 317,000",
    title: "Iphone 12",
    desc: "This iPhone 12 is in excellent condition with a smooth, responsive screen and strong battery life.",
    badge: "/assets/images/bgphone.svg",
  },
  {
    id: 2,
    price: "₦ 17,000",
    title: "Dress",
    desc: "This dress is perfect casual outings. Made with high-quality fabric.",
    badge: "/assets/images/bgdress.svg",
  },
  {
    id: 3,
    price: "₦ 17,000",
    title: "Sneakers",
    desc: "Selling brand new, Sneakers Size 30",
    badge: "/assets/images/bgshoe.svg",
  },
  {
    id: 4,
    price: "₦ 5,817,000",
    title: "Chevrolet",
    desc: "This Chevrolet is in excellent working condition with a strong engine.",
    badge: "/assets/images/bgcar.svg",
  },
  {
    id: 5,
    price: "₦ 280,000",
    title: "Iphone 11",
    desc: "Well maintained iPhone 11 with good battery health.",
    badge: "/assets/images/bgphone.svg",
  },
  {
    id: 6,
    price: "₦ 22,000",
    title: "Evening Gown",
    desc: "Elegant evening gown suitable for events and parties.",
    badge: "/assets/images/bgdress.svg",
  },
  {
    id: 7,
    price: "₦ 25,000",
    title: "Running Shoes",
    desc: "Comfortable running shoes, lightly used.",
    badge: "/assets/images/bgshoe.svg",
  },
  {
    id: 8,
    price: "₦ 4,950,000",
    title: "Toyota Camry",
    desc: "Clean Toyota Camry with smooth ride and reliable engine.",
    badge: "/assets/images/bgcar.svg",
  },
];


export default function Recommended() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-12 pb-16">
      <h3 className="text-3xl font-extrabold text-[#FF6B35] mb-6">Recommended for you.</h3>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[1fr] items-stretch">
        {items.map((it) => (
          <AdCard key={it.id} item={it} />
        ))}
      </div>

    </section>
  );
}
