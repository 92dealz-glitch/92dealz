import React from "react";
import { Metadata } from "next";
import { API_BASE } from "@/services/apiClient";
import ProductClient from "./ProductClient";

type Props = {
  params: Promise<{ id: string }>;
};

async function getProductAndSeller(id: string) {
  try {
    const adRes = await fetch(`${API_BASE}/ads/${id}`, { cache: 'no-store' });
    const adData = await adRes.json();
    if (!adData?.success) return null;
    const d = adData.data;

    const sellerRes = await fetch(`${API_BASE}/users/${d.userId}`, { cache: 'no-store' });
    const sellerData = await sellerRes.json();
    const seller = sellerData?.data || {};

    // Format initial product object for the client
    let images = [d.image_url || '/assets/images/bgphone.svg'];
    if (d.images_json) {
      try {
        const parsed = typeof d.images_json === 'string' ? JSON.parse(d.images_json) : d.images_json;
        if (Array.isArray(parsed) && parsed.length > 0) {
          images = parsed;
        }
      } catch (e) {}
    }

    const createdAt = seller.createdAt ? new Date(seller.createdAt) : new Date();
    const memberSince = createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return {
      id: d.id,
      title: d.title,
      desc: d.description || '',
      sellerId: String(d.userId),
      sellerName: seller.name || "Seller",
      price: `Rs ${Number(d.price).toLocaleString()}`,
      priceValue: Number(d.price),
      sellerRating: seller.rating || 2.9,
      sellerMemberSince: memberSince,
      sellerTotalAds: seller.total_ads || 0,
      sellerResponseTime: seller.responseTime || "Within 1 hour",
      images,
      condition: d.condition || 'New',
      location: d.location || d.city || 'Pakistan',
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
    };
  } catch (e) {
    console.error("Server-side fetch error:", e);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductAndSeller(id);
  
  if (product) {
    return {
      title: `${product.title} | 92Dealz`,
      description: product.desc?.slice(0, 160) || `Buy ${product.title} on 92Dealz. Best prices for ${product.subcategory || "items"} in Pakistan.`,
      openGraph: {
        title: product.title,
        description: product.desc?.slice(0, 160),
        images: [product.images[0] || "/92dealzlogo.svg"],
        type: "article",
      },
    };
  }
  
  return { title: "Product Details | 92Dealz" };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductAndSeller(id);

  const jsonLd = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.images,
    "description": product.desc,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": `https://92dealz.com/product/${id}`,
      "priceCurrency": "PKR",
      "price": product.priceValue,
      "availability": product.status === 'active' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": product.sellerName
      }
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductClient id={id} initialProduct={product} />
    </>
  );
}
