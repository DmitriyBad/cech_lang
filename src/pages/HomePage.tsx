import { BookOpen, Filter, RotateCcw, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import NicknameNotice from "../components/NicknameNotice";
import ProgressBar from "../components/ProgressBar";
import SearchBar from "../components/SearchBar";
import VerbCard from "../components/VerbCard";
import { verbs } from "../data/verbs";
import { useProgress } from "../hooks/useProgress";
import type { VerbLevel } from "../types/Verb";

type LevelFilter = "all" | VerbLevel;

const filters: Array<{ label: string; value: LevelFilter }> = [
  { label: "Всі", value: "all" },
  { label: "A1", value: "A1" },
  { label: "A2", value: "A2" },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const { progress, isLearningLocked, learnedCount, learnedPercent, reviewVerbIds, successRate } = useProgress(verbs.length);

  const filteredVerbs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return verbs.filter((verb) => {
      const matchesLevel = levelFilter === "all" || verb.level === levelFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        verb.infinitive.toLowerCase().includes(normalizedQuery) ||
        verb.translation.toLowerCase().includes(normalizedQuery);

      return matchesLevel && matchesQuery;
    });
  }, [levelFilter, query]);

  const reviewVerbs = verbs.filter((verb) => reviewVerbIds.includes(verb.id));

  return (
    <div className="space-y-6">
      {isLearningLocked ? <NicknameNotice /> : null}
      <section className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-blue-600 text-white shadow-soft">
              <BookOpen size={26} aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Вивчаємо чеську мову</h1>
              <p className="mt-1 text-sm text-slate-600">100 дієслів для рівнів A1–A2</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <ProgressBar value={learnedPercent} label="Вивчені дієслова" />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-500">Усього дієслів</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{verbs.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-500">Вивчено</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{learnedCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-500">Успішність</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{successRate}%</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-500">Потрібно повторити</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{reviewVerbIds.length}</p>
        </div>
      </section>

      {reviewVerbs.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <RotateCcw size={20} className="text-amber-600" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-slate-950">Потрібно повторити</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {reviewVerbs.map((verb) => (
              <VerbCard
                key={"review-" + verb.id}
                verb={verb}
                isLearned={progress.learnedVerbIds.includes(verb.id)}
                needsReview
                isLocked={isLearningLocked}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <SearchBar value={query} onChange={setQuery} />

          <div className="flex min-h-12 items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 shadow-soft">
            <Filter className="ml-2 text-slate-400" size={18} aria-hidden="true" />
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setLevelFilter(filter.value)}
                className={[
                  "focus-ring min-h-10 rounded-md px-4 text-sm font-semibold transition",
                  levelFilter === filter.value ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100",
                ].join(" ")}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Trophy size={18} aria-hidden="true" />
          Знайдено: {filteredVerbs.length}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredVerbs.map((verb) => (
            <VerbCard
              key={verb.id}
              verb={verb}
              isLearned={progress.learnedVerbIds.includes(verb.id)}
              needsReview={reviewVerbIds.includes(verb.id)}
              isLocked={isLearningLocked}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
