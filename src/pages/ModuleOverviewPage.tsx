import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import ExamplesList from "../components/ExamplesList";
import LessonCard from "../components/LessonCard";
import NicknameNotice from "../components/NicknameNotice";
import ProgressBar from "../components/ProgressBar";
import { grammarModules } from "../data/grammarModules";
import { useProgress } from "../hooks/useProgress";

export default function ModuleOverviewPage() {
  const { moduleId } = useParams();
  const module = grammarModules.find((item) => item.id === moduleId);
  const { getModuleStats, isLearningLocked } = useProgress();

  if (!module) {
    return <Navigate to="/modules" replace />;
  }

  const stats = getModuleStats(module.id, module.lessons.length);
  const previewExamples = module.lessons.flatMap((lesson) =>
    lesson.examples.slice(0, 2).map((example) => ({
      cz: example.cz,
      ua: lesson.title + ": " + example.ua,
    })),
  );

  return (
    <div className="space-y-6">
      <Link to="/modules" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
        <ArrowLeft size={18} aria-hidden="true" />
        До граматики
      </Link>

      {isLearningLocked ? <NicknameNotice /> : null}

      <section className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">{module.title}</h1>
          <p className="mt-2 text-slate-600">{module.subtitle}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <ProgressBar value={stats.learnedPercent} label="Прогрес модуля" />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(280px,380px)_1fr]">
        <div className="space-y-5">
          {module.referenceItems ? (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-950">{module.referenceTitle}</h2>
              <ol className="max-h-[520px] overflow-auto rounded-lg border border-slate-200 bg-white shadow-soft">
                {module.referenceItems.map((item) => (
                  <li key={item} className="border-b border-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 last:border-b-0">
                    {item}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-950">{module.referenceItems ? "Уроки" : "Перелік тем"}</h2>
            <div className="grid gap-4">
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
          </section>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-950">Приклади модуля</h2>
          <ExamplesList examples={previewExamples} />
        </div>
      </section>
    </div>
  );
}
