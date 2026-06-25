import { ArrowRight, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import type { LessonItem } from "../types/Lesson";

interface LessonCardProps {
  moduleId: string;
  lesson: LessonItem;
  isLocked: boolean;
  isLearned: boolean;
}

export default function LessonCard({ moduleId, lesson, isLocked, isLearned }: LessonCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">{lesson.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{lesson.subtitle}</p>
          </div>
          <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{lesson.level}</span>
        </div>
        {isLearned ? <span className="mt-3 inline-flex rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Вивчено</span> : null}
      </div>

      {isLocked ? (
        <button type="button" disabled className="mt-5 inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
          <LockKeyhole size={18} aria-hidden="true" />
          Введіть нікнейм
        </button>
      ) : (
        <Link to={"/modules/" + moduleId + "/" + lesson.id} className="focus-ring mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
          Вивчати
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}
