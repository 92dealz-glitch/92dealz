"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import Link from "next/link";
import { buyPlan, getProfile } from "@/services/user.service";
import { UserProfile } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Check, Star, Zap, Info, Trophy, Rocket, ShieldCheck, X } from "lucide-react";

interface PricingPlan {
  id: 'free' | 'starter' | 'basic' | 'star' | 'premium';
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  color: 'orange' | 'purple' | 'gray' | 'black';
  icon: React.ReactNode;
  recommended?: boolean;
}

const planPriority = { 'free': 0, 'basic': 1, 'star': 2, 'premium': 3 };

function SuccessModal({ isOpen, onClose, planName }: { isOpen: boolean; onClose: () => void; planName: string }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] p-8 md:p-12 max-w-xl w-full text-center relative shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={24} className="text-gray-400" />
        </button>

        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center animate-bounce">
            <Trophy className="w-12 h-12 text-[#f45c03]" />
          </div>
        </div>

        <h2 className="text-4xl font-black text-black mb-4">Congratulations!</h2>
        <p className="text-xl text-gray-600 mb-8 font-bold">
          You have successfully upgraded to the <span className="text-[#f45c03]">{planName}</span>. Your new features are now active!
        </p>

        <div className="space-y-4">
          <Link 
            href="/vendor-dashboard/add-product"
            className="block w-full py-5 bg-[#f45c03] text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95"
          >
            Post Your First Ad
          </Link>
          <button 
            onClick={onClose}
            className="block w-full py-5 bg-black text-white rounded-2xl font-black text-lg hover:bg-gray-900 transition-all active:scale-95"
          >
            Back to Pricing
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Secure Purchase • 234Deals Verified
        </p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [currentPlan, setCurrentPlan] = useState<'free' | 'basic' | 'star' | 'premium' | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [purchasedPlanName, setPurchasedPlanName] = useState("");
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

  const handleBuy = async (planId: 'free' | 'basic' | 'star' | 'premium' | 'starter', planName: string) => {
    setLoading(planId);
    setMessage(null);
    try {
      const res = await buyPlan(planId);
      if (res.success) {
        setPurchasedPlanName(planName);
        setIsSuccessModalOpen(true);
        const profileRes = await getProfile();
        if (profileRes.success) {
          setProfile(profileRes.data as UserProfile);
          if (planId !== 'starter') setCurrentPlan(profileRes.data.subscription_plan as any);
        }
      } else {
        setMessage({ type: 'error', text: res.message || "Failed to process subscription." });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "An error occurred." });
    } finally {
      setLoading(null);
    }
  };

  const isChina = profile?.country_name === 'China' || profile?.country_code === 'CN';

  const plans: PricingPlan[] = isChina ? [
    {
      id: 'basic',
      name: 'Featured Tier',
      price: '$9.99',
      period: '/month',
      description: 'Scale your business with priority feed placement.',
      features: [
        '10 Featured Ads per month',
        'Trending feed placement',
        '8h Support SLA'
      ],
      buttonText: 'Subscribe',
      color: 'orange',
      icon: <Zap className="w-5 h-5 text-[#f45c03]" />,
      recommended: true
    },
    {
      id: 'star',
      name: 'Premium Tier',
      price: '$24.99',
      period: '/month',
      description: 'Maximum market dominance for pro vendors.',
      features: [
        '20 Premium Ads per month',
        'Hot Deals placement',
        'Market insights'
      ],
      buttonText: 'Subscribe',
      color: 'black',
      icon: <Star className="w-5 h-5 text-yellow-500" />
    }
  ] : [
    {
      id: 'free',
      name: 'Standard',
      price: 'Free',
      period: '',
      description: 'Foundational entry for occasional sellers.',
      features: [
        '1 Standard Ad per month',
        'Basic search indexing',
        '24h Support response'
      ],
      buttonText: 'Current Tier',
      color: 'gray',
      icon: <Info className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'starter',
      name: 'Starter Add-on',
      price: '₦250',
      period: '/slot',
      description: 'Instant +1 Standard slot boost.',
      features: [
        'Pay-per-listing',
        'Unlimited purchases',
        'Never expires until used'
      ],
      buttonText: 'Buy Slot',
      color: 'gray',
      icon: <Rocket className="w-5 h-5 text-gray-500" />
    },
    {
      id: 'basic',
      name: 'Featured',
      price: '₦1,000',
      period: '/month',
      description: 'Scaling visibility for growing businesses.',
      features: [
        '10 Featured Ads per month',
        'Trending feed highlight',
        'Verified Vendor badge',
        '8h priority support'
      ],
      buttonText: 'Upgrade Now',
      color: 'orange',
      icon: <Zap className="w-5 h-5 text-[#f45c03]" />,
      recommended: true
    },
    {
      id: 'star',
      name: 'Star Premium',
      price: '₦5,000',
      period: '/month',
      description: 'Elite placement for top vendors.',
      features: [
        '20 Premium Ads per month',
        'Home page highlight',
        'Dedicated VIP channel',
        'Market performance reports'
      ],
      buttonText: 'Upgrade Now',
      color: 'black',
      icon: <Star className="w-5 h-5 text-yellow-500" />
    },
    {
      id: 'premium',
      name: 'Ultimate',
      price: '₦50,000',
      period: '/month',
      description: 'The absolute pinnacle of market dominance.',
      features: [
        'UNLIMITED Product Listings',
        'Permanent top placements',
        'Personal Account Manager',
        'White-glove data insights'
      ],
      buttonText: 'Go Ultimate',
      color: 'purple',
      icon: <Trophy className="w-5 h-5 text-purple-500" />
    }
  ];

  const getButtonStatus = (planId: string) => {
    if (planId === 'starter') return { disabled: false, text: 'Buy Slot' };
    const priority = planPriority[planId as keyof typeof planPriority];
    const currentPriority = planPriority[currentPlan as keyof typeof planPriority] || 0;
    
    if (planId === currentPlan) return { disabled: true, text: 'Active Plan' };
    if (priority < currentPriority) return { disabled: true, text: 'Locked' };
    return { disabled: false, text: 'Upgrade' };
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Navbar />
      <SuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
        planName={purchasedPlanName} 
      />
      
      <main className="flex-grow pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-black mb-4 tracking-tight">
              Scale Your <span className="text-[#f45c03]">Sales</span> Reach
            </h1>
            <p className="text-gray-500 text-lg md:text-xl font-bold max-w-xl mx-auto">
              Unlock premium visibility and reach thousands of buyers instantly.
            </p>
          </div>

          {message?.type === 'error' && (
            <div className="max-w-xl mx-auto mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between">
              <span className="text-red-700 font-bold">{message.text}</span>
              <button onClick={() => setMessage(null)} className="text-red-400 font-black"><X size={20}/></button>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {plans.map((plan) => {
              const status = getButtonStatus(plan.id);
              const isUltimate = plan.id === 'premium';
              const isRecommended = plan.recommended;

              return (
                <div 
                  key={plan.id}
                  className={`relative w-full sm:w-[320px] flex flex-col bg-white p-8 rounded-[32px] border transition-all duration-300 ${
                    isRecommended ? 'border-[#f45c03] shadow-2xl shadow-orange-50 scale-[1.02] z-10' : 'border-gray-100 shadow-sm hover:shadow-md'
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#f45c03] text-white px-5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                      Best Value
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                      {plan.icon}
                    </div>
                    {plan.id !== 'starter' && currentPlan === plan.id && (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase animate-pulse">Active</span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-black mb-1">{plan.name}</h3>
                  <p className="text-gray-400 text-xs font-bold mb-4 line-clamp-1">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-gray-50">
                    <span className={`text-3xl font-black ${isUltimate ? 'text-purple-600' : 'text-black'}`}>{plan.price}</span>
                    <span className="text-gray-400 text-sm font-bold">{plan.period}</span>
                  </div>

                  <div className="flex-grow space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-[#f45c03] mt-0.5" />
                        <span className="text-gray-600 text-[13px] font-bold leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {profile?.subscription_stats && plan.id !== 'starter' && (
                    <div className="mb-6 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 text-[11px] backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-400 font-bold uppercase tracking-tighter">Plan Usage</span>
                        <div className="flex items-center gap-1">
                          <span className="text-black font-black">
                            {plan.id === 'premium' ? profile.subscription_stats.premium : profile.subscription_stats[plan.id as 'free'|'basic'|'star']}
                          </span>
                          <span className="text-gray-400">/</span>
                          <span className="text-gray-500 font-bold">
                            {plan.id === 'premium' ? '∞' : (profile.subscription_stats.limits[plan.id as 'free'|'basic'|'star'] || '-')}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${plan.id === 'premium' ? 'bg-purple-500 w-full' : 'bg-[#f45c03]'}`}
                          style={{ 
                            width: plan.id === 'premium' ? '100%' : `${Math.min(100, (profile.subscription_stats[plan.id as 'free'|'basic'|'star'] / (profile.subscription_stats.limits[plan.id as 'free'|'basic'|'star'] || 1)) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleBuy(plan.id, plan.name)}
                    disabled={loading !== null || status.disabled}
                    className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 ${
                      status.disabled 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : isRecommended || isUltimate
                          ? 'bg-black text-white hover:bg-[#f45c03]' 
                          : 'bg-white border-2 border-black text-black hover:bg-black hover:text-white'
                    }`}
                  >
                    {loading === plan.id ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : status.text}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
