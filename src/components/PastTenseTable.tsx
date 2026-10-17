import { Link } from "react-router-dom";
import { buildPastRows } from "../data/verbPast";
import SpeakButton from "./SpeakButton";

function Form({ pronoun, text }: { pronoun?: string; text: string }) {
  return (
    <span className="flex items-center justify-between gap-2">
      <span lang="cs">{text}</span>
      <SpeakButton text={(pronoun ? pronoun + " " : "") + text} />
    </span>
  );
}

export default function PastTenseTable({ infinitive }: { infinitive: string }) {
  const rows = buildPastRows(infinitive);

  if (!rows) {
    return null;
  }

  const neuterRow = rows.find((row) => row.neuter);

  return (
    <div className="space-y-2">
      <div tabIndex={0} role="region" aria-label={"Таблиця минулого часу: " + infinitive} className="focus-ring relative overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-soft">
        <table className="w-full min-w-[420px] border-collapse text-left">
          <caption className="sr-only">Минулий час дієслова {infinitive}</caption>
          <thead className="bg-slate-100 text-sm text-slate-600">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">Особа</th>
              <th scope="col" className="px-3 py-2 font-semibold">Чоловік / чоловіки</th>
              <th scope="col" className="px-3 py-2 font-semibold">Жінка / жінки</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="px-3 py-2 text-sm font-medium text-slate-600">{row.label}</th>
                <td className="px-3 py-2 font-semibold text-slate-950">
                  <Form pronoun={row.label.split(" ")[0]} text={row.masculine} />
                </td>
                <td className="px-3 py-2 font-semibold text-slate-950">
                  <Form pronoun={row.label.split(" ")[0]} text={row.feminine} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {neuterRow?.neuter ? (
        <p className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <span>Середній рід (ono):</span>
          <span lang="cs" className="font-semibold text-slate-950">{neuterRow.neuter}</span>
          <SpeakButton text={neuterRow.neuter} />
        </p>
      ) : null}
      <p className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
        Інфінітив без -t + -l, а потім закінчення роду й числа. У третій особі допоміжного jsem немає. Чемне «vy» до однієї людини:
        jste + форма однини (vy jste byl / byla).{" "}
        <Link to="/modules/tenses" className="font-semibold text-blue-700 underline">Уроки про минулий час</Link>
      </p>
    </div>
  );
}
