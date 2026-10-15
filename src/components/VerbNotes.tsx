import { Info } from "lucide-react";
import type { Verb } from "../types/Verb";

interface VerbNotesProps {
  verb: Verb;
}

const pronouns: Record<keyof Verb["conjugation"], string> = {
  ja: "já",
  ty: "ty",
  on: "on",
  my: "my",
  vy: "vy",
  oni: "oni",
};

// Пояснення під таблицею відмінювання: вид дієслова, літературні форми, особливості вживання.
export default function VerbNotes({ verb }: VerbNotesProps) {
  const notes: string[] = [];

  if (verb.aspect === "perfective") {
    notes.push(
      "Доконаний вид: форми в таблиці означають майбутній час (дія буде завершена), а не теперішній. Теперішнього часу в доконаних дієслів немає.",
    );
  }

  if (verb.formalForms) {
    const pairs = (Object.entries(verb.formalForms) as Array<[keyof Verb["conjugation"], string]>).map(
      ([key, formal]) => pronouns[key] + " " + verb.conjugation[key] + " → " + pronouns[key] + " " + formal,
    );

    notes.push("Деякі форми в таблиці розмовні. У письмовій (літературній) мові: " + pairs.join("; ") + ".");
  }

  notes.push(...(verb.notes ?? []));

  if (notes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <p key={note} className="flex items-start gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
          <Info size={16} className="mt-0.5 shrink-0 text-slate-500" aria-hidden="true" />
          <span>{note}</span>
        </p>
      ))}
    </div>
  );
}
