"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import Link from "next/link";
import { buyPlan, getProfile } from "@/services/user.service";
import { UserProfile } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Check, Star, Zap, Info } from "lucide-react";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [currentPlan, setCurrentPlan] = useState<'free' | 'basic' | 'star' | 'premium' | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.success) {
          setCurrentPlan((res.data as UserProfile).subscription_plan || 'free');
          setProfile(res.data as UserProfile);
        }
      } catch (err) {}
    };
    fetchProfile();
  }, []);

  const handleBuy = async (plan: 'free' | 'basic' | 'star' | 'premium' | 'starter') => {
    setLoading(plan);
    setMessage(null);
    try {
      const res = await buyPlan(plan);
      if (res.success) {
        setMessage({ type: 'success', text: "Successfully subscribed to the plan." });
        setCurrentPlan(plan === 'starter' ? currentPlan : plan as any);
        // Refresh profile to get updated dates
        const profileRes = await getProfile();
        if (profileRes.success) {
          setProfile(profileRes.data as UserProfile);
          if (plan !== 'starter') setCurrentPlan(profileRes.data.subscription_plan as any);
        }
        // Success experience: show buttons after a short delay or immediately
      } else {
        setMessage({ type: 'error', text: "Failed to process subscription." });
      }
    } catch (err) {
      setMessage({ type: 'error', text: "An error occurred. Please ensure you are authenticated." });
    } finally {
      setLoading(null);
    }
  };

  const isChina = profile?.country_name === 'China' || profile?.country_code === 'CN';

  const plans = isChina ? [
    {
      id: 'basic',
      name: 'Featured Tier',
      price: '$9.99',
      period: '/month',
      description: 'Designed for scaling businesses requiring enhanced market exposure and priority placement.',
      features: [
        '10 Featured Visibility Ads per month',
        'Priority placement in Trending feeds',
        'Elevated search algorithm ranking',
        'Expedited 8h support SLA'
      ],
      buttonText: 'Subscribe to Featured',
      color: 'orange',
      icon: <Zap className="w-6 h-6 text-[#f45c03]" />,
      recommended: true
    },
    {
      id: 'star',
      name: 'Premium Enterprise',
      price: '$24.99',
      period: '/month',
      description: 'Maximum visibility architecture tailored for professional vendors dominating their category.',
      features: [
        '20 Premium Visibility Ads per month',
        'Exclusive placement in Prime sections',
        'Highest priority indexing in search matrices',
        'Comprehensive market performance analytics'
      ],
      buttonText: 'Subscribe to Premium',
      color: 'star',
      icon: <Star className="w-6 h-6 text-yellow-500" />
    }
  ] : [
    {
      id: 'free',
      name: 'Standard Tier',
      price: 'Free',
      period: '',
      description: 'The foundational entry point for independent sellers establishing their market presence.',
      features: [
        '1 Standard Visibility Ad per month',
        'Index-level search ranking',
        'Standard 24h support response time'
      ],
      buttonText: 'Default Tier',
      color: 'gray',
      icon: <Info className="w-6 h-6 text-gray-400" />
    },
    {
      id: 'starter',
      name: 'Starter Add-on',
      price: '₦250',
      period: '/slot',
      description: 'Add an extra Standard slot to your account without upgrading your full plan. Perfect for single extra uploads.',
      features: [
        '+1 Standard Visibility Ad slot',
        'Can be purchased multiple times',
        'Does not expire until used'
      ],
      buttonText: 'Buy Extra Slot',
      color: 'gray',
      icon: <Check className="w-6 h-6 text-gray-500" />
    },
    {
      id: 'basic',
      name: 'Featured Tier',
      price: '₦1,000',
      period: '/month',
      description: 'Designed for scaling businesses requiring enhanced market exposure and priority placement.',
      features: [
        '10 Featured Visibility Ads per month',
        'Priority placement in Trending feeds',
        'Elevated search algorithm ranking',
        'Official Verified Vendor designation',
        'Expedited 8h support SLA'
      ],
      buttonText: 'Subscribe to Featured',
      color: 'orange',
      icon: <Zap className="w-6 h-6 text-[#f45c03]" />,
      recommended: true
    },
    {
      id: 'star',
      name: 'Premium Enterprise',
      price: '₦5,000',
      period: '/month',
      description: 'Maximum visibility architecture tailored for professional vendors dominating their category.',
      features: [
        '20 Premium Visibility Ads per month',
        'Exclusive placement in Prime sections',
        'Highest priority indexing in search matrices',
        'Real-time dedicated support routing',
        'Comprehensive market performance analytics'
      ],
      buttonText: 'Subscribe to Premium',
      color: 'star',
      icon: <Star className="w-6 h-6 text-yellow-500" />
    },
    {
      id: 'premium',
      name: 'Ultimate Tier',
      price: '₦50,000',
      period: '/month',
      description: 'The absolute highest tier for super-vendors requiring limitless capacity and top-tier marketplace dominance.',
      features: [
        '50 Ultimate Visibility Ads per month',
        'Guaranteed top placements',
        'Dedicated VIP Account Manager',
        'Zero-delay instant support routing',
        'White-glove analytics and insights'
      ],
      buttonText: 'Subscribe to Ultimate',
      color: 'star',
      icon: <Star className="w-6 h-6 text-purple-500" />
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
            <div className={`max-w-2xl mx-auto mb-10 p-6 rounded-[32px] flex flex-col md:flex-row items-center gap-6 border shadow-2xl animate-in zoom-in-95 duration-300 ${
              message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                  {message.type === 'success' ? <Check className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <span className="font-black text-lg">{message.text}</span>
              </div>
              
              {message.type === 'success' && (
                <div className="flex gap-3 ml-auto">
                    <Link href="/vendor-dashboard/my-ads" className="bg-white border-2 border-emerald-200 text-emerald-700 px-6 py-2 rounded-xl font-black text-sm hover:bg-emerald-100 transition-all">My Ads</Link>
                    <Link href="/vendor-dashboard/add-product" className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-black text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all">Post My Ad</Link>
                </div>
              )}
              {message.type === 'error' && (
                 <button onClick={() => setMessage(null)} className="ml-auto text-red-400 font-bold text-sm">Dismiss</button>
              )}
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

                <div className="flex-grow space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-1 p-0.5 rounded-full ${plan.id === 'free' ? 'bg-gray-200' : 'bg-[#f45c03]/10'}`}>
                        <Check className={`w-3.5 h-3.5 ${plan.id === 'free' ? 'text-gray-500' : 'text-[#f45c03]'}`} />
                      </div>
                      <span className="text-gray-700 text-sm font-medium leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Analytics Block */}
                {profile?.subscription_stats && (
                  <div className="mb-6 p-4 rounded-xl border bg-gray-50/50 border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Usage Analytics</p>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-700">Ads Posted</span>
                      <span className="text-xs font-black text-black">
                        {(profile.subscription_stats[plan.id as 'free'|'basic'|'star'|'premium'|'starter'] as any) || 0} / {(profile.subscription_stats.limits[plan.id as 'free'|'basic'|'star'|'premium'|'starter'] as any) || '-'}
                      </span>
                    </div>
                    {/* Time Left */}
                    {(plan.id === 'basic' && profile.basic_plan_expires_at) && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                        <span className="text-xs font-bold text-gray-700">Subscription Valid Until</span>
                        <span className="text-[10px] font-black text-[#f45c03]">{new Date(profile.basic_plan_expires_at).toLocaleDateString()}</span>
                      </div>
                    )}
                    {(plan.id === 'star' && profile.star_plan_expires_at) && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                        <span className="text-xs font-bold text-gray-700">Subscription Valid Until</span>
                        <span className="text-[10px] font-black text-yellow-600">{new Date(profile.star_plan_expires_at).toLocaleDateString()}</span>
                      </div>
                    )}
                    {(plan.id === 'premium' && profile.premium_plan_expires_at) && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                        <span className="text-xs font-bold text-gray-700">Subscription Valid Until</span>
                        <span className="text-[10px] font-black text-purple-600">{new Date(profile.premium_plan_expires_at).toLocaleDateString()}</span>
                      </div>
                    )}
                    {(plan.id === 'free') && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                        <span className="text-xs font-bold text-gray-700">Renews</span>
                        <span className="text-[10px] font-black text-gray-500">Monthly</span>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleBuy(plan.id as any)}
                  disabled={loading !== null || (currentPlan === plan.id && plan.id !== 'starter')}
                  className={`w-full py-4 rounded-2xl font-black text-base transition-all active:scale-95 shadow-lg ${
                    plan.id === 'star' || plan.id === 'premium'
                      ? 'bg-black text-yellow-400 hover:shadow-yellow-200'
                      : plan.recommended
                        ? 'bg-[#f45c03] text-white hover:bg-orange-600 hover:shadow-orange-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } ${(loading !== null || (currentPlan === plan.id && plan.id !== 'starter')) ? 'opacity-50 cursor-not-allowed active:scale-100' : ''}`}
                >
                  {loading === plan.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (currentPlan === plan.id && plan.id !== 'starter') ? 'Current Plan' : plan.buttonText}
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
