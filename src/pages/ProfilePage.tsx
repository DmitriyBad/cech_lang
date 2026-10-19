import { Save, UserRound } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { verbs } from "../data/verbs";
import { useProgress } from "../hooks/useProgress";

export default function ProfilePage() {
  const { activeNickname, changeNickname, learnedCount, totalAnswers, successRate } = useProgress(verbs.length);
  const [draft, setDraft] = useState(activeNickname);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(activeNickname);
  }, [activeNickname]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changeNickname(draft);
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Профіль</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Нікнейм не обов'язковий: без нього прогрес зберігається в цьому браузері. З нікнеймом можна вести окремий прогрес для кількох людей, а прогрес гостя переходить до нового профілю.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <label className="block text-sm font-semibold text-slate-950" htmlFor="profile-nickname">Нікнейм</label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
          <input
            id="profile-nickname"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setSaved(false);
            }}
            className="focus-ring min-h-11 w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 text-base text-slate-950 placeholder:text-slate-500"
            placeholder="Ваш нікнейм"
            type="text"
            autoComplete="nickname"
            maxLength={32}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">
            <Save size={17} aria-hidden="true" />
            Зберегти
          </button>
          <p role="status" className="text-sm text-slate-700">{saved ? "Збережено" : ""}</p>
        </div>
      </form>

      <section className="grid max-w-xl gap-3 sm:grid-cols-3" aria-label="Підсумок профілю">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-600">Вивчено дієслів</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{learnedCount}</p>
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

      <p className="text-sm text-slate-700">
        Скинути прогрес можна на сторінці <Link to="/statistics" className="font-semibold text-blue-700 underline">«Статистика»</Link>.
      </p>
    </div>
  );
}
