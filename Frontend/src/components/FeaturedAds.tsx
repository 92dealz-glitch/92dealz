import Image from "next/image";

const featured = [
  {
    id: 1,
    price: "₦ 117,000",
    title: "English Bulldog",
    desc: "This English Bulldog puppy is healthy, active, and well-socialized. It has a strong body, beautiful wrinkles, and a calm, friendly temperament. Perfect for families and great with kids",
    img: "/assets/images/girl.svg",
    location: "Lagos, Ojo",
    likes: 14,
  },
  {
    id: 2,
    price: "₦ 117,000",
    title: "Chanel Bag",
    desc: "This Chanel bag is a classy, authentic luxury piece perfect for outings and everyday fashion. The leather is smooth, the stitching is firm, and the hardware is top quality.",
    img: "/assets/images/dress.svg",
    location: "Lagos, Ikeja",
    likes: 40,
  },
  {
    id: 3,
    price: "₦ 117,000",
    title: "Comfy Chair",
    desc: "This chair is strong, comfortable, and perfect for your home. The frame is sturdy, the seat is well-padded, and it's in very neat condition. No damage just buy and use",
    img: "/assets/images/furniture.svg",
    location: "Delta, Asaba",
    likes: 40,
  },
  {
    id: 4,
    price: "₦ 117,000",
    title: "Dynablend Blender",
    desc: "This Tribest Dynablend blender is a powerful, high performance machine perfect for smoothies, juices, soups, and ice crushing. It blends fast and smoothly with its strong motor and stainless-steel blades.",
    img: "/assets/images/equipment.svg",
    location: "Lagos, Ojo",
    likes: 40,
  },
];

function Stars() {
  return (
    <div className="flex items-center gap-1">
      <svg className="w-5 h-5 text-yellow-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.858L19.335 24 12 20.201 4.665 24 6 15.606 0 9.748l8.332-1.73L12 .587z"/></svg>
      <svg className="w-5 h-5 text-yellow-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.858L19.335 24 12 20.201 4.665 24 6 15.606 0 9.748l8.332-1.73L12 .587z"/></svg>
      <svg className="w-5 h-5 text-yellow-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.858L19.335 24 12 20.201 4.665 24 6 15.606 0 9.748l8.332-1.73L12 .587z"/></svg>
      <svg className="w-5 h-5 text-yellow-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.858L19.335 24 12 20.201 4.665 24 6 15.606 0 9.748l8.332-1.73L12 .587z"/></svg>
      <svg className="w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.858L19.335 24 12 20.201 4.665 24 6 15.606 0 9.748l8.332-1.73L12 .587z"/></svg>
    </div>
  );
}

export default function FeaturedAds() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-12 pb-16 mt-8">
      <h3 className="text-3xl font-extrabold text-[#FF6B35] mb-6">Featured Ads</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featured.map((it) => (
          <article
            key={it.id}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#C84312] to-[#DE5A28] p-4 lg:p-6 text-white shadow-lg flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-[220px]"
          >
            <div className="absolute top-4 right-4 lg:block">
              <div className="w-9 h-9 bg-emerald-400 rounded-full flex items-center justify-center text-white font-bold">✓</div>
            </div>

            <div className="flex-shrink-0 relative w-full lg:w-[300px] lg:h-[300px]">
              <div className="relative w-full rounded-xl overflow-hidden border-4 border-white p-1 bg-white h-full">
                <div className="relative w-full pb-[66%] lg:pb-0 lg:h-full">
                  <Image src={it.img} alt={it.title} fill className="absolute inset-0 object-cover" />
                </div>
              </div>

              <div className="absolute top-3 right-3">
                <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600">♡</div>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-extrabold text-lg sm:text-xl">{it.price}</p>
                    <h4 className="mt-2 text-white text-xl sm:text-2xl font-semibold">{it.title}</h4>
                  </div>
                </div>

                <p className="mt-3 text-white/90 text-sm leading-relaxed line-clamp-3 sm:line-clamp-4">{it.desc}</p>

                <div className="mt-4 flex items-center gap-3">
                  <Stars />
                </div>

                <div className="mt-4 flex items-center gap-3 text-sm text-white/90">
                  <span className="flex items-center gap-2">📍 <span>{it.location}</span></span>
                  <span className="ml-auto flex items-center gap-2">👍 <span className="font-semibold">{it.likes}</span></span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <button className="bg-[#DE5A28] px-12 py-3 rounded-md font-semibold shadow-lg text-white">Shop Now!</button>
      </div>
    </section>
  );
}
