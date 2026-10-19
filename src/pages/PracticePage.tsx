import { ArrowRight, Dumbbell, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AnswerModeToggle from "../components/AnswerModeToggle";
import ExerciseBlock from "../components/ExerciseBlock";
import ProgressBar from "../components/ProgressBar";
import {
  createSession,
  currentIndex,
  dueSources,
  getPracticeItem,
  isFinished,
  mistakeSources,
  pickSessionItems,
  practiceTopics,
  recordAnswer,
  sessionScore,
  type PracticeSession,
  type PracticeTopic,
} from "../data/practice";
import { useProgress } from "../hooks/useProgress";
import { cardLevel } from "../utils/srs";
import { loadPracticeSession, savePracticeSession } from "../utils/practiceStorage";

const SESSION_SIZE = 10;

export default function PracticePage() {
  const { progress, registerAnswer, registerModuleAnswer } = useProgress();
  const [session, setSession] = useState<PracticeSession | null>(() => loadPracticeSession());
  const [viewIndex, setViewIndex] = useState(() => {
    const saved = loadPracticeSession();
    if (!saved) return 0;
    // Завершена сесія відкривається одразу на підсумку.
    return isFinished(saved) ? saved.items.length : currentIndex(saved);
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const mistakeCount = useMemo(() => mistakeSources(progress).length, [progress]);
  const dueCount = useMemo(() => dueSources(progress).length, [progress]);
  const levels = useMemo(() => {
    const result = { learning: 0, known: 0, strong: 0 };
    for (const card of Object.values(progress.srs)) result[cardLevel(card)] += 1;
    return result;
  }, [progress.srs]);
  const cardTotal = Object.keys(progress.srs).length;

  const update = (next: PracticeSession | null, index = 0) => {
    setSession(next);
    setViewIndex(index);
    savePracticeSession(next);
  };

  const start = (topic: PracticeTopic) => {
    const items = pickSessionItems(topic, progress, SESSION_SIZE);
    if (items.length > 0) {
      update(createSession(topic, items));
    }
  };

  // Посилання з головної (?start=due) одразу запускає сесію, якщо немає незавершеної.
  const startParam = searchParams.get("start");
  useEffect(() => {
    if (!startParam) return;
    const topic = practiceTopics.find((item) => item.id === startParam)?.id;
    if (topic && !loadPracticeSession()) {
      start(topic);
    }
    setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startParam]);

  const handleAnswer = (isCorrect: boolean, given = "") => {
    // Відповідь на вже закриту вправу не рахуємо вдруге.
    if (!session || session.answers[viewIndex] !== null) return;
    const item = getPracticeItem(session.items[viewIndex]);

    if (item?.progressTarget.type === "verb") {
      registerAnswer(item.progressTarget.verbId, isCorrect);
    } else if (item) {
      registerModuleAnswer(item.progressTarget.moduleId, item.progressTarget.itemId, isCorrect);
    }

    const next = recordAnswer(session, viewIndex, { correct: isCorrect, given });
    setSession(next);
    savePracticeSession(next);
  };

  // 1. Вибір теми
  if (!session) {
    return (
      <div className="space-y-6">
        <section className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-blue-600 text-white shadow-soft">
            <Dumbbell size={26} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Тренування</h1>
            <p className="mt-1 text-sm text-slate-600">Сесія з {SESSION_SIZE} вправ. Оберіть тему.</p>
          </div>
        </section>

        <AnswerModeToggle />

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Теми тренування">
          {practiceTopics.map((topic) => {
            const disabled = (topic.id === "mistakes" && mistakeCount === 0) || (topic.id === "due" && dueCount === 0);
            return (
              <button
                key={topic.id}
                type="button"
                disabled={disabled}
                onClick={() => start(topic.id)}
                className="focus-ring flex min-h-24 flex-col items-start justify-between rounded-lg border border-slate-200 bg-white p-4 text-left shadow-soft transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:hover:border-slate-200"
              >
                <span className="text-lg font-bold text-slate-950">{topic.title}</span>
                <span className="text-sm text-slate-600">
                  {disabled && topic.id === "mistakes"
                    ? "Поки що помилок немає: тренуйтеся, і вони з'являться тут"
                    : disabled
                      ? cardTotal === 0
                        ? "З'явиться після перших вправ"
                        : "На сьогодні все повторено. Наступні картки з'являться за графіком"
                      : topic.text}
                </span>
                {topic.id === "due" && dueCount > 0 ? (
                  <span className="mt-1 text-xs font-semibold text-blue-700">Карток на сьогодні: {dueCount}</span>
                ) : null}
                {topic.id === "mistakes" && mistakeCount > 0 ? (
                  <span className="mt-1 text-xs font-semibold text-blue-700">Слів і уроків із помилками: {mistakeCount}</span>
                ) : null}
              </button>
            );
          })}
        </section>

        {cardTotal > 0 ? (
          <p className="text-sm text-slate-600">
            У повторенні {cardTotal} карток (слів і уроків): вчу {levels.learning}, знаю {levels.known}, міцно {levels.strong}. Що краще ви
            відповідаєте, то рідше картка повертається: через 1 день, 3 дні, потім усе довше.
          </p>
        ) : (
          <p className="text-sm text-slate-600">
            Після перших вправ слова й уроки потрапляють у графік повторення: через 1 день, 3 дні, потім усе довше. Помилка повертає картку на сьогодні.
          </p>
        )}
      </div>
    );
  }

  // 3. Підсумок
  if (isFinished(session) && viewIndex >= session.items.length) {
    const { correct, total } = sessionScore(session);
    const percent = Math.round((correct / total) * 100);
    const wrong = session.items
      .map((id, index) => ({ id, answer: session.answers[index], item: getPracticeItem(id) }))
      .filter((entry) => entry.answer && !entry.answer.correct && entry.item);
    const topicTitle = practiceTopics.find((topic) => topic.id === session.topic)?.title;

    return (
      <div className="space-y-6">
        <section>
          <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Підсумок</h1>
          <p className="mt-1 text-sm text-slate-600">Тема: {topicTitle}</p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-2xl font-bold text-slate-950">
            Правильно {correct} з {total}
          </p>
          <div className="mt-3">
            <ProgressBar value={percent} label="Результат" />
          </div>
          <p className="mt-3 text-sm text-slate-700">
            {wrong.length === 0
              ? "Без помилок. Так тримати!"
              : percent >= 80
                ? "Добрий результат. Перегляньте кілька помилок нижче."
                : "Є що повторити. Розберіть помилки нижче й спробуйте ще раз."}
          </p>
        </section>

        {wrong.length > 0 ? (
          <section className="space-y-3" aria-labelledby="mistakes-title">
            <h2 id="mistakes-title" className="text-xl font-bold text-slate-950">Помилки ({wrong.length})</h2>
            <ul className="space-y-3">
              {wrong.map(({ id, answer, item }) => {
                const [title, ...details] = item!.exercise.question.split("\n");
                return (
                  <li key={id} className="rounded-lg border border-rose-200 bg-white p-4 shadow-soft">
                    <p className="font-semibold text-slate-950">{title}</p>
                    {details.map((line) => (
                      <p key={line} lang="cs" className="mt-1 text-slate-950">{line}</p>
                    ))}
                    <p className="mt-2 text-sm text-rose-700">Ваша відповідь: {answer!.given || "пропущено"}</p>
                    <p className="text-sm font-semibold text-emerald-700">
                      Правильно: <span lang={/[Ѐ-ӿ]/.test(item!.exercise.correctAnswer) ? undefined : "cs"}>{item!.exercise.correctAnswer}</span>
                    </p>
                    <Link to={item!.link} className="focus-ring mt-2 inline-flex min-h-10 items-center gap-1 rounded-md text-sm font-semibold text-blue-700 underline">
                      Повторити: {item!.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => start(session.topic)}
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Ще {SESSION_SIZE} вправ
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          {wrong.length > 0 ? (
            <button
              type="button"
              onClick={() => update(createSession(session.topic, wrong.map((entry) => entry.id)))}
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-slate-800 ring-1 ring-inset ring-slate-300 hover:bg-slate-100"
            >
              <RotateCcw size={18} aria-hidden="true" />
              Повторити помилки
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => update(null)}
            className="focus-ring min-h-11 rounded-md px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Інша тема
          </button>
        </div>
      </div>
    );
  }

  // 2. Сесія
  const index = Math.min(viewIndex, session.items.length - 1);
  const item = getPracticeItem(session.items[index]);
  const answered = session.answers[index] !== null;
  const doneCount = session.answers.filter((answer) => answer !== null).length;
  const isLast = index === session.items.length - 1;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_340px] lg:items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Тренування</h1>
          <p className="mt-1 text-sm text-slate-600">
            Вправа {index + 1} з {session.items.length} · {practiceTopics.find((topic) => topic.id === session.topic)?.title}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <ProgressBar value={Math.round((doneCount / session.items.length) * 100)} label="Виконано" />
        </div>
      </section>

      <AnswerModeToggle />

      {item ? (
        <>
          <ExerciseBlock key={session.id + "-" + index} exercise={item.exercise} index={index} onAnswer={handleAnswer} />
          <div className="flex flex-wrap items-center gap-2">
            {answered ? (
              <button
                type="button"
                onClick={() => setViewIndex(index + 1)}
                className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {isLast ? "Показати підсумок" : "Далі"}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Перервати сесію? Результат цієї сесії буде втрачено (відповіді вже враховані в статистиці).")) update(null);
              }}
              className="focus-ring min-h-11 rounded-md px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Перервати
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
