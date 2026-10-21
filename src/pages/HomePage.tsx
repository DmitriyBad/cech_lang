import { ArrowRight, BookMarked, BookOpen, Dumbbell, GraduationCap, Grid2X2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import DailyCard from "../components/DailyCard";
import ProgressBar from "../components/ProgressBar";
import StartGuide from "../components/StartGuide";
import { courseSummary, nextSteps } from "../data/course";
import { grammarModules } from "../data/grammarModules";
import { nouns } from "../data/nouns";
import { dueSources } from "../data/practice";
import { verbs } from "../data/verbs";
import { useProgress } from "../hooks/useProgress";
import { loadLastVisit } from "../utils/lastVisit";

// Перетворює збережену адресу на назву слова чи уроку; null, якщо такого вже немає.
const describeVisit = (path: string): { to: string; label: string } | null => {
  const verb = /^\/verbs\/(\d+)$/.exec(path);
  if (verb) {
    const found = verbs.find((item) => item.id === Number(verb[1]));
    return found ? { to: path, label: "Дієслово " + found.infinitive } : null;
  }

  const noun = /^\/nouns\/(\d+)$/.exec(path);
  if (noun) {
    const found = nouns.find((item) => item.id === Number(noun[1]));
    return found ? { to: path, label: "Іменник " + found.noun } : null;
  }

  const lesson = /^\/modules\/([^/]+)\/([^/]+)$/.exec(path);
  if (lesson) {
    const found = grammarModules.find((module) => module.id === lesson[1])?.lessons.find((item) => item.id === lesson[2]);
    return found ? { to: path, label: "Урок «" + found.title + "»" } : null;
  }

  return null;
};

export default function HomePage() {
  const { progress, learnedCount, learnedPercent, successRate, totalAnswers, getModuleStats } = useProgress(verbs.length);

  const dueCount = useMemo(() => dueSources(progress).length, [progress]);
  const lastVisit = useMemo(() => describeVisit(loadLastVisit()), []);
  const nounStats = getModuleStats("nouns", nouns.length);
  const lessonTotal = grammarModules.reduce((sum, module) => sum + module.lessons.length, 0);
  const lessonDone = grammarModules.reduce((sum, module) => sum + getModuleStats(module.id, module.lessons.length).learnedCount, 0);
  const course = useMemo(() => courseSummary(progress), [progress]);
  const upcoming = useMemo(() => nextSteps(progress, 1)[0], [progress]);
  const isFreshVisitor = learnedCount === 0 && totalAnswers === 0;

  const sections = [
    { to: "/verbs", icon: BookOpen, title: "Дієслова", done: learnedCount, total: verbs.length },
    { to: "/nouns", icon: BookMarked, title: "Іменники", done: nounStats.learnedCount, total: nouns.length },
    { to: "/modules", icon: Grid2X2, title: "Граматика", done: lessonDone, total: lessonTotal },
  ];

  return (
    <div className="space-y-6">
      <section className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-lg bg-blue-600 text-white shadow-soft">
          <GraduationCap size={26} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Вивчаємо чеську мову</h1>
          <p className="mt-1 text-sm text-slate-600">Рівні A1–A2: дієслова, іменники, граматика</p>
        </div>
      </section>

      <DailyCard progress={progress} />

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4" aria-label="Курс">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Курс A1 → A2: {course.done} з {course.total} кроків</h2>
          <p className="text-sm text-slate-700">{upcoming ? "Далі: " + upcoming.title : "Курс пройдено. Закріплюйте у «Тренуванні»."}</p>
        </div>
        <Link to={upcoming ? upcoming.to : "/course"} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800">
          {course.done === 0 ? "Почати курс" : "Продовжити курс"}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      {dueCount > 0 || lastVisit ? (
        <section className="grid gap-3 md:grid-cols-2" aria-label="Наступні кроки">
          {dueCount > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
                  <Dumbbell size={20} className="text-emerald-700" aria-hidden="true" />
                  Сьогодні повторити: {dueCount}
                </h2>
                <p className="text-sm text-slate-700">Слова й уроки, які пора освіжити.</p>
              </div>
              <Link to="/practice?start=due" className="focus-ring inline-flex min-h-11 items-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800">
                Почати повторення
              </Link>
            </div>
          ) : null}
          {lastVisit ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Продовжити</h2>
                <p className="text-sm text-slate-700">{lastVisit.label}</p>
              </div>
              <Link to={lastVisit.to} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">
                Продовжити
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          ) : null}
        </section>
      ) : null}

      <StartGuide />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-950">Що вчити</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {sections.map((section) => (
            <Link key={section.to} to={section.to} className="focus-ring block rounded-lg border border-slate-200 bg-white p-4 shadow-soft transition hover:border-blue-300">
              <span className="flex items-center gap-3 text-lg font-semibold text-slate-950">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-blue-50 text-blue-700">
                  <section.icon size={20} aria-hidden="true" />
                </span>
                {section.title}
              </span>
              <div className="mt-3">
                <ProgressBar value={section.total === 0 ? 0 : Math.round((section.done / section.total) * 100)} label={section.done + " з " + section.total} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {isFreshVisitor ? null : (
        <section className="grid gap-3 sm:grid-cols-3" aria-label="Підсумок">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <p className="text-sm text-slate-600">Вивчено дієслів</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">{learnedCount} <span className="text-base font-medium text-slate-600">({learnedPercent}%)</span></p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <p className="text-sm text-slate-600">Відповідей</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">{totalAnswers}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <p className="text-sm text-slate-600">Успішність</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">{successRate}%</p>
          </div>
        </section>
      )}

      <Link to="/practice" className="focus-ring inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">
        <Dumbbell size={18} aria-hidden="true" />
        Перейти до тренування
      </Link>
    </div>
  );
}
