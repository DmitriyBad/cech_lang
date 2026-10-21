import { useMemo, useState } from "react";

interface TileBuilderProps {
  /** Слова речення в правильному порядку. */
  tokens: string[];
  disabled: boolean;
  onSubmit: (sentence: string) => void;
  onGiveUp: () => void;
}

// Складання речення зі слів: кожне слово — кнопка; обрані слова стають у рядок відповіді, їх можна прибрати натисненням.
export default function TileBuilder({ tokens, disabled, onSubmit, onGiveUp }: TileBuilderProps) {
  // Порядок плиток перемішується один раз; відмінний від правильного, щоб не було «готової» відповіді.
  const order = useMemo(() => {
    const indexes = tokens.map((_, index) => index);

    for (let attempt = 0; attempt < 10; attempt += 1) {
      for (let i = indexes.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
      }

      if (indexes.some((value, position) => value !== position)) {
        break;
      }
    }

    return indexes;
  }, [tokens]);
  const [placed, setPlaced] = useState<number[]>([]);

  const bank = order.filter((index) => !placed.includes(index));
  const complete = placed.length === tokens.length;

  const tileClass = "focus-ring min-h-11 rounded-md border px-3 py-2 text-base font-semibold transition disabled:cursor-default";

  return (
    <div className="mt-4 space-y-3">
      <div>
        <p className="text-sm font-medium text-slate-700" id="tile-answer-label">Ваше речення</p>
        <div
          role="group"
          aria-labelledby="tile-answer-label"
          lang="cs"
          className="mt-1 flex min-h-14 flex-wrap items-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 p-2"
        >
          {placed.length === 0 ? <span className="px-1 text-sm text-slate-600">Натискайте слова нижче по порядку</span> : null}
          {placed.map((index, position) => (
            <button
              key={index}
              type="button"
              disabled={disabled}
              onClick={() => setPlaced(placed.filter((value) => value !== index))}
              aria-label={"Слово " + (position + 1) + ": " + tokens[index] + ". Натисніть, щоб прибрати"}
              className={tileClass + " border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100"}
            >
              {tokens[index]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-700" id="tile-bank-label">Слова</p>
        <div role="group" aria-labelledby="tile-bank-label" lang="cs" className="mt-1 flex flex-wrap gap-2">
          {bank.map((index) => (
            <button
              key={index}
              type="button"
              disabled={disabled}
              onClick={() => setPlaced([...placed, index])}
              className={tileClass + " border-slate-200 bg-white text-slate-900 hover:border-blue-300 hover:bg-blue-50"}
            >
              {tokens[index]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={disabled || !complete}
          onClick={() => onSubmit(placed.map((index) => tokens[index]).join(" "))}
          className="focus-ring min-h-12 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Перевірити
        </button>
        <button
          type="button"
          disabled={disabled || placed.length === 0}
          onClick={() => setPlaced([])}
          className="focus-ring min-h-12 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
        >
          Скинути
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onGiveUp}
          className="focus-ring min-h-12 rounded-md px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
        >
          Не знаю
        </button>
      </div>
    </div>
  );
}
