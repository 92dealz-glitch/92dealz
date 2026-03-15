"use client";
import { useEffect, useState } from "react";
import AdCard, { AdItem } from "./ui/AdCard";
import { listActiveAds } from "@/services/ads.service";

const items: AdItem[] = [
  {
    id: 1,
    price: "₦ 317,000",
    title: "iPhone 12",
    desc: "This iPhone 12 is in excellent condition with a smooth, responsive screen and strong battery life.",
    badge: "/assets/images/bgphone.svg",
  },
  {
    id: 2,
    price: "₦ 17,000",
    title: "Dress",
    desc: "This dress is perfect for casual outings. Made with high-quality fabric.",
    badge: "/assets/images/bgdress.svg",
  },
  {
    id: 3,
    price: "₦ 17,000",
    title: "Sneakers",
    desc: "Selling brand new sneakers, Size 30.",
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
    title: "iPhone 11",
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
  {
    id: 9,
    price: "₦ 365,000",
    title: "iPhone 13",
    desc: "Neatly used iPhone 13 with sharp display and fast performance.",
    badge: "/assets/images/bgphone.svg",
  },
  {
    id: 10,
    price: "₦ 19,500",
    title: "Summer Dress",
    desc: "Lightweight summer dress, breathable and stylish.",
    badge: "/assets/images/bgdress.svg",
  },
  {
    id: 11,
    price: "₦ 30,000",
    title: "Fashion Sneakers",
    desc: "Trendy sneakers suitable for everyday wear.",
    badge: "/assets/images/bgshoe.svg",
  },
  {
    id: 12,
    price: "₦ 6,200,000",
    title: "Honda Accord",
    desc: "Well serviced Honda Accord with excellent fuel efficiency.",
    badge: "/assets/images/bgcar.svg",
  },
];

export default function TrendingAds() {
  const [list, setList] = useState<AdItem[]>(items);
  useEffect(() => {
    (async () => {
      try {
        const res = await listActiveAds();
        const mapped: AdItem[] = (res.data || []).map((d: any) => ({
          id: d.id,
          price: `₦ ${Number(d.price).toLocaleString()}`,
          title: d.title,
          desc: d.description || "",
          badge: d.image_url || "/assets/images/bgphone.svg",
        }));
        if (mapped.length) setList(mapped);
      } catch {}
    })();
  }, []);
  return (
    <>
      <section className="max-w-[1400px] mx-auto px-4 lg:px-12 pb-16">
        <h3 className="text-3xl font-extrabold text-[#FF6B35] mb-6">Trending Ads</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[1fr] items-stretch">
          {list.map((it) => (
            <AdCard key={it.id} item={it} />
          ))}
        </div>
      </section>
    </>
  );
}
