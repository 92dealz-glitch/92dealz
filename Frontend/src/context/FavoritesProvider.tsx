"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type FavoriteItem = {
  id: number | string;
  title: string;
  price?: string;
  priceValue?: number;
  img?: string;
  desc?: string;
  location?: string;
  likes?: number; // legacy, keeping for compatibility
  views?: number;
};

type FavoritesContextType = {
  items: FavoriteItem[];
  toggle: (item: FavoriteItem) => void;
  isFavorite: (id: string | number) => boolean;
  remove: (id: string | number) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "234deals_favorites_v1";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items]);

  function isFavorite(id: string | number) {
    return items.some((i) => String(i.id) === String(id));
  }

  function toggle(item: FavoriteItem) {
    setItems((prev) => {
      const exists = prev.some((p) => String(p.id) === String(item.id));
      if (exists) return prev.filter((p) => String(p.id) !== String(item.id));
      return [...prev, item];
    });
  }

  function remove(id: string | number) {
    setItems((prev) => prev.filter((p) => String(p.id) !== String(id)));
  }

  return (
    <FavoritesContext.Provider value={{ items, toggle, isFavorite, remove }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

export default FavoritesProvider;
