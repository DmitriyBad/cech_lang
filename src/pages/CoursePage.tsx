import { ArrowRight, BookMarked, BookOpen, Check, Grid2X2 } from "lucide-react";
import { Link } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import { courseSummary, courseUnits, nextSteps, stepStatus, unitProgress, type CourseStep } from "../data/course";
import { useProgress } from "../hooks/useProgress";

const icons = { lesson: Grid2X2, verbs: BookOpen, nouns: BookMarked } as const;

export default function CoursePage() {
  const { progress } = useProgress();
  const summary = courseSummary(progress);
  const queue = nextSteps(progress, 3);
  const nextId = queue[0]?.id;

  const renderStep = (step: CourseStep) => {
    const status = stepStatus(step, progress);
    const Icon = icons[step.kind];

    return (
      <li key={step.id} className="min-w-0">
        <Link
          to={step.to}
          className={"focus-ring flex min-h-14 items-center gap-3 rounded-md border p-3 transition " + (step.id === nextId ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300")}
        >
          <span className={"grid h-9 w-9 shrink-0 place-items-center rounded-md " + (status.complete ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700")}>
            {status.complete ? <Check size={18} aria-hidden="true" /> : <Icon size={18} aria-hidden="true" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold text-slate-950">{step.title}</span>
            <span className="block truncate text-sm text-slate-700">{step.hint}</span>
          </span>
          <span className="shrink-0 text-sm font-semibold text-slate-700">
            {status.complete ? <span className="sr-only">Пройдено</span> : null}
            {step.kind === "lesson" ? (status.complete ? "Пройдено" : step.id === nextId ? "Далі" : "") : status.done + "/" + status.total}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Курс A1 → A2</h1>
        <p className="mt-2 max-w-2xl text-slate-700">Сім тем у порядку від простого до складнішого. Урок вважається пройденим, коли ви завершили його вправи; набір слів — коли вивчені всі слова.</p>
        <div className="mt-4 max-w-md">
          <ProgressBar value={summary.percent} label={"Пройдено кроків: " + summary.done + " з " + summary.total} />
        </div>
      </section>

      {queue.length > 0 ? (
        <section className="rounded-lg border border-blue-200 bg-blue-50 p-4" aria-label="Черга уроків">
          <h2 className="text-lg font-bold text-slate-950">Далі за курсом</h2>
          <ol className="mt-3 space-y-2">
            {queue.map((step, index) => (
              <li key={step.id}>
                <Link to={step.to} className={"focus-ring flex min-h-11 items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-semibold " + (index === 0 ? "bg-blue-700 text-white hover:bg-blue-800" : "bg-white text-slate-900 ring-1 ring-inset ring-blue-200 hover:bg-blue-100")}>
                  <span className="min-w-0 truncate">{step.title}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <h2 className="text-lg font-bold text-slate-950">Курс пройдено!</h2>
          <p className="text-sm text-slate-700">Закріплюйте матеріал у розділі «Тренування».</p>
        </section>
      )}

      {courseUnits.map((unit, index) => {
        const done = unitProgress(unit, progress);

        return (
          <section key={unit.id} aria-labelledby={"unit-" + unit.id} className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 id={"unit-" + unit.id} className="text-xl font-bold text-slate-950">
                  {index + 1}. {unit.title} <span className="ml-1 rounded bg-slate-200 px-1.5 py-0.5 text-xs font-semibold text-slate-800">{unit.level}</span>
                </h2>
                <p className="text-sm text-slate-700">{unit.goal}</p>
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {done.done} з {done.total}
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">{unit.steps.map(renderStep)}</ul>
          </section>
        );
      })}
    </div>
  );
}
