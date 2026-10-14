import { CheckCircle2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import type { Exercise } from "../types/Verb";
import SpeakButton from "./SpeakButton";

interface ExerciseBlockProps {
  exercise: Exercise;
  index: number;
  onAnswer: (isCorrect: boolean) => void;
}

export default function ExerciseBlock({ exercise, index, onAnswer }: ExerciseBlockProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === exercise.correctAnswer;

  // Fisher–Yates: правильна відповідь не повинна завжди стояти першою.
  const options = useMemo(() => {
    const shuffled = [...exercise.options];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }, [exercise.options]);
  const [questionTitle, ...questionDetails] = exercise.question.split("\n");

  // Що можна послухати після відповіді. Чеський голос не повинен отримувати українську, тому
  // повертаємо текст лише якщо в ньому немає кирилиці; для решти вправ (граматичні терміни,
  // переклад на українську) кнопки немає.
  const listenText = useMemo(() => {
    const hasCyrillic = (text: string) => /[Ѐ-ӿ]/.test(text);
    const correct = exercise.correctAnswer;
    const title = exercise.question.split("\n")[0];
    const details = exercise.question.split("\n").slice(1);

    // 1. Речення з пропуском («Vidím ___» чи рядок уроку): підставляємо правильне слово.
    // Рядок може бути змішаним («Доповніть: Vidím ___»), тому беремо частину після останнього «: ».
    const gapLine = [...details, title].reverse().find((line) => line.includes("___")) ?? "";
    const gapCandidate = hasCyrillic(gapLine) ? (gapLine.split(": ").pop() ?? "") : gapLine;
    if (gapCandidate.includes("___") && !hasCyrillic(correct)) {
      return gapCandidate.replace("___", correct);
    }

    // 2. «Доповніть форму для “já”: jet» → «já jedu».
    const formMatch = /^Доповніть форму для “([^”]+)”/.exec(title);
    if (formMatch && !hasCyrillic(correct)) {
      return formMatch[1].split("/")[0] + " " + correct;
    }

    // 3. «Оберіть чеське речення / чеський інфінітив…»: правильна відповідь чеською.
    if (/^Оберіть чеськ/.test(title) && !hasCyrillic(correct)) {
      return correct;
    }

    // 4. «Що означає: “Já jedu autobusem.”»: чеське слово чи речення в лапках.
    const quoted = /^Що означає:?\s*“([^”]+)”/.exec(title)?.[1];
    if (quoted && !hasCyrillic(quoted)) {
      return quoted;
    }

    return "";
  }, [exercise.correctAnswer, exercise.question]);

  const handleAnswer = (answer: string) => {
    if (isAnswered) {
      return;
    }

    setSelectedAnswer(answer);
    onAnswer(answer === exercise.correctAnswer);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-blue-50 text-sm font-semibold text-blue-700">{index + 1}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-slate-950">{questionTitle}</h3>
          {questionDetails.length > 0 ? (
            <div className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-lg font-semibold text-slate-950">
              {questionDetails.map((line, lineIndex) => (
                <p key={lineIndex + "-" + line} lang="cs">{line}</p>
              ))}
            </div>
          ) : null}

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {options.map((option) => {
              const selected = selectedAnswer === option;
              const correctOption = isAnswered && option === exercise.correctAnswer;
              const wrongOption = selected && !isCorrect;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered}
                  className={[
                    "focus-ring min-h-12 rounded-md border px-3 py-2 text-left text-sm font-semibold transition",
                    correctOption ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "",
                    wrongOption ? "border-rose-500 bg-rose-50 text-rose-700" : "",
                    !correctOption && !wrongOption ? "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50" : "",
                    isAnswered ? "cursor-default" : "",
                  ].join(" ")}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {isAnswered ? (
            <div
              role="status"
              aria-live="polite"
              className={[
                "mt-4 flex items-start gap-2 rounded-md p-3 text-sm font-medium",
                isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
              ].join(" ")}
            >
              {isCorrect ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
              <span>{isCorrect ? "Правильно" : "Неправильно. Правильна відповідь: " + exercise.correctAnswer}</span>
            </div>
          ) : null}

          {/* Після відповіді можна почути правильну чеську відповідь повністю (слово, форму чи речення). */}
          {isAnswered && listenText ? (
            <div className="mt-3 flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-base font-semibold text-slate-950">
              <span lang="cs" className="min-w-0 flex-1">{listenText}</span>
              <SpeakButton text={listenText} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
