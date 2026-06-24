import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ExerciseBlock from "../components/ExerciseBlock";
import NicknameNotice from "../components/NicknameNotice";
import ProgressBar from "../components/ProgressBar";
import { verbs } from "../data/verbs";
import { useProgress } from "../hooks/useProgress";

export default function ExercisePage() {
  const { verbId } = useParams();
  const verb = verbs.find((item) => item.id === Number(verbId));
  const [answeredIndexes, setAnsweredIndexes] = useState<number[]>([]);
  const { isLearningLocked, registerAnswer, markVerbLearned } = useProgress(verbs.length);

  const answeredSet = useMemo(() => new Set(answeredIndexes), [answeredIndexes]);

  if (!verb) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-bold text-slate-950">Вправи не знайдено</h1>
        <Link to="/" className="focus-ring mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          <ArrowLeft size={18} aria-hidden="true" />
          На головну
        </Link>
      </div>
    );
  }

  if (isLearningLocked) {
    return (
      <div className="space-y-6">
        <Link to="/" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
          <ArrowLeft size={18} aria-hidden="true" />
          На головну
        </Link>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Вправи: {verb.infinitive}</h1>
          <div className="mt-5">
            <NicknameNotice title="Вправи заблоковані без нікнейма" />
          </div>
        </section>
      </div>
    );
  }

  const completedPercent = Math.round((answeredIndexes.length / verb.exercises.length) * 100);

  const handleAnswer = (index: number, isCorrect: boolean) => {
    if (answeredSet.has(index)) {
      return;
    }

    registerAnswer(verb.id, isCorrect);
    const nextAnsweredIndexes = [...answeredIndexes, index];
    setAnsweredIndexes(nextAnsweredIndexes);

    if (nextAnsweredIndexes.length === verb.exercises.length) {
      markVerbLearned(verb.id);
    }
  };

  return (
    <div className="space-y-6">
      <Link to={"/verbs/" + verb.id} className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
        <ArrowLeft size={18} aria-hidden="true" />
        До дієслова
      </Link>

      <section className="grid gap-4 lg:grid-cols-[1fr_340px] lg:items-end">
        <div>
          <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{verb.level}</span>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Вправи: {verb.infinitive}</h1>
          <p className="mt-2 text-slate-600">{verb.translation}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <ProgressBar value={completedPercent} label="Виконано" />
        </div>
      </section>

      <div className="grid gap-4">
        {verb.exercises.map((exercise, index) => (
          <ExerciseBlock key={verb.id + "-" + exercise.question} exercise={exercise} index={index} onAnswer={(isCorrect) => handleAnswer(index, isCorrect)} />
        ))}
      </div>

      {answeredIndexes.length === verb.exercises.length ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          <CheckCircle2 size={20} aria-hidden="true" />
          Дієслово додано до вивчених.
        </div>
      ) : null}
    </div>
  );
}
