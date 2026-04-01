"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { uploadImage } from "@/services/upload.service";
import { getMyProfile, updateProfileImage, updateProfile } from "@/lib/api";
import { getFallbackArray } from "@/data/categoriesData";

export default function PersonalDetailsPage() {
    const [profile, setProfile] = useState<any>({
        name: "", email: "", phone: "", businessName: "", businessCategory: "", businessAddress: "", about: ""
    });
    const [photo, setPhoto] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [categories, setCategories] = useState<{id: string, title: string}[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [res, cats] = await Promise.all([getMyProfile(), getFallbackArray()]);
                if (!mounted) return;
                setCategories(cats);
                if (res?.data) {
                    const data = res.data as any;
                    setProfile({
                        name: data.name || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        businessName: data.businessName || "",
                        businessCategory: data.businessCategory || "",
                        businessAddress: data.businessAddress || "",
                        about: data.about || "",
                    });
                    setPhoto(data.profile_image_url || null);
                }
            } catch {}
        })();
        return () => { mounted = false; };
    }, []);

    async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;
        setSaving(true);
        try {
            const { url } = await uploadImage(f);
            setPhoto(url);
            await updateProfileImage(url);
            if (typeof window !== "undefined") {
                window.localStorage.setItem("profile_image_url", url);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: "", type: "" });
        try {
            await updateProfile({
                name: profile.name,
                phone: profile.phone,
                businessName: profile.businessName,
                businessCategory: profile.businessCategory,
                businessAddress: profile.businessAddress,
                about: profile.about
            });
            setMessage({ text: "Profile updated successfully!", type: "success" });
        } catch (err: any) {
            setMessage({ text: err.message || "Failed to update profile", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden p-8 lg:p-12 animate-in fade-in duration-500">
            <h2 className="text-black font-black text-2xl mb-8">Personal & Business Details</h2>

            {message.text && (
                <div className={`mb-6 p-4 rounded-lg font-bold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {message.text}
                </div>
            )}

            <div className="max-w-3xl">
                <div className="mb-12 relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative bg-zinc-100">
                        {photo ? (
                          <img src={photo} alt="Profile" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-zinc-400 font-bold text-3xl">
                              {profile.name ? profile.name.substring(0, 1).toUpperCase() : "?"}
                          </div>
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-[#f45c03] text-white p-2.5 rounded-full border-4 border-white shadow-md hover:bg-[#f45c03] transition-all cursor-pointer">
                        <CameraIcon />
                        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
                    </label>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-black font-black text-[15px]">Full Name</label>
                            <input type="text" name="name" value={profile.name} onChange={handleChange} required className="border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#f45c03] transition-colors" placeholder="Enter full name" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-black font-black text-[15px]">Email Address (Read Only)</label>
                            <input type="email" value={profile.email} readOnly className="border border-zinc-200 bg-zinc-50 rounded-lg p-4 text-zinc-500 font-bold focus:outline-none transition-colors cursor-not-allowed" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-black font-black text-[15px]">Phone Number</label>
                            <input type="text" name="phone" value={profile.phone} onChange={handleChange} className="border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#f45c03] transition-colors" placeholder="+234 8100909 000" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-black font-black text-[15px]">Business Name</label>
                            <input type="text" name="businessName" value={profile.businessName} onChange={handleChange} className="border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#f45c03] transition-colors" placeholder="e.g. Adaeze Fashion House" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-black font-black text-[15px]">Business Category</label>
                            <div className="relative">
                                <select name="businessCategory" value={profile.businessCategory} onChange={handleChange} className="appearance-none w-full border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#f45c03] transition-colors bg-white">
                                    <option value="">Select a category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                    <ChevronDownIcon />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-black font-black text-[15px]">Business Address</label>
                            <input type="text" name="businessAddress" value={profile.businessAddress} onChange={handleChange} className="border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#f45c03] transition-colors" placeholder="e.g. 14 Broad Street, Lagos" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-black font-black text-[15px]">About Your Business</label>
                        <textarea
                            name="about"
                            value={profile.about}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Write a short description about yourself or your business"
                            className="border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#f45c03] transition-colors resize-none"
                        />
                    </div>

                    <div className="flex justify-start pt-8">
                        <button type="submit" disabled={saving} className="bg-[#f45c03] hover:bg-[#f45c03] disabled:opacity-50 text-white font-black py-4 px-16 rounded-xl transition-all shadow-lg shadow-orange-100 min-w-[240px]">
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CameraIcon() {
    return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.1667 15.8333V6.66667C19.1667 6.22464 18.9911 5.80072 18.6785 5.48816C18.366 5.17559 17.942 5 17.5 5H15.0167L13.8417 2.65C13.6845 2.33642 13.4382 2.07474 13.1311 1.89518C12.8239 1.71562 12.4691 1.6256 12.1083 1.63628H7.89171C7.53094 1.6256 7.17614 1.71562 6.86898 1.89518C6.56182 2.07474 6.31551 2.33642 6.15837 2.65L4.98337 5H2.50004C2.05801 5 1.63409 5.17559 1.32153 5.48816C1.00897 5.80072 0.833374 6.22464 0.833374 6.66667V15.8333C0.833374 16.2754 1.00897 16.6993 1.32153 17.0118C1.63409 17.3244 2.05801 17.5 2.50004 17.5H17.5C17.942 17.5 18.366 17.3244 18.6785 17.0118C18.9911 16.6993 19.1667 16.2754 19.1667 15.8333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 14.1667C12.3012 14.1667 14.1667 12.3012 14.1667 10C14.1667 7.69882 12.3012 5.83334 10 5.83334C7.69886 5.83334 5.83337 7.69882 5.83337 10C5.83337 12.3012 7.69886 14.1667 10 14.1667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function ChevronDownIcon() {
    return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

