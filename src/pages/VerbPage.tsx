import { ArrowLeft, CheckCircle2, PencilLine } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ConjugationTable from "../components/ConjugationTable";
import ExamplesList from "../components/ExamplesList";
import NicknameNotice from "../components/NicknameNotice";
import { verbs } from "../data/verbs";
import { useProgress } from "../hooks/useProgress";

export default function VerbPage() {
  const { verbId } = useParams();
  const verb = verbs.find((item) => item.id === Number(verbId));
  const { progress, isLearningLocked, markVerbLearned } = useProgress(verbs.length);

  if (!verb) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-bold text-slate-950">Дієслово не знайдено</h1>
        <Link to="/" className="focus-ring mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          <ArrowLeft size={18} aria-hidden="true" />
          На головну
        </Link>
      </div>
    );
  }

  const isLearned = progress.learnedVerbIds.includes(verb.id);

  if (isLearningLocked) {
    return (
      <div className="space-y-6">
        <Link to="/" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
          <ArrowLeft size={18} aria-hidden="true" />
          На головну
        </Link>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{verb.level}</span>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            {verb.infinitive} — {verb.translation}
          </h1>
          <div className="mt-5">
            <NicknameNotice title="Навчання заблоковане без нікнейма" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
        <ArrowLeft size={18} aria-hidden="true" />
        На головну
      </Link>

      <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{verb.level}</span>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            {verb.infinitive} — {verb.translation}
          </h1>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
          <button
            type="button"
            onClick={() => markVerbLearned(verb.id)}
            className={[
              "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition",
              isLearned ? "bg-emerald-50 text-emerald-700" : "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100",
            ].join(" ")}
          >
            <CheckCircle2 size={18} aria-hidden="true" />
            {isLearned ? "Вивчено" : "Позначити як вивчене"}
          </button>
          <Link
            to={"/verbs/" + verb.id + "/exercises"}
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <PencilLine size={18} aria-hidden="true" />
            Вправи
          </Link>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-950">Відмінювання</h2>
          <ConjugationTable conjugation={verb.conjugation} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-950">Приклади</h2>
          <ExamplesList examples={verb.examples} />
        </div>
      </section>
    </div>
  );
}
