import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";

interface Overview {
  totals: { visitors: number; sessions: number; pageviews: number; answers: number; correct: number };
  registeredUsers: number;
  daily: Array<{ day: string; visitors: number; pageviews: number; answers: number; correct: number }>;
  topPaths: Array<{ path: string; views: number; visitors: number }>;
  hardest: Array<{ key: string; answers: number; wrong: number }>;
  devices: Array<{ device: string; visitors: number }>;
  languages: Array<{ lang: string; visitors: number }>;
  users: Array<{ nickname: string; email: string; created_at: string; last_seen: string; learned_verbs: number; answers: number; correct: number }>;
}

const PERIODS = [7, 30, 90];

const percent = (part: number, whole: number) => (whole === 0 ? "0%" : Math.round((part / whole) * 100) + "%");
const formatDate = (value: string) => new Date(value).toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "2-digit" });

// Ключ відповіді «v:12» читається як «дієслово 12» тощо.
const describeKey = (key: string) => {
  const separator = key.indexOf(":");
  const kind = key.slice(0, separator);
  const id = key.slice(separator + 1);
  return (kind === "v" ? "Дієслово #" : kind === "n" ? "Іменник #" : kind === "sp" ? "Говоримо: " : "Урок ") + id;
};

function Table({ caption, head, rows }: { caption: string; head: string[]; rows: Array<Array<string | number>> }) {
  return (
    <section className="min-w-0 space-y-2">
      <h2 className="text-xl font-semibold text-slate-950">{caption}</h2>
      <div className="relative overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-soft" tabIndex={0} role="region" aria-label={caption}>
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>{head.map((cell) => <th key={cell} scope="col" className="px-3 py-2 font-semibold">{cell}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td className="px-3 py-3 text-slate-700" colSpan={head.length}>Поки немає даних.</td></tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index} className="border-t border-slate-100">
                  {row.map((cell, cellIndex) => <td key={cellIndex} className="px-3 py-2 text-slate-900">{cell}</td>)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function AdminPage() {
  const { ready, session, isAdmin } = useAuth();
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    let cancelled = false;
    setError("");
    supabase.rpc("admin_overview", { days }).then(({ data: result, error: rpcError }) => {
      if (cancelled) {
        return;
      }
      if (rpcError) {
        setError("Не вдалося завантажити статистику: " + rpcError.message);
      } else {
        setData(result as Overview);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [days, isAdmin]);

  if (!ready) {
    return <p className="text-slate-700">Завантаження…</p>;
  }

  if (!session || !isAdmin) {
    return (
      <div className="max-w-xl space-y-3 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-bold text-slate-950">Немає доступу</h1>
        <p className="text-slate-700">Ця сторінка лише для адміністратора. {session ? "Цей акаунт не має доступу." : "Спершу увійдіть у профілі."}</p>
        <Link to="/profile" className="focus-ring inline-flex min-h-11 items-center rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">До профілю</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Статистика сайту</h1>
          <p className="mt-1 text-sm text-slate-700">Враховуються лише відвідувачі, які дозволили статистику.</p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Період">
          {PERIODS.map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setDays(period)}
              aria-pressed={days === period}
              className={["focus-ring min-h-10 rounded-md px-4 text-sm font-semibold", days === period ? "bg-blue-600 text-white" : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"].join(" ")}
            >
              {period} днів
            </button>
          ))}
        </div>
      </section>

      {error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}

      {data ? (
        <>
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="Підсумок">
            {[
              ["Відвідувачів", data.totals.visitors],
              ["Сесій", data.totals.sessions],
              ["Переглядів", data.totals.pageviews],
              ["Відповідей", data.totals.answers + " (" + percent(data.totals.correct, data.totals.answers) + " вірних)"],
              ["Зареєстрованих", data.registeredUsers],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
                <p className="text-sm text-slate-700">{label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
              </div>
            ))}
          </section>

          <Table caption="За днями" head={["День", "Відвідувачі", "Перегляди", "Відповіді", "Вірних"]} rows={data.daily.map((row) => [formatDate(row.day), row.visitors, row.pageviews, row.answers, percent(row.correct, row.answers)])} />
          <Table caption="Популярні сторінки" head={["Сторінка", "Перегляди", "Відвідувачі"]} rows={data.topPaths.map((row) => [row.path, row.views, row.visitors])} />
          <Table caption="Найскладніші вправи (від 3 відповідей)" head={["Картка", "Відповідей", "Помилок", "Частка помилок"]} rows={data.hardest.map((row) => [describeKey(row.key), row.answers, row.wrong, percent(row.wrong, row.answers)])} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Table caption="Пристрої" head={["Пристрій", "Відвідувачі"]} rows={data.devices.map((row) => [row.device, row.visitors])} />
            <Table caption="Мови браузера" head={["Мова", "Відвідувачі"]} rows={data.languages.map((row) => [row.lang, row.visitors])} />
          </div>
          <Table caption="Користувачі" head={["Нікнейм", "Email", "Зареєстрований", "Остання активність", "Вивчено дієслів", "Відповідей", "Вірних"]} rows={data.users.map((row) => [row.nickname || "—", row.email, formatDate(row.created_at), formatDate(row.last_seen), row.learned_verbs, row.answers, percent(row.correct, row.answers)])} />
        </>
      ) : error ? null : (
        <p className="text-slate-700">Завантаження…</p>
      )}
    </div>
  );
}
