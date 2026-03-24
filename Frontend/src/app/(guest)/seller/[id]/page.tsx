"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/services/apiClient";

type Props = { params: Promise<{ id: string }> };

export default function SellerPage({ params }: Props) {
  const { id } = React.use(params);
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // Fetch seller profile
        const userRes = await fetch(`${API_BASE}/users/${id}`);
        const userData = await userRes.json();
        if (!active || !userData.success) return;

        const u = userData.data;
        const createdAt = u.createdAt ? new Date(u.createdAt) : new Date();
        const memberSince = createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" });

        setSeller({
          id: u.id,
          name: u.name || "Seller",
          email: u.email,
          about: u.about,
          rating: u.rating || 0,
          location: u.businessAddress || "Nigeria",
          memberSince,
          totalAds: u.total_ads || 0,
          responseTime: u.responseTime || "Within 1 hour",
          phone: u.phone,
        });

        // Fetch active ads for this user
        const adsRes = await fetch(`${API_BASE}/ads?userId=${id}&status=active`);
        const adsData = await adsRes.json();
        if (active && adsData.success) {
          setListings(adsData.data.map((d: any) => ({
            id: d.id,
            title: d.title,
            price: `₦${Number(d.price).toLocaleString()}`,
            condition: d.condition || "Brand New",
            location: d.location || "Lagos",
            likes: d.likes || 40,
            image: d.image_url || "/assets/images/bgphone.svg",
          })));
        }

        // Fetch real reviews natively
        const revRes = await fetch(`${API_BASE}/reviews/vendor/${id}`);
        const revData = await revRes.json();
        if (active && revData.success) {
           setReviews(revData.data);
        }
      } catch (err) {
        console.error("Failed to fetch seller profile", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="p-20 text-center font-bold text-orange-600 text-2xl">Loading profile...</div>;
  if (!seller) return <div className="p-20 text-center font-bold text-red-600 text-2xl">Seller not found.</div>;

  const StarRating = ({
    rating,
    max = 5,
    size = "sm",
  }: {
    rating: number;
    max?: number;
    size?: string;
  }) => {
    const starSize = size === "sm" ? "text-sm" : "text-base";
    return (
      <div className={`flex gap-0.5 ${starSize}`}>
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            style={{ color: i < Math.round(rating) ? "#f59e0b" : "#d1d5db" }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const PhoneIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
    </svg>
  );

  const WAIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );

  const ChatIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );

  const EmailIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );

  const MapPinIcon = () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );

  const HeartIcon = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9ca3af"
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );

  const FireIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f97316">
      <path d="M12 2c0 0-5 4-5 9a5 5 0 0010 0c0-5-5-9-5-9z" />
    </svg>
  );

  const ReportIcon = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );

  return (
    <div
      style={{
        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
        background: "#f8f8f8",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <main
        style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 16px 40px" }}
      >
        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
          Home &gt; Seller &gt; Profile
        </nav>

        {/* Profile Header Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "24px",
            marginBottom: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            {/* Avatar */}
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                background: "#fde8d4",
              }}
            >
              <img
                src="/assets/images/avatar-placeholder.png"
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.style.display = "none";
                  const parent = t.parentElement!;
                  parent.style.display = "flex";
                  parent.style.alignItems = "center";
                  parent.style.justifyContent = "center";
                  parent.style.fontSize = "28px";
                  parent.style.fontWeight = "800";
                  parent.style.color = "#f97316";
                  parent.innerHTML = "OG";
                }}
              />
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div>
                  <h1
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: "#f97316",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {seller.name}
                    <span
                      style={{
                        background: "#16a34a",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 11,
                      }}
                    >
                      ✓
                    </span>
                  </h1>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 6,
                    }}
                  >
                    <StarRating rating={seller.rating} />
                    <span style={{ color: "#6b7280", fontSize: 13 }}>
                      {seller.rating}
                    </span>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <span
                      style={{
                        background: "#dcfce7",
                        color: "#16a34a",
                        fontSize: 12,
                        padding: "2px 12px",
                        borderRadius: 20,
                        fontWeight: 600,
                      }}
                    >
                      Online
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 6,
                      color: "#6b7280",
                      fontSize: 13,
                    }}
                  >
                    <MapPinIcon />
                    <span>{seller.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 16,
            alignItems: "start",
          }}
        >
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* About (full width) */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                border: "1.5px solid #fed7aa",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
                  About the Seller
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#374151",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                <p
                  style={{
                    fontSize: 13,
                    color: "#374151",
                    lineHeight: 1.6,
                    margin: 0,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {seller.about || `Welcome to ${seller.name}'s profile! Here you can find a variety of quality listings at great prices.`}
                </p>
                </p>
              </div>

              <div
                style={{
                  marginTop: 16,
                  borderTop: "1px solid #eef2f6",
                  paddingTop: 12,
                  color: "#6b7280",
                  fontSize: 13,
                }}
              >
                Member Since: {seller.memberSince}
              </div>
            </div>

            {/* Active Listings */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                border: "1.5px solid #fed7aa",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h2 style={{ fontWeight: 700, fontSize: 17, margin: "0 0 16px" }}>
                Active Listing ({seller.totalAds})
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 14,
                }}
              >
                {listings.map((l) => (
                  <Link
                    key={l.id}
                    href={`/product/${l.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 10,
                        overflow: "hidden",
                        background: "#fff",
                        transition: "box-shadow 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.boxShadow =
                          "0 4px 12px rgba(0,0,0,0.1)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.boxShadow =
                          "none")
                      }
                    >
                      <div
                        style={{
                          position: "relative",
                          height: 140,
                          background: "#f3f4f6",
                        }}
                      >
                        <img
                          src={l.image}
                          alt={l.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            background: "rgba(255,255,255,0.9)",
                            borderRadius: "50%",
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          <HeartIcon />
                        </div>
                      </div>

                      <div style={{ padding: 12 }}>
                        <div
                          style={{
                            color: "#f97316",
                            fontWeight: 800,
                            fontSize: 15,
                          }}
                        >
                          {l.price}
                        </div>
                        <h4
                          style={{
                            margin: "4px 0 8px",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#111827",
                            lineHeight: 1.4,
                            height: 36,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {l.title}
                        </h4>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 8,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              color: "#6b7280",
                              fontSize: 11,
                            }}
                          >
                            <MapPinIcon />
                            <span>{l.location}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              color: "#f97316",
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            <FireIcon />
                            <span>{l.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {listings.length > 0 && (
                <Link
                  href={`/search?userId=${seller.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <button
                    style={{
                      width: "100%",
                      marginTop: 18,
                      background: "#f97316",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "12px",
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    View all Listings
                  </button>
                </Link>
              )}
            </div>

            {/* Customer Reviews */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                border: "1.5px solid #fed7aa",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h2 style={{ fontWeight: 700, fontSize: 17, margin: "0 0 16px" }}>
                Customer Reviews <span className="text-sm font-medium text-gray-500 ml-1">({reviews.length})</span>
              </h2>
              {reviews.length === 0 ? (
                 <div className="text-center italic text-gray-500 py-4">No reviews yet for this vendor.</div>
              ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {reviews.map((r: any) => (
                  <div
                    key={r.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: "14px 16px",
                    }}
                  >
                    <div style={{ display: "flex", gap: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: "#e5e7eb",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#9ca3af",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          fontSize: "14px",
                        }}
                      >
                       {(r.Reviewer?.name || "U").slice(0, 2)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: "0 0 8px",
                            fontSize: 14,
                            color: "#374151",
                            lineHeight: 1.5,
                          }}
                        >
                          {r.comment}
                        </p>
                        <div
                          style={{ display: "flex", gap: 2, marginBottom: 6 }}
                        >
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              style={{
                                color: i < Math.round(r.rating) ? "#f59e0b" : "#e5e7eb",
                                fontSize: 14,
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <div style={{ fontSize: 12, color: "#9ca3af" }}>
                          {new Date(r.createdAt).toLocaleDateString()} by {r.Reviewer?.name || "Anonymous User"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#f97316",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  marginTop: 10,
                  padding: "4px 0",
                  float: "right",
                }}
              >
                View more
              </button>
            </div>
          </div>

          {/* Right sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Contact Seller Card */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                border: "1px solid #fed7aa",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                style={{
                  fontWeight: 800,
                  fontSize: 20,
                  color: "#f97316",
                  margin: "0 0 8px",
                }}
              >
                Contact Seller
              </h3>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px" }}>
                Get in touch with {seller.name} for enquiries or offers.
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {seller.phone && (
                  <>
                    <button
                      onClick={() => window.location.href = `tel:${seller.phone}`}
                      style={{
                        background: "#f97316",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "12px",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <PhoneIcon /> Call Seller
                    </button>
                    <button
                      onClick={() => window.open(`https://wa.me/${seller.phone.replace(/\D/g, '')}`, '_blank')}
                      style={{
                        background: "#22c55e",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "12px",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <WAIcon /> Whatsapp
                    </button>
                  </>
                )}
                <Link href={`/messages?userId=${seller.id}`} className="w-full">
                  <button
                    style={{
                      background: "#fff",
                      color: "#374151",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      padding: "12px",
                      fontWeight: 500,
                      fontSize: 14,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "100%",
                    }}
                  >
                    <ChatIcon /> Chat Seller
                  </button>
                </Link>
                {seller.email && (
                  <button
                    onClick={() => window.location.href = `mailto:${seller.email}`}
                    style={{
                      background: "#fff",
                      color: "#374151",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      padding: "12px",
                      fontWeight: 500,
                      fontSize: 14,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <EmailIcon /> Email
                  </button>
                )}
              </div>
              <button
                style={{
                  marginTop: 14,
                  background: "none",
                  border: "1px solid #fca5a5",
                  color: "#ef4444",
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <ReportIcon /> Report this seller
              </button>
            </div>

            {/* Seller Statistics */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 18,
                border: "1px solid #fed7aa",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h4 style={{ fontWeight: 700, fontSize: 15, margin: "0 0 14px" }}>
                Seller Statistics
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  fontSize: 13,
                }}
              >
                {[
                  ["Member Since:", seller.memberSince],
                  ["Total Ads Posted:", `${seller.totalAds} items`],
                  ["Response Time:", seller.responseTime],
                  ["Customer Rating:", `${seller.rating}/5.0`],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>{label}</span>
                    <span style={{ fontWeight: 600, textAlign: "right" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification & Trust */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 18,
                border: "1px solid #fed7aa",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h4 style={{ fontWeight: 700, fontSize: 15, margin: "0 0 12px" }}>
                Verification & Trust
              </h4>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[
                  {
                    icon: "✓",
                    bg: "#dcfce7",
                    color: "#16a34a",
                    label: "Identity Verified",
                    sub: "Phone & Email confirmed",
                  },
                  {
                    icon: "★",
                    bg: "#fef9c3",
                    color: "#ca8a04",
                    label: "Top Rated",
                    sub: `${seller.rating}+ star rating`,
                  },
                  {
                    icon: "⚡",
                    bg: "#eff6ff",
                    color: "#3b82f6",
                    label: "Fast Responder",
                    sub: `Usually replies ${seller.responseTime.toLowerCase()}`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      padding: "10px 12px",
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: item.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ color: item.color }}>{item.icon}</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>
                        {item.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Tips */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 18,
                border: "1px solid #fed7aa",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h4
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  margin: "0 0 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ color: "#3b82f6" }}>🛡</span> Safety Tips
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "Meet in safe, public locations",
                  "Inspect item before payment",
                  "Never pay in advance",
                  "Use 234Deals chat for communication",
                ].map((tip) => (
                  <div
                    key={tip}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "#374151",
                    }}
                  >
                    <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            {/* Share With Friends */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 18,
                border: "1px solid #fed7aa",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h4 style={{ fontWeight: 700, fontSize: 15, margin: "0 0 12px" }}>
                Share With Friends
              </h4>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { bg: "#e1306c", icon: "📷", label: "Instagram" },
                  { bg: "#1877f2", icon: "f", label: "Facebook" },
                  { bg: "#1da1f2", icon: "𝕏", label: "Twitter" },
                  { bg: "#25d366", icon: "💬", label: "WhatsApp" },
                ].map((s) => (
                  <button
                    key={s.label}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: s.bg,
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 15,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
