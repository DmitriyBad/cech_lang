import { ArrowLeft, ArrowRight, Mic, Square } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import SpeakButton from "../components/SpeakButton";
import { pickSpeakingSet } from "../data/speakingSentences";
import { useProgress } from "../hooks/useProgress";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { PASS_SCORE, scoreSpeech, type SpeechScore, type WordStatus } from "../utils/speechScore";

const SET_SIZE = 10;

const statusStyle: Record<WordStatus, { className: string; mark: string; label: string }> = {
  ok: { className: "border-emerald-400 bg-emerald-50 text-emerald-900", mark: "✓", label: "сказано правильно" },
  close: { className: "border-amber-400 bg-amber-50 text-amber-900", mark: "≈", label: "майже, перевірте діакритику" },
  missed: { className: "border-rose-400 bg-rose-50 text-rose-900 underline decoration-wavy", mark: "✗", label: "не почув" },
};

export default function SpeakPage() {
  const { registerModuleAnswer } = useProgress();
  const { listening, error, start, stop, supported } = useSpeechRecognition();
  const [round, setRound] = useState(0);
  const sentences = useMemo(() => pickSpeakingSet(SET_SIZE), [round]);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<SpeechScore | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const registered = useRef(false);

  const sentence = sentences[index];
  const finished = index >= sentences.length;
  const passed = result !== null && result.score >= PASS_SCORE;

  const finishSentence = () => {
    // Рахуємо спробу лише раз: після успіху чи коли користувач пішов далі, так і не вдавшись.
    if (!registered.current && attempts > 0 && sentence) {
      registered.current = true;
      registerModuleAnswer("speaking", sentence.id, false);
    }
  };

  const next = () => {
    finishSentence();
    registered.current = false;
    setResult(null);
    setAttempts(0);
    setIndex(index + 1);
  };

  const handleSpeak = () => {
    if (!sentence) {
      return;
    }

    start((alternatives) => {
      const scored = scoreSpeech(sentence.cz, alternatives);
      setResult(scored);
      setAttempts((value) => value + 1);

      if (scored.score >= PASS_SCORE && !registered.current) {
        registered.current = true;
        setPassedCount((value) => value + 1);
        registerModuleAnswer("speaking", sentence.id, true);
      }
    });
  };

  const restart = () => {
    registered.current = false;
    setRound((value) => value + 1);
    setIndex(0);
    setResult(null);
    setAttempts(0);
    setPassedCount(0);
  };

  return (
    <div className="space-y-6">
      <Link to="/practice" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
        <ArrowLeft size={18} aria-hidden="true" />
        До тренування
      </Link>

      <section>
        <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Говоримо</h1>
        <p className="mt-2 max-w-2xl text-slate-700">Прочитайте речення вголос. Браузер розпізнає мову й покаже, які слова він почув. Це перевірка того, чи вас зрозуміли, а не точності кожного звука (наприклад, «ř»).</p>
      </section>

      {!supported ? (
        <section className="max-w-2xl rounded-lg border border-amber-300 bg-amber-50 p-4 text-slate-900" role="alert">
          <h2 className="text-lg font-bold">Розпізнавання мови недоступне</h2>
          <p className="mt-1 text-sm">Цей браузер не вміє розпізнавати мову. Відкрийте сайт у Chrome або Edge на комп'ютері чи телефоні з Android. У Firefox ця функція не працює, а в Safari нестабільна.</p>
        </section>
      ) : finished ? (
        <section className="max-w-2xl space-y-3 rounded-lg border border-slate-200 bg-white p-5 shadow-soft" aria-live="polite">
          <h2 className="text-2xl font-bold text-slate-950">Серію завершено</h2>
          <p className="text-lg text-slate-800">Вдалося прочитати: {passedCount} з {sentences.length}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={restart} className="focus-ring min-h-11 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">Нова серія</button>
            <Link to="/practice" className="focus-ring inline-flex min-h-11 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50">До тренування</Link>
          </div>
        </section>
      ) : (
        <>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <ProgressBar value={Math.round((index / sentences.length) * 100)} label={"Речення " + (index + 1) + " з " + sentences.length} />
          </div>

          <section className="max-w-2xl space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-soft" aria-label="Речення для читання">
            <p className="text-sm text-slate-700">Переклад: {sentence.ua}</p>

            {result ? (
              <div lang="cs" className="flex flex-wrap gap-2" role="group" aria-label="Результат по словах">
                {result.words.map((item, position) => (
                  <span key={position} className={"inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xl font-semibold " + statusStyle[item.status].className}>
                    <span aria-hidden="true" className="text-sm">{statusStyle[item.status].mark}</span>
                    {item.word}
                    <span className="sr-only"> ({statusStyle[item.status].label})</span>
                  </span>
                ))}
              </div>
            ) : (
              <p lang="cs" className="text-2xl font-semibold text-slate-950">{sentence.cz}</p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={listening ? stop : handleSpeak}
                className={"focus-ring inline-flex min-h-12 items-center gap-2 rounded-md px-5 text-base font-semibold text-white " + (listening ? "bg-rose-700 hover:bg-rose-800" : "bg-blue-600 hover:bg-blue-700")}
              >
                {listening ? <Square size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
                {listening ? "Слухаю… Натисніть, щоб зупинити" : result ? "Ще раз" : "Говорити"}
              </button>
              <SpeakButton text={sentence.cz} label="Прослухати речення" className="h-12 w-12 border border-slate-300 bg-white" />
            </div>

            <div role="status" aria-live="polite" className="space-y-1 text-sm">
              {error ? <p className="rounded-md bg-rose-50 p-2 font-medium text-rose-800">{error}</p> : null}
              {result ? (
                <>
                  <p className={"font-semibold " + (passed ? "text-emerald-800" : "text-slate-900")}>
                    {passed ? "Чудово! " : "Спробуйте ще раз. "}Збіг: {Math.round(result.score * 100)}%
                  </p>
                  <p className="text-slate-700">Браузер розпізнав: <span lang="cs">{result.heard || "нічого"}</span></p>
                </>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={next}
                className={"focus-ring inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-sm font-semibold " + (passed ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50")}
              >
                {index === sentences.length - 1 ? "Завершити" : passed ? "Далі" : "Пропустити"}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </section>

          <p className="max-w-2xl text-xs text-slate-700">Під час запису звук обробляється службою розпізнавання вашого браузера (у Chrome і Edge це сервери Google). Сайт запис не зберігає. Браузер попросить дозвіл на мікрофон.</p>
        </>
      )}
    </div>
  );
}
