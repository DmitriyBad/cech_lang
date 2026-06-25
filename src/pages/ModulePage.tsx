import { ArrowLeft, CheckCircle2, PencilLine } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ExamplesList from "../components/ExamplesList";
import NicknameNotice from "../components/NicknameNotice";
import { grammarModules } from "../data/grammarModules";
import { useProgress } from "../hooks/useProgress";

export default function ModulePage() {
  const { moduleId, lessonId } = useParams();
  const module = grammarModules.find((item) => item.id === moduleId);
  const lesson = module?.lessons.find((item) => item.id === lessonId);
  const { getModuleStats, isLearningLocked, markModuleItemLearned } = useProgress();

  if (!module || !lesson) {
    return <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">Урок не знайдено</div>;
  }

  const stats = getModuleStats(module.id, module.lessons.length);
  const isLearned = stats.completedItemIds.includes(lesson.id);

  if (isLearningLocked) {
    return (
      <div className="space-y-6">
        <Link to="/modules" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
          <ArrowLeft size={18} aria-hidden="true" />
          До модулів
        </Link>
        <NicknameNotice title="Граматичні модулі заблоковані без нікнейма" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/modules" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
        <ArrowLeft size={18} aria-hidden="true" />
        До модулів
      </Link>

      <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{lesson.level}</span>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">{lesson.title}</h1>
          <p className="mt-2 text-slate-600">{lesson.explanation}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
          <button
            type="button"
            onClick={() => markModuleItemLearned(module.id, lesson.id)}
            className={[
              "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition",
              isLearned ? "bg-emerald-50 text-emerald-700" : "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100",
            ].join(" ")}
          >
            <CheckCircle2 size={18} aria-hidden="true" />
            {isLearned ? "Вивчено" : "Позначити як вивчене"}
          </button>
          <Link to={"/modules/" + module.id + "/" + lesson.id + "/exercises"} className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            <PencilLine size={18} aria-hidden="true" />
            Вправи
          </Link>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(260px,360px)_1fr]">
        <aside className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-950">Короткий перелік</h2>
          <ol className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
            {lesson.studyItems.map((item, index) => (
              <li key={item} className="flex gap-3 border-b border-slate-100 p-4 last:border-b-0">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-blue-50 text-xs font-bold text-blue-700">{index + 1}</span>
                <span className="text-sm font-medium leading-6 text-slate-700">{item}</span>
              </li>
            ))}
          </ol>
        </aside>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-950">Приклади</h2>
          <ExamplesList examples={lesson.examples} />
        </section>
      </section>
    </div>
  );
}
