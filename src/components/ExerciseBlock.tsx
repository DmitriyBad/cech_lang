import { CheckCircle2, ChevronDown, ChevronUp, Keyboard, XCircle } from "lucide-react";
import { FormEvent, useMemo, useRef, useState } from "react";
import type { Exercise } from "../types/Verb";
import { useAnswerMode } from "../hooks/useAnswerMode";
import { isTypeable, matchAnswer, type MatchResult } from "../utils/answerMatch";
import SpeakButton from "./SpeakButton";

const czechLetters = ["á", "č", "ď", "é", "ě", "í", "ň", "ó", "ř", "š", "ť", "ú", "ů", "ý", "ž"];

interface ExerciseBlockProps {
  exercise: Exercise;
  index: number;
  onAnswer: (isCorrect: boolean) => void;
}

export default function ExerciseBlock({ exercise, index, onAnswer }: ExerciseBlockProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedDraft, setTypedDraft] = useState("");
  const [typedResult, setTypedResult] = useState<MatchResult | "gave-up" | null>(null);
  const [showKeys, setShowKeys] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mode = useAnswerMode();
  // У змішаному режимі вводимо кожну другу вправу (1-ша, 3-тя… з вибором, 2-га, 4-та… з введенням):
  // розминка вибором, потім пригадування. Нетипові для вводу вправи завжди лишаються з вибором.
  const wantsTyping = mode === "typing" || (mode === "mixed" && index % 2 === 1);
  const useTyping = wantsTyping && isTypeable(exercise.correctAnswer);
  const isAnswered = selectedAnswer !== null || typedResult !== null;
  const isCorrect = typedResult !== null ? typedResult === "exact" || typedResult === "no-diacritics" : selectedAnswer === exercise.correctAnswer;

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

  const submitTyped = (event: FormEvent) => {
    event.preventDefault();

    if (isAnswered || typedDraft.trim().length === 0) {
      return;
    }

    const result = matchAnswer(typedDraft, exercise.correctAnswer, exercise.options);
    setTypedResult(result);
    onAnswer(result !== "wrong");
  };

  const giveUp = () => {
    if (!isAnswered) {
      setTypedResult("gave-up");
      onAnswer(false);
    }
  };

  const insertLetter = (letter: string) => {
    const input = inputRef.current;
    const start = input?.selectionStart ?? typedDraft.length;
    const end = input?.selectionEnd ?? typedDraft.length;
    setTypedDraft(typedDraft.slice(0, start) + letter + typedDraft.slice(end));
    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(start + 1, start + 1);
    });
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

          {useTyping ? (
            <form onSubmit={submitTyped} className="mt-4 space-y-2">
              <label className="block text-sm font-medium text-slate-700" htmlFor={"answer-" + index}>
                Ваша відповідь чеською
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  id={"answer-" + index}
                  ref={inputRef}
                  lang="cs"
                  value={typedDraft}
                  onChange={(event) => setTypedDraft(event.target.value)}
                  disabled={isAnswered}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="focus-ring min-h-12 min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 disabled:bg-slate-100"
                />
                <button
                  type="submit"
                  disabled={isAnswered || typedDraft.trim().length === 0}
                  className="focus-ring min-h-12 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Перевірити
                </button>
                <button
                  type="button"
                  onClick={giveUp}
                  disabled={isAnswered}
                  className="focus-ring min-h-12 rounded-md px-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  Не знаю
                </button>
              </div>
              {!isAnswered ? (
                <div>
                  <button
                    type="button"
                    aria-expanded={showKeys}
                    aria-controls={"keys-" + index}
                    onClick={() => setShowKeys((value) => !value)}
                    className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                  >
                    <Keyboard size={18} aria-hidden="true" />
                    Чеські літери
                    {showKeys ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
                  </button>
                  {showKeys ? (
                    <div id={"keys-" + index} className="mt-1 flex flex-wrap gap-1" role="group" aria-label="Чеські літери">
                      {czechLetters.map((letter) => (
                        <button
                          key={letter}
                          type="button"
                          lang="cs"
                          onClick={() => insertLetter(letter)}
                          className="focus-ring min-h-10 min-w-10 rounded-md border border-slate-200 bg-slate-50 text-base font-semibold text-slate-800 hover:bg-blue-50"
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </form>
          ) : (
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
          )}

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
              <span>
                {typedResult === "no-diacritics"
                  ? "Правильно, але зверніть увагу на діакритику: " + exercise.correctAnswer
                  : isCorrect
                    ? "Правильно"
                    : "Неправильно. Правильна відповідь: " + exercise.correctAnswer}
              </span>
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
