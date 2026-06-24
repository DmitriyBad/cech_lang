import { ArrowRight, LockKeyhole, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import type { Verb } from "../types/Verb";

interface VerbCardProps {
  verb: Verb;
  isLearned: boolean;
  needsReview: boolean;
  isLocked?: boolean;
}

export default function VerbCard({ verb, isLearned, needsReview, isLocked = false }: VerbCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">{verb.infinitive}</h3>
            <p className="mt-1 text-sm text-slate-600">{verb.translation}</p>
          </div>
          <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{verb.level}</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-medium">
          {isLearned ? <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700">Вивчено</span> : null}
          {needsReview ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-amber-700">
              <RotateCcw size={14} aria-hidden="true" />
              Потрібно повторити
            </span>
          ) : null}
        </div>
      </div>

      {isLocked ? (
        <button
          type="button"
          disabled
          className="mt-5 inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500"
        >
          <LockKeyhole size={18} aria-hidden="true" />
          Введіть нікнейм
        </button>
      ) : (
        <Link
          to={"/verbs/" + verb.id}
          className="focus-ring mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Вивчати
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}
