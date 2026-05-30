"use client";

import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Buscar..." }: Props) {
  return (
    <div
      className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl w-full"
      style={{ border: "2.5px solid #133266", boxShadow: "3px 3px 0 #133266" }}
    >
      <Search size={15} color="#133266" strokeWidth={2.5} className="shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-sm font-medium text-[#133266] placeholder:text-gray-300 bg-transparent outline-none min-w-0"
        style={{ fontFamily: "var(--font-poppins)" }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="shrink-0 text-gray-300 hover:text-[#133266] transition-colors"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
