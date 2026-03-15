import Image from "next/image";

const recent = [
  { id: 1, title: "JBL Speaker", img: "/assets/images/phone.svg" },
  { id: 2, title: "Dress", img: "/assets/images/dress.svg" },
  { id: 3, title: "Generator", img: "/assets/images/equipment.svg" },
  { id: 4, title: "Blender", img: "/assets/images/foodbaasket.svg" },
  { id: 5, title: "Mercedes Benz", img: "/assets/images/car.svg" },
  { id: 6, title: "Iphone 14", img: "/assets/images/phone.svg" },
  { id: 7, title: "Headphone", img: "/assets/images/tv.svg" },
  { id: 8, title: "Laptop bag", img: "/assets/images/laptop.svg" },
  { id: 9, title: "JBL Speaker", img: "/assets/images/phone.svg" },
  { id: 10, title: "Mercedes Benz", img: "/assets/images/car.svg" },
  { id: 11, title: "Iphone 14", img: "/assets/images/phone.svg" },
  { id: 12, title: "Headphone", img: "/assets/images/tv.svg" },
  { id: 13, title: "Laptop bag", img: "/assets/images/laptop.svg" },
  { id: 14, title: "Dress", img: "/assets/images/dress.svg" },
];

export default function RecentSearches() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-12 pb-16 mt-8">
      <h3 className="text-3xl font-extrabold text-[#FF6B35] mb-6">Recent Searches</h3>

      <div className="flex gap-3 lg:gap-6 overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory px-1 lg:flex-wrap lg:items-start">
        {recent.map((it) => (
          <div key={it.id} className="shrink-0 w-[110px] lg:w-[120px] flex flex-col items-center snap-start">
            <div className="w-full max-w-[140px] lg:w-[100px] lg:h-[100px] rounded-md overflow-hidden border-4 border-[#FF6B35] p-1 bg-white shadow-sm">
              <div className="relative w-full pb-[100%] lg:pb-0 lg:h-full">
                <Image src={it.img} alt={it.title} fill className="absolute inset-0 object-contain p-2" />
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-700 text-center font-medium line-clamp-1 w-full">{it.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
