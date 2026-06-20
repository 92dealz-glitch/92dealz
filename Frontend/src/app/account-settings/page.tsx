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
  LogOut,
  Mail,
  X
} from "lucide-react";
import { 
  getMyProfile, 
  updateProfile, 
  upgradeToVendor, 
  sendPhoneOtp, 
  verifyPhoneOtp,
  sendVerificationOtp,
  verifyContactOtp,
  API_BASE
} from "@/lib/api";
import { getFallbackArray } from "@/data/categoriesData";
import { useAlert } from "@/context/AlertContext";

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
  
  // Contact verification state
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showEmailOtpInput, setShowEmailOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  
  const isPakistan = profile?.country_code === 'PK' || profile?.country_name === 'Pakistan' || (profile?.phone && (profile.phone.startsWith('+92') || profile.phone.startsWith('92')));
  const isChina = profile?.country_code === 'CN' || profile?.country_name === 'China' || (profile?.phone && (profile.phone.startsWith('+86') || profile.phone.startsWith('86')));
  const isRestricted = profile && !isPakistan && !isChina;

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

  const { showVendorTasks } = useAlert();

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await upgradeToVendor(upgradeData);
      
      // Update local storage immediately for direct conversion
      if (typeof window !== "undefined") {
        window.localStorage.setItem("role", "vendor");
      }
      
      setMessage({ 
        type: "success", 
        text: "Congratulations! Your account has been upgraded to Vendor successfully." 
      });
      
      setUpgradeMode(false);
      showVendorTasks();
      loadData(); // Success, so reload profile to reflect vendor fields
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

  const handleSendOtp = async () => {
    if (!profile?.phone) {
      setMessage({ type: "error", text: "Please enter a phone number first" });
      return;
    }
    setVerifying(true);
    try {
      await sendVerificationOtp({ contact: profile.phone, method: 'phone' });
      setShowOtpInput(true);
      setMessage({ type: "success", text: "Verification code sent to your phone!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to send code" });
    } finally {
      setVerifying(false);
    }
  };

  const handleConfirmOtp = async () => {
    if (!otpCode) return;
    setVerifying(true);
    try {
      await verifyContactOtp({ contact: profile.phone, method: "phone", otp: otpCode });
      setShowOtpInput(false);
      setOtpCode("");
      setMessage({ type: "success", text: "Phone number verified successfully!" });
      setProfile((prev: any) => ({ ...prev, is_phone_verified: true }));
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Verification failed" });
    } finally {
      setVerifying(false);
    }
  };

  const handleSendEmailOtp = async () => {
    if (!profile?.email) {
      setMessage({ type: "error", text: "Please enter an email address first" });
      return;
    }
    setVerifying(true);
    try {
      await sendVerificationOtp({ contact: profile.email, method: "email" });
      setShowEmailOtpInput(true);
      setMessage({ type: "success", text: "Verification code sent to your email!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to send code" });
    } finally {
      setVerifying(false);
    }
  };

  const handleConfirmEmailOtp = async () => {
    if (!emailOtpCode) return;
    setVerifying(true);
    try {
      await verifyContactOtp({ contact: profile.email, method: "email", otp: emailOtpCode });
      setShowEmailOtpInput(false);
      setEmailOtpCode("");
      setMessage({ type: "success", text: "Email address verified successfully!" });
      setProfile((prev: any) => ({ ...prev, is_email_verified: true }));
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Verification failed" });
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[#708238] px-6 py-8 sm:px-10">
            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            <p className="text-emerald-100 mt-1">Manage your profile and business information</p>
          </div>

          <div className="p-6 sm:p-10">
            {message && (
              <div className={`mb-8 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-[#E9E0D4]' : 'bg-red-50 text-red-700 border border-red-100'}`}>
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
                <div className="w-24 h-24 rounded-full bg-[#FFFDF9] flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                   {profile?.profile_image_url ? (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img src={profile.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <User size={40} className="text-[#708238]" />
                   )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#708238] rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-[#5E6E2F] transition shadow-lg border-2 border-white">
                  <Plus size={16} />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      // 3MB limit check 
                      if (file.size > 3 * 1024 * 1024) {
                        alert("File is too large. Profile photo must be less than 3MB.");
                        return;
                      }

                      const formData = new FormData();
                      formData.append("image", file);
                      setSaving(true);
                      try {
                        const token = localStorage.getItem("token");
                        const res = await fetch(`${API_BASE}/uploads/image`, {
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

            {profile?.role === 'vendor' && (!profile.is_phone_verified || !profile.is_email_verified) && (
              <div className="mb-8 p-4 sm:p-5 bg-[#FFFDF9]/30 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="bg-[#FFFDF9] p-2.5 rounded-xl text-emerald-600 h-fit w-fit mx-auto sm:mx-0">
                  <TrendingUp size={22} />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-sm font-bold text-emerald-900 mb-1">Verify your account for the Best User Experience</h4>
                  <p className="text-xs text-[#5E6E2F] font-medium leading-relaxed">
                    To ensure trust between you and your buyers, and to provide the <span className="underline decoration-emerald-300">Best User Experience</span>, 
                    we require all vendors to verify both their Phone Number and Email Address. 
                    Verified vendors get <span className="font-black text-emerald-900">3x more visibility</span> and faster ad approvals!
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={profile?.name || ""} 
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                     <span>Email Address</span>
                     {profile?.email && (
                       <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-black ${profile?.is_email_verified ? 'bg-green-100 text-[#708238]' : 'bg-[#FFFDF9] text-emerald-600'}`}>
                         {profile?.is_email_verified ? 'Verified' : 'Unverified'}
                       </span>
                     )}
                   </label>
                   <div className="flex gap-2">
                     <div className="relative flex-1">
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                       <input 
                         type="email" 
                         value={profile?.email || ""} 
                         onChange={(e) => setProfile({...profile, email: e.target.value})}
                         disabled={profile?.role === 'vendor' && profile?.is_email_verified}
                         className={`w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none ${profile?.role === 'vendor' && profile?.is_email_verified ? 'opacity-70 cursor-not-allowed grayscale-[0.5]' : ''}`}
                         placeholder="your@email.com"
                       />
                     </div>
                     {!profile?.is_email_verified && profile?.email && !showEmailOtpInput && (
                       <button
                         type="button"
                         onClick={handleSendEmailOtp}
                         disabled={verifying}
                         className="bg-zinc-900 text-white px-4 rounded-xl text-xs font-bold hover:bg-zinc-800 transition disabled:opacity-50 whitespace-nowrap"
                       >
                         {verifying ? "..." : "Verify Now"}
                       </button>
                     )}
                   </div>

                   {showEmailOtpInput && (
                     <div className="mt-4 p-4 bg-[#FFFDF9]/30 rounded-xl border border-emerald-100 animate-in fade-in zoom-in duration-200">
                       <p className="text-xs font-bold text-[#5E6E2F] mb-3 text-center sm:text-left">Check your email for the 6-digit code:</p>
                       <div className="flex flex-col sm:flex-row gap-3">
                         <input 
                           type="text" 
                           maxLength={6}
                           value={emailOtpCode}
                           onChange={(e) => setEmailOtpCode(e.target.value)}
                           className="flex-1 px-4 py-2 bg-white border-2 border-emerald-200 rounded-lg outline-none focus:border-emerald-500 font-black tracking-widest text-center"
                           placeholder="000000"
                         />
                         <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleConfirmEmailOtp}
                              disabled={verifying || emailOtpCode.length < 6}
                              className="flex-1 sm:flex-none bg-[#708238] text-white px-6 rounded-lg font-bold hover:bg-[#5E6E2F] transition disabled:opacity-50"
                            >
                              Verify
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowEmailOtpInput(false)}
                              className="px-3 py-2 text-zinc-500 hover:bg-[#FFFDF9] rounded-lg transition"
                            >
                              <X size={18} />
                            </button>
                         </div>
                       </div>
                     </div>
                   )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                    <span>Phone Number</span>
                    {profile?.phone && (
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-black ${profile?.is_phone_verified ? 'bg-green-100 text-[#708238]' : 'bg-[#FFFDF9] text-emerald-600'}`}>
                        {profile?.is_phone_verified ? 'Verified' : 'Unverified'}
                      </span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        value={profile?.phone || ""} 
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        disabled={profile?.role === 'vendor' && profile?.is_phone_verified}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none ${profile?.role === 'vendor' && profile?.is_phone_verified ? 'opacity-70 cursor-not-allowed grayscale-[0.5]' : ''}`}
                        placeholder="+92..."
                      />
                    </div>
                    {!profile?.is_phone_verified && profile?.phone && !showOtpInput && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={verifying}
                        className="bg-zinc-900 text-white px-4 rounded-xl text-xs font-bold hover:bg-zinc-800 transition disabled:opacity-50 whitespace-nowrap"
                      >
                        {verifying ? "Sending..." : "Verify Now"}
                      </button>
                    )}
                  </div>

                  {showOtpInput && (
                    <div className="mt-4 p-4 bg-[#FFFDF9]/30 rounded-xl border border-emerald-100 animate-in fade-in zoom-in duration-200">
                      <p className="text-xs font-bold text-[#5E6E2F] mb-3 text-center sm:text-left">Enter the 6-digit code sent to your phone:</p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input 
                          type="text" 
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          className="flex-1 px-4 py-2 bg-white border-2 border-emerald-200 rounded-lg outline-none focus:border-emerald-500 font-black tracking-widest text-center"
                          placeholder="000000"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleConfirmOtp}
                            disabled={verifying || otpCode.length < 6}
                            className="flex-1 sm:flex-none bg-[#708238] text-white px-6 rounded-lg font-bold hover:bg-[#5E6E2F] transition disabled:opacity-50"
                          >
                            {verifying ? "..." : "Confirm"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowOtpInput(false)}
                            className="px-3 py-2 text-zinc-500 hover:bg-[#FFFDF9] rounded-lg transition"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {profile?.role === 'vendor' && (
                <div className="pt-6 border-t border-gray-100 space-y-6">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="text-emerald-600" size={20} />
                    Business Information
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                      <input 
                        type="text" 
                        value={profile?.businessName || ""} 
                        onChange={(e) => setProfile({...profile, businessName: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                      <select 
                        value={profile?.businessCategory || ""} 
                        onChange={(e) => setProfile({...profile, businessCategory: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none appearance-none"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                       <label className="block text-sm font-semibold text-gray-700">About your business</label>
                       <span className={`text-[10px] font-bold ${ (profile?.about || "").length >= 500 ? 'text-red-500' : 'text-zinc-400'}`}>
                          {(profile?.about || "").length} / 500
                       </span>
                    </div>
                    <textarea 
                      rows={4}
                      maxLength={500}
                      value={profile?.about || ""} 
                      onChange={(e) => setProfile({...profile, about: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none resize-none"
                      placeholder="Describe your store..."
                    ></textarea>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#708238] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#5E6E2F] transition shadow-lg shadow-[#E9E0D4]/30 disabled:opacity-50"
                >
                  <Save size={20} />
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>

            {profile?.role === 'user' && !upgradeMode && (
              <div className="mt-12 p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                <TrendingUp className="mx-auto text-emerald-600 mb-4" size={40} />
                <h2 className="text-xl font-bold text-gray-900">Want to sell your products?</h2>
                <p className="text-gray-500 mt-2 mb-6">
                  {isRestricted 
                    ? "Vendor accounts are currently only available in Pakistan and China." 
                    : "Upgrade to a vendor account and start reaching millions of buyers across Pakistan."}
                </p>
                {isRestricted ? (
                  <div className="bg-[#FFFDF9]/30 p-4 rounded-xl border border-emerald-100 text-emerald-700 text-sm font-bold">
                    You cannot be a vendor, not available in your country but you can purchase products you like.
                  </div>
                ) : (
                  <button 
                    onClick={() => setUpgradeMode(true)}
                    className="bg-zinc-900 text-white font-bold px-10 py-3 rounded-xl hover:bg-zinc-800 transition"
                  >
                    Become a Vendor
                  </button>
                )}
              </div>
            )}

            {upgradeMode && (
              <div className="mt-12 p-8 bg-[#FFFDF9]/30 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="text-emerald-600" size={24} />
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
                        className="w-full px-4 py-2.5 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="e.g. My Awesome Shop"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Category</label>
                      <select 
                        required
                        value={upgradeData.businessCategory} 
                        onChange={(e) => setUpgradeData({...upgradeData, businessCategory: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
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
                      className="w-full px-4 py-2.5 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="Street, City, State"
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="flex-1 bg-[#708238] text-white font-bold py-3 rounded-xl hover:bg-[#5E6E2F] transition disabled:opacity-50"
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


