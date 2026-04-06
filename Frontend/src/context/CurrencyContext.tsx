"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { API_BASE } from "@/services/apiClient";

type Currency = "NGN" | "USD" | "CNY";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: Record<string, number>;
  formatPrice: (priceNgn: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>("NGN");
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1, NGN: 1600, CNY: 7.2 });

  useEffect(() => {
    // 1. Fetch Rates
    fetch(`${API_BASE}/currency/rates`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.rates) setRates(data.rates);
      })
      .catch(err => console.error("Failed to fetch rates", err));

    // 2. Detect Initial Currency
    const saved = localStorage.getItem("user_currency") as Currency;
    if (saved) {
      setCurrencyState(saved);
    } else {
      // Check for user profile preference if logged in
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.currencyPreference) {
            setCurrencyState(user.currencyPreference);
            return;
          }
          
          // Logic based on phone number prefix
          const phone = String(user.phone || "");
          if (phone.startsWith("+234") || phone.startsWith("234")) {
            setCurrencyState("NGN");
            return;
          } else if (phone.startsWith("+86") || phone.startsWith("86")) {
            setCurrencyState("CNY");
            return;
          } else if (phone) {
            setCurrencyState("USD");
            return;
          }
        } catch {}
      }

      // Default for Guests
      setCurrencyState("NGN");
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("user_currency", c);
    
    // Optionally sync with backend if logged in
    const token = localStorage.getItem("token");
    if (token) {
        fetch(`${API_BASE}/users/profile`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ currencyPreference: c })
        }).catch(err => console.error("Failed to sync currency preference", err));
    }
  };

  const formatPrice = (priceNgn: number) => {
    const usdValue = priceNgn / rates.NGN;
    const converted = usdValue * (rates[currency] || 1);

    const formatter = new Intl.NumberFormat(currency === "NGN" ? "en-NG" : currency === "CNY" ? "zh-CN" : "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: currency === "NGN" ? 0 : 2,
      maximumFractionDigits: currency === "NGN" ? 0 : 2,
    });

    return formatter.format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within a CurrencyProvider");
  return context;
};
