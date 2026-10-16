import { setAnswerMode, useAnswerMode } from "../hooks/useAnswerMode";

export default function AnswerModeToggle() {
  const mode = useAnswerMode();
  const options = [
    { value: "mixed", label: "Змішано" },
    { value: "choice", label: "Лише вибір" },
    { value: "typing", label: "Лише введення" },
  ] as const;

  return (
    <div className="space-y-1">
      <div role="group" aria-label="Спосіб відповіді" className="inline-flex rounded-md border border-slate-200 bg-white p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={mode === option.value}
            onClick={() => setAnswerMode(option.value)}
            className={
              "focus-ring min-h-10 rounded px-3 text-sm font-semibold " +
              (mode === option.value ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100")
            }
          >
            {option.label}
          </button>
        ))}
      </div>
      {mode !== "choice" ? (
        <p className="text-xs text-slate-600">
          {mode === "mixed" ? "Частину чеських відповідей потрібно ввести самому, решту обрати. " : "Усі чеські відповіді вводяться з клавіатури. "}
          Без діакритики теж зарахуємо, але підкажемо правильне написання. Вправи з відповіддю українською лишаються з вибором.
        </p>
      ) : null}
    </div>
  );
}
