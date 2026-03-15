"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  User,
  Heart,
  Menu,
  Home,
  Bell,
  Mail,
  HelpCircle,
  MessageSquare,
  Lock,
  Shield,
  CreditCard,
  Settings,
  LogOut,
  Plus,
  Grid,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DropdownCategories from "./DropdownCategories";
import CategoryMegaMenu from "./CategoryMegaMenu";
import LocationDropdown from "./LocationDropdown";
import { useFavorites } from "../context/FavoritesProvider";
import { API_BASE } from "@/services/apiClient";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const browseRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [mQuery, setMQuery] = useState("");
  const favorites = useFavorites();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (browseRef.current && browseRef.current.contains(target)) return;
      if (navRef.current && navRef.current.contains(target)) return;
      setOpen(false);
      setOpenCategory(null);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <header className="w-full bg-white shadow-sm">
      {/* ================= DESKTOP HEADER ================= */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center">
                <Image
                  src="/234dealslogo.svg"
                  alt="234 Deals"
                  width={120}
                  height={65}
                  priority
                  className="object-contain"
                />
              </Link>

              <div className="flex items-center gap-3">
                <LocationDropdown value="Lagos" onChange={() => { }} />

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (query.trim()) {
                      router.push(`/search?search=${encodeURIComponent(query.trim())}`);
                    }
                  }}
                  className="flex items-center overflow-hidden rounded-md border border-orange-500 shadow-sm"
                >
                  <input
                    type="text"
                    placeholder="I am looking for..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-72 px-4 py-2 text-sm text-black placeholder:text-black/50 outline-none"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center bg-orange-500 px-4 py-2.5 text-white hover:bg-orange-600 transition-colors"
                  >
                    <Search size={16} />
                  </button>
                </form>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {!isLoggedIn ? (
                <>
                  <Link href="/signup" className="text-sm text-zinc-700 hover:text-orange-600">
                    Sign up
                  </Link>
                  <Link href="/login" className="text-sm text-zinc-700 hover:text-orange-600">
                    Log in
                  </Link>
                  <Link href="/signup" className="text-sm text-zinc-700 hover:text-orange-600">
                    <button className="hidden lg:inline-flex items-center rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-orange-600 transition-colors">
                      Start Selling Today!
                    </button>
                  </Link>
                </>
              ) : (
                <NavUserMenu />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden bg-[#f3f3f3]">
        <div className="px-4 pt-4 pb-3">
          {/* Top Row */}
          <div className="flex items-center mb-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/234dealslogo.svg"
                alt="234 Deals"
                width={105}
                height={55}
                priority
                className="object-contain"
              />
            </Link>

            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-3">
                {!isLoggedIn ? (
                  <>
                    <Link href="/login" className="text-[15px] font-medium text-black whitespace-nowrap hover:text-orange-600">
                      Log In
                    </Link>
                    <span className="text-[15px] text-gray-400">/</span>
                    <Link href="/signup" className="text-[15px] font-medium text-black whitespace-nowrap hover:text-orange-600">
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <NavUserMenu />
                )}
              </div>

              <button
                className="text-orange-600"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={26} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Mobile Search Row */}
          <div className="flex w-full items-center gap-2">
            <div className="flex-shrink-0 w-auto min-w-[100px] max-w-[130px]">
              <LocationDropdown value="Lagos" onChange={() => { }} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (mQuery.trim()) {
                  setMobileMenuOpen(false);
                  router.push(`/search?search=${encodeURIComponent(mQuery.trim())}`);
                }
              }}
              className="flex flex-1 items-center overflow-hidden rounded-lg border border-orange-500 bg-white h-[42px]"
            >
              <input
                type="text"
                placeholder="Search..."
                value={mQuery}
                onChange={(e) => setMQuery(e.target.value)}
                className="flex-1 px-3 text-sm text-black placeholder:text-gray-400 outline-none h-full min-w-0"
              />
              <button
                type="submit"
                className="flex items-center justify-center bg-orange-500 px-3 h-full shrink-0"
              >
                <Search size={18} className="text-white" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU MODAL ================= */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="relative z-50 h-full w-full bg-white overflow-auto">
            <div className="px-4 pt-4 pb-3">
              {/* Top Row: User & Close */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <UserAvatarCircle />
                  <div className="text-sm font-medium">Account</div>
                </div>

                <button
                  type="button"
                  className="text-orange-600"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>

              <div className="flex w-full items-stretch gap-2 pb-4">
                <div className="flex-shrink-0 w-auto min-w-[100px] max-w-[130px]">
                  <LocationDropdown value="Lagos" onChange={() => { }} />
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (mQuery.trim()) {
                      setMobileMenuOpen(false);
                      router.push(`/search?search=${encodeURIComponent(mQuery.trim())}`);
                    }
                  }}
                  className="flex flex-1 items-stretch overflow-hidden rounded-lg border border-orange-500 bg-white"
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    value={mQuery}
                    onChange={(e) => setMQuery(e.target.value)}
                    className="flex-1 px-3 text-sm text-black placeholder:text-gray-400 outline-none min-w-0"
                  />
                  <button type="submit" className="flex items-center justify-center bg-orange-500 px-3 shrink-0">
                    <Search size={18} className="text-white" />
                  </button>
                </form>
              </div>

              {/* Login/Signup Buttons */}
              {!isLoggedIn && (
                <div className="flex gap-3 mb-4">
                  <Link href="/login" className="flex-1 bg-orange-500 text-white py-3 rounded-md shadow inline-flex items-center justify-center">
                    Login
                  </Link>
                  <Link href="/signup" className="flex-1 bg-orange-500 text-white py-3 rounded-md shadow inline-flex items-center justify-center">
                    Signup
                  </Link>
                </div>
              )}

              {/* Menu Links */}
              <div className="py-2 border-b border-zinc-100">
                <button
                  onClick={() => {
                    const r = typeof window !== "undefined" ? (window.localStorage.getItem("role") || "user").toLowerCase() : "user";
                    setMobileMenuOpen(false);
                    router.push(r === "vendor" ? "/vendor-dashboard" : r === "admin" ? "/admin" : "/user/dashboard/settings");
                  }}
                  className="w-full text-left px-5 py-2.5 text-sm hover:bg-zinc-50 flex items-center gap-3 transition-colors"
                >
                  <span className="bg-orange-100 p-1.5 rounded-lg text-orange-600"><Settings size={16} /></span>
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    const r = typeof window !== "undefined" ? (window.localStorage.getItem("role") || "user").toLowerCase() : "user";
                    setMobileMenuOpen(false);
                    router.push(r === "vendor" ? "/vendor-dashboard/add-product" : "/user/profile");
                  }}
                  className="w-full text-left px-5 py-2.5 text-sm hover:bg-zinc-50 flex items-center gap-3 transition-colors"
                >
                  <span className="bg-orange-100 p-1.5 rounded-lg text-orange-600"><Plus size={16} /></span>
                  { (typeof window !== "undefined" && window.localStorage.getItem("role") === "vendor") ? "Add New Deal" : "My Profile" }
                </button>
              </div>

              <div className="divide-y divide-zinc-100">
                {[
                  { icon: Bell, label: "Notifications" },
                  { icon: Mail, label: "Messages" },
                  { icon: HelpCircle, label: "Help Center" },
                  { icon: MessageSquare, label: "Chat With Us" },
                  { icon: Lock, label: "Update Password" },
                  { icon: Shield, label: "Verify Account" },
                  { icon: CreditCard, label: "Payment Details" },
                  { icon: LogoutButton, label: "Logout", color: "text-red-500" }
                ].map((item, idx) => (
                  <div key={idx} className={`px-4 py-3 flex items-center gap-3 hover:bg-zinc-50 transition-colors cursor-pointer ${item.color || "text-zinc-700"}`}>
                    <item.icon className={item.color ? "text-red-500" : "text-orange-600"} size={20} />
                    <div className="text-sm font-medium">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Bottom Fixed Navigation in Modal */}
              <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t z-50">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex items-center justify-between h-16">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center text-sm text-zinc-700">
                      <Home size={22} />
                      <span className="text-[10px] mt-1 text-center">Home</span>
                    </Link>
                    <Link href="/favorites" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center text-sm text-zinc-700">
                      <Heart size={22} />
                      <span className="text-[10px] mt-1 text-center">Favorite</span>
                    </Link>
                    <Link href="/vendor-dashboard/add-product" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center text-sm text-zinc-700">
                      <Plus size={22} />
                      <span className="text-[10px] mt-1 text-center">Sell</span>
                    </Link>
                    <Link href="/vendor-dashboard/my-ads" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center text-sm text-zinc-700">
                      <Grid size={22} />
                      <span className="text-[10px] mt-1 text-center">My Ads</span>
                    </Link>
                    <Link href="/user/dashboard/settings" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center text-sm text-zinc-700">
                      <User size={22} />
                      <span className="text-[10px] mt-1 text-center">Account</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent bottom navigation shown on mobile when modal is closed */}
      {!mobileMenuOpen && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex flex-col items-center text-sm text-zinc-700">
                <Home size={22} />
                <span className="text-[10px] mt-1 text-center">Home</span>
              </Link>
              <Link href="/favorites" className="flex flex-col items-center text-sm text-zinc-700">
                <Heart size={22} />
                <span className="text-[10px] mt-1 text-center">Favorite</span>
              </Link>
              <Link href="/vendor-dashboard/add-product" className="flex flex-col items-center text-sm text-[#FF6B35]">
                <div className="bg-[#FF6B35] rounded-full p-2.5 -mt-8 shadow-lg border-4 border-white">
                  <Plus size={24} className="text-white" />
                </div>
                <span className="text-[10px] mt-1 text-center">Sell</span>
              </Link>
              <Link href="/vendor-dashboard/my-ads" className="flex flex-col items-center text-sm text-zinc-700">
                <Grid size={22} />
                <span className="text-[10px] mt-1 text-center">My Ads</span>
              </Link>
              <Link href="/user/dashboard/settings" className="flex flex-col items-center text-sm text-zinc-700">
                <UserAvatarCircle small />
                <span className="text-[10px] mt-1 text-center">Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ================= DESKTOP CATEGORY NAV ================= */}
      <div ref={navRef} className="relative hidden md:block">
        <nav className="border-t bg-[#f6efef]">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex h-14 items-center gap-8">
              {/* Browse Categories */}
              <div className="relative" ref={browseRef}>
                <button
                  onClick={() => {
                    if (openCategory) return;
                    setOpen((v) => !v);
                  }}
                  disabled={!!openCategory}
                  className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  <Menu size={18} />
                  Browse Categories
                </button>

                {open && (
                  <DropdownCategories
                    className="left-0"
                    onSelect={(id) => {
                      setOpen(false);
                      router.push(`/category/${id}`);
                    }}
                  />
                )}
              </div>

              {/* Category Buttons */}
              <div className="hidden sm:flex items-center gap-10 text-sm">
                {["fashion", "phones", "computer", "health", "electronics"].map(
                  (category) => (
                    <button
                      key={category}
                      onClick={() =>
                        setOpenCategory((c) =>
                          c === category ? null : category,
                        )
                      }
                      className="text-zinc-700 hover:text-orange-600 transition-all font-medium py-2"
                    >
                      {category === "fashion" && "Fashion"}
                      {category === "phones" && "Phones & Tablets"}
                      {category === "computer" && "Computer & Accessories"}
                      {category === "health" && "Health & Beauty"}
                      {category === "electronics" && "Electronics"}
                    </button>
                  ),
                )}
              </div>

              {/* Wishlist */}
              <div className="ml-auto flex items-center gap-2 text-zinc-700">
                <button
                  type="button"
                  onClick={() => router.push("/favorites")}
                  className="flex items-center gap-2 hover:text-orange-600 transition-colors"
                >
                  <Heart size={20} />
                  <span className="text-xs font-bold">{favorites.items.length}</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {openCategory && (
          <CategoryMegaMenu
            category={openCategory}
            onSelect={(item) => {
              setOpenCategory(null);
              setOpen(false);
              router.push(`/category/${openCategory}?sub=${item}`);
            }}
          />
        )}
      </div>
    </header>
  );
}

function useNavProfileImage() {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    try {
      const cached = typeof window !== "undefined" ? window.localStorage.getItem("profile_image_url") : null;
      if (cached) setUrl(cached);
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      if (!token) return;
      fetch(`${API_BASE}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })
        .then((r) => r.json())
        .then((d) => {
          const u = d?.data?.profile_image_url;
          if (u) {
            setUrl(u);
            if (typeof window !== "undefined") window.localStorage.setItem("profile_image_url", u);
          }
        })
        .catch(() => {});
    } catch {}
  }, []);
  return url;
}

function NavUserMenu() {
  const [open, setOpen] = useState(false);
  const url = useNavProfileImage();
  const role = typeof window !== "undefined" ? (window.localStorage.getItem("role") || "user").toLowerCase() : "user";
  const router = useRouter();

  function signOut() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("role");
      window.localStorage.removeItem("profile_image_url");
    }
    router.push("/login");
    window.location.reload();
  }

  function go(path: string) {
    setOpen(false);
    router.push(path);
  }

  const vendor = role === "vendor";

  return (
    <div className="relative" id="nav-user-menu">
      <button 
        onClick={() => setOpen(v => !v)} 
        className="flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 transition-colors w-10 h-10 overflow-hidden border-2 border-white shadow-sm"
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Me" className="w-full h-full object-cover" />
        ) : (
          <User size={22} className="text-white" />
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-3 w-56 bg-white border border-zinc-100 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-zinc-50 px-4 py-3 border-b border-zinc-100 mb-1">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Account Role</p>
              <p className="text-sm font-bold text-orange-600 capitalize">{role}</p>
            </div>
            <div className="p-1.5 space-y-0.5">
              <button onClick={() => go(vendor ? "/vendor/dashboard" : role === "admin" ? "/admin" : "/user/dashboard")} className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors flex items-center gap-3">
                <Settings size={16} />
                Dashboard
              </button>
              <button onClick={() => go(vendor ? "/vendor-dashboard/add-product" : "/user/profile")} className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors flex items-center gap-3">
                <Plus size={16} />
                {vendor ? "Add New Deal" : "My Profile"}
              </button>
              <button 
                onClick={signOut} 
                className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded-lg transition-colors flex items-center gap-3 mt-1 pt-2 border-t border-zinc-100"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function UserAvatarCircle({ small = false }: { small?: boolean }) {
  const url = useNavProfileImage();
  const size = small ? "w-6 h-6" : "w-10 h-10";
  return (
    <div className={`${size} rounded-full bg-orange-500 flex items-center justify-center text-white overflow-hidden border border-white shadow-sm`}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Me" className="w-full h-full object-cover" />
      ) : (
        <User size={small ? 14 : 20} />
      )}
    </div>
  );
}

function LogoutButton(props: any) {
  return <LogOut {...props} />;
}
