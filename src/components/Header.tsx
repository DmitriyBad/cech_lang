import { BarChart3, BookMarked, BookOpen, Grid2X2, Home, Save, UserRound } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { verbs } from "../data/verbs";
import { useProgress } from "../hooks/useProgress";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
    isActive ? "bg-blue-600 text-white shadow-soft" : "text-slate-600 hover:bg-white hover:text-blue-700",
  ].join(" ");

export default function Header() {
  const { activeNickname, changeNickname, learnedCount, learnedPercent } = useProgress(verbs.length);
  const [nicknameDraft, setNicknameDraft] = useState(activeNickname);

  useEffect(() => {
    setNicknameDraft(activeNickname);
  }, [activeNickname]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changeNickname(nicknameDraft);
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-3 px-4 py-3 sm:px-6 xl:grid-cols-[auto_minmax(260px,390px)_auto] xl:items-center xl:px-8">
        <NavLink to="/" className="focus-ring flex w-fit items-center gap-3 rounded-md">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-blue-600 text-white">
            <BookOpen size={22} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-semibold text-slate-950">Česky A1-A2</span>
            <span className="block text-xs text-slate-500">{learnedCount} / {verbs.length} дієслів · {learnedPercent}%</span>
          </span>
        </NavLink>

        <form onSubmit={handleSubmit} className="flex min-w-0 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1.5">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Нікнейм</span>
            <UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
            <input
              value={nicknameDraft}
              onChange={(event) => setNicknameDraft(event.target.value)}
              className="focus-ring min-h-10 w-full rounded-md border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm font-medium text-slate-950 placeholder:text-slate-400"
              placeholder="Введіть нікнейм"
              type="text"
              autoComplete="nickname"
              maxLength={32}
            />
          </label>
          <button type="submit" className="focus-ring inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-blue-600 px-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Save size={17} aria-hidden="true" />
            Зберегти
          </button>
        </form>

        <nav className="flex gap-2 overflow-x-auto pb-1 xl:justify-end xl:pb-0" aria-label="Основна навігація">
          <NavLink to="/" className={navLinkClass} end>
            <Home size={18} aria-hidden="true" />
            Головна
          </NavLink>
          <NavLink to="/nouns" className={navLinkClass}>
            <BookMarked size={18} aria-hidden="true" />
            Іменники
          </NavLink>
          <NavLink to="/modules" className={navLinkClass}>
            <Grid2X2 size={18} aria-hidden="true" />
            Граматика
          </NavLink>
          <NavLink to="/statistics" className={navLinkClass}>
            <BarChart3 size={18} aria-hidden="true" />
            Статистика
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
