"use client";
import React, { useEffect, useState, use } from "react"
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import SimilarItems from '@/components/SimilarItems'
import Button from '@/components/ui/Button'
import { API_BASE, apiFetch } from "@/services/apiClient"
import { logAdView, logContactView } from "@/services/analytics.service"
import { Loader2, CheckCircle2, AlertCircle, Shield, Package, Share2, Copy, Check, Maximize2, X, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { createOrder } from "@/services/orders.service"
import VerifiedBadge from "@/components/VerifiedBadge"
import ReportModal from "@/components/ReportModal";
import { useAlert } from "@/context/AlertContext";
import { useFavorites } from "@/context/FavoritesProvider";

type Props = {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: Props) {
  // Unwrap params using use()
  const { id } = use(params);
  const { showAlert } = useAlert();
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(id);
  const router = useRouter();
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<any>({
    id, title: '', desc: '', price: '', sellerId: '', images: ['/assets/images/bgphone.svg'], condition: '', specifications: {}, subcategory: '', isVerified: false
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
          price: `₦${Number(d.price).toLocaleString()}`,
          sellerId: String(d.userId),
          sellerName,
          sellerRating: seller.rating || 2.9,
          sellerMemberSince: memberSince,
          sellerTotalAds: seller.total_ads || 0,
          sellerResponseTime: seller.responseTime || "Within 1 hour",
          images,
          condition: d.condition || 'Brand New',
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
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false)
  const [orderMessage, setOrderMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);
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
      const res = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to_user_id: Number(product.sellerId),
          deal_id: Number(product.id),
          content: finalMsg.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showAlert("Message sent successfully!", "Message Sent");
        setMessageModal(false);
        setMessageText("");
        try { await logContactView(Number(product.id)); } catch {}
      } else {
        showAlert(data.message || "Failed to send message");
      }
    } catch (err) {
      showAlert("An error occurred while sending the message");
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

  return (
    <div>
      <Navbar />
      <main className="max-w-[1200px] mx-auto mt-6 px-4 sm:px-6">
        <nav className="text-gray-600 text-sm mb-4">Home &gt; Products &gt; {product.title}</nav>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* 1. Gallery Section */}
          <section className="lg:col-start-1 rounded-lg border-2 border-orange-300 bg-white p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-extrabold text-orange-600 break-words leading-tight">{product.title}</h1>
              </div>
              <div className="flex items-center gap-3">
               <button 
                 onClick={(e) => {
                    e.preventDefault();
                    toggle({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      img: sampleImages[selected] || sampleImages[0],
                      desc: product.desc,
                      location: product.location,
                      likes: product.likes,
                    });
                 }}
                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
               >
                 <Heart className={`w-5 h-5 ${fav ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />
                 <span className={`text-sm font-semibold ${fav ? 'text-red-500' : 'text-gray-700'}`}>
                   {fav ? 'Favorited' : 'Add to Favorites'}
                 </span>
               </button>
              </div>
            </div>

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
                  className="flex items-center gap-2 bg-white/90 hover:bg-white text-orange-600 px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
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
                  className={`flex-shrink-0 w-14 h-10 sm:w-20 sm:h-14 rounded overflow-hidden border ${i === selected ? 'border-orange-500' : 'border-gray-200'} p-0`}
                  aria-label={`thumbnail-${i}`}
                >
                  <img src={src} className="w-full h-full object-cover" alt={`${product.title} thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          </section>

          {/* 2. Description & Specs Section (Now above Price on Mobile) */}
          <section className="lg:col-start-1 space-y-6">
            <div className="rounded-lg border border-orange-200 bg-white p-4">
              <div className="border-b pb-3">
                <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-1 scrollbar-hide">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`pb-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${activeTab === 'description' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500'}`}
                  >
                    PRODUCT DESCRIPTION
                  </button>

                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${activeTab === 'specs' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500'}`}
                  >
                    SPECIFICATIONS
                  </button>
                </div>
              </div>

              <div className="mt-4 text-gray-800 leading-relaxed">
                {activeTab === 'description' && (
                  <div className="whitespace-pre-wrap">
                    {product.desc || "No description provided."}
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 3. Sidebar (Price Section + Seller Info) - Spans all rows on desktop to avoid gaps */}
          <aside className="lg:col-start-2 lg:row-start-1 lg:row-span-4 space-y-4">
            <div className="rounded-lg bg-white border border-orange-200 p-6 shadow-sm relative">
              <div className="text-3xl font-extrabold text-orange-600">{product.price}</div>
              <div className="mt-4 flex items-center gap-2">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-medium uppercase">Negotiable</span>
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded text-xs font-bold uppercase">
                  {product.condition === "Brand New" ? "New" : (product.condition?.replace(/_/g, ' ') || 'New')}
                </span>
              </div>

              {orderMessage && (
                <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm font-bold ${orderMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                   {orderMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                   {orderMessage.text}
                </div>
              )}

              <div className="mt-6 space-y-3">
                <Button 
                  onClick={() => {
                    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
                    if (!token) { showAlert("Please login to contact seller", "Authentication Required"); return; }
                    handleSendMessage("I'm interested in your product.");
                  }} 
                  className="w-full bg-orange-600 text-white py-3"
                  disabled={sendingMessage}
                >
                  {sendingMessage ? "Sending..." : "📞 Contact Seller"}
                </Button>
                <Link 
                  href={`/messages?userId=${product.sellerId}&dealId=${product.id}`}
                  className="w-full"
                >
                  <Button 
                    className="w-full bg-orange-600 text-white py-3 font-bold"
                  >
                    💬 Chat Seller
                  </Button>
                </Link>
              </div>
            </div>

            {/* 4. Seller Information */}
            <div className="rounded-lg bg-white border border-orange-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Seller Information</h3>
                <div className="text-xs text-gray-500">● Last seen 12:01 PM</div>
              </div>

              <div className="border-t border-b border-gray-100 py-3">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-505 text-white flex items-center justify-center font-bold overflow-hidden">
                      {product.sellerImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.sellerImage} alt="" className="w-full h-full object-cover" />
                      ) : (product.sellerName || 'S').slice(0,1)}
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-1.5">
                        <Link href={`/seller/${product.sellerId}`} className="hover:underline text-orange-600">{product.sellerName || 'Seller'}</Link>
                        {product.isVerified && <VerifiedBadge size={16} showText />}
                      </div>
                      <div className="text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="text-lg">{i < Math.floor(product.sellerRating || 0) ? "⭐️" : "☆"}</span>
                        ))}
                      </div>
                      <div className="mt-2">
                        <Link href={`/seller/${product.sellerId}`} className="text-sm text-orange-500 font-medium">View Seller Profile</Link>
                      </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>Member Since:</div><div className="font-medium">{product.sellerMemberSince || "January 2023"}</div>
                  <div>Total Ads Posted:</div><div className="font-medium">{product.sellerTotalAds || 0} items</div>
                  <div>Response Time:</div><div className="font-medium">{product.sellerResponseTime || "Within 1 hour"}</div>
                  <div>Customer Rating:</div><div className="font-medium">{(product.sellerRating || 2.9).toFixed(1)}/5.0</div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Link href={`/seller/${product.sellerId}/listings`} className="w-full inline-block text-center bg-orange-600 text-white py-2 rounded font-bold transition-all hover:bg-orange-700 shadow-sm">📋 See All Ads from Seller</Link>
                <button 
                  onClick={() => {
                    setReportTarget({ productId: product.id, itemName: product.title });
                    setShowReportModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-red-500 font-bold text-sm hover:bg-red-50 rounded border border-red-100 transition-colors mt-2"
                >
                  🚩 Report this Ad
                </button>
              </div>
            </div>

            {/* 5. Contact Options */}
            <div className="rounded-lg border border-orange-200 bg-white">
              <button 
                onClick={() => setShowContactOptions(!showContactOptions)}
                className="w-full p-4 flex items-center justify-between font-semibold"
              >
                <span>Contact Options</span>
                <span className={`transition-transform duration-300 ${showContactOptions ? 'rotate-180' : ''}`}>▼</span>
              </button>
              
              {showContactOptions && (
                <div className="p-4 pt-0 space-y-3">
                  {product.sellerPhone ? (
                    <a 
                      href={`tel:${product.sellerPhone.replace(/\D/g,'')}`}
                      className="w-full bg-orange-600 text-white py-3 rounded flex items-center justify-center gap-2 font-bold hover:bg-orange-700 transition-colors"
                    >
                      📞 {product.sellerPhone}
                    </a>
                  ) : (
                    <button type="button" onClick={() => showAlert("Phone number not available", "Seller Contact")} className="w-full bg-orange-600 text-white py-3 rounded flex items-center justify-center gap-2 font-bold opacity-70 cursor-not-allowed">
                      📞 Not Available
                    </button>
                  )}
                  <a href={`https://wa.me/${product.sellerPhone?.replace(/\D/g,'')}`} className="w-full inline-flex bg-green-500 text-white py-3 rounded items-center justify-center gap-2 font-bold hover:bg-green-600 transition-colors">💬 Whatsapp</a>
                  <button type="button" onClick={() => setMessageModal(true)} className="w-full bg-orange-600 text-white py-3 rounded flex items-center justify-center gap-2 font-bold hover:bg-orange-700 transition-colors">💬 Chat Seller</button>
                  <div className="mt-4 text-sm text-gray-600">📍 {product.location || "Location not specified"}</div>
                  <button 
                    onClick={() => {
                      setReportTarget({ vendorId: product.sellerId, itemName: product.sellerName || "this seller" });
                      setShowReportModal(true);
                    }}
                    className="mt-4 w-full border border-red-300 text-red-600 py-2 rounded hover:bg-red-50 transition-colors font-bold"
                  >
                    🚩 Report this seller
                  </button>
                </div>
              )}
            </div>

            {/* 8. Share Section */}
            <div className="rounded-lg border border-orange-200 bg-white p-5 shadow-sm">
              <h5 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <Share2 size={18} className="text-orange-600" />
                Share With Friends
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 hover:bg-zinc-100 transition-all group"
                >
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-zinc-400 group-hover:text-orange-500" />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <button 
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 py-2.5 bg-orange-600 border border-orange-500 rounded-xl text-sm font-bold text-white hover:bg-orange-700 transition-all shadow-sm shadow-orange-100"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          </aside>

          {/* 6. Reviews Section */}
          <section className="lg:col-start-1 rounded-lg border border-orange-200 bg-white">
              <div className="p-4 border-b">
                <h4 className="font-semibold flex items-center gap-2">Customer Reviews <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs">{reviews.length}</span></h4>
              </div>
              
              <div className="p-4 border-b bg-zinc-50">
                  <h5 className="font-bold text-sm mb-2">Leave a Review for {product.sellerName}</h5>
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(star => (
                       <button key={star} type="button" onClick={() => setReviewRating(star)} className={`text-2xl hover:scale-110 transition-transform ${reviewRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                    ))}
                  </div>
                  <textarea 
                     value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                     placeholder="Share your experience with this vendor..."
                     className="w-full text-sm border-gray-300 rounded-md shadow-sm p-3 focus:ring-orange-500 outline-none focus:border-orange-500 mb-3" rows={3}>
                  </textarea>
                  <Button disabled={submittingReview || !reviewText.trim()} onClick={submitReview} className="bg-orange-600 text-white min-w-[120px]">
                     {submittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
              </div>

              {reviews.length === 0 ? (
                <div className="p-6 text-center text-gray-500 italic">No reviews yet for this vendor. Be the first!</div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto">
                {reviews.map((r: any) => (
                  <div key={r.id} className="p-4 border-b flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 uppercase font-bold text-sm">
                      {(r.Reviewer?.name || 'U').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{r.comment}</div>
                      <div className="text-yellow-400 mt-1 text-sm">
                         {Array.from({length: 5}).map((_, i) => (<span key={i}>{i < Math.round(r.rating) ? '★' : '☆'}</span>))}
                        <p className="text-gray-600 mt-2 text-sm">{r.comment}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-xs text-gray-400">
                            {new Date(r.createdAt).toLocaleDateString()} by {r.Reviewer?.name || "Anonymous User"}
                          </div>
                          <button 
                            onClick={() => {
                              setReportTarget({ 
                                reportedReviewId: r.id, 
                                itemName: `Review by ${r.Reviewer?.name || 'User'}`,
                                vendorId: undefined, // Clear other targets
                                productId: undefined
                              });
                              setShowReportModal(true);
                            }}
                            className="text-[10px] text-rose-500 font-bold hover:underline flex items-center gap-1"
                          >
                            🚩 Report
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}
          </section>

          {/* 7. Safety / Before you buy Section */}
          <section className="lg:col-start-1 rounded-lg border border-orange-200 bg-white p-4 pb-8">
            <h4 className="font-semibold mb-3">Before you buy</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
              <li>Check feedbacks to make sure the person is reliable.</li>
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
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
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
             <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-orange-100">
               <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
                 <h3 className="font-bold text-gray-900">Message Seller</h3>
                 <button onClick={() => setMessageModal(false)} className="text-gray-400 hover:text-orange-600 transition-colors">
                   <X size={20} />
                 </button>
               </div>
               <div className="p-6">
                 <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl">
                   <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold overflow-hidden shadow-inner">
                     {product.sellerImage ? <img src={product.sellerImage} className="w-full h-full object-cover" alt="" /> : (product.sellerName || 'S').slice(0,1)}
                   </div>
                   <div>
                     <div className="font-bold text-gray-900">{product.sellerName}</div>
                     <div className="text-xs text-orange-600 font-medium">Verified Seller</div>
                   </div>
                 </div>

                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Message</label>
                 <textarea 
                   value={messageText} 
                   onChange={(e) => setMessageText(e.target.value)}
                   placeholder="Hi, is this still available?"
                   className="w-full border-2 border-gray-100 rounded-xl p-4 text-sm focus:border-orange-500 outline-none transition-all resize-none min-h-[120px]"
                 />
                 
                 <div className="mt-6 flex gap-3">
                   <button 
                     onClick={() => setMessageModal(false)}
                     className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors border-2 border-transparent"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleSendMessage}
                     disabled={sendingMessage || !messageText.trim()}
                     className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 disabled:opacity-50 flex items-center justify-center gap-2"
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
      <Footer />
    </div>
  )
}
