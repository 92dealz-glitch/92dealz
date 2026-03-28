"use client";

import React from "react";

export default function PollGame() {
  return (
    <section className="relative w-full bg-[#F5F5F5] py-16 px-4 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-center text-[42px] md:text-[52px] font-bold mb-12">
          Let&apos;s Play a Quick <span className="text-[#FF6B35]">Poll Game</span> 🎮
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1100px] mx-auto">
          <div className="relative">
            <div className="absolute -left-6 md:-left-8 top-1/2 -translate-y-1/2 text-[60px] md:text-[80px] opacity-10 pointer-events-none z-0">
              🎮
            </div>
            <div className="relative bg-[#FF6B35] rounded-[28px] p-8 shadow-lg h-full z-10 text-white">
              <h3 className="text-[20px] font-semibold mb-6">If you could shop only ONE category this week, which would it be?</h3>
              <p>Electronics, Fashion, or Phones?</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-6 md:-right-8 top-1/2 -translate-y-1/2 text-[60px] md:text-[80px] opacity-10 pointer-events-none z-0">
              🎮
            </div>
            <div className="relative bg-[#FF6B35] rounded-[28px] p-8 shadow-lg h-full z-10 text-white">
              <h3 className="text-[20px] font-semibold mb-6">What makes you click a product the fastest?</h3>
              <p>Fine pictures, Popular items, or Good descriptions?</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}