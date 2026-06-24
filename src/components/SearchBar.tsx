import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="relative block">
      <span className="sr-only">Пошук дієслів</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} aria-hidden="true" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring min-h-12 w-full rounded-md border border-slate-200 bg-white py-3 pl-11 pr-11 text-base text-slate-950 shadow-soft placeholder:text-slate-400"
        placeholder="Пошук дієслова або перекладу"
        type="search"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="focus-ring absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
          aria-label="Очистити пошук"
        >
          <X size={18} aria-hidden="true" />
        </button>
      ) : null}
    </label>
  );
}
