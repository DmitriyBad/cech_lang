import { useMemo } from "react";
import { recentDays, streakInfo } from "../utils/daily";
import { todayNumber } from "../utils/srs";
import type { StoredProgress } from "../utils/storage";

// Стовпчики відповідей за 14 днів; колір і підпис показують, чи виконано ціль.
export default function ActivityChart({ progress }: { progress: Pick<StoredProgress, "activity" | "dailyGoal"> }) {
  const today = todayNumber();
  const bars = useMemo(() => recentDays(progress.activity, progress.dailyGoal, today, 14), [progress.activity, progress.dailyGoal, today]);
  const info = useMemo(() => streakInfo(progress.activity, progress.dailyGoal, today), [progress.activity, progress.dailyGoal, today]);
  const max = Math.max(progress.dailyGoal, ...bars.map((bar) => bar.answers));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft" aria-label="Активність за 14 днів">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-950">Активність за 14 днів</h2>
        <p className="text-sm text-slate-700">
          Серія: <strong>{info.current}</strong> · найдовша: <strong>{info.best}</strong> · ціль: {progress.dailyGoal} на день
        </p>
      </div>
      <ul className="mt-4 flex h-32 items-end gap-1 sm:gap-2" role="list">
        {bars.map((bar) => (
          <li key={bar.day} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1" aria-label={bar.label + ": " + bar.answers + " відповідей" + (bar.reached ? ", ціль виконано" : "")}>
            <span className="text-[10px] font-semibold text-slate-700" aria-hidden="true">{bar.answers > 0 ? bar.answers : ""}</span>
            <div className={"w-full rounded-t " + (bar.reached ? "bg-emerald-600" : "bg-blue-300")} style={{ height: Math.max(bar.answers === 0 ? 2 : 6, Math.round((bar.answers / max) * 80)) + "px" }} aria-hidden="true" />
            <span className={"text-[10px] " + (bar.isToday ? "font-bold text-slate-950" : "text-slate-600")} aria-hidden="true">{bar.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
