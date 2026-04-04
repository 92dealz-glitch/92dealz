import { useState, useEffect } from "react";
import { API_BASE } from "@/services/apiClient";

export type NavUserDetails = {
  url: string | null;
  isVerified: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  verificationStatus: string;
  name: string | null;
  role: string;
  isFullyVerified: boolean;
};

export function useNavUserDetails() {
  const [data, setData] = useState<Omit<NavUserDetails, 'isFullyVerified'>>({ 
    url: null, 
    isVerified: false, 
    isPhoneVerified: false,
    isEmailVerified: false,
    verificationStatus: "none",
    name: null,
    role: "user"
  });

  const isFullyVerified = data.isPhoneVerified && data.isEmailVerified;

  useEffect(() => {
    try {
      const cached = typeof window !== "undefined" ? window.localStorage.getItem("profile_image_url") : null;
      const cachedVerified = typeof window !== "undefined" ? window.localStorage.getItem("is_verified") === "true" : false;
      const cachedPhoneVerified = typeof window !== "undefined" ? window.localStorage.getItem("is_phone_verified") === "true" : false;
      const cachedEmailVerified = typeof window !== "undefined" ? window.localStorage.getItem("is_email_verified") === "true" : false;
      const cachedStatus = typeof window !== "undefined" ? window.localStorage.getItem("verification_status") || "none" : "none";
      const cachedName = typeof window !== "undefined" ? window.localStorage.getItem("profile_name") : null;
      const role = typeof window !== "undefined" ? (window.localStorage.getItem("role") || "user").toLowerCase() : "user";
      
      if (cached) setData(prev => ({ ...prev, url: cached }));
      if (cachedName) setData(prev => ({ ...prev, name: cachedName }));
      setData(prev => ({ 
        ...prev, 
        isVerified: cachedVerified, 
        isPhoneVerified: cachedPhoneVerified,
        isEmailVerified: cachedEmailVerified,
        verificationStatus: cachedStatus,
        role: role
      }));

      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      if (!token) return;
      fetch(`${API_BASE}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })
        .then((r) => r.json())
        .then((d) => {
          if (d?.success === false && (d?.message === "User not found" || d?.message === "Invalid or expired token")) {
            if (typeof window !== "undefined") {
              window.localStorage.removeItem("token");
              window.localStorage.removeItem("role");
            }
          } else {
            const u = d?.data?.profile_image_url;
            const v = !!d?.data?.is_verified;
            const pv = !!d?.data?.is_phone_verified;
            const ev = !!d?.data?.is_email_verified;
            const vs = d?.data?.verification_status || "none";
            const n = d?.data?.name;
            const r = (d?.data?.role || "user").toLowerCase();
            
            setData({ 
              url: u || null, 
              isVerified: v, 
              isPhoneVerified: pv,
              isEmailVerified: ev,
              verificationStatus: vs,
              name: n || null,
              role: r
            });
            
            if (typeof window !== "undefined") {
              if (u) window.localStorage.setItem("profile_image_url", u);
              if (n) window.localStorage.setItem("profile_name", n);
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
  }, []);

  return { ...data, isFullyVerified } as NavUserDetails;
}
