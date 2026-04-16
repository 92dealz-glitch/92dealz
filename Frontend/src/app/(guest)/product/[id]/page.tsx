"use client";
import React, { useEffect, useState, use } from "react";
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import SimilarItems from '@/components/SimilarItems'
import Button from '@/components/ui/Button'
import { API_BASE, apiFetch } from "@/services/apiClient"
import { logAdView, logContactView } from "@/services/analytics.service"
import { Loader2, CheckCircle2, AlertCircle, Shield, Package, Share2, Copy, Check, Maximize2, X, Heart, Timer, Coins, Eye, ChevronLeft, ChevronDown, Phone, MessageCircle, User, Facebook, Twitter, Instagram, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { createOrder } from "@/services/orders.service"
import VerifiedBadge from "@/components/VerifiedBadge"
import ReportModal from "@/components/ReportModal";
import { useNavUserDetails } from "@/hooks/useNavUserDetails";
import { sendMessage } from "@/services/messages.service";
import VerificationGateModal from "@/components/ui/VerificationGateModal";
import { useAlert } from "@/context/AlertContext";
import { useFavorites } from "@/context/FavoritesProvider";
import { getFlagEmoji } from "@/utils/flagUtils";
import { useCurrency } from "@/context/CurrencyContext";

type Props = {
  params: Promise<{ id: string }>
}

const SpecsGridContent = ({ product }: { product: any }) => (
  <>
    {product.brand && (
      <div className="flex justify-between border-b border-gray-100 pb-2">
        <span className="text-gray-500">Brand</span>
        <span className="font-semibold">{product.brand}</span>
      </div>
    )}
    {product.model && (
      <div className="flex justify-between border-b border-gray-100 pb-2">
        <span className="text-gray-500">Model</span>
        <span className="font-semibold">{product.model}</span>
      </div>
    )}
    {product.color && (
      <div className="flex justify-between border-b border-gray-100 pb-2">
        <span className="text-gray-500">Color</span>
        <span className="font-semibold">{product.color}</span>
      </div>
    )}
    {product.screenSize && (
      <div className="flex justify-between border-b border-gray-100 pb-2">
        <span className="text-gray-500">Screen Size</span>
        <span className="font-semibold">{product.screenSize}</span>
      </div>
    )}
    {product.ram && (
      <div className="flex justify-between border-b border-gray-100 pb-2">
        <span className="text-gray-500">RAM</span>
        <span className="font-semibold">{product.ram}</span>
      </div>
    )}
    {product.internalStorage && (
      <div className="flex justify-between border-b border-gray-100 pb-2">
        <span className="text-gray-500">Storage</span>
        <span className="font-semibold">{product.internalStorage}</span>
      </div>
    )}
    {product.battery && (
      <div className="flex justify-between border-b border-gray-100 pb-2">
        <span className="text-gray-500">Battery</span>
        <span className="font-semibold">{product.battery}</span>
      </div>
    )}
    {product.mainCamera && (
      <div className="flex justify-between border-b border-gray-100 pb-2">
        <span className="text-gray-500">Main Camera</span>
        <span className="font-semibold">{product.mainCamera}</span>
      </div>
    )}
    {product.location && (
      <div className="flex justify-between border-b border-gray-100 pb-2">
        <span className="text-gray-500">Location</span>
        <span className="font-semibold">{product.location}</span>
      </div>
    )}
    {product.subcategory && (
      <div className="flex justify-between border-b border-gray-100 pb-2">
        <span className="text-gray-500">Subcategory</span>
        <span className="font-semibold">{product.subcategory}</span>
      </div>
    )}
    {Object.entries(product.specifications || {}).map(([key, value]) => (
      <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
        <span className="text-gray-500">{key}</span>
        <span className="font-semibold">{String(value)}</span>
      </div>
    ))}
  </>
);

export default function ProductPage({ params }: Props) {
  // Unwrap params using use()
  const { id } = use(params);
  const { showAlert } = useAlert();
  const { isFavorite, toggle } = useFavorites();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const sequence: ("NGN" | "USD" | "CNY")[] = ["NGN", "USD", "CNY"];
  
  const cycleCurrency = () => {
    const currentIndex = sequence.indexOf(currency);
    const nextIndex = (currentIndex + 1) % sequence.length;
    setCurrency(sequence[nextIndex]);
  };
  const fav = isFavorite(id);
  const router = useRouter();
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<any>({
    id, title: '', desc: '', price: '', priceValue: 0, sellerId: '', images: ['/assets/images/bgphone.svg'], condition: '', specifications: {}, subcategory: '', isVerified: false, sellerAddress: ''
  })
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await apiFetch<{ success: boolean; data: any }>(`ads/${id}`);
        if (!active || !data?.success) return
        const d = data.data
        let images = [d.image_url || '/assets/images/bgphone.svg']
        if (d.images_json) {
          try {
            const parsed = typeof d.images_json === 'string' ? JSON.parse(d.images_json) : d.images_json
            if (Array.isArray(parsed) && parsed.length > 0) {
              images = parsed
            }
          } catch (e) {
            console.error("Failed to parse images_json", e)
          }
        }
        const sellerData = await apiFetch<{ success: boolean; data: any }>(`users/${d.userId}`);
        const seller = sellerData?.data || {}
        const sellerName = seller.name || "Seller"
        const createdAt = seller.createdAt ? new Date(seller.createdAt) : new Date();
        const memberSince = createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        setProduct({
          id: d.id,
          title: d.title,
          desc: d.description || '',
          sellerId: String(d.userId),
          sellerName,
          price: `₦${Number(d.price).toLocaleString()}`,
          priceValue: Number(d.price),
          sellerRating: seller.rating || 2.9,
          sellerMemberSince: memberSince,
          sellerTotalAds: seller.total_ads || 0,
          sellerResponseTime: seller.responseTime || "Within 1 hour",
          images,
          condition: d.condition || 'New',
          location: d.location || d.city || 'Nigeria',
          brand: d.brand,
          model: d.model,
          color: d.color,
          negotiable: d.negotiable,
          screenSize: d.screenSize,
          ram: d.ram,
          mainCamera: d.mainCamera,
          selfieCamera: d.selfieCamera,
          battery: d.battery,
          internalStorage: d.internalStorage,
          city: d.city,
          specifications: d.specifications || {},
          subcategory: d.subcategory || '',
          sellerPhone: seller.phone || '',
          sellerEmail: seller.email || '',
          sellerImage: seller.profile_image_url || null,
          isVerified: seller.is_verified || false,
          likes: d.clicks || 0,
          country_code: seller.country_code,
          country_name: seller.country_name,
          sellerAddress: seller.businessAddress || seller.location || '',
          status: d.status,
          rejection_reason: d.rejection_reason
        })
        // log a view
        try { await logAdView(Number(id)); } catch {}
      } catch (err) {
        console.error("Failed to fetch product or seller:", err);
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [id])

  const sampleImages: string[] = Array.isArray(product.images)
    ? (product.images as string[])
    : (product.images ? [String(product.images)] : [])
  const [selected, setSelected] = useState(0)
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description')

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  
  useEffect(() => {
    if (product.sellerId) {
      fetch(`${API_BASE}/reviews/vendor/${product.sellerId}`)
        .then(res => res.json())
        .then(data => { if(data.success) setReviews(data.data); })
        .catch(console.error);
    }
  }, [product.sellerId]);

  const submitReview = async () => {
    if (!reviewText.trim()) return;
    try {
      setSubmittingReview(true);
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      if (!token) { showAlert("Please login to leave a review.", "Authentication Required"); return; }
      if (!isFullyVerified) { setShowGateModal(true); return; }
      
      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ vendor_id: product.sellerId, rating: reviewRating, comment: reviewText })
      });
      const data = await res.json();
      if (data.success) {
        showAlert("Review submitted!", "Review Success");
        setReviewText("");
        // Reload reviews locally
        setReviews([data.data, ...reviews]);
      } else {
        showAlert(data.message || "Failed to submit review.");
      }
    } catch { showAlert("Error submitting review."); }
    finally { setSubmittingReview(false); }
  };

  const [messageModal, setMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("I am interested in this item. Is it still available?");
  const [sendingMessage, setSendingMessage] = useState(false)
  const [orderMessage, setOrderMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [hasLoggedContact, setHasLoggedContact] = useState(false);
  const [showGateModal, setShowGateModal] = useState(false);
  const { isFullyVerified } = useNavUserDetails();
  const isLoggedIn = !!(typeof window !== "undefined" ? window.localStorage.getItem("token") : null);
  const [reportTarget, setReportTarget] = useState<{ productId?: number; vendorId?: number; reportedReviewId?: number; itemName: string }>({ itemName: "" });
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.desc,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled or failed", err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSendMessage = async (textOverride?: string) => {
    const finalMsg = textOverride || messageText;
    if (!finalMsg.trim()) return;
    try {
      setSendingMessage(true);
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      if (!token) {
        showAlert("Please login to send a message", "Authentication Required");
        return;
      }

      // Reverting to built-in messaging as requested by user
      const res = await sendMessage(Number(product.sellerId), finalMsg.trim(), Number(id));
      
      if (res.success) {
        showAlert("Message sent successfully!", "Success");
        setMessageModal(false);
        setMessageText("I am interested in this item. Is it still available?");
        try { await logContactView(Number(id)); } catch {}
      } else {
        showAlert(res.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      showAlert("Error sending message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const handlePlaceOrder = async () => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    if (!token) {
        showAlert("Please login to place an order", "Authentication Required");
        return;
    }

    setIsPlacingOrder(true);
    setOrderMessage(null);
    setShowConfirmModal(false);
    try {
        const numericPrice = Number(product.price.toString().replace(/[^0-9.]/g, ''));
        const res = await createOrder({
            deal_id: Number(product.id),
            vendor_id: Number(product.sellerId),
            price: numericPrice,
            notes: "I am a serious buyer and want to proceed with this purchase immediately."
        });

        if (res.success) {
            setOrderMessage({ type: 'success', text: "Order placed successfully! Redirecting..." });
            setTimeout(() => {
                router.push("/user-dashboard/orders");
            }, 2500);
        } else {
            setOrderMessage({ type: 'error', text: res.message || "Failed to place order. Please try again." });
        }
    } catch (err: any) {
        setOrderMessage({ type: 'error', text: err.message || "An error occurred while placing your order." });
    } finally {
        setIsPlacingOrder(false);
    }
  };

  const currentUser = typeof window !== "undefined" ? JSON.parse(window.localStorage.getItem("user") || "{}") : {};
  const currentUserId = currentUser.id ? String(currentUser.id) : null;
  const currentUserRole = (currentUser.role || "").toLowerCase();
  const isStaff = currentUserRole === 'admin' || currentUserRole === 'csr';
  const isOwner = currentUserId === product.sellerId;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#ff7a2d] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product.id || !product.title) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you are looking for does not exist or has been removed.</p>
          <Link href="/" className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition">
            Go to Homepage
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // MODERATION GATE
  if (product.status !== 'active' && !isStaff && !isOwner) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
            <div className="max-w-md w-full bg-white rounded-md bg-zinc-50/50 p-4 border border-zinc-100 text-center animate-in zoom-in-95 duration-500">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                    product.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                }`}>
                    {product.status === 'pending' ? <Timer size={40} /> : <AlertCircle size={40} />}
                </div>
                <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight mb-2">
                    {product.status === 'pending' ? 'Pending Approval' : 'Listing Rejected'}
                </h1>
                <p className="text-zinc-500 font-medium mb-6">
                    {product.status === 'pending' 
                        ? "This ad is currently being reviewed by our moderation team. It will be visible to everyone once approved."
                        : "This advertisement has been rejected by our team and is hidden from the public marketplace."
                    }
                </p>

                {product.status === 'rejected' && product.rejection_reason && (
                    <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 text-left">
                        <span className="text-[10px] font-black uppercase text-red-400 tracking-widest block mb-1">Rejection Reason</span>
                        <p className="text-red-700 text-sm font-bold leading-relaxed">{product.rejection_reason}</p>
                    </div>
                )}

                <Link href="/" className="inline-flex w-full items-center justify-center bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95">
                    Return to Marketplace
                </Link>
            </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="max-w-[1200px] mx-auto mt-6 px-4 sm:px-6"> 
        {/* Banner for Moderators/Owners */}
        {product.status !== 'active' && (isStaff || isOwner) && (
            <div className={`mb-6 p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
                product.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-800'
            }`}>
               <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                         product.status === 'pending' ? 'bg-amber-200' : 'bg-red-200'
                    }`}>
                        {product.status === 'pending' ? <Timer size={24} /> : <AlertCircle size={24} />}
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-tight text-sm">
                            {isStaff ? "Moderatation Preview" : "Private Preview"} - {product.status.toUpperCase()}
                        </h4>
                        <p className="text-xs font-medium opacity-80">
                            {isStaff ? "You are viewing this as a moderator. It is currently hidden from other users." : "Only you can see this page. It is currently hidden from the public."}
                        </p>
                    </div>
               </div>
               {product.status === 'rejected' && product.rejection_reason && (
                   <div className="flex-1 max-w-lg px-4 border-l border-current/20">
                        <span className="text-[10px] font-black uppercase opacity-60 tracking-wider">Reason for Rejection</span>
                        <p className="text-sm font-bold">{product.rejection_reason}</p>
                   </div>
               )}
            </div>
        )}
        {/* Mobile Header Sub-nav */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-orange-200 py-3 px-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-1 hover:bg-orange-50 rounded-full transition-colors text-[#ff7a2d]">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-sm font-bold text-gray-800 line-clamp-1">{product.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toggle({ id: product.id, title: product.title, priceValue: product.priceValue, price: product.price, img: sampleImages[selected] || sampleImages[0], desc: product.desc, location: product.location, likes: product.likes })}
              className="p-1 hover:bg-orange-50 rounded-full transition-colors"
            >
              <Heart className={`w-6 h-6 ${fav ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
            </button>
            <button onClick={handleShare} className="p-1 hover:bg-orange-50 rounded-full transition-colors text-gray-400">
              <Share2 size={24} />
            </button>
          </div>
        </div>

        <nav className="text-gray-600 text-sm mb-4 hidden sm:block">Home &gt; Products &gt; {product.title}</nav>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* 1. Gallery Section */}
          <section className="lg:col-start-1 rounded-md border-2 border-orange-200 bg-white p-4 sm:p-6">
            <h1 className="hidden lg:block text-3xl font-extrabold text-zinc-900 mb-4">{product.title}</h1>
            <div className="relative">
              <div className="w-full h-[320px] sm:h-[420px] md:h-[480px] lg:h-[520px] rounded-md overflow-hidden border border-orange-200">
                <img src={sampleImages[selected]} alt={product.title || 'image'} className="w-full h-full object-cover block" />
              </div>

              {/* Left/Right arrows */}
              <button
                aria-label="previous image"
                type="button"
                onClick={() => setSelected((prev) => (prev - 1 + sampleImages.length) % sampleImages.length)}
                className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 border border-gray-200 items-center justify-center"
              >
                ‹
              </button>
              <button
                aria-label="next image"
                type="button"
                onClick={() => setSelected((prev) => (prev + 1) % sampleImages.length)}
                className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 border border-gray-200 items-center justify-center"
              >
                ›
              </button>

              <div className="absolute bottom-5 right-5 z-10">
                <button 
                  onClick={() => setIsLightboxOpen(true)}
                  className="flex items-center gap-2 bg-white/90 hover:bg-white text-[#ff7a2d] px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  <Maximize2 size={16} />
                  View Image
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 overflow-x-auto">
              {sampleImages.map((src: string, i: number) => (
                <button
                  key={`${src}-${i}`}
                  onClick={() => setSelected(i)}
                  type="button"
                  className={`flex-shrink-0 w-14 h-10 sm:w-20 sm:h-14 rounded overflow-hidden border ${i === selected ? 'border-orange-200' : 'border-gray-200'} p-0`}
                  aria-label={`thumbnail-${i}`}
                >
                  <img src={src} className="w-full h-full object-cover" alt={`${product.title} thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          </section>

          {/* Product Info Section (Title visible on mobile, hidden on desktop here) */}
          <div className="space-y-4 px-1">
            <div className="space-y-1">
              <h1 className="text-xl lg:hidden font-extrabold text-zinc-900 leading-tight capitalize lg:mb-4">{product.title}</h1>
            </div>

            <div className="lg:hidden flex flex-wrap items-center justify-between gap-3">
              <div className="text-2xl font-black text-[#ff7a2d]">
                {product.priceValue ? formatPrice(product.priceValue) : product.price}
              </div>
              <div className="lg:hidden flex flex-wrap items-center gap-2">
                <span className="bg-[#24b17a] text-white px-3 py-1 rounded-md text-[10px] font-black uppercase shadow-sm">
                  {product.condition || "Brand New"}
                </span>
                <span className="bg-[#a3a1a1] text-white px-3 py-1 rounded-md text-[10px] font-black uppercase shadow-sm">
                  Negotiable
                </span>
                <div className="flex items-center gap-1.5 text-zinc-600 text-[11px] font-bold">
                  <Eye size={16} />
                  <span>{product.likes} views</span>
                </div>
              </div>
            </div>

            {/* Mobile Actions - Hidden on Desktop to maintain original sidebar layout */}
            <div className="lg:hidden grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => {
                   if (!isLoggedIn || !isFullyVerified) { setShowGateModal(true); return; }
                   if (product.sellerPhone) {
                      window.location.href = `tel:${product.sellerPhone.replace(/\D/g,"")}`;
                   } else {
                      showAlert("Phone number not available", "Seller Contact");
                   }
                }}
                className="flex items-center justify-center gap-2 bg-[#ff7a2d] text-white py-3.5 rounded-xl font-black text-sm shadow-lg shadow-orange-100 active:scale-95 transition-all"
              >
                <Phone size={18} fill="currentColor" />
                Contact Seller
              </button>
              <button 
                onClick={() => {
                  if (!isLoggedIn || !isFullyVerified) { setShowGateModal(true); return; }
                  router.push(`/messages?userId=${product.sellerId}&dealId=${product.id}`);
                }}
                className="flex items-center justify-center gap-2 bg-[#ff7a2d] text-white py-3.5 rounded-xl font-black text-sm shadow-lg shadow-orange-100 active:scale-95 transition-all"
              >
                <div className="relative">
                  <MessageCircle size={18} fill="currentColor" />
                </div>
                Chat Seller
              </button>
            </div>
          </div>

          {/* 2. Description & Specs Section (Accordions for Mobile, Tabs for Desktop) */}
          <section className="lg:col-start-1 space-y-4">
            {/* Desktop Tabs View */}
            <div className="hidden lg:block rounded-lg border-2 border-orange-200 bg-white p-6">
              <div className="border-b pb-3 mb-6">
                <div className="flex gap-8">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`pb-2 font-bold text-sm uppercase transition-all ${activeTab === 'description' ? 'text-[#ff7a2d] border-b-2 border-orange-600' : 'text-gray-500'}`}
                  >
                    PRODUCT DESCRIPTION
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2 font-bold text-sm uppercase transition-all ${activeTab === 'specs' ? 'text-[#ff7a2d] border-b-2 border-orange-600' : 'text-gray-500'}`}
                  >
                    SPECIFICATIONS
                  </button>
                </div>
              </div>

              <div className="text-gray-800 leading-relaxed">
                {activeTab === 'description' ? (
                  <div className="whitespace-pre-wrap">{product.desc || "No description provided."}</div>
                ) : (
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <SpecsGridContent product={product} />
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Accordion View */}
            <div className="lg:hidden space-y-3">
              <details className="group lg:rounded-md lg:border-2 lg:border-orange-200 border-0 bg-white lg:overflow-hidden lg:shadow-sm" open>
                <summary className="flex items-center justify-between p-4 lg:p-4 p-3 cursor-pointer list-none font-black text-sm text-gray-800 uppercase bg-zinc-50/50">
                  PRODUCT DESCRIPTION
                  <ChevronDown size={18} className="text-[#ff7a2d] transition-transform group-open:rotate-180" />
                </summary>
                <div className="p-4 lg:p-4 p-3 text-sm text-gray-600 leading-relaxed border-t border-zinc-100">
                  {product.desc || "No description provided."}
                </div>
              </details>

              <details className="group lg:rounded-md lg:border-2 lg:border-orange-200 border-0 bg-white lg:overflow-hidden lg:shadow-sm">
                <summary className="flex items-center justify-between p-4 lg:p-4 p-3 cursor-pointer list-none font-black text-sm text-gray-800 uppercase bg-zinc-50/50">
                  SPECIFICATION
                  <ChevronDown size={18} className="text-[#ff7a2d] transition-transform group-open:rotate-180" />
                </summary>
                <div className="p-4 lg:p-4 p-3 text-sm border-t border-zinc-100">
                  <div className="grid grid-cols-1 gap-2">
                    <SpecsGridContent product={product} />
                  </div>
                </div>
              </details>
            </div>
          </section>

          {/* 3. Sidebar (Price Section + Seller Info) - Spans all rows on desktop to avoid gaps */}
          <aside className="lg:col-start-2 lg:row-start-1 lg:row-span-4 space-y-4 hidden lg:block">
            <div className="rounded-md bg-white border-2 border-orange-200 p-6 shadow-sm relative">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="text-3xl font-extrabold text-[#ff7a2d]">
                  {product.priceValue ? formatPrice(product.priceValue) : product.price}
                </div>
                <button 
                  onClick={cycleCurrency}
                  title="Click to change currency"
                  className="flex items-center justify-center p-2 rounded-md bg-orange-50 text-[#ff7a2d] hover:bg-orange-100 transition-all shadow-sm active:scale-90"
                >
                  <Coins size={24} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-xs font-bold uppercase">
                  {product.condition || 'New'}
                </span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-medium uppercase">Negotiable</span>
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-bold ml-auto">
                    <Eye size={14} />
                    <span>{product.likes} views</span>
                </div>
              </div>

              {orderMessage && (
                <div className={`mt-4 p-3 rounded-md flex items-center gap-2 text-sm font-bold ${orderMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                   {orderMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                   {orderMessage.text}
                </div>
              )}

              <div className="mt-6 space-y-3">
                <Button 
                  onClick={() => {
                    if (!isLoggedIn || !isFullyVerified) {
                      setShowGateModal(true);
                      return;
                    }
                    setMessageText("I am interested in your product.");
                    setMessageModal(true);
                  }} 
                  className="w-full bg-orange-600 text-white py-3"
                >
                  Send Message to seller
                </Button>
                <Button 
                  onClick={() => {
                    if (!isLoggedIn || !isFullyVerified) {
                      setShowGateModal(true);
                      return;
                    }
                    router.push(`/messages?userId=${product.sellerId}&dealId=${product.id}`);
                  }}
                  className="w-full bg-orange-600 text-white py-3 font-bold"
                >
                  💬 Chat Seller
                </Button>
              </div>
            </div>

            {/* 4. Seller Information */}
            <div className="rounded-md bg-white border-2 border-orange-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Seller Information</h3>
                <div className="text-xs text-gray-500">● Last seen 12:01 PM</div>
              </div>

              <div className="border-t border-b border-gray-100 py-3">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-md bg-orange-505 text-white flex items-center justify-center font-bold overflow-hidden">
                      {product.sellerImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.sellerImage} alt="" className="w-full h-full object-cover" />
                      ) : (product.sellerName || 'S').slice(0,1)}
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-1.5">
                        <Link href={`/seller/${product.sellerId}`} className="hover:underline text-[#ff7a2d]">{product.sellerName || 'Seller'}</Link>
                        {product.country_code && <span className="text-xl" title={product.country_name}>{getFlagEmoji(product.country_code)}</span>}
                        {product.isVerified && <VerifiedBadge size={16} showText />}
                      </div>
                      <div className="text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="text-lg">{i < Math.floor(product.sellerRating || 0) ? "⭐️" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>Member Since:</div><div className="font-medium">{product.sellerMemberSince || "January 2023"}</div>
                  <div>Location:</div><div className="font-medium">{product.country_name || product.location}</div>
                  <div>Total Ads Posted:</div><div className="font-medium">{product.sellerTotalAds || 0} items</div>
                  <div>Response Time:</div><div className="font-medium">{product.sellerResponseTime || "Within 1 hour"}</div>
                  <div>Customer Rating:</div><div className="font-medium">{(product.sellerRating || 2.9).toFixed(1)}/5.0</div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Link 
                  href={`/seller/${product.sellerId}`} 
                  className="w-full flex items-center justify-center bg-[#ff7a2d] text-white py-2.5 rounded-md font-bold transition-all hover:bg-orange-600 shadow-sm mb-2"
                >
                  <User size={18} className="mr-2" />
                  View Seller Profile
                </Link>
                <Link 
                  href={`/seller/${product.sellerId}/listings`} 
                  className="w-full flex items-center justify-center bg-[#ff7a2d] text-white py-2.5 rounded-md font-bold transition-all hover:bg-orange-600 shadow-sm"
                >
                  <Package size={18} className="mr-2" />
                  See All Ads from Seller
                </Link>
                <button 
                  onClick={() => {
                    setReportTarget({ productId: product.id, itemName: product.title });
                    setShowReportModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-red-500 font-bold text-sm hover:bg-red-50 rounded-md border border-red-100 transition-colors mt-2"
                >
                  🚩 Report this Ad
                </button>
              </div>
            </div>

            {/* 5. Contact Options */}
            <div className="rounded-md border-2 border-orange-200 bg-white">
              <button 
                onClick={async () => {
                  if (!isLoggedIn || !isFullyVerified) {
                    setShowGateModal(true);
                    return;
                  }
                  if (!showContactOptions && !hasLoggedContact) {
                    try {
                      await logContactView(Number(id));
                      setHasLoggedContact(true);
                    } catch (err) {
                      console.error("Failed to log contact view:", err);
                    }
                  }
                  setShowContactOptions(!showContactOptions);
                }}
                className="w-full p-4 flex items-center justify-between font-semibold"
              >
                <span>View Contact Options</span>
                <span className={`transition-transform duration-300 ${showContactOptions ? 'rotate-180' : ''}`}>▼</span>
              </button>
              
              {showContactOptions && (
                <div className="p-4 pt-0 space-y-3">
                  {product.sellerPhone ? (
                    <button 
                      onClick={() => {
                        if (!isLoggedIn || !isFullyVerified) {
                          setShowGateModal(true);
                          return;
                        }
                        window.location.href = `tel:${product.sellerPhone.replace(/\D/g,'')}`;
                      }}
                      className="w-full bg-[#ff7a2d] text-white py-3 rounded-md flex items-center justify-center gap-2 font-bold hover:bg-orange-600 transition-colors"
                    >
                      📞 {product.sellerPhone}
                    </button>
                  ) : (
                    <button type="button" onClick={() => showAlert("Phone number not available", "Seller Contact")} className="w-full bg-[#ff7a2d] text-white py-3 rounded-md flex items-center justify-center gap-2 font-bold opacity-70 cursor-not-allowed">
                      📞 Not Available
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (!isLoggedIn || !isFullyVerified) {
                        setShowGateModal(true);
                        return;
                      }
                      window.open(`https://wa.me/${product.sellerPhone?.replace(/\D/g,'')}`, '_blank');
                    }}
                    className="w-full inline-flex bg-green-500 text-white py-3 rounded-md items-center justify-center gap-2 font-bold hover:bg-green-600 transition-colors"
                  >
                    💬 Whatsapp
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      if (!isLoggedIn || !isFullyVerified) {
                        setShowGateModal(true);
                        return;
                      }
                      setMessageModal(true);
                    }} 
                    className="w-full bg-[#ff7a2d] text-white py-3 rounded-md flex items-center justify-center gap-2 font-bold hover:bg-orange-600 transition-colors"
                  >
                    💬 Chat Seller
                  </button>
                  <div className="mt-4 text-sm text-gray-600 flex items-start gap-2">
                    <span className="flex-shrink-0">📍</span>
                    <span className="font-medium whitespace-pre-wrap">{product.sellerAddress || product.location || "Location not specified"}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setReportTarget({ vendorId: product.sellerId, itemName: product.sellerName || "this seller" });
                      setShowReportModal(true);
                    }}
                    className="mt-4 w-full border border-red-300 text-red-600 py-2 rounded-md hover:bg-red-50 transition-colors font-bold"
                  >
                    🚩 Report this seller
                  </button>
                </div>
              )}
            </div>

            {/* 8. Share Section */}
            <div className="lg:rounded-md lg:border-2 lg:border-orange-200 border-0 bg-white lg:p-5 p-4 lg:shadow-sm">
              <h5 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                Share With Friends
              </h5>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.open(`https://www.instagram.com/`, '_blank')}
                  className="w-10 h-10 rounded-full bg-[#ff7a2d] flex items-center justify-center text-white hover:bg-orange-600 transition-all shadow-md active:scale-90"
                >
                  <Instagram size={20} />
                </button>
                <button 
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="w-10 h-10 rounded-full bg-[#ff7a2d] flex items-center justify-center text-white hover:bg-orange-600 transition-all shadow-md active:scale-90"
                >
                  <Facebook size={20} fill="currentColor" />
                </button>
                <button 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="w-10 h-10 rounded-full bg-[#ff7a2d] flex items-center justify-center text-white hover:bg-orange-600 transition-all shadow-md active:scale-90"
                >
                  <Twitter size={20} fill="currentColor" />
                </button>
                <button 
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="w-10 h-10 rounded-full bg-[#ff7a2d] flex items-center justify-center text-white hover:bg-orange-600 transition-all shadow-md active:scale-90"
                >
                  <div className="relative">
                    <MessageCircle size={20} fill="currentColor" />
                  </div>
                </button>
                <button 
                  onClick={handleCopyLink}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-full text-xs font-bold text-zinc-500 hover:bg-zinc-100 transition-all"
                >
                  {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar (Only Seller Info for mobile, since price is above) */}
          <aside className="lg:hidden space-y-4">
            {/* 4. Seller Information (Mobile Card) */}
            <div className="lg:rounded-md lg:border-2 lg:border-orange-200 border-0 bg-white p-4 lg:shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-100 pb-2">
                <h3 className="font-bold text-gray-800">Seller Information</h3>
                <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 font-bold uppercase">
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-md" />
                  Last seen 12:01 PM
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-md bg-[#ff7a2d] text-white flex items-center justify-center font-bold overflow-hidden shadow-lg border-2 border-white">
                    {product.sellerImage ? (
                      <img src={product.sellerImage} alt="" className="w-full h-full object-cover" />
                    ) : (product.sellerName || 'S').slice(0,1)}
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-gray-900 flex items-center gap-1.5">
                      {product.sellerName || 'Seller'}
                      {product.isVerified && <VerifiedBadge size={14} />}
                    </div>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-sm">{i < Math.floor(product.sellerRating || 0) ? "⭐" : "☆"}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 bg-zinc-50/50 p-4 rounded-md border border-zinc-100">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-zinc-500 font-medium">Member Since:</span>
                    <span className="font-bold text-zinc-900">{product.sellerMemberSince || "January 2023"}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-zinc-500 font-medium">Total Ads Posted:</span>
                    <span className="font-bold text-zinc-900">{product.sellerTotalAds || 0} items</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-zinc-500 font-medium">Response Time:</span>
                    <span className="font-bold text-zinc-900">{product.sellerResponseTime || "Within 1 hour"}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-zinc-500 font-medium">Customer Rating:</span>
                    <span className="font-bold text-zinc-900">{(product.sellerRating || 2.9).toFixed(1)}/5.0</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    href={`/seller/${product.sellerId}`} 
                    className="flex items-center justify-center bg-[#ff7a2d] text-white py-3.5 rounded-md font-black text-[12px] hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 active:scale-95"
                  >
                    <User size={16} className="mr-1.5" />
                    View Profile
                  </Link>
                  <Link 
                    href={`/seller/${product.sellerId}/listings`} 
                    className="flex items-center justify-center bg-white text-[#ff7a2d] border-2 border-[#ff7a2d] py-3.5 rounded-md font-black text-[12px] hover:bg-orange-50 transition-all active:scale-95"
                  >
                    <Package size={16} className="mr-1.5" />
                    All Ads
                  </Link>
                </div>
              </div>
            </div>

            {/* 8. Share Section (Mobile) */}
            <div className="lg:rounded-md lg:border-2 lg:border-orange-200 border bg-white p-4 shadow-sm mb-4">
                <h5 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  Share With Friends
                </h5>
                <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-hide">
                  <button 
                    onClick={() => window.open(`https://www.instagram.com/`, '_blank')}
                    className="w-10 h-10 shrink-0 rounded-full bg-[#ff7a2d] flex items-center justify-center text-white active:scale-90 transition-all"
                  >
                    <Instagram size={20} />
                  </button>
                  <button 
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="w-10 h-10 shrink-0 rounded-full bg-[#ff7a2d] flex items-center justify-center text-white active:scale-90 transition-all"
                  >
                    <Facebook size={20} fill="currentColor" />
                  </button>
                  <button 
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="w-10 h-10 shrink-0 rounded-full bg-[#ff7a2d] flex items-center justify-center text-white active:scale-90 transition-all"
                  >
                    <Twitter size={20} fill="currentColor" />
                  </button>
                  <button 
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="w-10 h-10 shrink-0 rounded-full bg-[#ff7a2d] flex items-center justify-center text-white active:scale-90 transition-all"
                  >
                    <MessageCircle size={20} fill="currentColor" />
                  </button>
                  <button 
                    onClick={handleCopyLink}
                    className="ml-auto shrink-0 flex items-center gap-1.5 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full text-xs font-bold text-zinc-500"
                  >
                    {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
            </div>
          </aside>

          {/* 6. Reviews Section */}
          <section className="lg:col-start-1 lg:rounded-md lg:border-2 lg:border-orange-200 border-0 bg-white overflow-hidden">
              <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                <h4 className="font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide text-sm">Customer Reviews</h4>
                <div className="flex items-center gap-2">
                   <span className="bg-orange-100 text-[#ff7a2d] px-3 py-1 rounded-full text-[10px] font-black">{reviews.length}</span>
                </div>
              </div>
              
              {!isFullyVerified ? (
                <div className="p-10 text-center bg-zinc-50/50">
                    <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-[#ff7a2d]">
                        <Shield size={32} />
                    </div>
                    <h5 className="text-lg font-black text-zinc-900 mb-2">Verify Your Account</h5>
                    <p className="text-zinc-500 text-xs max-w-xs mx-auto mb-6 leading-relaxed">
                        To build trust and access full reviews, please verify your identity and account status.
                    </p>
                    <button 
                      onClick={() => setShowGateModal(true)}
                      className="inline-flex items-center gap-2 bg-[#ff7a2d] text-white px-8 py-3 rounded-md font-black text-sm shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95"
                    >
                      Verify Now
                    </button>
                </div>
              ) : (
                <div className="lg:p-6 p-4">
                  {/* Leave a review box */}
                  <div className="mb-6 p-4 bg-zinc-50/50 rounded-md border border-zinc-100">
                      <h5 className="font-bold text-xs text-gray-900 mb-3 uppercase tracking-wider">Leave a Review for {product.sellerName}</h5>
                      <div className="flex gap-1 mb-4">
                        {[1,2,3,4,5].map(star => (
                           <button key={star} type="button" onClick={() => setReviewRating(star)} className={`text-2xl transition-all hover:scale-110 ${reviewRating >= star ? 'text-amber-400' : 'text-gray-200'}`}>★</button>
                        ))}
                      </div>
                      <textarea 
                         value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                         placeholder="Share your experience..."
                         className="w-full text-sm border-zinc-200 rounded-md p-3 focus:ring-2 focus:ring-orange-500 outline-none mb-3 resize-none" rows={3} />
                      <button 
                        disabled={submittingReview || !reviewText.trim()} 
                        onClick={submitReview} 
                        className="bg-zinc-900 text-white px-6 py-2.5 rounded-md font-bold text-xs shadow-md hover:bg-orange-600 transition-all disabled:opacity-50"
                      >
                         {submittingReview ? "Submitting..." : "Post Review"}
                      </button>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 italic">No reviews yet.</div>
                  ) : (
                    <div className="flex lg:grid lg:grid-cols-2 overflow-x-auto gap-4 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                      {reviews.map((r: any) => (
                        <div key={r.id} className="min-w-[280px] lg:min-w-0 flex-shrink-0 bg-white border border-zinc-200 rounded-md p-5 shadow-sm flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-50 border-2 border-white shadow-md flex items-center justify-center font-black text-[#ff7a2d]">
                                  {r.Reviewer?.profile_image_url ? (
                                    <img src={r.Reviewer.profile_image_url} alt={r.Reviewer.name} className="w-full h-full object-cover" />
                                  ) : (r.Reviewer?.name || 'U').slice(0, 2)}
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900 text-sm">{r.Reviewer?.name || "Samuel James"}</div>
                                  <div className="text-[10px] text-gray-400 font-bold uppercase">{new Date(r.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</div>
                                </div>
                              </div>
                              <button className="text-gray-400 p-1 hover:text-gray-600 transition-colors">
                                <MoreVertical size={18} />
                              </button>
                            </div>
                            
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                              {r.comment || "Very polite and honest. Product was clean and in great condition."}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-50">
                            <div className="flex items-center gap-4">
                              <span className="text-[11px] font-bold text-zinc-400">Helpful?</span>
                              <div className="flex items-center gap-3">
                                <button className="flex items-center gap-1.5 text-zinc-400 hover:text-orange-500 transition-colors">
                                  <ThumbsUp size={14} />
                                </button>
                                <button className="flex items-center gap-1.5 text-zinc-400 hover:text-orange-500 transition-colors">
                                  <ThumbsDown size={14} />
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex text-amber-400 text-xs">
                              {Array.from({length: 5}).map((_, i) => (<span key={i}>{i < Math.round(r.rating) ? '★' : '☆'}</span>))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
          </section>

          {/* 7. Safety / Before you buy Section */}
          <section className="lg:col-start-1 lg:rounded-md lg:border-2 lg:border-orange-200 border-0 bg-white lg:p-4 p-4 pb-8">
            <h4 className="font-semibold mb-3">Before you buy</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
              <li>Check feedbacks to make sure the person is reliable.</li>
              <li>Make sure that the person is a verified seller.</li>
              <li>Ensure the seller's profile picture clearly shows the face so you know who you are dealing with.</li>
              <li>Agree on the product/service before committing yourself.</li>
              <li>For products, ensure that what's in the package is exactly what you expect.</li>
              <li>Avoid sending any prepayments.</li>
              <li>Meet in person at a safe public place.</li>
              <li>Check all the docs and only pay if you're satisfied.</li>
            </ul>
          </section>
        </div>

        {/* --- Lightbox Modal --- */}
        {isLightboxOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110]"
            >
              <X size={32} />
            </button>
            <div className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center">
              <img 
                src={sampleImages[selected]} 
                alt={product.title} 
                className="max-w-full max-h-full object-contain rounded-md shadow-2xl" 
              />
              
              {/* Optional: Nav arrows inside lightbox for mobile ease */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none px-4">
                 <button
                    onClick={(e) => { e.stopPropagation(); setSelected((prev) => (prev - 1 + sampleImages.length) % sampleImages.length); }}
                    className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all sm:hidden"
                  >
                    ‹
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelected((prev) => (prev + 1) % sampleImages.length); }}
                    className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all sm:hidden"
                  >
                    ›
                  </button>
              </div>
            </div>
          </div>
        )}
        <ReportModal 
          isOpen={showReportModal} 
          onClose={() => {
            setShowReportModal(false);
          }} 
          productId={reportTarget.productId}
          vendorId={reportTarget.vendorId}
          reportedReviewId={reportTarget.reportedReviewId}
          itemName={reportTarget.itemName}
        />

        {/* --- Message Seller Modal --- */}
        {messageModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMessageModal(false)}></div>
             <div className="relative bg-white rounded-md w-full max-w-md shadow-2xl overflow-hidden border border-orange-100">
               <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
                 <h3 className="font-bold text-gray-900">Message Seller</h3>
                 <button onClick={() => setMessageModal(false)} className="text-gray-400 hover:text-[#ff7a2d] transition-colors">
                   <X size={20} />
                 </button>
               </div>
               <div className="p-6">
                 <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-md">
                   <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold overflow-hidden shadow-inner">
                     {product.sellerImage ? <img src={product.sellerImage} className="w-full h-full object-cover" alt="" /> : (product.sellerName || 'S').slice(0,1)}
                   </div>
                   <div>
                     <div className="font-bold text-gray-900">{product.sellerName}</div>
                     {product.isVerified && <div className="text-xs text-[#ff7a2d] font-medium">Verified Seller</div>}
                   </div>
                 </div>

                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Message</label>
                 <textarea 
                   value={messageText} 
                   onChange={(e) => setMessageText(e.target.value)}
                   placeholder="Hi, is this still available?"
                   className="w-full border-2 border-gray-100 rounded-md p-4 text-sm focus:border-orange-200 outline-none transition-all resize-none min-h-[120px]"
                 />
                 
                 <div className="mt-6 flex gap-3">
                   <button 
                     onClick={() => setMessageModal(false)}
                     className="flex-1 py-3 rounded-md font-bold text-gray-500 hover:bg-gray-100 transition-colors border-2 border-transparent"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={() => handleSendMessage()}
                     disabled={sendingMessage || !messageText.trim()}
                     className="flex-1 bg-orange-600 text-white py-3 rounded-md font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 disabled:opacity-50 flex items-center justify-center gap-2"
                   >
                     {sendingMessage ? (
                       <>
                         <Loader2 className="w-4 h-4 animate-spin" />
                         Sending...
                       </>
                     ) : (
                       "Send Message"
                     )}
                   </button>
                 </div>
               </div>
             </div>
          </div>
        )}
      </main>

      <SimilarItems />
      <VerificationGateModal 
        isOpen={showGateModal} 
        onClose={() => setShowGateModal(false)} 
      />
      <Footer />
    </div>
  )
}
