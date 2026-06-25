import { BookMarked, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import NounCard from "../components/NounCard";
import NicknameNotice from "../components/NicknameNotice";
import ProgressBar from "../components/ProgressBar";
import SearchBar from "../components/SearchBar";
import { caseInfo, nouns } from "../data/nouns";
import { useProgress } from "../hooks/useProgress";
import type { Noun } from "../types/Noun";

type GenderFilter = "all" | Noun["gender"];

const filters: Array<{ label: string; value: GenderFilter }> = [
  { label: "Всі", value: "all" },
  { label: "Чол.", value: "masculine" },
  { label: "Жін.", value: "feminine" },
  { label: "Сер.", value: "neuter" },
];

export default function NounsPage() {
  const [query, setQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const { getModuleStats, isLearningLocked } = useProgress();
  const nounStats = getModuleStats("nouns", nouns.length);

  const filteredNouns = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return nouns.filter((noun) => {
      const matchesGender = genderFilter === "all" || noun.gender === genderFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        noun.noun.toLowerCase().includes(normalizedQuery) ||
        noun.translation.toLowerCase().includes(normalizedQuery);

      return matchesGender && matchesQuery;
    });
  }, [genderFilter, query]);

  return (
    <div className="space-y-6">
      {isLearningLocked ? <NicknameNotice /> : null}

      <section className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-end">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-blue-600 text-white shadow-soft">
            <BookMarked size={26} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Іменники та відмінки</h1>
            <p className="mt-1 text-sm text-slate-600">100 іменників, 7 відмінків, однина і множина</p>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <ProgressBar value={nounStats.learnedPercent} label="Вивчені іменники" />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {caseInfo.map((item) => (
          <article key={item.key} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <h2 className="text-sm font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{item.question}</p>
            <p className="mt-2 text-xs font-medium text-blue-700">{item.hint}</p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <SearchBar value={query} onChange={setQuery} />
          <div className="flex min-h-12 items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 shadow-soft">
            <Filter className="ml-2 text-slate-400" size={18} aria-hidden="true" />
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setGenderFilter(filter.value)}
                className={[
                  "focus-ring min-h-10 rounded-md px-4 text-sm font-semibold transition",
                  genderFilter === filter.value ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100",
                ].join(" ")}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredNouns.map((noun) => (
            <NounCard
              key={noun.id}
              noun={noun}
              isLocked={isLearningLocked}
              isLearned={nounStats.completedItemIds.includes(String(noun.id))}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
