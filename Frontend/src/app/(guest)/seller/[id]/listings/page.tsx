"use client";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdCard, { AdItem } from "@/components/ui/AdCard";
import { API_BASE } from "@/services/apiClient";
import VerifiedBadge from "@/components/VerifiedBadge";
import { Loader2, ArrowLeft, MapPin } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export default function VendorListingsPage({ params }: Props) {
  const { id } = React.use(params);
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState<any>(null);
  const [listings, setListings] = useState<AdItem[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // Fetch seller profile
        const userRes = await fetch(`${API_BASE}/users/${id}`);
        const userData = await userRes.json();
        if (!active || !userData.success) return;

        const u = userData.data;
        setSeller({
          id: u.id,
          name: u.name || "Seller",
          rating: u.rating || 0,
          location: u.businessAddress || "Nigeria",
          isVerified: u.is_verified || false,
          profile_image_url: u.profile_image_url,
        });

        // Fetch ALL active ads for this user (high limit)
        const adsRes = await fetch(`${API_BASE}/ads?userId=${id}&status=active&limit=100`);
        const adsData = await adsRes.json();
        if (active && adsData.success) {
          setListings(adsData.data.map((d: any) => ({
            id: d.id,
            title: d.title,
            price: `₦${Number(d.price).toLocaleString()}`,
            condition: d.condition || "New",
            location: d.location || "Nigeria",
            state: d.state,
            city: d.city,
            views: d.clicks || 0,
            badge: d.image_url || "/assets/images/bgphone.svg",
            rating: d.rating || 0,
          })));
        }
      } catch (err) {
        console.error("Failed to fetch vendor listings", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5 text-yellow-400 text-lg">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < Math.round(rating) ? "★" : "☆"}</span>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Not Found</h2>
          <Link href="/" className="text-orange-600 font-semibold hover:underline">Go to Homepage</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href={`/seller/${seller.id}`}
            className="flex items-center gap-1 text-gray-600 hover:text-orange-600 transition-colors text-sm font-semibold"
          >
            <ArrowLeft size={16} /> Back to Profile
          </Link>
          <span className="text-gray-300">|</span>
          <nav className="text-gray-500 text-sm">
            Home &gt; Seller &gt; <span className="text-orange-600">{seller.name}</span> &gt; All Listings
          </nav>
        </div>

        {/* Vendor Header (Optimized for both Desktop & Mobile) */}
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden flex-shrink-0 border-4 border-orange-50 bg-orange-100 flex items-center justify-center shadow-md">
              {seller.profile_image_url ? (
                <img src={seller.profile_image_url} alt={seller.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-orange-500">{seller.name.slice(0, 1).toUpperCase()}</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col items-center md:items-start gap-2">
                <h1 className="text-3xl font-black text-orange-600 flex items-center gap-2">
                  {seller.name}
                  {seller.isVerified && <VerifiedBadge size={22} showText />}
                </h1>
                
                <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                  <StarRating rating={seller.rating} />
                  <span className="text-gray-600 font-bold text-lg">({Number(seller.rating).toFixed(1)})</span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-1.5 text-gray-500 mt-2">
                  <MapPin size={18} className="text-orange-500" />
                  <span className="font-medium text-base">{seller.location}</span>
                </div>

                <div className="mt-3">
                  <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold border border-green-200">
                    Online
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-end justify-center">
                <div className="text-gray-400 text-sm italic font-medium">Verified Vendor</div>
                <div className="text-orange-600 text-2xl font-black mt-1 tracking-tight">234DEALS EXCLUSIVE</div>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-800">
              All Ads from <span className="text-orange-600">{seller.name}</span>
              <span className="ml-3 text-sm font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{listings.length} items</span>
            </h2>
          </div>

          {listings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center text-gray-500 shadow-sm">
              <p className="text-xl font-semibold mb-2">No active listings found.</p>
              <p className="text-sm">This vendor has no ads currently available for purchase.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-start">
              {listings.map((it) => (
                <AdCard key={it.id} item={it} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
