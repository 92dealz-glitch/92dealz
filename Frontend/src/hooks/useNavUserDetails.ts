import { useState, useEffect } from "react";
import { API_BASE } from "@/services/apiClient";
import { useSession, signOut } from "next-auth/react";
import { getCookie, deleteCookie } from "@/lib/cookies";

export type NavUserDetails = {
  url: string | null;
  isVerified: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  verificationStatus: string;
  name: string | null;
  role: string;
  isFullyVerified: boolean;
  country_code: string | null;
  country_name: string | null;
};

export function useNavUserDetails() {
  const { data: session, status: authStatus } = useSession();
  const [data, setData] = useState<Omit<NavUserDetails, 'isFullyVerified'>>({ 
    url: null, 
    isVerified: false, 
    isPhoneVerified: false,
    isEmailVerified: false,
    verificationStatus: "none",
    name: null,
    role: "user",
    country_code: null,
    country_name: null
  });

  const isFullyVerified = data.isPhoneVerified && data.isEmailVerified;

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      // Clear data if not logged in
      setData({
        url: null, isVerified: false, isPhoneVerified: false, isEmailVerified: false,
        verificationStatus: "none", name: null, role: "user", country_code: null, country_name: null
      });
      return;
    }

    try {
      const cached = typeof window !== "undefined" ? window.localStorage.getItem("profile_image_url") : null;
      const cachedVerified = typeof window !== "undefined" ? window.localStorage.getItem("is_verified") === "true" : false;
      const cachedPhoneVerified = typeof window !== "undefined" ? window.localStorage.getItem("is_phone_verified") === "true" : false;
      const cachedEmailVerified = typeof window !== "undefined" ? window.localStorage.getItem("is_email_verified") === "true" : false;
      const cachedStatus = typeof window !== "undefined" ? window.localStorage.getItem("verification_status") || "none" : "none";
      const cachedName = typeof window !== "undefined" ? window.localStorage.getItem("profile_name") : null;
      const role = typeof window !== "undefined" ? (window.localStorage.getItem("role") || "user").toLowerCase() : "user";
      const cachedCC = typeof window !== "undefined" ? window.localStorage.getItem("country_code") : null;
      const cachedCN = typeof window !== "undefined" ? window.localStorage.getItem("country_name") : null;
      
      if (cached) setData(prev => ({ ...prev, url: cached }));
      if (cachedName) setData(prev => ({ ...prev, name: cachedName }));
      setData(prev => ({ 
        ...prev, 
        isVerified: cachedVerified, 
        isPhoneVerified: cachedPhoneVerified,
        isEmailVerified: cachedEmailVerified,
        verificationStatus: cachedStatus,
        role: role,
        country_code: cachedCC,
        country_name: cachedCN
      }));

      // Use token from session or cookie
      const token = (session as any)?.accessToken || getCookie("token") || (typeof window !== "undefined" ? window.localStorage.getItem("token") : null);
      if (!token || authStatus === "loading") return;

      fetch(`${API_BASE}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })
        .then((r) => r.json())
        .then((d) => {
          if (d?.success === false && (d?.message === "User not found" || d?.message === "Invalid or expired token" || d?.message === "Unauthorized")) {
            // GLOBAL CLEANUP on 401
            if (typeof window !== "undefined") {
              window.localStorage.clear();
              deleteCookie("token");
            }
            signOut({ callbackUrl: "/login" });
          } else {
            const u = d?.data?.profile_image_url;
            const v = !!d?.data?.is_verified;
            const pv = !!d?.data?.is_phone_verified;
            const ev = !!d?.data?.is_email_verified;
            const vs = d?.data?.verification_status || "none";
            const n = d?.data?.name;
            const r = (d?.data?.role || "user").toLowerCase();
            const cc = d?.data?.country_code;
            const cn = d?.data?.country_name;
            
            setData({ 
              url: u || null, 
              isVerified: v, 
              isPhoneVerified: pv,
              isEmailVerified: ev,
              verificationStatus: vs,
              name: n || null,
              role: r,
              country_code: cc || null,
              country_name: cn || null
            });
            
            if (typeof window !== "undefined") {
              if (u) window.localStorage.setItem("profile_image_url", u);
              if (n) window.localStorage.setItem("profile_name", n);
              if (cc) window.localStorage.setItem("country_code", cc);
              if (cn) window.localStorage.setItem("country_name", cn);
              window.localStorage.setItem("is_verified", String(v));
              window.localStorage.setItem("is_phone_verified", String(pv));
              window.localStorage.setItem("is_email_verified", String(ev));
              window.localStorage.setItem("verification_status", vs);
              window.localStorage.setItem("role", r);
            }
          }
        })
        .catch((err) => { 
          console.error("Profile fetch error:", err);
        });
    } catch { }
  }, [authStatus, session]);

  return { ...data, isFullyVerified } as NavUserDetails;
}
