import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ExerciseBlock from "../components/ExerciseBlock";
import NicknameNotice from "../components/NicknameNotice";
import ProgressBar from "../components/ProgressBar";
import { grammarModules } from "../data/grammarModules";
import { useProgress } from "../hooks/useProgress";

export default function ModuleExercisePage() {
  const { moduleId, lessonId } = useParams();
  const module = grammarModules.find((item) => item.id === moduleId);
  const lesson = module?.lessons.find((item) => item.id === lessonId);
  const [answeredIndexes, setAnsweredIndexes] = useState<number[]>([]);
  const { isLearningLocked, markModuleItemLearned, registerModuleAnswer } = useProgress();
  const answeredSet = useMemo(() => new Set(answeredIndexes), [answeredIndexes]);

  if (!module || !lesson) {
    return <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">Вправи не знайдено</div>;
  }

  if (isLearningLocked) {
    return (
      <div className="space-y-6">
        <Link to="/modules" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
          <ArrowLeft size={18} aria-hidden="true" />
          До модулів
        </Link>
        <NicknameNotice title="Вправи заблоковані без нікнейма" />
      </div>
    );
  }

  const completedPercent = Math.round((answeredIndexes.length / lesson.exercises.length) * 100);

  const handleAnswer = (index: number, isCorrect: boolean) => {
    if (answeredSet.has(index)) {
      return;
    }

    registerModuleAnswer(module.id, lesson.id, isCorrect);
    const nextAnsweredIndexes = [...answeredIndexes, index];
    setAnsweredIndexes(nextAnsweredIndexes);

    if (nextAnsweredIndexes.length === lesson.exercises.length) {
      markModuleItemLearned(module.id, lesson.id);
    }
  };

  return (
    <div className="space-y-6">
      <Link to={"/modules/" + module.id + "/" + lesson.id} className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
        <ArrowLeft size={18} aria-hidden="true" />
        До уроку
      </Link>

      <section className="grid gap-4 lg:grid-cols-[1fr_340px] lg:items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Вправи: {lesson.title}</h1>
          <p className="mt-2 text-slate-600">{module.title}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <ProgressBar value={completedPercent} label="Виконано" />
        </div>
      </section>

      <div className="grid gap-4">
        {lesson.exercises.map((exercise, index) => (
          <ExerciseBlock key={lesson.id + "-" + exercise.question} exercise={exercise} index={index} onAnswer={(isCorrect) => handleAnswer(index, isCorrect)} />
        ))}
      </div>

      {answeredIndexes.length === lesson.exercises.length ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          <CheckCircle2 size={20} aria-hidden="true" />
          Урок додано до вивчених.
        </div>
      ) : null}
    </div>
  );
}
