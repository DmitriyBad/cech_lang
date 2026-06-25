import { CalendarDays, Hash, Layers3, MessageSquareText, Palette, Route } from "lucide-react";
import { Link } from "react-router-dom";
import LessonCard from "../components/LessonCard";
import NicknameNotice from "../components/NicknameNotice";
import ProgressBar from "../components/ProgressBar";
import { grammarModules } from "../data/grammarModules";
import { useProgress } from "../hooks/useProgress";

const iconMap = {
  copy: Layers3,
  hash: Hash,
  calendar: CalendarDays,
  palette: Palette,
  route: Route,
  messages: MessageSquareText,
};

export default function ModulesPage() {
  const { getModuleStats, isLearningLocked } = useProgress();

  return (
    <div className="space-y-6">
      {isLearningLocked ? <NicknameNotice /> : null}

      <section>
        <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Граматичні модулі</h1>
        <p className="mt-2 text-slate-600">Однина-множина, числа, дати, прикметники, прийменники і життєві сценарії.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {grammarModules.map((module) => {
          const Icon = iconMap[module.icon];
          const stats = getModuleStats(module.id, module.lessons.length);

          return (
            <article key={module.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-blue-50 text-blue-700">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">{module.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{module.subtitle}</p>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar value={stats.learnedPercent} label="Прогрес" />
              </div>
              <Link to={"/modules/" + module.id} className="focus-ring mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                Відкрити модуль
              </Link>
            </article>
          );
        })}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-950">Усі уроки</h2>
        {grammarModules.map((module) => {
          const stats = getModuleStats(module.id, module.lessons.length);

          return (
            <div key={module.id} className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800">{module.title}</h3>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {module.lessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    moduleId={module.id}
                    lesson={lesson}
                    isLocked={isLearningLocked}
                    isLearned={stats.completedItemIds.includes(lesson.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
