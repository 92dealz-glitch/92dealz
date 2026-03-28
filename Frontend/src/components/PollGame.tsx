"use client";

import React from "react";

export default function PollGame() {
  return (
    <section className="relative w-full bg-[#F5F5F5] py-16 px-4 overflow-hidden">
      {/* Floating Background Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] text-[40px] opacity-10 animate-float-slow">🎮</div>
        <div className="absolute top-[30%] right-[10%] text-[50px] opacity-10 animate-float-medium">🕹️</div>
        <div className="absolute bottom-[20%] left-[15%] text-[45px] opacity-10 animate-float-fast">🎮</div>
        <div className="absolute bottom-[10%] right-[20%] text-[35px] opacity-10 animate-float-medium">🕹️</div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -50px) rotate(10deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-40px, -30px) rotate(-15deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, 30px) rotate(5deg); }
          75% { transform: translate(-30px, -20px) rotate(-10deg); }
        }
        .animate-float-slow { animation: float-slow 15s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 12s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 10s ease-in-out infinite; }
      `}} />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <h2 className="text-center text-[42px] md:text-[52px] font-bold mb-12">
          Let&apos;s Play a Quick <span className="text-[#FF6B35]">Poll Game</span> 🎮
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1100px] mx-auto">
          <div className="relative">
            <div className="relative bg-[#FF6B35] rounded-[28px] p-8 shadow-lg h-full z-10 text-white transition-transform hover:scale-[1.02] duration-300">
              <h3 className="text-[20px] font-semibold mb-6">If you could shop only ONE category this week, which would it be?</h3>
              <p>Electronics, Fashion, or Phones?</p>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-[#FF6B35] rounded-[28px] p-8 shadow-lg h-full z-10 text-white transition-transform hover:scale-[1.02] duration-300">
              <h3 className="text-[20px] font-semibold mb-6">What makes you click a product the fastest?</h3>
              <p>Fine pictures, Popular items, or Good descriptions?</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}