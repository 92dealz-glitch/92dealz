"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  ChevronLeft, 
  Save, 
  X, 
  ChevronDown,
  Upload,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";
import { updateDeal, getAdminCategories } from "@/lib/api";
import { apiFetch } from "@/services/apiClient";

interface DealFormProps {
  initialData?: any;
  type: "add" | "edit";
}

export default function DealForm({ initialData, type }: DealFormProps) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || initialData?.image || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadResources() {
      try {
        const catRes = await getAdminCategories();
        if (catRes.success) setCategories(catRes.data);
      } catch (err) {
        console.error("Failed to load resources", err);
      }
    }
    loadResources();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await apiFetch<{ success: boolean; url: string }>("uploads/image", {
        method: "POST",
        body: formData,
      }, true);
      return res.success ? res.url : null;
    } catch (err) {
      console.error("Upload failed", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data: any = Object.fromEntries(formData.entries());
      
      // Handle numeric price
      const priceVal = String(data.price || "").replace(/[^0-9.]/g, "");
      data.price = Number(priceVal);
      
      data.category_id = data.category_id ? Number(data.category_id) : undefined;
      data.isFeatured = isFeatured;

      // Image upload
      let finalImageUrl = imagePreview;
      if (selectedFile) {
        const uploadedUrl = await uploadToCloudinary(selectedFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          showNotification("error", "Image upload failed. Proceeding with previous image.");
        }
      }
      data.image_url = finalImageUrl;

      if (type === "edit") {
        await updateDeal(initialData.id, data);
        showNotification("success", "Deal updated successfully");
      }
      router.push("/admin/deals");
    } catch (err: any) {
      showNotification("error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-bold">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Deal Details */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
            <h3 className="text-lg text-zinc-900 mb-2 font-black uppercase tracking-tight">Product Details</h3>
            <p className="text-zinc-500 mb-8 font-medium italic text-xs">Verify and update core listing information</p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-zinc-900 flex items-center gap-1 font-black uppercase tracking-wide">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="title"
                  defaultValue={initialData?.title}
                  placeholder="e.g., Samsung Galaxy S24"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-medium"
                />
              </div>
 
              <div className="space-y-2">
                <label className="text-sm text-zinc-900 flex items-center gap-1 font-black uppercase tracking-wide">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  name="description"
                  defaultValue={initialData?.description}
                  placeholder="Describe the product in detail..."
                  rows={8}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all resize-none font-medium text-sm leading-relaxed"
                ></textarea>
              </div>
 
              <div className="space-y-2">
                  <label className="text-sm text-zinc-900 flex items-center gap-1 font-black uppercase tracking-wide">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      required 
                      name="category_id"
                      value={initialData?.category_id}
                      onChange={() => {}} // Controlled if we want, or just defaultValue
                      className="w-full appearance-none px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-orange-500 transition-all font-medium cursor-pointer"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
                  </div>
              </div>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
            <h3 className="text-lg text-zinc-900 mb-2 font-black uppercase tracking-tight">Pricing</h3>
            <p className="text-zinc-500 mb-8 font-medium italic text-xs">Set the finalized price for the platform</p>
            <div className="space-y-2">
                <label className="text-sm text-zinc-900 flex items-center gap-1 font-black uppercase tracking-wide">
                  Deal Price (₦) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₦</span>
                  <input
                    type="text"
                    required
                    name="price"
                    defaultValue={initialData?.price}
                    placeholder="450,000"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-bold text-xl"
                  />
                </div>
            </div>
          </div>
          
          {/* Image Upload */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
            <h3 className="text-lg text-zinc-900 mb-2 font-black uppercase tracking-tight">Product Image</h3>
            <p className="text-zinc-500 mb-8 font-medium italic text-xs">Upload or update the primary visual for this ad</p>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-2xl p-10 bg-zinc-50 hover:bg-zinc-100/50 transition-colors group relative overflow-hidden">
              {imagePreview ? (
                <div className="relative w-full h-full min-h-[250px] flex items-center justify-center">
                  <img src={imagePreview} alt="Preview" className="max-h-[250px] object-contain rounded-xl shadow-lg border border-white" />
                  <button 
                    type="button"
                    onClick={() => { setImagePreview(null); setSelectedFile(null); }}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all hover:scale-110 active:scale-95"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer w-full h-full py-10">
                  <div className="w-16 h-16 bg-white border-2 border-zinc-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <Upload size={24} className="text-[#f45c03]" />
                  </div>
                  <span className="text-sm text-zinc-900 font-black mb-1 uppercase tracking-wider">Click to upload image</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">JPG, PNG, GIF (Max size 5MB)</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Stats */}
        <div className="space-y-8">
          {/* Moderation Controls */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
            <h3 className="text-lg text-zinc-900 mb-8 font-black uppercase tracking-tight border-b-2 border-orange-500 inline-block">Moderation</h3>

            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs text-zinc-900 font-black uppercase">Featured Deal</h4>
                  <p className="text-[10px] text-zinc-500 font-medium italic">Display on main home hero</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isFeatured ? "bg-[#10B981] shadow-lg shadow-emerald-200" : "bg-zinc-200"}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isFeatured ? "translate-x-6" : ""}`} />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-zinc-900 font-black uppercase">Current Listing Status</label>
                <div className="relative">
                  <select 
                    required 
                    name="status"
                    defaultValue={initialData?.status}
                    className="w-full appearance-none px-4 py-3 bg-zinc-50 border-2 border-zinc-100 rounded-xl outline-none focus:border-orange-500 transition-all font-black text-xs uppercase"
                  >
                    <option value="active">Active (LIVE)</option>
                    <option value="pending">Pending (REVIEW)</option>
                    <option value="rejected">Rejected (HIDDEN)</option>
                    <option value="draft">Draft (INTERNAL)</option>
                    <option value="sold">Sold / Completed</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
                </div>
              </div>
 
              <div className="space-y-3 pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#f45c03] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#f45c03] transition-all shadow-xl shadow-orange-100 active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Changes
                </button>
                <Link 
                  href="/admin/deals"
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-zinc-100 text-zinc-500 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-50 hover:text-zinc-900 transition-all active:scale-95"
                >
                  Go Back
                </Link>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
            <h3 className="text-sm text-zinc-900 mb-8 font-black uppercase tracking-widest border-b border-zinc-100 pb-2">Engagement</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase">Views</span>
                <span className="text-sm font-black text-zinc-900">{initialData?.stats?.views || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase">Clicks</span>
                <span className="text-sm font-black text-zinc-900">{initialData?.stats?.clicks || 0}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                <span className="text-[10px] font-bold text-zinc-400 uppercase italic">Registered on</span>
                <span className="text-[10px] font-black text-zinc-600 italic">{initialData?.createdAt ? new Date(initialData.createdAt).toLocaleDateString() : "Just now"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
