import { Flame, Target } from "lucide-react";
import { useMemo } from "react";
import { streakInfo } from "../utils/daily";
import { todayNumber } from "../utils/srs";
import type { StoredProgress } from "../utils/storage";

interface DailyCardProps {
  progress: Pick<StoredProgress, "activity" | "dailyGoal">;
}

const dayWord = (n: number) => (n % 10 === 1 && n % 100 !== 11 ? "день" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "дні" : "днів");

// Щоденна ціль і серія днів: показується на головній.
export default function DailyCard({ progress }: DailyCardProps) {
  const info = useMemo(() => streakInfo(progress.activity, progress.dailyGoal, todayNumber()), [progress.activity, progress.dailyGoal]);
  const percent = Math.min(100, Math.round((info.todayAnswers / progress.dailyGoal) * 100));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft" aria-label="Сьогоднішня ціль">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
          <Target size={20} className="text-blue-700" aria-hidden="true" />
          Сьогодні: {Math.min(info.todayAnswers, progress.dailyGoal)} з {progress.dailyGoal}
        </h2>
        <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
          <Flame size={18} className={info.current > 0 ? "text-orange-600" : "text-slate-500"} aria-hidden="true" />
          {info.current > 0 ? "Серія: " + info.current + " " + dayWord(info.current) : "Серії ще немає"}
        </p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-md bg-slate-200" role="progressbar" aria-label="Щоденна ціль" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div className={"h-full rounded-md transition-all " + (info.todayDone ? "bg-emerald-600" : "bg-blue-600")} style={{ width: percent + "%" }} />
      </div>
      <p className="mt-2 text-sm text-slate-700">
        {info.todayDone
          ? "Ціль на сьогодні виконано. Так тримати!"
          : info.current > 0
            ? "Ще " + (progress.dailyGoal - info.todayAnswers) + " відповідей, щоб не перервати серію."
            : "Дайте " + progress.dailyGoal + " відповідей у вправах, щоб почати серію."}
      </p>
    </section>
  );
}
