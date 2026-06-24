import type { Example } from "../types/Verb";

interface ExamplesListProps {
  examples: Example[];
}

export default function ExamplesList({ examples }: ExamplesListProps) {
  return (
    <div className="grid gap-3">
      {examples.map((example) => (
        <article key={example.cz + "-" + example.ua} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-base font-semibold text-slate-950">{example.cz}</p>
          <p className="mt-1 text-sm text-slate-600">{example.ua}</p>
        </article>
      ))}
    </div>
  );
}
