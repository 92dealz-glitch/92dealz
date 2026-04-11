"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import Link from "next/link";
import { buyPlan, getProfile } from "@/services/user.service";
import { useRouter } from "next/navigation";
import { Check, Star, Zap, Info } from "lucide-react";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.success) {
          setCurrentPlan((res.data as any).subscription_plan);
        }
      } catch (err) {}
    };
    fetchProfile();
  }, []);

  const handleBuy = async (plan: 'free' | 'basic' | 'star') => {
    setLoading(plan);
    setMessage(null);
    try {
      const res = await buyPlan(plan);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setCurrentPlan(plan);
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: "Failed to upgrade plan." });
      }
    } catch (err) {
      setMessage({ type: 'error', text: "An error occurred. Are you logged in?" });
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 'Free',
      period: '',
      description: 'Perfect for casual sellers getting started.',
      features: [
        'Post 1 ad per month',
        'Standard visibility',
        'Basic search ranking',
        '24h support response'
      ],
      buttonText: 'Starting Plan',
      color: 'gray',
      icon: <Info className="w-6 h-6 text-gray-400" />
    },
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '₦1,000',
      period: '/month',
      description: 'Ideal for small businesses wanting more exposure.',
      features: [
        'Post up to 10 ads per month',
        'Visible in Trending Ads',
        'Priority search ranking',
        'Verified Vendor badge',
        '8h support response'
      ],
      buttonText: 'Upgrade to Basic',
      color: 'orange',
      icon: <Zap className="w-6 h-6 text-[#f45c03]" />,
      recommended: true
    },
    {
      id: 'star',
      name: 'Star Premium',
      price: '₦5,000',
      period: '/month',
      description: 'The ultimate visibility for professional vendors.',
      features: [
        'Post up to 20 products per month',
        'Listed in Featured Ads (Orange Box)',
        'Listed in Hot Deals Today',
        'Top priority in search results',
        'Instant support response',
        'Advanced seller analytics'
      ],
      buttonText: 'Get Star Premium',
      color: 'star',
      icon: <Star className="w-6 h-6 text-yellow-500" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-6">
              Empower Your <span className="text-[#f45c03]">Business</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
              Reach more customers and boost your sales with our premium visibility plans. Choose the one that fits your scale.
            </p>
          </div>

          {/* Alert Message */}
          {message && (
            <div className={`max-w-2xl mx-auto mb-10 p-4 rounded-2xl flex items-center gap-3 border shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 ${
              message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {message.type === 'success' ? <Check className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative flex flex-col p-8 rounded-[32px] transition-all duration-300 border-2 ${
                  plan.id === 'star' 
                    ? 'border-yellow-400 shadow-2xl shadow-yellow-100 bg-white ring-8 ring-yellow-50' 
                    : plan.recommended 
                      ? 'border-[#f45c03] shadow-xl shadow-orange-50 bg-white scale-105 z-10' 
                      : 'border-gray-100 bg-gray-50/50 hover:border-gray-300'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#f45c03] text-white px-6 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
                    Most Popular
                  </div>
                )}
                {plan.id === 'star' && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-yellow-400 px-6 py-1.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-2">
                    <Star className="w-3 h-3 fill-current" /> Premium Choice
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                    {plan.icon}
                  </div>
                  {currentPlan === plan.id && (
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-200">
                      Active Plan
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-black mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{plan.description}</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className={`text-4xl md:text-5xl font-black ${plan.id === 'star' ? 'text-black' : plan.recommended ? 'text-[#f45c03]' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className="text-gray-400 font-semibold">{plan.period}</span>
                </div>

                <div className="flex-grow space-y-4 mb-10">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-1 p-0.5 rounded-full ${plan.id === 'free' ? 'bg-gray-200' : 'bg-[#f45c03]/10'}`}>
                        <Check className={`w-3.5 h-3.5 ${plan.id === 'free' ? 'text-gray-500' : 'text-[#f45c03]'}`} />
                      </div>
                      <span className="text-gray-700 text-sm font-medium leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleBuy(plan.id as any)}
                  disabled={loading !== null || currentPlan === plan.id}
                  className={`w-full py-4 rounded-2xl font-black text-base transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg ${
                    plan.id === 'star'
                      ? 'bg-black text-yellow-400 hover:shadow-yellow-200'
                      : plan.recommended
                        ? 'bg-[#f45c03] text-white hover:bg-orange-600 hover:shadow-orange-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {loading === plan.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : currentPlan === plan.id ? 'Current Plan' : plan.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* Bottom Info */}
          <div className="bg-gray-50 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-100">
            <div className="max-w-xl text-center md:text-left">
              <h4 className="text-2xl font-bold text-black mb-3 text-center md:text-left">Frequently Asked Question</h4>
              <p className="text-gray-600 text-center md:text-left">
                Once purchased, you can post products through the plan dashboard. The visibility tier is locked at the time of posting. For any issues, contact our support team.
              </p>
            </div>
            <Link 
              href="/contact" 
              className="px-10 py-4 bg-white border-2 border-black text-black font-bold rounded-2xl hover:bg-black hover:text-white transition-colors shrink-0"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
