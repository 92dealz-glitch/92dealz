"use client";

import React from "react";
import DealForm from "@/components/admin/deals/DealForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const mockDealData = {
  id: 1,
  title: "Samsung Galaxy S24 Ultra",
  description: "Get the latest Samsung flagship at an unbelievable price. Featuring a stunning 6.8-inch Dynamic AMOLED 2X display and the powerful Snapdragon 8 Gen 3.",
  category: "Electronics",
  tags: "smartphone, samsung, sale",
  price: "450,000",
  originalPrice: "950,000",
  url: "https://example.com/samsungs24",
  status: "published",
  isFeatured: true,
  stats: {
    views: "12,450",
    clicks: "5,897"
  },
  createdAt: "2026-03-01"
};

export default function EditDealPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Edit Deal</h1>
          <p className="text-zinc-500 text-sm mt-1">Modify existing deal information</p>
        </div>
      </div>

      <Link 
        href="/admin/deals" 
        className="inline-flex items-center gap-2 px-3 py-1.5 border border-orange-500 text-orange-600 rounded-lg text-sm font-bold hover:bg-orange-50 transition-colors"
      >
        <ChevronLeft size={18} />
        Back to deals
      </Link>

      <DealForm type="edit" initialData={mockDealData} />
    </div>
  );
}
