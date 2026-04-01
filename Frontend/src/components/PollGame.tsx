"use client";
import React, { useState, useEffect } from "react";
import { submitPoll, getMyProfile } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function PollGame() {
  const [category, setCategory] = useState<string>("");
  const [choice, setChoice] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "completed" | "error">("idle");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res: any = await getMyProfile();
        if (res.success) {
          setUser(res.data);
          // Check if poll was done recently
          if (res.data?.last_poll_date) {
            const now = new Date();
            const last = new Date(res.data.last_poll_date);
            const diffDays = Math.floor(Math.abs(now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays < 7) {
              setStatus("completed");
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!category || !choice) {
      setMessage("Please select an option for both questions!");
      return;
    }

    setLoading(true);
    setStatus("loading");
    try {
      const res = await submitPoll({ category, choice });
      if (res.success) {
        setStatus("completed");
        setMessage("Thank you for participating! Check your 'Recommended' section for personalized deals.");
        // Optional: reload or update local state
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to submit poll. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "completed") {
    return (
      <section className="relative w-full bg-[#F5F5F5] py-16 px-4 overflow-hidden text-center">
        <div className="max-w-[800px] mx-auto bg-white p-12 rounded-[32px] shadow-xl border border-emerald-100">
          <div className="text-[60px] mb-4">🏆</div>
          <h2 className="text-[32px] font-bold text-gray-900 mb-4">Poll Completed!</h2>
          <p className="text-gray-600 mb-8">{message || "You've already played this week. Come back next week for fresh options!"}</p>
          <button 
            onClick={() => router.push("/")}
            className="bg-[#f45c03] text-white px-8 py-3 rounded-full font-bold hover:bg-[#f45c03] transition-all"
          >
            Back to Home
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-[#F5F5F5] py-16 px-4 overflow-hidden">
      {/* Floating Background Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] text-[60px] opacity-20 animate-float-slow">🎮</div>
        <div className="absolute top-[30%] right-[10%] text-[70px] opacity-20 animate-float-medium">🕹️</div>
        <div className="absolute bottom-[20%] left-[15%] text-[65px] opacity-20 animate-float-fast">🎮</div>
        <div className="absolute bottom-[10%] right-[20%] text-[55px] opacity-20 animate-float-medium">🕹️</div>
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
        <h2 className="text-center text-[42px] md:text-[52px] font-bold mb-4">
          Let&apos;s Play a Quick <span className="text-[#f45c03]">Poll Game</span> 🎮
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-[600px] mx-auto">
          Help us personalize your experience and win insights into what others are shopping for!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1100px] mx-auto mb-12">
          {/* Question 1 */}
          <div className="relative">
            <div className="relative bg-[#f45c03] rounded-[28px] p-8 shadow-lg h-full z-10 text-white">
              <h3 className="text-[20px] font-semibold mb-6">If you could shop only ONE category this week, which would it be?</h3>
              <div className="flex flex-col gap-3">
                {["Electronics", "Fashion", "Phones"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setCategory(opt)}
                    className={`text-left px-6 py-4 rounded-xl border-2 transition-all font-medium ${
                      category === opt 
                        ? "bg-white text-[#f45c03] border-white" 
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question 2 */}
          <div className="relative">
            <div className="relative bg-[#f45c03] rounded-[28px] p-8 shadow-lg h-full z-10 text-white">
              <h3 className="text-[20px] font-semibold mb-6">What makes you click a product the fastest?</h3>
              <div className="flex flex-col gap-3">
                {["Fine pictures", "Popular items", "Good descriptions"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setChoice(opt)}
                    className={`text-left px-6 py-4 rounded-xl border-2 transition-all font-medium ${
                      choice === opt 
                        ? "bg-white text-[#f45c03] border-white" 
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {message && status === "error" && (
          <div className="text-center text-red-600 font-semibold mb-4">{message}</div>
        )}

        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-16 py-4 rounded-full font-black text-white text-lg shadow-xl transition-all duration-300 ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gray-900 hover:bg-black hover:scale-[1.05] active:scale-[0.95]"
            }`}
          >
            {loading ? "Submitting..." : user ? "Submit My Vote" : "Login to Vote"}
          </button>
        </div>
      </div>
    </section>
  );
}
