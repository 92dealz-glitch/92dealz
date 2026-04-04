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
import { createDeal, updateDeal, getAdminCategories } from "@/lib/api";
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
      
      // Handle numeric fields
      const priceVal = String(data.price || "").replace(/[^0-9.]/g, "");
      data.price = Number(priceVal);
      
      if (data.originalPrice) {
          const origVal = String(data.originalPrice).replace(/[^0-9.]/g, "");
          data.originalPrice = Number(origVal);
      }
      
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

      if (type === "add") {
        await createDeal(data);
        showNotification("success", "Deal created successfully");
      } else {
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
            <h3 className="text-lg text-zinc-900 mb-2 font-bold uppercase tracking-tight">Deal Details</h3>
            <p className="text-sm text-zinc-500 mb-8 font-medium">Basic information about the deal</p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-zinc-900 flex items-center gap-1 font-bold">
                  Deal title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="title"
                  defaultValue={initialData?.title}
                  placeholder="e.g., Samsung Galaxy S24"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-orange-500 transition-colors font-medium"
                />
              </div>
 
              <div className="space-y-2">
                <label className="text-sm text-zinc-900 flex items-center gap-1 font-bold">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  name="description"
                  defaultValue={initialData?.description}
                  placeholder="Describe the deal in detail..."
                  rows={6}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-orange-500 transition-colors resize-none font-medium text-sm"
                ></textarea>
              </div>
 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-900 flex items-center gap-1 font-bold">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      required 
                      name="category_id"
                      defaultValue={initialData?.category_id}
                      className="w-full appearance-none px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-orange-500 transition-colors font-medium cursor-pointer"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-900 flex items-center gap-1 font-bold">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={initialData?.tags}
                    placeholder="smartphone, sale, tech"
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-orange-500 transition-colors font-medium"
                  />
                </div>
              </div>
 
              <div className="space-y-2">
                <label className="text-sm text-zinc-900 flex items-center gap-1 font-bold">
                  Deal URL (Affiliate Link)
                </label>
                <input
                  type="url"
                  name="url"
                  defaultValue={initialData?.url}
                  placeholder="https://example.com/deal"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-orange-500 transition-colors font-medium"
                />
              </div>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
            <h3 className="text-lg text-zinc-900 mb-2 font-bold uppercase tracking-tight">Pricing</h3>
            <p className="text-sm text-zinc-500 mb-8 font-medium">Set the current and original price</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-900 flex items-center gap-1 font-bold">
                    Deal price (₦) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="price"
                    defaultValue={initialData?.price}
                    placeholder="450,000"
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-orange-500 transition-colors font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-900 flex items-center gap-1 font-bold">
                    Original Price (₦)
                  </label>
                  <input
                    type="text"
                    name="originalPrice"
                    defaultValue={initialData?.originalPrice}
                    placeholder="950,000"
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-orange-500 transition-colors font-medium"
                  />
                </div>
            </div>
          </div>
          
          {/* Image Upload */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
            <h3 className="text-lg text-zinc-900 mb-2 font-bold uppercase tracking-tight">Deal Image</h3>
            <p className="text-sm text-zinc-500 mb-8 font-medium">Upload a high-quality image of the product</p>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-2xl p-10 bg-zinc-50 hover:bg-zinc-100/50 transition-colors group relative overflow-hidden">
              {imagePreview ? (
                <div className="relative w-full h-full min-h-[200px] flex items-center justify-center">
                  <img src={imagePreview} alt="Preview" className="max-h-[200px] object-contain rounded-lg" />
                  <button 
                    type="button"
                    onClick={() => { setImagePreview(null); setSelectedFile(null); }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer w-full h-full">
                  <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload size={24} className="text-[#f45c03]" />
                  </div>
                  <span className="text-sm text-zinc-900 font-bold mb-1">Click to upload product image</span>
                  <span className="text-xs text-zinc-500 font-medium">JPG, PNG, GIF (Max size 5MB)</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Stats */}
        <div className="space-y-8">
          {/* Publish Controls */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
            <h3 className="text-lg text-zinc-900 mb-8 font-bold uppercase tracking-tight">Moderation</h3>

            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm text-zinc-900 font-bold">Featured Deal</h4>
                  <p className="text-[10px] text-zinc-500 font-medium italic">Show on homepage</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${isFeatured ? "bg-[#10B981]" : "bg-zinc-200"}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isFeatured ? "translate-x-6" : ""}`} />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-900 font-bold">Status</label>
                <div className="relative">
                  <select 
                    required 
                    name="status"
                    defaultValue={initialData?.status}
                    className="w-full appearance-none px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-orange-500 transition-colors font-medium capitalize"
                  >
                    <option value="active">Active (Live)</option>
                    <option value="pending">Pending (Review)</option>
                    <option value="rejected">Rejected</option>
                    <option value="draft">Draft</option>
                    <option value="sold">Sold / Closed</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
                </div>
              </div>
 
              <div className="space-y-3 pt-4 font-bold">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#f45c03] text-white py-3 rounded-lg font-bold hover:bg-[#f45c03] transition-colors shadow-md shadow-[#f45c03]/20 active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {type === "add" ? "Create Deal" : "Save Changes"}
                </button>
                <Link 
                  href="/admin/deals"
                  className="w-full flex items-center justify-center gap-2 bg-white border border-zinc-200 text-zinc-700 py-3 rounded-lg font-bold hover:bg-zinc-50 transition-colors shadow-sm active:scale-95"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 font-bold">
            <h3 className="text-lg text-zinc-900 mb-8 font-bold uppercase tracking-tight">Status & Stats</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                <span className="text-sm font-medium text-zinc-500 italic">Views</span>
                <span className="text-sm font-bold text-zinc-900">{initialData?.stats?.views || 0}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                <span className="text-sm font-medium text-zinc-500 italic">Clicks</span>
                <span className="text-sm font-bold text-zinc-900">{initialData?.stats?.clicks || 0}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                <span className="text-sm font-medium text-zinc-500 italic">Created</span>
                <span className="text-sm font-bold text-zinc-900">{initialData?.createdAt ? new Date(initialData.createdAt).toLocaleDateString() : "Just now"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
