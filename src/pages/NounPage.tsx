import { ArrowLeft, CheckCircle2, PencilLine } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ExamplesList from "../components/ExamplesList";
import NicknameNotice from "../components/NicknameNotice";
import NounDeclensionTable from "../components/NounDeclensionTable";
import { nouns } from "../data/nouns";
import { useProgress } from "../hooks/useProgress";

export default function NounPage() {
  const { nounId } = useParams();
  const noun = nouns.find((item) => item.id === Number(nounId));
  const { getModuleStats, isLearningLocked, markModuleItemLearned } = useProgress();

  if (!noun) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-bold text-slate-950">Іменник не знайдено</h1>
        <Link to="/nouns" className="focus-ring mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          <ArrowLeft size={18} aria-hidden="true" />
          До іменників
        </Link>
      </div>
    );
  }

  const nounStats = getModuleStats("nouns", nouns.length);
  const isLearned = nounStats.completedItemIds.includes(String(noun.id));

  if (isLearningLocked) {
    return (
      <div className="space-y-6">
        <Link to="/nouns" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
          <ArrowLeft size={18} aria-hidden="true" />
          До іменників
        </Link>
        <NicknameNotice title="Іменники заблоковані без нікнейма" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/nouns" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
        <ArrowLeft size={18} aria-hidden="true" />
        До іменників
      </Link>

      <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{noun.level}</span>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            {noun.noun} — {noun.translation}
          </h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
          <button
            type="button"
            onClick={() => markModuleItemLearned("nouns", String(noun.id))}
            className={[
              "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition",
              isLearned ? "bg-emerald-50 text-emerald-700" : "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100",
            ].join(" ")}
          >
            <CheckCircle2 size={18} aria-hidden="true" />
            {isLearned ? "Вивчено" : "Позначити як вивчене"}
          </button>
          <Link to={"/nouns/" + noun.id + "/exercises"} className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            <PencilLine size={18} aria-hidden="true" />
            Вправи
          </Link>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-950">Відмінювання</h2>
          <NounDeclensionTable noun={noun} />
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-950">Приклади</h2>
          <ExamplesList examples={noun.examples} />
        </div>
      </section>
    </div>
  );
}
