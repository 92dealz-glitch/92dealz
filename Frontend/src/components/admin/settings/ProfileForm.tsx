"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { User, Plus, Edit3 } from "lucide-react";
import { useNotification } from "@/context/NotificationContext";
import { uploadImage } from "@/services/upload.service";
import { updateProfileImage, getMyProfile } from "@/lib/api";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  photo: string | null;
}

export default function ProfileForm() {
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    fullName: "Admin User",
    email: "admin234dea@gmail.com",
    phone: "+234 801 234 5678",
    photo: null,
  });
  const [tempProfile, setTempProfile] = useState<ProfileData>(profile);

  useEffect(() => {
    (async () => {
      try {
        const cached = typeof window !== "undefined" ? window.localStorage.getItem("profile_image_url") : null;
        if (cached) {
          setProfile((p) => ({ ...p, photo: cached }));
          setTempProfile((p) => ({ ...p, photo: cached }));
        }
        const res = await getMyProfile();
        const url = (res as any)?.data?.profile_image_url || null;
        if (url) {
          setProfile((p) => ({ ...p, photo: url }));
          setTempProfile((p) => ({ ...p, photo: url }));
          if (typeof window !== "undefined") window.localStorage.setItem("profile_image_url", url);
        }
      } catch {}
    })();
  }, []);

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
    showNotification("success", "Profile updated successfully.");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showNotification("error", "Maximum size is 5MB.");
      return;
    }
    try {
      const { url } = await uploadImage(file);
      setTempProfile({ ...tempProfile, photo: url });
      await updateProfileImage(url);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("profile_image_url", url);
      }
      showNotification("success", "Profile photo updated.");
    } catch (err) {
      showNotification("error", "Failed to upload image.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Account Information</h2>
          <p className="text-sm text-zinc-500">Your personal details and profile</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-sm font-bold text-zinc-700 shadow-sm"
          >
            <Edit3 size={16} />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-[#E85A28] text-white rounded-lg text-sm font-bold hover:bg-[#D14F23] transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-zinc-100 shadow-inner bg-zinc-50 flex items-center justify-center">
            {(isEditing ? tempProfile.photo : profile.photo) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={(isEditing ? tempProfile.photo : profile.photo)!}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={40} className="text-zinc-300" />
            )}
          </div>
          {isEditing && (
            <label className="absolute bottom-0 right-0 p-1.5 bg-[#E85A28] rounded-full border-2 border-white text-white shadow-sm cursor-pointer hover:scale-110 transition-transform">
              <Plus size={14} />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          )}
          <div className="mt-4 text-center md:text-left">
            <h4 className="text-sm font-bold text-zinc-900">Profile Photo</h4>
            <p className="text-[10px] text-zinc-500 mt-1">JPG, PNG or GIF. Max size 5MB.</p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full font-bold">
          <div className="space-y-2">
            <label className="text-sm text-zinc-900">Full Name</label>
            <input
              type="text"
              value={isEditing ? tempProfile.fullName : profile.fullName}
              disabled={!isEditing}
              onChange={(e) => setTempProfile({ ...tempProfile, fullName: e.target.value })}
              className={`w-full px-4 py-2.5 bg-zinc-50 border ${isEditing ? 'border-orange-500/20 focus:border-orange-500' : 'border-zinc-200'} rounded-lg outline-none text-zinc-700 font-medium transition-colors`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-900">Email Address</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2.5 bg-zinc-100 border border-zinc-200 rounded-lg outline-none text-zinc-500 font-medium cursor-not-allowed"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-zinc-900">Phone Number</label>
            <input
              type="text"
              value={isEditing ? tempProfile.phone : profile.phone}
              disabled={!isEditing}
              onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
              className={`w-full px-4 py-2.5 bg-zinc-50 border ${isEditing ? 'border-orange-500/20 focus:border-orange-500' : 'border-zinc-200'} rounded-lg outline-none text-zinc-700 font-medium transition-colors`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
