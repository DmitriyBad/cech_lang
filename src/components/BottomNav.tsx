import { BarChart3, Dumbbell, GraduationCap, Home } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";

const tabClass = (active: boolean) =>
  [
    "focus-ring flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-semibold transition",
    active ? "text-blue-700" : "text-slate-600 hover:text-blue-700",
  ].join(" ");

const learnPaths = ["/learn", "/verbs", "/nouns", "/modules", "/start"];

// Нижня панель вкладок для телефонів; на широких екранах працює верхнє меню.
export default function BottomNav() {
  const { pathname } = useLocation();
  const learnActive = learnPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Нижня навігація">
      <NavLink to="/" end className={({ isActive }) => tabClass(isActive)}>
        <Home size={22} aria-hidden="true" />
        Головна
      </NavLink>
      <Link to="/learn" className={tabClass(learnActive)} aria-current={learnActive ? "page" : undefined}>
        <GraduationCap size={22} aria-hidden="true" />
        Вчити
      </Link>
      <NavLink to="/practice" className={({ isActive }) => tabClass(isActive)}>
        <Dumbbell size={22} aria-hidden="true" />
        Тренування
      </NavLink>
      <NavLink to="/statistics" className={({ isActive }) => tabClass(isActive)}>
        <BarChart3 size={22} aria-hidden="true" />
        Статистика
      </NavLink>
    </nav>
  );
}
