import { Check, Compass } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { nouns } from "../data/nouns";
import { useProgress } from "../hooks/useProgress";
import { loadStartGuideState, updateStartGuideState } from "../utils/startGuide";

// Перші дієслова: být, mít, chtít, mluvit (id у verbs.ts).
const firstVerbIds = [1, 2, 6, 27];
const firstNounsGoal = 5;

interface Step {
  title: string;
  text: string;
  to: string;
  done: boolean;
  status?: string;
}

export default function StartGuide() {
  const { progress, getModuleStats } = useProgress();
  const [state, setState] = useState(loadStartGuideState);

  const learnedFirstVerbs = firstVerbIds.filter((id) => progress.learnedVerbIds.includes(id)).length;
  const learnedNouns = Math.min(getModuleStats("nouns", nouns.length).learnedCount, firstNounsGoal);
  const numbersDone = getModuleStats("numbers").completedItemIds.includes("numbers-0-10");

  const steps: Step[] = [
    {
      title: "Вимова",
      text: "Десять хвилин: наголос, довгі голосні та звук ř.",
      to: "/start/pronunciation",
      done: state.pronunciationSeen,
    },
    {
      title: "Перші фрази",
      text: "Привітання, ввічливість і що сказати, коли не розумієш.",
      to: "/start/phrases",
      done: state.phrasesSeen,
    },
    {
      title: "Числа 0–10",
      text: "Потрібні для ціни, часу й телефону.",
      to: "/modules/numbers/numbers-0-10",
      done: numbersDone,
    },
    {
      title: "Перші дієслова",
      text: "být, mít, chtít, mluvit: з них складається більшість простих речень.",
      to: "/verbs/" + firstVerbIds[0],
      done: learnedFirstVerbs === firstVerbIds.length,
      status: learnedFirstVerbs + " з " + firstVerbIds.length,
    },
    {
      title: "Перші іменники",
      text: "Почніть із п'яти слів зі списку.",
      to: "/nouns",
      done: learnedNouns >= firstNounsGoal,
      status: learnedNouns + " з " + firstNounsGoal,
    },
  ];

  const doneCount = steps.filter((step) => step.done).length;
  const nextIndex = steps.findIndex((step) => !step.done);
  const allDone = nextIndex === -1;

  if (state.dismissed) {
    return (
      <button
        type="button"
        onClick={() => {
          updateStartGuideState({ dismissed: false });
          setState(loadStartGuideState());
        }}
        className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
      >
        <Compass size={18} aria-hidden="true" />
        Показати «З чого почати»
      </button>
    );
  }

  return (
    <section className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-soft sm:p-5" aria-labelledby="start-guide-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="start-guide-title" className="flex items-center gap-2 text-xl font-bold text-slate-950">
            <Compass size={22} className="text-blue-700" aria-hidden="true" />
            З чого почати
          </h2>
          <p className="mt-1 text-sm text-slate-700">
            {allDone
              ? "Ви пройшли всі кроки. Тепер вчіть дієслова й іменники у власному темпі."
              : "П'ять кроків для початківця. Нікнейм не потрібен: прогрес зберігається в цьому браузері. Виконано " + doneCount + " з " + steps.length + "."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            updateStartGuideState({ dismissed: true });
            setState(loadStartGuideState());
          }}
          className="focus-ring min-h-10 rounded-md px-3 text-sm font-semibold text-slate-600 hover:bg-white"
        >
          Сховати
        </button>
      </div>

      <ol className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, index) => {
          const isNext = index === nextIndex;

          return (
            <li key={step.title} className={"flex flex-col rounded-lg border bg-white p-3 " + (isNext ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200")}>
              <div className="flex items-center gap-2">
                <span
                  className={"grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold " + (step.done ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700")}
                >
                  {step.done ? <Check size={16} aria-hidden="true" /> : index + 1}
                </span>
                <h3 className="font-semibold text-slate-950">
                  {step.title}
                  {step.done ? <span className="sr-only"> (виконано)</span> : null}
                </h3>
              </div>
              <p className="mt-2 flex-1 text-sm text-slate-600">{step.text}</p>
              {step.status && !step.done ? <p className="mt-1 text-xs font-semibold text-slate-500">{step.status}</p> : null}
              <Link
                to={step.to}
                className={"focus-ring mt-3 inline-flex min-h-10 items-center justify-center rounded-md px-3 text-sm font-semibold " + (isNext ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-100 text-slate-800 hover:bg-slate-200")}
              >
                {step.done ? "Повторити" : isNext ? "Почати" : "Відкрити"}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
