"use client";
import React, { useState } from "react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  if (subscribed) {
    return (
      <section className="w-full py-10 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div
            className="w-full rounded-3xl overflow-hidden shadow-2xl relative text-center py-20 px-8 text-white"
            style={{
              background: 'linear-gradient(135deg, #708238 0%, #312E81 50%, #1E1B4B 100%)',
            }}
          >
            {/* Decorative Glowing Orbs */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-[250px] h-[250px] bg-[#F8F4EE]merald-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-[600px] mx-auto flex flex-col items-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Check your inbox! 📧</h2>
              <p className="text-sm sm:text-base text-zinc-100 max-w-[500px]">
                Thank you for subscribing to our newsletter! We&apos;ll keep you posted with the latest updates and exclusive deals.
              </p>
              <button 
                onClick={() => setSubscribed(false)}
                className="mt-8 bg-white text-[#708238] px-6 py-2.5 rounded-md font-bold hover:bg-zinc-100 hover:scale-105 active:scale-[0.97] transition-all duration-300 shadow-md cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-10 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        <div
          className="w-full rounded-3xl overflow-hidden shadow-2xl relative"
          style={{
            background: 'linear-gradient(135deg, #708238 0%, #312E81 50%, #1E1B4B 100%)',
          }}
        >
          {/* Decorative Glowing Orbs */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-[250px] h-[250px] bg-[#F8F4EE]merald-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 bg-[rgba(0,0,0,0.0)] px-4 sm:px-8 md:px-12 py-8 sm:py-10 md:py-16">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Left text */}
              <div className="md:w-2/3 text-white">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold leading-tight">
                  Subscribe to<br />
                  Our Newsletter
                </h2>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base max-w-[560px]">
                  Stay updated with the latest deals, exclusive offers, and marketplace news delivered directly to your inbox.
                </p>
              </div>

              {/* Right form */}
              <div className="md:w-1/3 w-full flex flex-col items-stretch md:items-end">
                <form onSubmit={handleSubmit} className="w-full md:w-[380px] flex flex-col items-stretch gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md px-4 py-3 outline-none bg-white text-black placeholder-gray-400"
                  />

                  <button
                    type="submit"
                    className="w-full md:w-auto bg-white text-[#708238] px-6 py-3 rounded-md font-bold cursor-pointer hover:bg-zinc-100 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-md"
                  >
                    SUBSCRIBE
                  </button>

                  <label className="flex items-start gap-3 text-white text-xs sm:text-sm">
                    <input type="checkbox" className="mt-1" />
                    <span>
                      By signing up, you agree to our <u>privacy policy</u>.<br />
                      Unsubscribe anytime at the bottom of our emails.
                    </span>
                  </label>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


