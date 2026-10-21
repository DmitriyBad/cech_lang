import { BarChart3, BookMarked, BookOpen, Dumbbell, Grid2X2, Home, Route as RouteIcon, UserRound } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { verbs } from "../data/verbs";
import { useProgress } from "../hooks/useProgress";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
    isActive ? "bg-blue-600 text-white shadow-soft" : "text-slate-600 hover:bg-white hover:text-blue-700",
  ].join(" ");

export default function Header() {
  const { activeNickname, learnedCount, learnedPercent } = useProgress(verbs.length);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="relative mx-auto grid w-full max-w-7xl gap-3 px-4 py-3 sm:px-6 xl:grid-cols-[auto_auto] xl:items-center xl:justify-between xl:px-8">
        <NavLink to="/" className="focus-ring flex w-fit items-center gap-3 rounded-md">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-blue-600 text-white">
            <BookOpen size={22} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-semibold text-slate-950">Česky A1-A2</span>
            <span className="block text-xs text-slate-500">{learnedCount} / {verbs.length} дієслів · {learnedPercent}%</span>
          </span>
        </NavLink>

        <Link
          to="/profile"
          className="focus-ring absolute right-4 top-3 inline-flex min-h-10 max-w-[45%] items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 md:hidden"
          aria-label={activeNickname ? "Профіль: " + activeNickname : "Профіль"}
        >
          <UserRound size={18} aria-hidden="true" />
          <span className="truncate">{activeNickname || "Профіль"}</span>
        </Link>

        <nav className="hidden flex-wrap gap-2 md:flex xl:justify-end" aria-label="Основна навігація">
          <NavLink to="/" className={navLinkClass} end>
            <Home size={18} aria-hidden="true" />
            Головна
          </NavLink>
          <NavLink to="/course" className={navLinkClass}>
            <RouteIcon size={18} aria-hidden="true" />
            Курс
          </NavLink>
          <NavLink to="/verbs" className={navLinkClass}>
            <BookOpen size={18} aria-hidden="true" />
            Дієслова
          </NavLink>
          <NavLink to="/nouns" className={navLinkClass}>
            <BookMarked size={18} aria-hidden="true" />
            Іменники
          </NavLink>
          <NavLink to="/modules" className={navLinkClass}>
            <Grid2X2 size={18} aria-hidden="true" />
            Граматика
          </NavLink>
          <NavLink to="/practice" className={navLinkClass}>
            <Dumbbell size={18} aria-hidden="true" />
            Тренування
          </NavLink>
          <NavLink to="/statistics" className={navLinkClass}>
            <BarChart3 size={18} aria-hidden="true" />
            Статистика
          </NavLink>
          <NavLink to="/profile" className={navLinkClass} aria-label={activeNickname ? "Профіль: " + activeNickname : "Профіль"}>
            <UserRound size={18} aria-hidden="true" />
            <span className="max-w-[10rem] truncate">{activeNickname || "Профіль"}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
