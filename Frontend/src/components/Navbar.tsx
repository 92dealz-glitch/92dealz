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

              <NavUserMenu />
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
                <Link href="/login" className="text-[15px] font-medium text-black whitespace-nowrap hover:text-orange-600">
                  Log In
                </Link>
                <span className="text-[15px] text-gray-400">/</span>
                <Link href="/signup" className="text-[15px] font-medium text-black whitespace-nowrap hover:text-orange-600">
                  Sign Up
                </Link>
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

              {/* Search Row (fixed icon alignment) */}
              {/* <div className="flex items-center gap-2 mb-4">
                <div className="w-[130px] flex-shrink-0">
                  <LocationDropdown value="Lagos" onChange={() => {}} />
                </div>

                <div className="flex flex-1 items-center overflow-hidden rounded-lg border border-orange-500 bg-white h-[42px]">
                  <input
                    type="text"
                    placeholder="I am looking for..."
                    className="flex-1 px-3 text-sm text-black placeholder:text-gray-400 outline-none h-full"
                  />
                  <button className="flex items-center justify-center bg-orange-500 px-4 h-full">
                    <Search size={18} className="text-white" />
                  </button>
                </div>
              </div> */}

              <div className="flex w-full items-stretch gap-2 pb-4">
                {/* Location Dropdown */}
                <div className="flex-shrink-0 w-auto min-w-[100px] max-w-[130px]">
                  <LocationDropdown value="Lagos" onChange={() => { }} />
                </div>

                {/* Search Bar */}
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
              <div className="flex gap-3 mb-4">
                <Link href="/login" className="flex-1 bg-orange-500 text-white py-3 rounded-md shadow inline-flex items-center justify-center">
                  Login
                </Link>
                <Link href="/signup" className="flex-1 bg-orange-500 text-white py-3 rounded-md shadow inline-flex items-center justify-center">
                  Signup
                </Link>
              </div>

              {/* Menu Links */}
              <div className="divide-y">
                <div className="px-4 py-3 flex items-center gap-3">
                  <Bell className="text-orange-600" />
                  <div className="text-sm font-medium">Notifications</div>
                </div>
                <div className="px-4 py-3 flex items-center gap-3">
                  <Mail className="text-orange-600" />
                  <div className="text-sm">Messages</div>
                </div>
                <div className="px-4 py-3 flex items-center gap-3">
                  <HelpCircle className="text-orange-600" />
                  <div className="text-sm">Help Center</div>
                </div>
                <div className="px-4 py-3 flex items-center gap-3">
                  <MessageSquare className="text-orange-600" />
                  <div className="text-sm">Chat With Us</div>
                </div>
                <div className="px-4 py-3 flex items-center gap-3">
                  <Lock className="text-orange-600" />
                  <div className="text-sm">Update Password</div>
                </div>
                <div className="px-4 py-3 flex items-center gap-3">
                  <Shield className="text-orange-600" />
                  <div className="text-sm">Verify Account</div>
                </div>
                <div className="px-4 py-3 flex items-center gap-3">
                  <CreditCard className="text-orange-600" />
                  <div className="text-sm">Payment Details</div>
                </div>
                <div className="px-4 py-3 flex items-center gap-3">
                  <Settings className="text-orange-600" />
                  <div className="text-sm">Settings</div>
                </div>
                <div className="px-4 py-3 flex items-center gap-3 text-red-500">
                  <LogOut className="text-red-500" />
                  <div className="text-sm">Logout</div>
                </div>
              </div>

              {/* Bottom Fixed Navigation */}
              <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex items-center justify-between h-16">
                    <button className="flex flex-col items-center text-sm text-zinc-700">
                      <Home />
                      <span className="text-xs">Home</span>
                    </button>
                    <button className="flex flex-col items-center text-sm text-zinc-700">
                      <Heart />
                      <span className="text-xs">Favorite</span>
                    </button>
                    <button className="flex flex-col items-center text-sm text-zinc-700">
                      <Plus />
                      <span className="text-xs">Sell</span>
                    </button>
                    <button className="flex flex-col items-center text-sm text-zinc-700">
                      <Grid />
                      <span className="text-xs">My Ads</span>
                    </button>
                    <button className="flex flex-col items-center text-sm text-zinc-700">
                      <User />
                      <span className="text-xs">Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent bottom navigation shown on mobile when modal is closed */}
      {!mobileMenuOpen && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex flex-col items-center text-sm text-zinc-700">
                <Home />
                <span className="text-xs">Home</span>
              </Link>
              <Link href="/favorites" className="flex flex-col items-center text-sm text-zinc-700">
                <Heart />
                <span className="text-xs">Favorite</span>
              </Link>
              <Link href="/sell" className="flex flex-col items-center text-sm text-zinc-700">
                <Plus />
                <span className="text-xs">Sell</span>
              </Link>
              <Link href="/my-ads" className="flex flex-col items-center text-sm text-zinc-700">
                <Grid />
                <span className="text-xs">My Ads</span>
              </Link>
              <Link href="/account" className="flex flex-col items-center text-sm text-zinc-700">
                <UserAvatarCircle small />
                <span className="text-xs">Account</span>
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
                  className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700"
                >
                  <Menu size={18} />
                  Browse Categories
                </button>

                {open && (
                  <DropdownCategories
                    className="left-0"
                    onSelect={(id) => {
                      setOpen(false);
                      setOpenCategory(id);
                    }}
                  />
                )}
              </div>

              {/* Category Buttons */}
              <div className="hidden sm:flex items-center gap-12 text-sm">
                {["fashion", "phones", "computer", "health", "electronics"].map(
                  (category) => (
                    <button
                      key={category}
                      onClick={() =>
                        setOpenCategory((c) =>
                          c === category ? null : category,
                        )
                      }
                      className="text-zinc-700 hover:text-orange-600 transition-all"
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
                  <span className="text-xs">{favorites.items.length}</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {openCategory && (
          <CategoryMegaMenu
            category={openCategory}
            onSelect={() => {
              setOpenCategory(null);
              setOpen(false);
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
  useEffect(() => {
    function close(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (!t.closest?.("#nav-user-menu")) return;
    }
    return () => {};
  }, []);
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
  }
  function go(path: string) {
    setOpen(false);
    router.push(path);
  }
  const vendor = role === "vendor";
  return (
    <div className="relative" id="nav-user-menu">
      <button onClick={() => setOpen(v => !v)} className="flex items-center justify-center rounded-full bg-orange-500 p-2 hover:bg-orange-600 transition-colors w-9 h-9 overflow-hidden">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Me" className="w-full h-full object-cover rounded-full" />
        ) : (
          <User size={20} className="text-white" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden z-50">
          <button onClick={() => go(vendor ? "/vendor-dashboard" : role === "admin" ? "/admin" : "/user/dashboard")} className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-50">View Profile</button>
          <button onClick={() => go(vendor ? "/vendor-dashboard/settings/personal-details" : role === "admin" ? "/admin/settings" : "/user/dashboard/settings")} className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-50">Account Settings</button>
          {vendor && <button onClick={() => go("/vendor-dashboard/messages")} className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-50">Messages</button>}
          <button onClick={signOut} className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 text-red-600">Sign out</button>
        </div>
      )}
    </div>
  );
}

function UserAvatarCircle({ small = false }: { small?: boolean }) {
  const url = useNavProfileImage();
  const size = small ? "w-6 h-6" : "w-9 h-9";
  return (
    <div className={`${size} rounded-full bg-orange-500 flex items-center justify-center text-white overflow-hidden`}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Me" className="w-full h-full object-cover rounded-full" />
      ) : (
        <User size={small ? 14 : 16} />
      )}
    </div>
  );
}
