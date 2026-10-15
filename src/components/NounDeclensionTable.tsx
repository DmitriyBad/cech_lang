import { caseInfo } from "../data/nouns";
import type { Noun } from "../types/Noun";
import SpeakButton from "./SpeakButton";

interface NounDeclensionTableProps {
  noun: Noun;
}

export default function NounDeclensionTable({ noun }: NounDeclensionTableProps) {
  // У неживих іменників чоловічого роду кличний відмінок практично не вживається.
  const vocativeRare = noun.gender === "masculine" && !noun.animate;

  return (
    <div className="space-y-3">
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
                    {item.key === "vocative" && vocativeRare ? (
                      <p className="text-xs text-amber-700">Майже не вживається; у таблиці форма, що збігається з називним.</p>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 text-base font-semibold text-slate-950">
                  <div className="flex items-center justify-between gap-2">
                    <span lang="cs">{noun.singular[item.key]}</span>
                    <SpeakButton text={noun.singular[item.key]} />
                  </div>
                </td>
                <td className={"px-4 py-3 text-base font-semibold " + (noun.pluralRare ? "text-slate-400" : "text-slate-950")}>
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

      {noun.pluralRare ? (
        <p className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
          Це слово майже завжди вживається в однині. Форми множини наведено лише для повноти, вони рідкісні.
        </p>
      ) : null}
    </div>
  );
}
