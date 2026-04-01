"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const LOCATIONS = [
  "All",
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT (Abuja)",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "🇨🇳 CHINA"
];

export default function LocationDropdown({
  value = "All",
  onChange,
  className,
  openOnMount,
}: {
  value?: string;
  onChange?: (loc: string) => void;
  className?: string;
  openOnMount?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(value);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (openOnMount) {
      setOpen(true);
    }
  }, [openOnMount]);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current) return;
      if (ref.current.contains(e.target as Node)) return;
      setOpen(false);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  function choose(loc: string) {
    setSelected(loc);
    setOpen(false);
    onChange?.(loc);
  }

  return (
    <div className={(className || "") + " relative min-w-0"} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full h-full flex items-center gap-2 rounded-md border border-orange-500 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 cursor-pointer"
      >
        <span className="truncate pr-2">{selected}</span>
        <ChevronDown size={16} className="flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-[220px] rounded-md bg-white shadow-md ring-1 ring-black/5 z-50 max-h-[300px] overflow-y-auto overflow-x-hidden">
          <ul className="divide-y">
            {LOCATIONS.map((l) => (
              <li key={l}>
                <button
                  type="button"
                  onClick={() => choose(l)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50"
                >
                  {l}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
