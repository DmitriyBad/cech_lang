import type { ReactNode } from "react";
import { caseOrder, type DeclensionPattern } from "../data/declensionRules";
import { caseInfo } from "../data/nouns";
import SpeakButton from "./SpeakButton";

function FormCell({ stem, ending }: { stem: string; ending: string | null }) {
  if (ending === null) {
    return <span className="text-sm text-slate-600">= називний (майже не вживається)</span>;
  }

  return (
    <span className="flex items-center justify-between gap-2">
      <span lang="cs" className="font-semibold text-slate-950">
        {stem}
        {ending === "" ? (
          <>
            <span aria-hidden="true" className="text-slate-500">∅</span>
            <span className="sr-only"> (без закінчення)</span>
          </>
        ) : (
          <span className="text-blue-700">{ending}</span>
        )}
      </span>
      <SpeakButton text={stem + ending} />
    </span>
  );
}

export default function PatternTable({ pattern, children }: { pattern: DeclensionPattern; children?: ReactNode }) {
  return (
    <div tabIndex={0} role="region" aria-label={"Таблиця відмінювання за зразком " + pattern.example} className="focus-ring relative overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-soft">
      <table className="w-full min-w-[520px] border-collapse text-left">
        <caption className="sr-only">Відмінювання за зразком {pattern.example}</caption>
        <thead className="bg-slate-100 text-sm text-slate-600">
          <tr>
            <th scope="col" className="px-3 py-2 font-semibold">Відмінок</th>
            <th scope="col" className="px-3 py-2 font-semibold">Однина</th>
            <th scope="col" className="px-3 py-2 font-semibold">Множина</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {caseOrder.map((key, index) => (
            <tr key={key}>
              <th scope="row" className="px-3 py-2 text-sm font-semibold text-slate-700">
                {caseInfo.find((item) => item.key === key)?.title}
              </th>
              <td className="px-3 py-2">
                <FormCell stem={pattern.stem} ending={pattern.singular[index]} />
              </td>
              <td className="px-3 py-2">
                <FormCell stem={pattern.stem} ending={pattern.plural[index]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {children}
    </div>
  );
}
