"use client";

import React, { useState } from "react";
import { X, Upload, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useNotification } from "@/context/NotificationContext";

interface AddTaxonomyModalProps {
  type: "category" | "merchant" | "tag";
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTaxonomyModal({ type, isOpen, onClose }: AddTaxonomyModalProps) {
  const { showNotification } = useNotification();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    showNotification("success", `${label} added successfully.`);
    onClose();
    setImagePreview(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 font-bold">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl text-zinc-900 font-bold">Add New {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-zinc-900 font-bold capitalize">{type} Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder={`e.g., Electronics`}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-orange-500 transition-colors font-medium"
              />
            </div>

            {type === "merchant" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-900 font-bold">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://merchant.com"
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-orange-500 transition-colors font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-900 font-bold">Status</label>
                  <div className="relative">
                    <select className="w-full appearance-none px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-orange-500 transition-colors font-medium cursor-pointer">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={20} />
                  </div>
                </div>
              </>
            )}

            {(type === "category" || type === "merchant") && (
              <div className="space-y-2">
                <label className="text-sm text-zinc-900 font-bold">{type === "category" ? "Category Icon" : "Merchant Logo"}</label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-2xl p-6 bg-zinc-50 hover:bg-zinc-100/50 transition-colors group relative min-h-[150px]">
                  {imagePreview ? (
                    <div className="relative flex items-center justify-center h-full">
                      <Image src={imagePreview} alt="Preview" width={100} height={100} className="max-h-[100px] object-contain rounded-lg shadow-sm" />
                      <button 
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer w-full text-center">
                      <div className="w-12 h-12 bg-white border border-zinc-200 rounded-xl flex items-center justify-center mb-3 shadow-sm">
                        <Upload size={20} className="text-[#E85A28]" />
                      </div>
                      <span className="text-xs text-zinc-900 font-bold">Upload image</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 font-bold">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-zinc-500 hover:text-zinc-700 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-[2] py-3 bg-[#E85A28] text-white rounded-xl font-bold hover:bg-[#D14F23] transition-colors shadow-lg shadow-[#E85A28]/20 active:scale-95"
              >
                Add {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
