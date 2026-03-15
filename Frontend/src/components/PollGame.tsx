export default function PollGame() {
  return (
    <section className="w-full bg-[#F5F5F5] py-16 px-4">
      <div className="max-w-[1200px] mx-auto">
        {/* Title */}
        <h2 className="text-center text-[42px] md:text-[52px] font-bold mb-12">
          Let&apos;s Play a Quick {" "}
          <span className="text-[#FF6B35]">Poll Game</span>{" "}
          <span className="inline-block">🎮</span>
        </h2>

        {/* Poll Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1100px] mx-auto">
          {/* Left Card */}
          <div className="relative">
            {/* Decorative gamepad */}
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-[80px] opacity-20 pointer-events-none hidden md:block">
              🎮
            </div>
            
            <div className="bg-[#FF6B35] rounded-[28px] p-8 shadow-lg h-full">
              <h3 className="text-white text-[20px] font-semibold mb-6 leading-tight">
                If you could shop only ONE category this week, which would it be?
              </h3>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="category"
                      className="w-5 h-5 appearance-none rounded-full border-2 border-white bg-transparent checked:bg-white checked:border-white cursor-pointer transition-all"
                    />
                    <div className="absolute w-2 h-2 rounded-full bg-[#FF6B35] opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                  </div>
                  <span className="text-white text-[17px]">Electronics</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="category"
                      className="w-5 h-5 appearance-none rounded-full border-2 border-white bg-transparent checked:bg-white checked:border-white cursor-pointer transition-all"
                    />
                  </div>
                  <span className="text-white text-[17px]">Fashion</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="category"
                      className="w-5 h-5 appearance-none rounded-full border-2 border-white bg-transparent checked:bg-white checked:border-white cursor-pointer transition-all"
                    />
                  </div>
                  <span className="text-white text-[17px]">Phones & Accessories</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="relative">
            {/* Decorative gamepad */}
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-[80px] opacity-20 pointer-events-none hidden md:block">
              🎮
            </div>
            
            <div className="bg-[#FF6B35] rounded-[28px] p-8 shadow-lg h-full">
              <h3 className="text-white text-[20px] font-semibold mb-6 leading-tight">
                What makes you click a product the fastest?
              </h3>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="clickfactor"
                      className="w-5 h-5 appearance-none rounded-full border-2 border-white bg-transparent checked:bg-white checked:border-white cursor-pointer transition-all"
                    />
                  </div>
                  <span className="text-white text-[17px]">Fine picture</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="clickfactor"
                      className="w-5 h-5 appearance-none rounded-full border-2 border-white bg-transparent checked:bg-white checked:border-white cursor-pointer transition-all"
                    />
                  </div>
                  <span className="text-white text-[17px]">Popular item</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="clickfactor"
                      className="w-5 h-5 appearance-none rounded-full border-2 border-white bg-transparent checked:bg-white checked:border-white cursor-pointer transition-all"
                    />
                  </div>
                  <span className="text-white text-[17px]">Good description</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
     
    </section>
  );
}