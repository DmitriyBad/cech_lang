import { caseInfo } from "../data/nouns";
import type { Noun } from "../types/Noun";
import SpeakButton from "./SpeakButton";

interface NounDeclensionTableProps {
  noun: Noun;
}

export default function NounDeclensionTable({ noun }: NounDeclensionTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <table className="w-full border-collapse text-left">
        <thead className="bg-slate-100 text-sm text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Відмінок</th>
            <th className="px-4 py-3 font-semibold">Однина</th>
            <th className="px-4 py-3 font-semibold">Множина</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {caseInfo.map((item) => (
            <tr key={item.key}>
              <td className="px-4 py-3">
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <div className="mt-1 space-y-0.5">
                  {item.question.split(" · ").map((question) => (
                    <p key={question} className="text-xs text-slate-500">{question}</p>
                  ))}
                  <p className="text-xs text-blue-700">{item.hint}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-base font-semibold text-slate-950">
                <div className="flex items-center justify-between gap-2">
                  <span lang="cs">{noun.singular[item.key]}</span>
                  <SpeakButton text={noun.singular[item.key]} />
                </div>
              </td>
              <td className="px-4 py-3 text-base font-semibold text-slate-950">
                <div className="flex items-center justify-between gap-2">
                  <span lang="cs">{noun.plural[item.key]}</span>
                  <SpeakButton text={noun.plural[item.key]} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
