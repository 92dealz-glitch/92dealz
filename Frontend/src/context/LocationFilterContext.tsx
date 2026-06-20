"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type LocationFilter = {
  country: string;
  state: string;
  city: string;
};

type LocationFilterContextType = {
  filter: LocationFilter;
  setCountry: (country: string) => void;
  setState: (state: string) => void;
  setCity: (city: string) => void;
  setLocation: (country: string, state?: string, city?: string) => void;
  resetAll: () => void;
};

const LocationFilterContext = createContext<LocationFilterContextType | undefined>(undefined);

export function LocationFilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<LocationFilter>({
    country: "All",
    state: "",
    city: "",
  });

  const setCountry = (country: string) => {
    setFilter({ country, state: "", city: "" });
  };

  const setState = (state: string) => {
    setFilter(prev => ({ ...prev, state, city: "" }));
  };

  const setCity = (city: string) => {
    setFilter(prev => ({ ...prev, city }));
  };

  const setLocation = (country: string, state: string = "", city: string = "") => {
    setFilter({ country, state, city });
  };

  const resetAll = () => {
    setFilter({ country: "All", state: "", city: "" });
  };

  return (
    <LocationFilterContext.Provider value={{ filter, setCountry, setState, setCity, setLocation, resetAll }}>
      {children}
    </LocationFilterContext.Provider>
  );
}

export function useLocationFilter() {
  const context = useContext(LocationFilterContext);
  if (context === undefined) {
    throw new Error("useLocationFilter must be used within a LocationFilterProvider");
  }
  return context;
}


