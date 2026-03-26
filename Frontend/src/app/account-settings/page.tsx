"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Save, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Plus, 
  Settings, 
  LogOut 
} from "lucide-react";
import { getMyProfile, updateProfile, upgradeToVendor } from "@/lib/api";
import { getFallbackArray } from "@/data/categoriesData";

export default function AccountSettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [categories, setCategories] = useState<{ id: string; title: string }[]>([]);

  // Upgrade form state
  const [upgradeMode, setUpgradeMode] = useState(false);
  const [upgradeData, setUpgradeData] = useState({
    businessName: "",
    businessCategory: "",
    businessAddress: ""
  });

  useEffect(() => {
    loadData();
    getFallbackArray().then(res => setCategories(res as any));
  }, []);

  const loadData = async () => {
    try {
      const res = await getMyProfile();
      if (res.success) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile({
        name: profile.name,
        phone: profile.phone,
        profile_image_url: profile.profile_image_url,
        // Also include vendor fields if they exist
        ...(profile.role === 'vendor' && {
            businessName: profile.businessName,
            businessCategory: profile.businessCategory,
            businessAddress: profile.businessAddress,
            about: profile.about
        })
      });
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await upgradeToVendor(upgradeData);
      setMessage({ 
        type: "success", 
        text: "Upgrade request submitted! Your role change requires a fresh login to take effect. Please logout and login again." 
      });
      setUpgradeMode(false);
      // We don't call loadData here because the token is stale anyway
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to upgrade" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
      window.location.href = "/login";
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-orange-600 px-6 py-8 sm:px-10">
            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            <p className="text-orange-100 mt-1">Manage your profile and business information</p>
          </div>

          <div className="p-6 sm:p-10">
            {message && (
              <div className={`mb-8 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                <div className="flex items-center gap-3">
                  {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
                {message.type === 'success' && message.text.includes("re-login") && (
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold h-fit hover:bg-green-700 transition"
                  >
                    <LogOut size={16} />
                    Logout Now
                  </button>
                )}
              </div>
            )}

            <div className="mb-10 flex flex-col items-center sm:flex-row gap-6 p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                   {profile?.profile_image_url ? (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img src={profile.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <User size={40} className="text-orange-400" />
                   )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-orange-700 transition shadow-lg border-2 border-white">
                  <Plus size={16} />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append("image", file);
                      setSaving(true);
                      try {
                        const token = localStorage.getItem("token");
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/upload/image`, {
                          method: "POST",
                          headers: { Authorization: `Bearer ${token}` },
                          body: formData
                        });
                        const data = await res.json();
                        if (data.success) {
                          setProfile({ ...profile, profile_image_url: data.url });
                          localStorage.setItem("profile_image_url", data.url);
                          // Auto-save to database
                          await updateProfile({ ...profile, profile_image_url: data.url });
                          setMessage({ type: "success", text: "Profile photo updated and saved!" });
                        }
                      } catch (err) {
                        setMessage({ type: "error", text: "Upload failed" });
                      } finally {
                        setSaving(false);
                      }
                    }}
                  />
                </label>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-bold text-zinc-900">Profile Picture</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">JPG or PNG, max 5MB.</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={profile?.name || ""} 
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={profile?.phone || ""} 
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {profile?.role === 'vendor' && (
                <div className="pt-6 border-t border-gray-100 space-y-6">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="text-orange-600" size={20} />
                    Business Information
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                      <input 
                        type="text" 
                        value={profile?.businessName || ""} 
                        onChange={(e) => setProfile({...profile, businessName: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                      <select 
                        value={profile?.businessCategory || ""} 
                        onChange={(e) => setProfile({...profile, businessCategory: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none appearance-none"
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin size={16} /> Business Address
                    </label>
                    <input 
                      type="text" 
                      value={profile?.businessAddress || ""} 
                      onChange={(e) => setProfile({...profile, businessAddress: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">About your business</label>
                    <textarea 
                      rows={4}
                      value={profile?.about || ""} 
                      onChange={(e) => setProfile({...profile, about: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none resize-none"
                      placeholder="Describe your store..."
                    ></textarea>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex items-center gap-2 bg-orange-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-100 disabled:opacity-50"
                >
                  <Save size={20} />
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>

            {profile?.role === 'user' && !upgradeMode && (
              <div className="mt-12 p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                <TrendingUp className="mx-auto text-orange-600 mb-4" size={40} />
                <h2 className="text-xl font-bold text-gray-900">Want to sell your products?</h2>
                <p className="text-gray-500 mt-2 mb-6">Upgrade to a vendor account and start reaching millions of buyers across Nigeria.</p>
                <button 
                  onClick={() => setUpgradeMode(true)}
                  className="bg-zinc-900 text-white font-bold px-10 py-3 rounded-xl hover:bg-zinc-800 transition"
                >
                  Become a Vendor
                </button>
              </div>
            )}

            {upgradeMode && (
              <div className="mt-12 p-8 bg-orange-50 rounded-2xl border border-orange-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="text-orange-600" size={24} />
                  Vendor Upgrade Application
                </h2>
                <form onSubmit={handleUpgrade} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Store / Business Name</label>
                      <input 
                        required
                        type="text" 
                        value={upgradeData.businessName} 
                        onChange={(e) => setUpgradeData({...upgradeData, businessName: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                        placeholder="e.g. My Awesome Shop"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Category</label>
                      <select 
                        required
                        value={upgradeData.businessCategory} 
                        onChange={(e) => setUpgradeData({...upgradeData, businessCategory: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Address</label>
                    <input 
                      required
                      type="text" 
                      value={upgradeData.businessAddress} 
                      onChange={(e) => setUpgradeData({...upgradeData, businessAddress: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="Street, City, State"
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition disabled:opacity-50"
                    >
                      {saving ? "Submitting..." : "Submit Upgrade Request"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setUpgradeMode(false)}
                      className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
