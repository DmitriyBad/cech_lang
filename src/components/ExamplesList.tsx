import type { Example } from "../types/Verb";
import SpeakButton from "./SpeakButton";

interface ExamplesListProps {
  examples: Example[];
}

export default function ExamplesList({ examples }: ExamplesListProps) {
  return (
    <div className="grid gap-3">
      {examples.map((example) => (
        <article key={example.cz + "-" + example.ua} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="flex items-start justify-between gap-2">
            <p lang="cs" className="text-base font-semibold text-slate-950">{example.cz}</p>
            <SpeakButton text={example.cz} />
          </div>
          <p className="mt-1 text-sm text-slate-600">{example.ua}</p>
        </article>
      ))}
    </div>
  );
}
