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
  Package,
  ClipboardList,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DropdownCategories from "./DropdownCategories";
import CategoryMegaMenu from "./CategoryMegaMenu";
import LocationDropdown from "./LocationDropdown";
import { useFavorites } from "../context/FavoritesProvider";
import { API_BASE } from "@/services/apiClient";
import { getFallbackArray } from "../data/categoriesData";
import { getNotifications, markAsRead, AppNotification } from "@/services/notification.service";
import VerifiedBadge from "./VerifiedBadge";
import { useAlert } from "@/context/AlertContext";
import { useNavUserDetails } from "@/hooks/useNavUserDetails";
import { getFlagEmoji } from "@/utils/flagUtils";
import { useLocationFilter } from "@/context/LocationFilterContext";
import { useSession } from "next-auth/react";

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
  const { showVendorUpgrade, showVendorTasks } = useAlert();
  const { data: session, status: authStatus } = useSession();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { role, isPhoneVerified, verificationStatus } = useNavUserDetails();
  const isLoggedIn = mounted && authStatus === "authenticated";
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mSuggestions, setMSuggestions] = useState<string[]>([]);
  const [showMSuggestions, setShowMSuggestions] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const isVendor = role === "vendor" || role === "Vendor";
  const { isFullyVerified } = useNavUserDetails();
  const hasPendingTasks = isVendor && (!isFullyVerified || verificationStatus !== "approved");

  const { filter, setCountry, setState, setCity, setLocation, resetAll } = useLocationFilter();
  const [topCats, setTopCats] = useState<{ id: string; title: string }[]>([]);

  const handleLocationChange = (loc: string) => {
    if (loc === "Location") {
      resetAll();
    } else if (loc === "🇨🇳 CHINA") {
      setLocation("China");
    } else {
      // Must be a Nigerian state
      setLocation("Nigeria", loc);
    }
  };

  const currentLocationLabel = filter.country === "China" 
    ? "🇨🇳 CHINA" 
    : (filter.state || (filter.country === "All" ? "Location" : filter.country));

  useEffect(() => {
    getFallbackArray().then(res => setTopCats(res.slice(0, 5)));
  }, []);


  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (browseRef.current && browseRef.current.contains(target)) return;
      if (navRef.current && navRef.current.contains(target)) return;
      setOpen(false);
      setOpenCategory(null);
      setShowSuggestions(false);
      setShowMSuggestions(false);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Suggestions Fetcher
  useEffect(() => {
    const q = query.trim();
    if (q.length < 1) {
      // Fetch initial recommendations when empty
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`${API_BASE}/search/suggestions?q=`);
          const json = await res.json();
          if (json.success) {
            setSuggestions(json.data);
          }
        } catch (err) {}
      }, 100);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/search/suggestions?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        if (json.success) {
          setSuggestions(json.data);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Suggestions fetch failed", err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Mobile Suggestions Fetcher
  useEffect(() => {
    const q = mQuery.trim();
    if (q.length < 1) {
      // Fetch initial recommendations when empty
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`${API_BASE}/search/suggestions?q=`);
          const json = await res.json();
          if (json.success) {
            setMSuggestions(json.data);
          }
        } catch (err) {}
      }, 100);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/search/suggestions?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        if (json.success) {
          setMSuggestions(json.data);
          setShowMSuggestions(true);
        }
      } catch (err) {
        console.error("Mobile suggestions fetch failed", err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [mQuery]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const loadNotifications = async () => {
      try {
        const res = await getNotifications();
        if (res.success) {
          setNotifications(res.data);
          setUnreadCount(res.data.filter(n => !n.read_at).length);
        }
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  async function signOut() {
    const { signOut: nextAuthSignOut } = await import("next-auth/react");
    await nextAuthSignOut({ callbackUrl: "/login" });
  }

  const handleSellClick = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    if (!token) {
      router.push("/signup");
      return;
    }
    const role = (typeof window !== "undefined" ? window.localStorage.getItem("role") || "user" : "user").toLowerCase();
    if (role === "user") {
      const confirmed = await showVendorUpgrade(
        "To Add a Product you need to Upgrade your account into Vendor, it will just take a minute"
      );
      if (confirmed) {
        setMobileMenuOpen(false);
        router.push("/account-settings");
      }
    } else {
      setMobileMenuOpen(false);
      router.push("/vendor-dashboard/add-product");
    }
  };

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
                <LocationDropdown value={currentLocationLabel} onChange={handleLocationChange} />

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (query.trim()) {
                      router.push(`/search?search=${encodeURIComponent(query.trim())}`);
                    }
                  }}
                  className="flex items-center overflow-hidden rounded-md border border-orange-500 shadow-sm"
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="I am looking for..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                      onBlur={() => {
                        // Small delay to allow clicking suggestions
                        setTimeout(() => setShowSuggestions(false), 200);
                      }}
                      className="w-72 px-4 py-2 text-sm text-black placeholder:text-black/50 outline-none"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-zinc-200 shadow-xl rounded-b-xl z-[100] mt-1 py-2 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                        {!query.trim() && (
                          <div className="px-4 py-2 text-[10px] font-black text-orange-600 uppercase tracking-wider bg-orange-50/50 mb-1">
                            Recommended Searches
                          </div>
                        )}
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setQuery(s);
                              setShowSuggestions(false);
                              router.push(`/search?search=${encodeURIComponent(s)}`);
                            }}
                            className="w-full text-left px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-orange-50 hover:text-orange-600 transition-all truncate flex items-center gap-3"
                          >
                            <Search size={14} className="text-zinc-400 group-hover:text-orange-500" />
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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
                  <Link href="/signup" className="text-sm font-bold text-zinc-700 hover:text-orange-600">
                    Sign up
                  </Link>
                  <Link href="/login" className="text-sm font-bold text-zinc-700 hover:text-orange-600">
                    Log in
                  </Link>
                  <Link href="/signup" className="text-sm">
                    <button className="hidden lg:inline-flex items-center rounded-full bg-orange-500 px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95">
                      Start Selling Today!
                    </button>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-5">
                  <TaskIcon showVendorTasks={showVendorTasks} />
                  <div className="relative">
                    <button
                      onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                      className="p-2 text-zinc-600 hover:text-orange-600 transition-colors relative"
                    >
                      <Bell size={24} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                    {showNotificationDropdown && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowNotificationDropdown(false)} />
                        <div className="absolute right-0 mt-3 w-80 bg-white border border-zinc-100 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
                            <span className="text-sm font-bold text-zinc-900">Notifications</span>
                            {unreadCount > 0 && <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                          </div>
                          <div className="max-h-[350px] overflow-y-auto">
                            {notifications.filter(n => !n.read_at).length > 0 ? (
                              notifications.filter(n => !n.read_at).slice(0, 5).map((n) => (
                                <div
                                  key={n.id}
                                  onClick={async () => {
                                    if (!n.read_at) await markAsRead(n.id);
                                    if (n.link) router.push(n.link);
                                    setShowNotificationDropdown(false);
                                  }}
                                  className="px-4 py-3 border-b border-zinc-50 hover:bg-orange-50/30 transition-colors cursor-pointer relative bg-orange-50/30"
                                >
                                  <div className="absolute left-1 top-4 w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                  <p className="text-xs font-bold text-zinc-900 mb-0.5">{n.title}</p>
                                  <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">{n.message}</p>
                                  <p className="text-[10px] text-zinc-400 mt-1.5">{new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                              ))
                            ) : (
                              <div className="p-8 text-center">
                                <Bell className="mx-auto text-zinc-200 mb-2" size={32} />
                                <p className="text-sm text-zinc-400">No new notifications</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {isVendor && (
                    <Link
                      href="/pricing"
                      className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-black text-yellow-400 rounded-full text-xs font-black border border-black hover:bg-zinc-800 transition-all shadow-sm group"
                    >
                      <Star size={14} className="fill-current group-hover:scale-110 transition-transform" />
                      Promote Ads
                    </Link>
                  )}
                  <NavUserMenu signOut={signOut} />
                </div>
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
              <div className="hidden sm:flex items-center gap-3">
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
                  <>
                    {!isFullyVerified && (
                      <Link 
                        href={role === "vendor" || role === "Vendor" ? "/vendor-dashboard/settings/verification" : "/account-settings"}
                        className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 text-orange-600 rounded-full text-[9px] font-bold border border-orange-100 whitespace-nowrap"
                      >
                         <div className="w-1 h-1 bg-orange-600 rounded-full animate-ping" />
                         Verify
                      </Link>
                    )}
                    <NavUserMenu signOut={signOut} />
                  </>
                )}
              </div>

              {isLoggedIn && (
                <>
                  <div className="flex items-center gap-3">
                    <TaskIcon showVendorTasks={showVendorTasks} />
                    <Link href="/notifications" className="text-zinc-600 relative hover:text-orange-600 transition-colors">
                      <Bell size={24} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[9px] font-bold rounded-full border-2 border-[#f3f3f3] flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Link>
                  </div>
                </>
              )}

              <button
                className="text-orange-600 ml-1"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={26} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Mobile Search Row */}
          <div className="flex w-full items-center gap-2">
            <div className="flex-shrink-0 w-auto min-w-[100px] max-w-[130px]">
              <LocationDropdown value={currentLocationLabel} onChange={handleLocationChange} />
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
              <div className="flex-1 relative h-full">
                <input
                  type="text"
                  placeholder="Search..."
                  value={mQuery}
                  onChange={(e) => setMQuery(e.target.value)}
                  onFocus={() => { if (mSuggestions.length > 0) setShowMSuggestions(true); }}
                  onBlur={() => {
                    setTimeout(() => setShowMSuggestions(false), 200);
                  }}
                  className="w-full px-3 text-sm text-black placeholder:text-gray-400 outline-none h-full min-w-0"
                />
                {showMSuggestions && mSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-zinc-200 shadow-xl rounded-b-lg z-[100] mt-1 py-1 overflow-hidden">
                    {mSuggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setMQuery(s);
                          setShowMSuggestions(false);
                          router.push(`/search?search=${encodeURIComponent(s)}`);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-zinc-700 hover:bg-orange-50 border-b last:border-0 border-zinc-100"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
                  <LocationDropdown value={currentLocationLabel} onChange={handleLocationChange} />
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
              {isLoggedIn && (
                <div className="py-2 border-b border-zinc-100">
                  {typeof window !== "undefined" && (window.localStorage.getItem("role") || "user").toLowerCase() !== "user" && (
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
                  )}
                  <button
                    onClick={() => {
                      const r = typeof window !== "undefined" ? (window.localStorage.getItem("role") || "user").toLowerCase() : "user";
                      if (r === "vendor") {
                        setMobileMenuOpen(false);
                        router.push("/vendor-dashboard/add-product");
                      } else {
                        handleSellClick();
                      }
                    }}
                    className="w-full text-left px-5 py-2.5 text-sm hover:bg-zinc-50 flex items-center gap-3 transition-colors"
                  >
                    <span className="bg-orange-100 p-1.5 rounded-lg text-orange-600"><Plus size={16} /></span>
                    {(typeof window !== "undefined" && window.localStorage.getItem("role") === "vendor") ? "Add New Deal" : "Browse Deals"}
                  </button>
                  {isVendor && (
                    <button
                      onClick={() => {
                          setMobileMenuOpen(false);
                          router.push("/pricing");
                      }}
                      className="w-full text-left px-5 py-2.5 text-sm hover:bg-zinc-50 flex items-center gap-3 transition-colors font-bold text-orange-600"
                    >
                      <span className="bg-orange-600 p-1.5 rounded-lg text-white"><Star size={16} /></span>
                      Promote Your Ads
                    </button>
                  )}
                </div>
              )}

              <div className="divide-y divide-zinc-100">
                {[
                  { icon: Bell, label: "Notifications", path: "/notifications", authRequired: true },
                  { icon: Mail, label: "Messages", path: "/messages", authRequired: true },
                  { icon: Settings, label: "Account Settings", path: "/account-settings", authRequired: true },
                  { icon: Heart, label: "Favorites", path: "/favorites", authRequired: true },
                  { icon: HelpCircle, label: "Help & Support", path: "/contact", authRequired: false },
                  { icon: Shield, label: "Safety Tips", path: "/safety-tips", authRequired: true },
                ].filter(item => !item.authRequired || isLoggedIn).concat(
                  hasPendingTasks && isLoggedIn
                  ? [{ icon: ClipboardList as any, label: "Tasks", path: "#" } as any] 
                  : []
                ).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.label === "Tasks") {
                        showVendorTasks();
                      } else {
                        router.push(item.path);
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-50 transition-colors cursor-pointer text-zinc-700"
                  >
                    <item.icon className="text-orange-600" size={20} />
                    <div className="text-sm font-medium">{item.label}</div>
                    {item.label === "Tasks" && (
                       <span className="ml-auto w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-50 transition-colors cursor-pointer text-red-500"
                  >
                    <LogoutButton className="text-red-500" size={20} />
                    <div className="text-sm font-medium">Logout</div>
                  </button>
                )}
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
                    <button onClick={() => handleSellClick()} className="flex flex-col items-center text-sm text-zinc-700">
                      <Plus size={22} />
                      <span className="text-[10px] mt-1 text-center">Sell</span>
                    </button>
                    <Link href="/messages" onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); router.push("/login"); } setMobileMenuOpen(false); }} className="flex flex-col items-center text-sm text-zinc-700">
                      <Mail size={22} />
                      <span className="text-[10px] mt-1 text-center">{isLoggedIn ? "Chat" : "Login"}</span>
                    </Link>
                    {isLoggedIn && (
                      <Link href="/vendor-dashboard/my-ads" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center text-sm text-zinc-700">
                        <Grid size={22} />
                        <span className="text-[10px] mt-1 text-center">My Ads</span>
                      </Link>
                    )}
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
              <button onClick={() => handleSellClick()} className="flex flex-col items-center text-sm text-[#f45c03]">
                <div className="bg-[#f45c03] rounded-full p-2.5 -mt-8 shadow-lg border-4 border-white relative z-50">
                  <Plus size={24} className="text-white" />
                </div>
                <span className="text-[10px] mt-1 text-center">Sell</span>
              </button>
              <Link href="/messages" onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); router.push("/login"); } }} className="flex flex-col items-center text-sm text-zinc-700">
                <Mail size={22} />
                <span className="text-[10px] mt-1 text-center">{isLoggedIn ? "Chat" : "Login"}</span>
              </Link>
              {isLoggedIn ? (
                <Link href="/vendor-dashboard/my-ads" className="flex flex-col items-center text-sm text-zinc-700">
                  <Grid size={22} />
                  <span className="text-[10px] mt-1 text-center">My Ads</span>
                </Link>
              ) : (
                <Link href="/signup" className="flex flex-col items-center text-sm text-zinc-700">
                  <User size={22} />
                  <span className="text-[10px] mt-1 text-center">Profile</span>
                </Link>
              )}
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
                {topCats.map(
                  (c) => (
                    <button
                      key={c.id}
                      onClick={() =>
                        setOpenCategory((prev) =>
                          prev === c.id ? null : c.id,
                        )
                      }
                      className="text-zinc-700 hover:text-orange-600 transition-all font-medium py-2"
                    >
                      {c.title}
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

export function TaskIcon({ showVendorTasks }: { showVendorTasks: () => void }) {
  const { isFullyVerified, verificationStatus, role } = useNavUserDetails();
  const hasPendingTasks = (role === "vendor" || role === "Vendor") && (!isFullyVerified || verificationStatus !== "approved");

  if (!hasPendingTasks) return null;

  return (
    <button
      onClick={() => showVendorTasks()}
      className="p-2 text-zinc-600 hover:text-orange-600 transition-colors relative group"
      title="Vendor Tasks"
    >
      <ClipboardList size={24} />
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-600 rounded-full border-2 border-white animate-pulse" />
      
      {/* Tooltip */}
      <div className="absolute top-full right-0 mt-2 hidden group-hover:block bg-zinc-900 text-white text-[10px] font-bold py-1 px-2 rounded whitespace-nowrap z-50">
        Tasks Pending
      </div>
    </button>
  );
}

function MobileTaskTab({ showVendorTasks }: { showVendorTasks: () => void }) {
  const { isFullyVerified, verificationStatus, role } = useNavUserDetails();
  const hasPendingTasks = (role === "vendor" || role === "Vendor") && (!isFullyVerified || verificationStatus !== "approved");

  if (!hasPendingTasks) return null;

  return (
    <button onClick={() => showVendorTasks()} className="flex flex-col items-center text-sm text-zinc-700 relative">
      <ClipboardList size={22} className="text-orange-600" />
      <span className="text-[10px] mt-1 text-center font-bold text-orange-600">Tasks</span>
      <span className="absolute top-0 right-1/2 translate-x-3 w-1.5 h-1.5 bg-orange-600 rounded-full" />
    </button>
  );
}

function NavUserMenu({ signOut }: { signOut: () => void }) {
  const [open, setOpen] = useState(false);
  const { url, isVerified, name, country_code } = useNavUserDetails();
  const role = typeof window !== "undefined" ? (window.localStorage.getItem("role") || "user").toLowerCase() : "user";
  const router = useRouter();

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
              {name && (
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold text-zinc-800">{name}</p>
                  {country_code && <span className="text-base" title={country_code}>{getFlagEmoji(country_code)}</span>}
                </div>
              )}
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Account Role:</p>
                <p className="text-[10px] font-black text-orange-600 capitalize">{role}</p>
                {isVerified && <VerifiedBadge size={12} />}
              </div>
            </div>
            <div className="p-1.5 space-y-0.5">
              {role !== "user" && (
                <button onClick={() => go(vendor ? "/vendor-dashboard" : role === "admin" ? "/admin" : "/user/dashboard/settings")} className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors flex items-center gap-3">
                  <Grid size={16} />
                  Dashboard
                </button>
              )}
              {vendor && (
                <button onClick={() => go("/vendor-dashboard/add-product")} className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors flex items-center gap-3">
                  <Plus size={16} />
                  Add New Deal
                </button>
              )}
              <div className="h-px bg-zinc-100 my-1 mx-2" />
              <button onClick={() => go("/messages")} className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors flex items-center gap-3">
                <Mail size={16} />
                Messages
              </button>
              <button onClick={() => go("/favorites")} className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors flex items-center gap-3">
                <Heart size={16} />
                Favorites
              </button>
              <button onClick={() => go("/account-settings")} className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors flex items-center gap-3">
                <Settings size={16} />
                Account Settings
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
  const { url } = useNavUserDetails();
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

