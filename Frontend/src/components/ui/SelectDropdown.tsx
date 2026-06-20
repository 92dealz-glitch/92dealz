"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function SelectDropdown({
  options,
  value,
  placeholder,
  onChange,
  className,
  openOnMount,
}: {
  options: string[];
  value?: string;
  placeholder?: string;
  onChange?: (v: string) => void;
  className?: string;
  openOnMount?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | undefined>(value);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current) return;
      if (ref.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  useEffect(() => {
    if (openOnMount) setOpen(true);
  }, [openOnMount]);

  function choose(v: string) {
    setSelected(v);
    setOpen(false);
    onChange?.(v);
  }

  return (
    <div ref={ref} className={(className || "") + " relative"}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
      >
        <span className="truncate">{selected ?? placeholder ?? "Select"}</span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-full rounded-md bg-white shadow-md ring-1 ring-black/5 z-50">
          <ul className="divide-y max-h-48 overflow-auto">
            {options.map((o) => (
              <li key={o}>
                <button
                  type="button"
                  onClick={() => choose(o)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50"
                >
                  {o}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


