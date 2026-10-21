interface ErrorFinderProps {
  /** Слова речення з помилкою. */
  tokens: string[];
  /** Позиції слів із помилкою. */
  errorIndexes: number[];
  /** Позиція слова, яке обрав користувач (null, поки не відповів). */
  selected: number | null;
  onSelect: (index: number) => void;
  onGiveUp: () => void;
}

// Речення зі словами-кнопками: користувач натискає слово, в якому, на його думку, помилка.
export default function ErrorFinder({ tokens, errorIndexes, selected, onSelect, onGiveUp }: ErrorFinderProps) {
  const answered = selected !== null;

  return (
    <div className="mt-4 space-y-3">
      <div role="group" aria-label="Речення з помилкою. Оберіть слово з помилкою" lang="cs" className="flex flex-wrap gap-2 rounded-md bg-slate-50 p-3">
        {tokens.map((token, index) => {
          const isError = errorIndexes.includes(index);
          const picked = selected === index;
          const className = [
            "focus-ring min-h-11 rounded-md border px-3 py-2 text-lg font-semibold transition disabled:cursor-default",
            answered && isError ? "border-rose-500 bg-rose-50 text-rose-800 underline decoration-wavy" : "",
            answered && picked && !isError ? "border-amber-500 bg-amber-50 text-amber-900" : "",
            !answered || (!isError && !picked) ? "border-slate-200 bg-white text-slate-900 hover:border-blue-300 hover:bg-blue-50" : "",
          ].join(" ");

          return (
            <button
              key={index}
              type="button"
              disabled={answered}
              onClick={() => onSelect(index)}
              aria-label={answered && isError ? token + " (тут помилка)" : answered && picked ? token + " (ваш вибір, тут немає помилки)" : undefined}
              className={className}
            >
              {token}
            </button>
          );
        })}
      </div>
      {!answered ? (
        <button
          type="button"
          onClick={onGiveUp}
          className="focus-ring min-h-11 rounded-md px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Не знаю
        </button>
      ) : null}
    </div>
  );
}
