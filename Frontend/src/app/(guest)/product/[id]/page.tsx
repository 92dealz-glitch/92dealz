"use client";
import React, { useEffect, useState, use } from "react"
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import SimilarItems from '@/components/SimilarItems'
import Button from '@/components/ui/Button'
import { API_BASE, apiFetch } from "@/services/apiClient"
import { logAdView, logContactView } from "@/services/analytics.service"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: Props) {
  // Unwrap params using use()
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<any>({
    id, title: '', desc: '', price: '', sellerId: '', images: ['/assets/images/bgphone.svg'], condition: 'Brand New', specifications: {}, subcategory: ''
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
      if (!token) { alert("Please login to leave a review."); return; }
      
      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ vendor_id: product.sellerId, rating: reviewRating, comment: reviewText })
      });
      const data = await res.json();
      if (data.success) {
        alert("Review submitted!");
        setReviewText("");
        // Reload reviews locally
        setReviews([data.data, ...reviews]);
      } else {
        alert(data.message || "Failed to submit review.");
      }
    } catch { alert("Error submitting review."); }
    finally { setSubmittingReview(false); }
  };

  const [messageModal, setMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      setSendingMessage(true);
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      if (!token) {
        alert("Please login to send a message");
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
          content: messageText.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Message sent successfully!");
        setMessageModal(false);
        setMessageText("");
        try { await logContactView(Number(product.id)); } catch {}
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (err) {
      alert("An error occurred while sending the message");
    } finally {
      setSendingMessage(false);
    }
  };

  const [placingOrder, setPlacingOrder] = useState(false);
  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      if (!token) { alert("Please login to place an order"); return; }
      
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deal_id: product.id,
          vendor_id: product.sellerId,
          price: parseFloat(product.price.replace(/[^\d.]/g, '')),
          notes: "I want to buy this item."
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Order placed successfully! Please check your Dashboard -> Orders for confirmation.");
        router.push("/dashboard/orders");
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (err) {
      alert("An error occurred while placing the order");
    } finally {
      setPlacingOrder(false);
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

        <div className="grid gap-6 items-start lg:grid-cols-[1fr_360px]">
          {/* Left: Gallery + Info (card with orange border) */}
          <section className="rounded-lg border-2 border-orange-300 bg-white p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-extrabold text-orange-600">{product.title}</h1>
                <p className="text-gray-700 mt-2">{product.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-9 h-9 rounded-md border border-gray-200 flex items-center justify-center">♡</button>
                <button className="w-9 h-9 rounded-md border border-gray-200 flex items-center justify-center">⤴</button>
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

              <div className="absolute bottom-4 right-6">
                <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">View Image</span>
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

          {/* Right: Price box + Seller Info */}
          <aside className="space-y-4">
            <div className="rounded-lg bg-white border border-orange-200 p-6 shadow-sm relative lg:sticky lg:top-24">
              <div className="absolute top-4 right-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">{product.condition}</span>
              </div>

              <div className="text-3xl font-extrabold text-orange-600">{product.price}</div>
              <div className="mt-2 inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm">Negotiable</div>

              <div className="mt-6 space-y-3">
                <Button 
                  onClick={() => {
                    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
                    if (!token) { alert("Please login to contact seller"); return; }
                    setMessageText("I'm interested in your ad.");
                    setMessageModal(true);
                  }} 
                  className="w-full bg-orange-600 text-white py-3"
                >
                  📞 Contact Seller
                </Button>
                <Button 
                  onClick={() => {
                    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
                    if (!token) { alert("Please login to chat"); return; }
                    setMessageText("Hello! I would like to chat about this item.");
                    setMessageModal(true);
                  }} 
                  className="w-full bg-orange-600 text-white py-3 font-bold"
                >
                  💬 Chat Seller
                </Button>
                <Button 
                  disabled={placingOrder}
                  onClick={handlePlaceOrder}
                  className="w-full bg-black text-white py-3 font-bold flex items-center justify-center gap-2"
                >
                  {placingOrder ? "Placing..." : "🛒 Order Now"}
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-white border border-orange-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Seller Information</h3>
                <div className="text-xs text-gray-500">● Last seen 12:01 PM</div>
              </div>

              <div className="border-t border-b border-gray-100 py-3">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">{(product.sellerName || 'S').slice(0,1)}</div>
                    <div>
                      <div className="font-semibold">
                        <Link href={`/seller/${product.sellerId}`} className="hover:underline text-orange-600">{product.sellerName || 'Seller'}</Link> <span className="text-green-600">✔</span>
                      </div>
                      <div className="text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < Math.floor(product.sellerRating || 0) ? "⭐️" : "☆"}</span>
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
                  {product.sellerPhone && (
                    <>
                      <div>Phone:</div><div className="font-medium text-orange-600 select-all">{product.sellerPhone}</div>
                    </>
                  )}
                  {product.sellerEmail && (
                    <>
                      <div>Email:</div><div className="font-medium text-zinc-600 truncate max-w-[150px]">{product.sellerEmail}</div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Link href={`/seller/${product.sellerId}`} className="w-full inline-block text-center bg-orange-600 text-white py-2 rounded">🔎 View Seller Profile</Link>
                <Link href={`/seller/${product.sellerId}`} className="w-full inline-block text-center bg-orange-600 text-white py-2 rounded">📋 See All Ads from Seller</Link>
              </div>
            </div>
          </aside>
        </div>
        
        {/* Message Modal */}
        {messageModal && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Message to {product.sellerName}</h3>
                <button onClick={() => setMessageModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                className="w-full h-32 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              />
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setMessageModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  disabled={sendingMessage || !messageText.trim()}
                  onClick={handleSendMessage}
                  className="flex-1 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50"
                >
                  {sendingMessage ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Second row: Description tabs + Reviews and Right column contact options */}
        <div className="grid gap-6 mt-6 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="rounded-lg border border-orange-200 bg-white p-4">
              <div className="border-b pb-3">
                <div className="sm:hidden">
                  <label className="sr-only">Select section</label>
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value as any)}
                    className="w-full rounded-md border-gray-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="description">PRODUCT DESCRIPTION</option>
                    <option value="specs">SPECIFICATIONS</option>
                  </select>
                </div>

                <div className="hidden sm:flex gap-6">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`pb-2 font-semibold whitespace-nowrap ${activeTab === 'description' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-800'}`}
                  >
                    PRODUCT DESCRIPTION
                  </button>

                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2 font-semibold whitespace-nowrap ${activeTab === 'specs' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-800'}`}
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
                    {product.condition && (
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Condition</span>
                        <span className="font-semibold">{product.condition}</span>
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

            <div className="mt-6 rounded-lg border border-orange-200 bg-white">
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
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(r.createdAt).toLocaleDateString()} by <span className="font-semibold">{r.Reviewer?.name || 'Anonymous User'}</span>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}
            </div>

            <div className="mt-6 rounded-lg border border-orange-200 bg-white p-4 pb-8">
              <h4 className="font-semibold mb-3">Before you buy</h4>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                <li>Check feedbacks to make sure the person is reliable.</li>
                <li>For products, ensure that what's in the package is exactly what you expect.</li>
                <li>Avoid sending any prepayments.</li>
                <li>Meet in person at a safe public place.</li>
                <li>Check all the docs and only pay if you're satisfied.</li>
              </ul>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border border-orange-200 bg-white p-4">
              <h4 className="font-semibold mb-3">Contact Options</h4>
              <div className="space-y-3">
                <button type="button" onClick={() => alert(`Call: ${product.sellerPhone || 'Not available'}`)} className="w-full bg-orange-600 text-white py-3 rounded flex items-center justify-center gap-2 font-bold">📞 {product.sellerPhone || "View Phone Number"}</button>
                <a href={`https://wa.me/${product.sellerPhone?.replace(/\D/g,'')}`} className="w-full inline-flex bg-green-500 text-white py-3 rounded items-center justify-center gap-2 font-bold">💬 Whatsapp</a>
                <button type="button" onClick={() => setMessageModal(true)} className="w-full bg-orange-600 text-white py-3 rounded flex items-center justify-center gap-2 font-bold">💬 Chat Seller</button>
                <a href={`mailto:${product.sellerEmail}`} className="w-full border border-gray-300 py-3 rounded flex items-center justify-center gap-2 font-bold">✉️ Email</a>
              </div>

              <div className="mt-4 text-sm text-gray-600">📍 Off Deco Road, Crystals Layout, Delta State, Warri.</div>

              <button className="mt-4 w-full border border-red-300 text-red-600 py-2 rounded">🚩 Report this seller</button>
            </div>

            <div className="rounded-lg border border-orange-200 bg-white p-4">
              <button className="w-full bg-orange-600 text-white py-3 rounded">🔎 View all Reviews</button>
            </div>

            <div className="rounded-lg border border-orange-200 bg-white p-4">
              <h5 className="font-semibold mb-2">Share With Friends</h5>
              <div className="flex gap-3 text-orange-600">
                <a href="#" aria-label="Share on Instagram" className="w-8 h-8 rounded-full border flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" stroke="#EF6B2B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" stroke="#EF6B2B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="17.5" cy="6.5" r="0.5" fill="#EF6B2B"/></svg>
                </a>
                <a href="#" aria-label="Share on Facebook" className="w-8 h-8 rounded-full border flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12a10 10 0 10-11.5 9.9v-7H8.9v-2.9h1.6V9.1c0-1.6.9-2.7 2.4-2.7.7 0 1.4.1 1.4.1v1.6h-.8c-.7 0-.9.4-.9.9v1.1h1.6l-.3 2.9h-1.3v7A10 10 0 0022 12z" stroke="#EF6B2B" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="#" aria-label="Share on Twitter" className="w-8 h-8 rounded-full border flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016.5 2c-2.5 0-4.5 2.2-4 4.6A12.94 12.94 0 013 4s-4 9 5 13a13 13 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="#EF6B2B" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="#" aria-label="Share on WhatsApp" className="w-8 h-8 rounded-full border flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5a9 9 0 10-2.3 5.7L21 22l-3.9-1.1A9 9 0 0021 11.5z" stroke="#EF6B2B" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 12.5c-.1-.2-.6-.3-1-.5-.3-.2-.6-.2-.9.2-.3.5-1 .6-1.3.6-.3 0-.6-.1-.9-.4-.4-.3-.9-.9-.9-1.3 0-.4.3-.6.6-.9.2-.2.3-.5.5-.8.1-.3 0-.5-.1-.6-.2-.2-.9-2-1.3-2.7-.3-.6-.7-.5-1-.5-.3 0-.6 0-.9 0s-.8.1-1.2.6c-.4.5-1.6 1.7-1.6 4.1s1.7 4.8 1.9 5.1c.2.3 3.4 5.2 8.3 6.1 4.5.8 4.5-3.1 4.5-3.6 0-.6-.4-.9-.8-1.3z" stroke="#EF6B2B" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SimilarItems />

      <Footer />
    </div>
  )
}
