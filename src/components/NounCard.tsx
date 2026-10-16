import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Noun } from "../types/Noun";
import SpeakButton from "./SpeakButton";

interface NounCardProps {
  noun: Noun;
  isLearned: boolean;
}

const genderLabels: Record<Noun["gender"], string> = {
  masculine: "чоловічий",
  feminine: "жіночий",
  neuter: "середній",
};

export default function NounCard({ noun, isLearned }: NounCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1">
              <h3 lang="cs" className="text-xl font-semibold text-slate-950">{noun.noun}</h3>
              <SpeakButton text={noun.noun} />
            </div>
            <p className="mt-1 text-sm text-slate-600">{noun.translation}</p>
          </div>
          <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{noun.level}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">{genderLabels[noun.gender]}</span>
          {noun.animate ? <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">істота</span> : null}
          {isLearned ? <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700">Вивчено</span> : null}
        </div>
      </div>

      <Link to={"/nouns/" + noun.id} className="focus-ring mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
          Вивчати
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
    </article>
  );
}
