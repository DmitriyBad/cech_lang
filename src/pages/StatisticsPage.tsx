import { RotateCcw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import ActivityChart from "../components/ActivityChart";
import ProgressBar from "../components/ProgressBar";
import { grammarModules } from "../data/grammarModules";
import { nouns } from "../data/nouns";
import { verbs } from "../data/verbs";
import { useProgress } from "../hooks/useProgress";

export default function StatisticsPage() {
  const {
    activeNickname,
    getModuleStats,
    progress,
    learnedCount,
    learnedPercent,
    reviewVerbIds,
    resetProgress,
    successRate,
  } = useProgress(verbs.length);

  const reviewVerbs = verbs.filter((verb) => reviewVerbIds.includes(verb.id));

  // Загальні лічильники містять відповіді з усіх розділів; для дієслів віднімаємо відповіді модулів та іменників.
  const otherModules = Object.values(progress.moduleProgress);
  const verbCorrectAnswers = Math.max(0, progress.correctAnswers - otherModules.reduce((sum, item) => sum + item.correctAnswers, 0));
  const verbWrongAnswers = Math.max(0, progress.wrongAnswers - otherModules.reduce((sum, item) => sum + item.wrongAnswers, 0));

  const handleReset = () => {
    if (window.confirm("Скинути весь прогрес для цього нікнейма? Цю дію не можна скасувати.")) {
      resetProgress();
    }
  };

  const moduleRows = [
    { id: "verbs", title: "Дієслова", learnedCount, learnedPercent, correctAnswers: verbCorrectAnswers, wrongAnswers: verbWrongAnswers },
    { id: "nouns", title: "Іменники", ...getModuleStats("nouns", nouns.length) },
    ...grammarModules.map((module) => ({ id: module.id, title: module.title, ...getModuleStats(module.id, module.lessons.length) })),
  ];
  const speaking = progress.moduleProgress.speaking;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Статистика</h1>
          <p className="mt-2 text-slate-600">Особистий прогрес зберігається у localStorage{activeNickname ? " для нікнейма “" + activeNickname + "”" : ""}.</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
        >
          <Trash2 size={18} aria-hidden="true" />
          Скинути
        </button>
      </section>

      <ActivityChart progress={progress} />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-500">Дієслова</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{verbs.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-500">Іменники</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{nouns.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-500">Правильні відповіді</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{progress.correctAnswers}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-500">Неправильні відповіді</p>
          <p className="mt-1 text-2xl font-bold text-rose-700">{progress.wrongAnswers}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-500">Відсоток успішності</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{successRate}%</p>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <ProgressBar value={learnedPercent} label="Прогрес дієслів" />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-950">Прогрес по модулях</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {moduleRows.map((module) => (
            <article key={module.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-950">{module.title}</h3>
                <span className="text-sm text-slate-500">{module.learnedCount} вивчено</span>
              </div>
              <ProgressBar value={module.learnedPercent} />
              <p className="mt-3 text-xs text-slate-500">
                Правильно: {module.correctAnswers ?? 0} · Неправильно: {module.wrongAnswers ?? 0}
              </p>
            </article>
          ))}
          {speaking && speaking.correctAnswers + speaking.wrongAnswers > 0 ? (
            <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
              <h3 className="font-semibold text-slate-950">Говоримо (читання вголос)</h3>
              <p className="mt-3 text-xs text-slate-500">
                Вдалося: {speaking.correctAnswers} · Не вдалося: {speaking.wrongAnswers}
              </p>
            </article>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <RotateCcw size={20} className="text-amber-600" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-slate-950">Потрібно повторити</h2>
        </div>

        {reviewVerbs.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {reviewVerbs.map((verb) => (
              <Link
                key={verb.id}
                to={"/verbs/" + verb.id + "/exercises"}
                className="focus-ring rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800 hover:bg-amber-100"
              >
                {verb.infinitive} · {verb.translation}
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-soft">
            Немає дієслів для повторення.
          </div>
        )}
      </section>
    </div>
  );
}
