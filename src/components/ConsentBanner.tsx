import { Link } from "react-router-dom";
import { setConsent, useConsent } from "../lib/analytics";

// Запитує згоду на анонімну статистику один раз; відповідь можна змінити на сторінці «Профіль».
export default function ConsentBanner() {
  const consent = useConsent();

  if (consent !== null) {
    return null;
  }

  return (
    <section
      className="fixed inset-x-0 bottom-16 z-30 mx-auto max-w-3xl px-3 pb-[env(safe-area-inset-bottom)] md:bottom-4"
      aria-label="Згода на статистику"
    >
      <div className="rounded-lg border border-slate-300 bg-white p-4 shadow-lg">
        <p className="text-sm text-slate-800">
          Дозволити збирати анонімну статистику (які сторінки відкриваються і чи правильні відповіді), щоб покращувати сайт? Це не потрібно для навчання.{" "}
          <Link to="/privacy" className="font-semibold text-blue-700 underline">Докладніше</Link>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => setConsent("granted")} className="focus-ring min-h-11 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">
            Дозволити
          </button>
          <button type="button" onClick={() => setConsent("denied")} className="focus-ring min-h-11 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            Не дозволяти
          </button>
        </div>
      </div>
    </section>
  );
}
